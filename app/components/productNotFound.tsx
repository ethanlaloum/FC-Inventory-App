import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import NewProductPage from './NewProductPage';
import ExistingProductList from './ExistingProductList';
import axios from 'axios';
import { useUser } from '@/app/UserContext';

interface ProductNotFoundProps {
  upcCode: string;
}

interface ProductData {
  product_name: string;
  brand: string;
  model: string;
  product_type: string;
  quantity: number;
  upcCode: string;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ upcCode }) => {
  const router = useRouter();
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showExistingProducts, setShowExistingProducts] = useState(false);
  const { token, logout } = useUser();

  const handleSubmitNewProduct = async (productData: ProductData) => {
    console.log('Nouveau produit créé:', productData);
    try {
      await axios.post('http://10.7.10.226:4000/new-product', {
        product_name: productData.product_name,
        brand: productData.brand,
        model: productData.model,
        product_type: productData.product_type,
        quantity: productData.quantity,
        upcCode: productData.upcCode
      },
      {headers: { Authorization: `Bearer ${token}` }}
    );
      setShowNewProduct(false);
      router.back();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401)
        await logout();
      else
        console.error('Erreur lors de l\'ajout d\'article:', err);
    }
  };

  const handleAssociateUPC = async (productId: any, upcCode: any) => {
    try {
    await axios.post('http://10.7.10.226:4000/assign-upc', {
      upcCode: upcCode,
      id: productId
    },
    {headers: { Authorization: `Bearer ${token}` }}
    );
    router.push('/stock')
    setShowExistingProducts(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401)
        await logout();
      console.error('Erreur lors de l\'association du code UPC:', err);
    }
  };

  if (showNewProduct) {
    return (
      <NewProductPage
        upcCode={upcCode}
        onClose={() => setShowNewProduct(false)}
        onSubmit={handleSubmitNewProduct}
      />
    );
  }

  if (showExistingProducts) {
    return (
      <ExistingProductList
        upcCode={upcCode}
        onClose={() => setShowExistingProducts(false)}
        onAssociate={handleAssociateUPC}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</Text>
        <Text className="text-base text-gray-600 mb-6">UPC: {upcCode}</Text>
        <View className="w-full max-w-sm space-y-4">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-red-fc rounded-xl py-4 px-6"
            onPress={() => setShowNewProduct(true)}
          >
            <FontAwesome name="plus-circle" size={24} color="#ffffff" />
            <Text className="text-white font-semibold text-lg ml-2">Create New Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center bg-red-fc rounded-xl py-4 px-6"
            onPress={() => setShowExistingProducts(true)}
          >
            <FontAwesome name="link" size={24} color="#ffffff" />
            <Text className="text-white font-semibold text-lg ml-2">Add UPC to Existing Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center bg-gray-200 rounded-xl py-4 px-6"
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color="#4b5563" />
            <Text className="text-gray-700 font-semibold text-lg ml-2">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductNotFound;