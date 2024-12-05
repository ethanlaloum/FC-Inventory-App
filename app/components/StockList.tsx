import React from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';

interface StockItem {
  id: number;
  product_name: string;
  brand: string;
  model: string;
  quantity: number;
  code: string;
}

interface StockListProps {
  data: StockItem[];
  onItemPress: (item: StockItem) => void;
  refreshing: boolean;
  onRefresh: () => void;
  type: string;
}

export default function StockList({ data, onItemPress, refreshing, onRefresh, type }: StockListProps) {
  const renderItem = ({ item }: { item: StockItem }) => {
    if (type === 'brand') {
      return (
      <TouchableOpacity onPress={() => onItemPress(item)} className="bg-white p-4 mb-2 rounded-lg shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-medium text-gray-800 text-base">{item.product_name}</Text>
          </View>
        </View>
      </TouchableOpacity>
      );
    }
  };

  return (
    <FlatList
      data={data}
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
  );
}
