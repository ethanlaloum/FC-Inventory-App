import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: 'ADMIN' | 'USER';
  emailVerified: Date | null;
  image: string | null;
};

type UserContextType = {
  isLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void | { twoFactor: boolean, message: string }>;
  logout: () => Promise<void>;
  verifyTwoFactor: (email: string, code: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedToken && storedUser) {
          setToken(storedToken);
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            emailVerified: userData.emailVerified ? new Date(userData.emailVerified) : null,
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://10.7.10.226:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (data.twoFactor) {
          // Handle two-factor authentication
          return { twoFactor: true, message: data.message };
        }
        setToken(data.token);
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          emailVerified: data.user.emailVerified ? new Date(data.user.emailVerified) : null,
          image: data.user.image,
        });
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          emailVerified: data.user.emailVerified,
          image: data.user.image,
        }));
      } else {
        throw new Error(data.error || 'An error occurred during login');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await axios.post('http://10.7.10.226:4000/logout', {
      name: user?.name,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    router.replace('/login');
  };

  const verifyTwoFactor = async (email: string, code: string) => {
    try {
      const response = await fetch('http://10.7.10.226:4000/verify-two-factor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          emailVerified: data.user.emailVerified ? new Date(data.user.emailVerified) : null,
          image: data.user.image,
        });
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          emailVerified: data.user.emailVerified,
          image: data.user.image,
        }));
      } else {
        throw new Error(data.error || 'Invalid two-factor code');
      }
    } catch (error) {
      console.error('Two-factor verification error:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{isLoading, user, setUser, token, setToken, login, logout, verifyTwoFactor }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
