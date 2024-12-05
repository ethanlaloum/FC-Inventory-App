import React, { useState, useCallback } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import BarcodeScanner from '../components/BarcodeScanner';
import { useFocusEffect } from '@react-navigation/native';

export default function ScannerScreen() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);
      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );

  const handleBarCodeScanned = (data) => {
    console.log("UPC scanned:", data);
    router.push({
      pathname: '/ProductDetails',
      params: { upcCode: data, email: email }
    });
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Request Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />
      {isCameraActive && (
        <BarcodeScanner
          onScan={handleBarCodeScanned}
          onClose={() => {
            setIsCameraActive(false);
            router.back();
          }}
        />
      )}
    </SafeAreaView>
  );
}
