import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import NewArticleModal from '../../components/NewArticleModal';
import BrandList from '../../components/BrandList';
import { useUser } from '@/app/UserContext';
import * as Font from 'expo-font';
import AntDesign from '@expo/vector-icons/AntDesign';
import LoadingScreen from '@/app/components/LoadingScreen';
import NewProductPage from '@/app/components/NewProductPage';

export default function StockScreen() {
  const [isNewArticleModalVisible, setNewArticleModalVisible] = useState(false);
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredStock, setFilteredStock] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user, token, logout } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'fc-font': require('../../../assets/fonts/fc-integration.ttf'),
    }).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const fetchStock = useCallback(async () => {
    try {
      const response = await axios.get('http://10.7.10.226:4000/display-brands', {
        params: { timestamp: new Date().getTime() },
        headers: { Authorization: `Bearer ${token}` }
      });
      setStock(response.data);
      setFilteredStock(response.data);
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await logout();
      } else
        console.error('Erreur lors de la récupération du stock:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const updateQuantity = async (id, quantity) => {
    try {
      await axios.post('http://10.7.10.226:4000/update-product',
        { id, quantity },
        {headers: { Authorization: `Bearer ${token}` }}
      );
      await axios.post('http://10.7.10.226:4000/update-log', {
        stock_id: id,
        user_name: user?.email,
        quantity_changed: quantity
      },
    {headers: { Authorization: `Bearer ${token}` }}
  );
      await fetchStock();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401)
        await logout();
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const handleItemPress = (item) => {
    router.push(`/(tabs)/stock/${item.brand}`);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStock();
    setRefreshing(false);
  }, [fetchStock]);

  const addNewArticle = async (article) => {
    try {
      await axios.post('http://10.7.10.226:4000/new-product', {
        product_name: article.product_name,
        brand: article.brand,
        model: article.model,
        product_type: article.product_type,
        quantity: article.quantity,
        upcCode: article.upcCode
      },
    {headers: { Authorization: `Bearer ${token}` }}
  );
      await fetchStock();
      setNewArticleModalVisible(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401)
        await logout();
      console.error('Erreur lors de l\'ajout d\'article:', err);
    }
  };

  if (isNewArticleModalVisible) {
    return (
      <NewProductPage
        upcCode="0"
        onClose={() => setNewArticleModalVisible(false)}
        onSubmit={addNewArticle}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 p-6">
          <Text className="text-3xl mb-6 text-gray-800" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>Sélectionnez une marque</Text>
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity
              onPress={() => setNewArticleModalVisible(true)}
              className="bg-red-fc px-4 py-2 rounded-lg flex-row items-center"
            >
              <AntDesign name="plus" size={16} color="white" />
              <Text className="text-white ml-2 font-medium">Nouvel Article</Text>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <BrandList
              data={stock}
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
