import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white rounded-lg mb-4 px-3 py-2 shadow-sm">
      <Feather name="search" size={20} color="#9ca3af" />
      <TextInput
        className="flex-1 ml-2 text-gray-700"
        placeholder="Rechercher un article..."
        placeholderTextColor="#9ca3af"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery !== '' && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Feather name="x" size={20} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
}