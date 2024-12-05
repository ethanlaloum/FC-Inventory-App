import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';

export default function LoadingScreen() {
  const [loadingText, setLoadingText] = useState('Chargement');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prevText) => {
        if (prevText === 'Chargement...') return 'Chargement';
        return prevText + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
      <View className="items-center">
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'timing',
            duration: 700,
          }}
        >
          <ActivityIndicator size="large" />
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 700,
            delay: 300,
          }}
          className="mt-4"
        >
          <Text className="text-xl font-semibold text-gray-700">{loadingText}</Text>
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 700,
            delay: 600,
          }}
          className="mt-2"
        >
          <Text className="text-sm text-gray-500">Veuillez patienter...</Text>
        </MotiView>
      </View>
    </SafeAreaView>
  );
}