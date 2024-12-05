import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface ActionButtonsProps {
  onNewArticle: () => void;
  onExportStock: () => void;
}

export default function ActionButtons({ onNewArticle, onExportStock }: ActionButtonsProps) {
  return (
    <View className="flex-row justify-between mb-6">
      <TouchableOpacity
        onPress={onNewArticle}
        className="bg-emerald-300 px-4 py-2 rounded-lg flex-row items-center"
      >
        <AntDesign name="plus" size={16} color="#4b5563" />
        <Text className="text-white ml-2 font-medium">Nouvel Article</Text>
      </TouchableOpacity>
    </View>
  );
}