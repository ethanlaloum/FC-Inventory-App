import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useUser } from '@/app/UserContext';
import SearchBar from '@/app/components/SearchBar';

interface StockItem {
  id: number;
  product_name: string;
  brand: string;
  model: string;
  quantity: number;
  code: string;
}

const ExistingProductList = ({ upcCode, onClose, onAssociate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredStock, setFilteredStock] = useState<StockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stock, setStock] = useState<StockItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useUser();

  const fetchStock = useCallback(async () => {
    try {
      const response = await axios.get('http://10.7.10.226:4000/display-stock', {
        params: { timestamp: new Date().getTime() },
        headers: { Authorization: `Bearer ${token}` }
      });
      setStock(response.data);
      setFilteredStock(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération du stock:', error);
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock])

  useEffect(() => {
    const filtered = stock.filter(item =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStock(filtered);
  }, [searchQuery, stock]);

  const handleItemPress = (item: StockItem) => {
    onAssociate(item.id, upcCode);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStock();
    setRefreshing(false);
  }, [fetchStock]);

  const renderItem = ({ item }: { item: StockItem }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)} className="bg-white p-4 mb-2 rounded-lg shadow-sm">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-medium text-gray-800 text-base">{item.product_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <TouchableOpacity onPress={onClose} style={{ marginBottom: 16 }}>
            <FontAwesome name='arrow-left' color="#4b5563" size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, marginBottom: 24, color: '#1f2937' }}>Sélectionnez un produit existant</Text>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#6366f1" />
        ) : (
          <FlatList
            data={filteredStock}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#6366f1']}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExistingProductList;
