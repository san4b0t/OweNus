import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const addExpense = async (expense: any) => {
  const expenses = await getExpenses();
  const newExpense = { 
    ...expense, 
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  await AsyncStorage.setItem(
    STORAGE_KEYS.EXPENSES,
    JSON.stringify([...expenses, newExpense])
  );
  return newExpense;
};

export const getExpenses = async () => {
  const expenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
  return expenses ? JSON.parse(expenses) : [];
};

export const calculateSplit = (amount: number, members: string[]) => {
  const splitAmount = (amount / members.length).toFixed(2);
  return members.map(member => ({
    name: member,
    owes: parseFloat(splitAmount)
  }));
};