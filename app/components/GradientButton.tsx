import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import * as Font from 'expo-font';

const StyledTouchableOpacity = styled(TouchableOpacity);

const GradientButton = ({ onPress, isLoading }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    Font.loadAsync({
      'fc-font': require('@/assets/fonts/fc-integration.ttf'),
    }).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <StyledTouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        className={`mx-auto w-9/12 bg-red-500 text-white py-2 rounded-lg border-b-[4px] border-red-600 active:border-b-[2px] transition-all ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text className="text-white text-center text-lg" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>Se connecter</Text>
        )}
      </StyledTouchableOpacity>
    </Animated.View>
  );
};

export default GradientButton;
