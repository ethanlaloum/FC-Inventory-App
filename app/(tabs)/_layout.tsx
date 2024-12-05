import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import MyTabBar from '../components/TabBar';

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e50020'
      }}>
      <Tabs.Screen
        name="index"
        options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Feather name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
            title: 'Stock',
            tabBarIcon: ({ color }) => <Feather name="box" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
            title: 'Scanner',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="barcode-scan" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ProductDetails"
        options={{
            title: 'productdetails',
            tabBarStyle: { display: 'none' },
            tabBarButton: (props) => null,
        }}
      />
    </Tabs>
  );
}
