import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { UserProvider, useUser } from './UserContext';

function LayoutContent() {
  const { isLoading, token } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/');
      }
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{headerShown: false,}} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <UserProvider>
      <LayoutContent />
    </UserProvider>
  );
}