import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import LogoutButton from '../components/LogoutButton';
import { useUser } from '../UserContext';
import LoadingScreen from '../components/LoadingScreen';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

interface Log {
  id: number;
  stock_id: number | null;
  user_name: string | null;
  item_description: string | null;
  action: 'ADD' | 'REM' | 'LOGIN' | 'LOGOUT' | 'CREATE' | 'DELETE';
  quantity_before: number | null;
  quantity_after: number | null;
  log_time: string;
  commentaire: string | null;
}

function LogItem({ log }: { log: Log }) {
  const { stock_id, user_name, item_description, action, quantity_before, quantity_after, log_time, commentaire } = log;
  const [productName, setProductName] = useState('');
  const { token, logout } = useUser();

  useEffect(() => {
    const fetchProductName = async () => {
      if (stock_id) {
        try {
          const response = await axios.get(`http://10.7.10.226:4000/display-product-name?id=${stock_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProductName(response.data.product_name);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401)
            await logout();
          else
            console.error('Erreur lors de la récupération du nom du produit', error);
        }
      }
    };

    fetchProductName();
  }, [stock_id, token]);

  const renderLogContent = () => {
    switch (action) {
      case 'ADD':
      case 'REM':
        const quantityChanged = quantity_after !== null && quantity_before !== null
          ? quantity_after - quantity_before
          : null;
        const isPositive = quantityChanged !== null ? quantityChanged > 0 : false;
        return (
          <>
            <View className="flex-row items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                  isPositive ? 'bg-emerald-100' : 'bg-rose-100'
                }`}
              >
                {isPositive ? (
                  <FontAwesome name="arrow-up" size={16} color="#059669" />
                ) : (
                  <FontAwesome name="arrow-down" size={16} color="#e11d48" />
                )}
              </View>
              <View>
                <Text className="font-medium text-gray-800">{productName || item_description}</Text>
                {stock_id && <Text className="text-xs text-gray-500">ID: {stock_id}</Text>}
              </View>
            </View>
            <View className="items-end">
              {quantityChanged !== null && (
                <Text className={`font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPositive ? '+' : ''}{quantityChanged}
                </Text>
              )}
              <Text className="text-xs text-gray-400">{formatDate(log_time)}</Text>
            </View>
          </>
        );
      case 'LOGIN':
      case 'LOGOUT':
        return (
          <>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-blue-100">
                <FontAwesome name={action === 'LOGIN' ? 'sign-in' : 'sign-out'} size={16} color="#3b82f6" />
              </View>
              <View>
                <Text className="font-medium text-gray-800">{action === 'LOGIN' ? 'Connexion' : 'Déconnexion'}</Text>
                {user_name && <Text className="text-xs text-gray-500">Utilisateur: {user_name}</Text>}
              </View>
            </View>
            <Text className="text-xs text-gray-400">{formatDate(log_time)}</Text>
          </>
        );
      case 'CREATE':
      case 'DELETE':
        return (
          <>
            <View className="flex-row items-center">
              <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${action === 'CREATE' ? 'bg-green-100' : 'bg-red-100'}`}>
                <FontAwesome name={action === 'CREATE' ? 'plus' : 'trash'} size={16} color={action === 'CREATE' ? '#10b981' : '#ef4444'} />
              </View>
              <View>
                <Text className="font-medium text-gray-800">{action === 'CREATE' ? 'Création' : 'Suppression'}</Text>
                {item_description && <Text className="text-xs text-gray-500">{item_description}</Text>}
              </View>
            </View>
            <Text className="text-xs text-gray-400">{formatDate(log_time)}</Text>
          </>
        );
      default:
        return (
          <>
            <Text className="font-medium text-gray-800">{action}</Text>
            <Text className="text-xs text-gray-400">{formatDate(log_time)}</Text>
          </>
        );
    }
  };

  return (
    <View className="flex-row items-center justify-between bg-white p-4 mb-2 rounded-lg">
      {renderLogContent()}
    </View>
  );
}

export default function WelcomePage() {
  const [latestLogs, setLatestLogs] = useState<Log[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
  const { user, token, logout, isLoading } = useUser();

  useEffect(() => {
    Font.loadAsync({
      'fc-font': require('../../assets/fonts/fc-integration.ttf'),
    }).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const fetchData = useCallback(async () => {
    if (!user || !token) {
      return;
    }

    try {
      setError(null);
      const logsResponse = await axios.get(`http://10.7.10.226:4000/latest-logs?user_name=${user.name}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLatestLogs(logsResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await logout();
      } else {
        console.error('Error fetching data:', error);
        setError('Une erreur est survenue lors du chargement des données.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, token, router, logout]);

  useEffect(() => {
    if (!isLoading && user && token) {
      fetchData();
    }
  }, [isLoading, user, token, fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  if (loading || isLoading) {
    return (
      <LoadingScreen />
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-red-fc">{error}</Text>
        <TouchableOpacity className="mt-4 bg-blue-500 p-2 rounded" onPress={onRefresh}>
          <Text className="text-white">Réessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6 bg-white">
        <View className="flex flex-col w-full">
          <View className="flex-row justify-between items-start mb-2">
            <Text
              className="text-3xl text-gray-800 flex-shrink"
              numberOfLines={1}
              style={{fontFamily: fontsLoaded ? 'fc-font' : 'System'}}
            >
              Bienvenue,
            </Text>
            <LogoutButton onPress={logout} iconType="logout" />
          </View>
          <Text
            className="text-3xl text-gray-800 mb-1"
            numberOfLines={2}
            style={{fontFamily: fontsLoaded ? 'fc-font' : 'System'}}
          >
            {user?.name}
          </Text>
          <Text className="text-base text-gray-500">
            Voici vos dernières activités
          </Text>
        </View>
      </View>

      <FlatList
        className="px-4 pt-4"
        data={latestLogs}
        renderItem={({ item }) => <LogItem log={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
        }
      />
    </SafeAreaView>
  );
}
