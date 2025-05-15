import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../src/context/AuthContext';
import { ExpenseProvider } from '../src/context/ExpenseContext';
import { PaymentProvider } from '../src/context/PaymentContext';
import AppNavigator from '../src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <PaymentProvider>
          <ExpenseProvider>
            <AppNavigator />
          </ExpenseProvider>
        </PaymentProvider>
      </AuthProvider>
    </PaperProvider>
  );
}