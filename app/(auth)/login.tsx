import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useUser } from '../UserContext';
import * as Font from 'expo-font';
import GradientButton from '../components/GradientButton';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const { login } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'fc-font': require('../../assets/fonts/fc-integration.ttf'),
    }).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      alert(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-full max-w-sm">
            <View className="mb-8 items-center">
              <Feather name="box" size={68} color="#e50020" />
              <Text className="text-3xl mt-4 text-gray-800" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>
                FC Inventory
              </Text>
              <Text className="text-sm text-gray-500 mt-2">Gestion de stock FC-Integration</Text>
            </View>

            <View className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>
                  Identifiant
                </Text>
                <View className="relative">
                  <Feather name="user" size={20} color="#e50020" className="absolute left-3 top-2.5" />
                  <TextInput
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-red-fc focus:ring focus:ring-red-200 transition-all duration-200"
                    placeholder="Entrez votre identifiant"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    placeholderTextColor="#9ca3af"
                    selectionColor="#e50020"
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>
                  Mot de passe
                </Text>
                <View className="relative">
                  <Feather name="lock" size={20} color="#e50020" className="absolute left-3 top-2.5" />
                  <TextInput
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-red-fc focus:ring focus:ring-red-200 transition-all duration-200"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                    selectionColor="#e50020"
                  />
                </View>
              </View>
            </View>
            <View className="mt-12">
              <GradientButton onPress={handleLogin} isLoading={isLoading} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
