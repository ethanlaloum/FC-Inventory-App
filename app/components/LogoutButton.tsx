import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LogOut } from 'lucide-react-native';

interface LogoutButtonProps {
  onPress: () => void;
}

export default function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-rose-100 px-4 py-2 rounded-full flex-row items-center absolute top-4 right-4 z-10"
    >
      <LogOut size={20} color="#e11d48" />
    </TouchableOpacity>
  );
}
