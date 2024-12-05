import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import StockList from '@/app/components/StockList';
import { useUser } from '../../../UserContext';
import * as Font from 'expo-font';
import SearchBar from '@/app/components/SearchBar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import LoadingScreen from '@/app/components/LoadingScreen';

export default function ProductTypes() {
  const { brand, product_type } = useLocalSearchParams();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredStock, setFilteredStock] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stock, setStock] = useState([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { user, token, logout } = useUser();

  useEffect(() => {
    Font.loadAsync({
      'fc-font': require('@/assets/fonts/fc-integration.ttf'),
    }).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const fetchStock = useCallback(async () => {
    try {
      const response = await axios.get(`http://10.7.10.226:4000/display-models?brand=${brand}&type=${product_type}`, {
        params: { timestamp: new Date().getTime() },
        headers: { Authorization: `Bearer ${token}` }
      });
      setStock(response.data);
      setFilteredStock(response.data);
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401)
        await logout();
      else
        console.error('Erreur lors de la récupération du stock:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  useEffect(() => {
    const filtered = stock.filter(item =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStock(filtered);
  }, [searchQuery, stock]);

  const updateQuantity = async (id, quantity) => {
    console.log('update');
  };

  const handleItemPress = (item) => {
    router.push({
        pathname: '/ProductDetails',
        params: { email: user?.email, productName: item.product_name }
    });
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStock();
    setRefreshing(false);
  }, [fetchStock]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 p-6">
          <TouchableOpacity
                onPress={() => router.back()}
                className="mb-4"
            >
              <FontAwesome name='arrow-left' color="#4b5563" size={24} />
          </TouchableOpacity>
          <Text className="text-3xl mb-6 text-gray-800" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>Sélectionnez un produit</Text>
          <View className="flex-row justify-between mb-6">
          </View>

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {isLoading ? (
            <LoadingScreen />
          ) : (
            <StockList
              data={filteredStock}
              onUpdateQuantity={updateQuantity}
              onItemPress={handleItemPress}
              refreshing={refreshing}
              onRefresh={onRefresh}
              type="brand"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
