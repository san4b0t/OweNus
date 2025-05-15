import React, { createContext, useEffect, useState } from 'react';
import { getExpenses } from '../services/expenseService';

export const ExpenseContext = createContext({
  expenses: [] as any[],
  addExpense: (expense: any) => {},
  refreshExpenses: () => {}
});

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<any[]>([]);

  const refreshExpenses = async () => {
    const loadedExpenses = await getExpenses();
    setExpenses(loadedExpenses);
  };

  useEffect(() => {
    refreshExpenses();
  }, []);

  const addExpense = async (expense: any) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, refreshExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
}