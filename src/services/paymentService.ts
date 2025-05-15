import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const addPayment = async (payment: any) => {
  const payments = await getPayments();
  const newPayment = { ...payment, id: Date.now().toString() };
  await AsyncStorage.setItem(
    STORAGE_KEYS.PAYMENTS,
    JSON.stringify([...payments, newPayment])
  );
  return newPayment;
};

export const getPayments = async () => {
  const payments = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS);
  return payments ? JSON.parse(payments) : [];
};