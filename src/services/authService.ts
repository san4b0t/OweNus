import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const login = async (email: string) => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ email }));
};

export const logout = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};