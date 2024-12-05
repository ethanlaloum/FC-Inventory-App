import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, ScrollView, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import ProductNotFound from '../components/productNotFound';
import BarcodeScanner from '../components/BarcodeScanner';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUser } from '@/app/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import LoadingScreen from '../components/LoadingScreen';

interface UpcScannerModalProps {
  isVisible: boolean;
  onScan: (data: any) => void;
  onClose: () => void;
}

function UpcScannerModal({ isVisible, onScan, onClose }: UpcScannerModalProps) {
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <BarcodeScanner onScan={onScan} onClose={onClose} />
      </View>
    </Modal>
  );
}

export default function ProductDetails() {
  const { upcCode, email, productName } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<{ id: string; code?: string; image_url?: string; product_name: string; quantity: number; brand?: string; model?: string; product_type?: string; description?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const { token, logout, user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState('');

  const addUpcCode = async (data: any) => {
    setIsScannerVisible(false);
    if (!product || !data) return;
    try {
      await axios.post('http://10.7.10.226:4000/init-upc', {
        id: product.id,
        upcCode: data
      },
      {headers: { Authorization: `Bearer ${token}` }}
      );
      setProduct({ ...product, code: data });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        await logout();
      }
      setError('Erreur lors de l\'ajout du code UPC');
      console.error('Erreur lors de l\'ajout du code UPC:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('ProductDetails is focused');
      const fetchData = async () => {
        setProduct(null);
        setLoading(true);
        setError(null);
        await fetchProductDetails();
      };
      fetchData();
    }, [upcCode, productName, token])
  );

  const fetchProductDetails = async () => {
    try {
      let response;
      if (upcCode) {
        console.log(upcCode)
        response = await axios.get(
          `http://10.7.10.226:4000/product-details?barCode=${upcCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (!upcCode) {
        response = await axios.get(
          `http://10.7.10.226:4000/product-details?productName=${productName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (response?.data && Object.keys(response.data).length > 0) {
        setProduct(response.data);
      } else {
        setProduct(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await logout();
      } else if ((error as any).response?.data?.message !== 'Produit non trouvé.') {
        setError('Erreur lors de la récupération des détails du produit');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (change: number) => {
    if (!product) return;
    try {
      const newQuantity = Math.max(0, product.quantity + change);
      await axios.post('http://10.7.10.226:4000/update-product', {
        id: product.id,
        quantity: change
      },
      {headers: { Authorization: `Bearer ${token}` }}
      );
      await axios.post('http://10.7.10.226:4000/update-log', {
        stock_id: product.id,
        user_name: user?.name,
        item_description: product.product_name,
        action: change > 0 ? 'ADD' : 'REM',
        quantity_before: product.quantity,
        quantity_after: newQuantity,
        commentaire: `Quantité ${change > 0 ? 'augmentée' : 'diminuée'} de ${Math.abs(change)}`
      },
      {headers: { Authorization: `Bearer ${token}` }}
      );
      setProduct({ ...product, quantity: newQuantity });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        await logout();
      } else {
        setError('Erreur lors de la mise à jour de la quantité');
        console.error('Erreur lors de la mise à jour de la quantité:', err);
      }
    }
  };

  const updateQuantityByInput = async () => {
    if (!product || newQuantity === '') return;
    const parsedQuantity = parseInt(newQuantity, 10);
    if (isNaN(parsedQuantity)) return;
    const quantityBeforeSafe = isNaN(product.quantity) ? 0 : product.quantity; // Sécurise la valeur
    const quantityAfterSafe = isNaN(parsedQuantity) ? 0 : parsedQuantity; // Sécurise aussi
    const change = quantityAfterSafe - quantityBeforeSafe;
    try {
      await axios.post('http://10.7.10.226:4000/update-product', {
        id: product.id,
        quantity: change
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await axios.post('http://10.7.10.226:4000/update-log', {
        stock_id: product.id,
        user_name: user?.name,
        item_description: product.product_name,
        action: change > 0 ? 'ADD' : 'REM',
        quantity_before: quantityBeforeSafe,
        quantity_after: quantityAfterSafe,
        commentaire: `Quantité mise à jour manuellement de ${quantityBeforeSafe} à ${quantityAfterSafe}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProduct({ ...product, quantity: quantityAfterSafe });
      setNewQuantity('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        await logout();
      } else {
        setError('Erreur lors de la mise à jour de la quantité');
        console.error('Erreur lors de la mise à jour de la quantité:', err);
      }
    }
  };

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity className="mt-4 bg-blue-500 p-2 rounded" onPress={() => router.back()}>
          <Text className="text-white">Quitter</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ProductNotFound upcCode={upcCode} />
        <UpcScannerModal
          isVisible={isScannerVisible}
          onScan={addUpcCode}
          onClose={() => setIsScannerVisible(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <TouchableOpacity
            onPress={() => router.push('/stock')}
            className="mb-4"
          >
            <FontAwesome name='arrow-left' color="#4b5563" size={24} />
          </TouchableOpacity>

          <View className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <View className="aspect-square w-full">
              <Image
                source={{ uri: product.image_url || '/placeholder.svg?height=300&width=300' }}
                className="w-full h-full object-contain bg-gray-100"
              />
            </View>
            <View className="p-4">
              <Text className="text-xl font-bold text-gray-800 mb-2">{product.product_name}</Text>
              <Text className="text-sm text-gray-500 mb-4">UPC: {product.code || 'Non disponible'}</Text>

              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-medium text-gray-700">Quantity</Text>
                <View className="flex-row items-center bg-gray-100 rounded-full">
                  <TouchableOpacity
                    onPress={() => updateQuantity(-1)}
                    className="bg-rose-100 w-10 h-10 rounded-full justify-center items-center"
                  >
                    <AntDesign name="minus" size={16} color="#4b5563" />
                  </TouchableOpacity>
                  <Text className="mx-4 text-lg font-semibold text-gray-800 w-8 text-center">{product.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(1)}
                    className="bg-emerald-100 w-10 h-10 rounded-full justify-center items-center"
                  >
                    <AntDesign name="plus" size={16} color="#4b5563" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-medium text-gray-700">Set Quantity</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="bg-gray-100 px-3 py-2 rounded-l-lg w-20 text-center"
                    keyboardType="numeric"
                    value={newQuantity}
                    onChangeText={setNewQuantity}
                    placeholder="Enter"
                  />
                  <TouchableOpacity
                    onPress={updateQuantityByInput}
                    className="bg-blue-300 px-4 py-2 rounded-r-lg"
                  >
                    <Text className="text-white font-semibold">Set</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="space-y-2 mb-4">
                <Text className="text-sm text-gray-600">Brand: {product.brand}</Text>
                <Text className="text-sm text-gray-600">Model: {product.model}</Text>
                <Text className="text-sm text-gray-600">Type: {product.product_type}</Text>
                <Text className="text-sm text-gray-600">Description: {product.description || 'Aucune description disponible'}</Text>
              </View>

              {!product.code && (
                <TouchableOpacity
                  onPress={() => setIsScannerVisible(true)}
                  className="bg-red-fc rounded-lg px-4 py-3 w-full max-w-sm relative"
                >
                  <View className="absolute left-4 top-0 bottom-0 justify-center">
                    <MaterialCommunityIcons name="barcode-scan" size={28} color="white" />
                  </View>
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-white font-semibold text-sm">Ajouter un code UPC</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <UpcScannerModal
        isVisible={isScannerVisible}
        onScan={addUpcCode}
        onClose={() => setIsScannerVisible(false)}
      />
    </SafeAreaView>
  );
}