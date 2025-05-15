import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';

type AuthContextType = {
  user: { email: string } | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string) => {
    const userData = { email };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

