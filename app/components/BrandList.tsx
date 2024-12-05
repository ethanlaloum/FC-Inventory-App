import React from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
// import { Plus, Minus } from 'lucide-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

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
  onUpdateQuantity: (id: number, quantity: number) => void;
  onItemPress: (item: StockItem) => void;
  refreshing: boolean;
  onRefresh: () => void;
  type: string;
}

export default function BrandList({ data, onUpdateQuantity, onItemPress, refreshing, onRefresh, type }: StockListProps) {
  const renderItem = ({ item }: { item: StockItem }) => {
    if (type === 'brand') {
      return (
      <TouchableOpacity onPress={() => onItemPress(item)} className="bg-white p-4 mb-2 rounded-lg shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-medium text-gray-800 text-base">{item.brand}</Text>
            {/* <Text className="text-sm text-gray-500">{item.brand} - {item.model}</Text> */}
          </View>
          {/* <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.id, -1)}
              className="bg-rose-100 w-8 h-8 rounded-full justify-center items-center mr-2"
            >
              <AntDesign name="minus" size={16} color="#e11d48" />
            </TouchableOpacity>
            <Text className="text-base font-semibold w-8 text-center text-gray-700">{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.id, 1)}
              className="bg-emerald-100 w-8 h-8 rounded-full justify-center items-center ml-2"
            >
              <AntDesign name="plus" size={16} color="#059669" />
            </TouchableOpacity>
          </View> */}
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
