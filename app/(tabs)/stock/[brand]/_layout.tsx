import { Stack, useLocalSearchParams } from 'expo-router';

export default function BrandLayout() {
  const { brand } = useLocalSearchParams();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: `Brand: ${brand}`,
        }}
      />
      <Stack.Screen
        name="[product_type]"
        options={({ route }) => ({
          title: `${brand} - ${route.params.product_type}`,
        })}
      />
    </Stack>
  );
}