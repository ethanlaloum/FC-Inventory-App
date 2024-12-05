import { Stack } from 'expo-router';

export default function StockLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Stock Overview' }} />
      <Stack.Screen
        name="[brand]"
        options={({ route }) => ({
          title: `Brand: ${route.params.brand}`,
          headerShown: false,
        })}
      />
    </Stack>
  );
}