import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

export default function ArticleForm({ onSubmit }) {
  const [product_name, setProduct_name] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [product_type, setProduct_type] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [upcCode, setUpcCode] = useState('');

  const handleSubmit = () => {
    onSubmit({ product_name, brand, model, product_type, quantity, upcCode });
    setProduct_name('');
    setBrand('');
    setModel('');
    setProduct_type('');
    setQuantity('0');
    setUpcCode('');
  };

  const renderInput = (label, value, onChangeText, placeholder, keyboardType = 'default') => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      <TextInput
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          <Text className="text-2xl font-bold mb-6 text-gray-800">Ajouter un nouvel article</Text>
          <View className="space-y-4">
            {renderInput("Nom du produit", product_name, setProduct_name, "Entrez le nom du produit")}
            {renderInput("Marque", brand, setBrand, "Entrez la marque")}
            {renderInput("Modèle", model, setModel, "Entrez le modèle")}
            {renderInput("Type", product_type, setProduct_type, "Entrez le type")}
            {renderInput("Quantité", quantity, setQuantity, "Entrez la quantité", "numeric")}
            {renderInput("Code UPC", upcCode, setUpcCode, "Entrez le code UPC", "numeric")}
          </View>
        </View>
      </ScrollView>

      <View className="p-4 bg-gray-50 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleSubmit}
          className="w-full bg-red-fc py-3 rounded-md shadow-md"
        >
          <Text className="text-white text-center font-semibold">Ajouter l'article</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}