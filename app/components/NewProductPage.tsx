import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';

interface ProductData {
  product_name: string;
  brand: string;
  model: string;
  product_type: string;
  quantity: number;
  upcCode: string;
}

interface NewProductPageProps {
  upcCode: string;
  onClose: () => void;
  onSubmit: (productData: ProductData) => void;
}

interface RenderInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  disabled?: boolean;
}

const brandData = [
  { label: 'UNIFI', value: 'UNIFI' },
  { label: 'AVIGILON', value: 'AVIGILON' },
  { label: 'FS', value: 'FS' },
  { label: 'BIZLINE', value: 'BIZLINE' },
];

const productTypeData = [
  { label: 'Access Point', value: 'Access Point' },
  { label: 'Switch', value: 'Switch' },
  { label: 'Camera', value: 'Camera' },
  { label: 'NVR', value: 'NVR' },
  { label: 'Accessories', value: 'Accessories' },
  { label: 'UNITY', value: 'UNITY' },
  { label: 'VIDEO APPLICANCE', value: 'VIDEO APPLICANCE' },
  { label: 'Router', value: 'Router' },
  { label: 'Others', value: 'Others' },
];

export default function NewProductPage({ upcCode, onClose, onSubmit }: NewProductPageProps) {
  const [product_name, setProduct_name] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [product_type, setProduct_type] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    if (!product_name.trim()) {
      Alert.alert('Erreur', 'Le nom du produit est obligatoire.');
      return;
    }

    const quantityNumber = parseInt(quantity, 10);
    if (isNaN(quantityNumber) || quantityNumber < 0) {
      Alert.alert('Erreur', 'La quantité doit être un nombre positif.');
      return;
    }

    onSubmit({
      product_name,
      brand,
      model,
      product_type,
      quantity: quantityNumber,
      upcCode
    });
  };

  const renderInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', disabled = false }: RenderInputProps) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      <TextInput
        className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-red-500 focus:ring focus:ring-red-200 ${
          disabled ? 'bg-gray-100 text-gray-500' : ''
        }`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        selectionColor="#e50020"
        keyboardType={keyboardType}
        editable={!disabled}
      />
    </View>
  );

  const renderDropdownItem = (item: { label: string; value: string }) => {
    return (
      <View className="p-4 flex-row justify-between items-center">
        <Text className="flex-1 text-base">{item.label}</Text>
        {item.value === (item.label === 'Brand' ? brand : product_type)}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="p-6">
            <Text className="text-2xl font-bold mb-6 text-gray-800">Ajouter un nouvel article</Text>
            <View className="space-y-4">
              {renderInput({ label: "Nom du produit", value: product_name, onChangeText: setProduct_name, placeholder: "Entrez le nom du produit" })}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Marque</Text>
                <Dropdown
                  className="h-12 bg-white rounded-xl p-3 shadow-sm"
                  placeholderStyle="text-base"
                  selectedTextStyle="text-base"
                  inputSearchStyle="h-10 text-base"
                  iconStyle="w-5 h-5"
                  data={brandData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Sélectionnez une marque"
                  searchPlaceholder="Rechercher..."
                  value={brand}
                  onChange={item => setBrand(item.value)}
                  renderItem={renderDropdownItem}
                />
              </View>
              {renderInput({ label: "Modèle", value: model, onChangeText: setModel, placeholder: "Entrez le modèle" })}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Type</Text>
                <Dropdown
                  className="h-12 bg-white rounded-xl p-3 shadow-sm"
                  placeholderStyle="text-base"
                  selectedTextStyle="text-base"
                  inputSearchStyle="h-10 text-base"
                  iconStyle="w-5 h-5"
                  data={productTypeData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Sélectionnez un type"
                  searchPlaceholder="Rechercher..."
                  value={product_type}
                  onChange={item => setProduct_type(item.value)}
                  renderItem={renderDropdownItem}
                />
              </View>
              {renderInput({ label: "Quantité", value: quantity, onChangeText: setQuantity, placeholder: "Entrez la quantité", keyboardType: "numeric" })}
              {upcCode === '0' ? (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">Code UPC</Text>
                  <Text className="text-base text-gray-500">Aucun code UPC disponible</Text>
                </View>
              ) : (
                renderInput({
                  label: "Code UPC Pre Rempli",
                  value: upcCode,
                  onChangeText: () => {},
                  placeholder: "Code UPC pré-rempli",
                  keyboardType: "numeric",
                  disabled: true
                })
              )}
            </View>
          </View>
        </ScrollView>

        <View className="p-4 bg-gray-50 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full bg-red-500 py-3 rounded-md shadow-md mb-4"
          >
            <Text className="text-white text-center font-semibold">Ajouter l'article</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            className="w-full bg-gray-200 py-3 rounded-md shadow-md flex-row items-center justify-center"
          >
            <FontAwesome name="arrow-left" size={24} color="#4b5563" />
            <Text className="text-gray-700 font-semibold text-lg ml-2">Retour</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}