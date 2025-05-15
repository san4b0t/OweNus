import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { ExpenseProvider } from '../src/context/ExpenseContext';
import { PaymentProvider } from '../src/context/PaymentContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <ExpenseProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
        </ExpenseProvider>
      </PaymentProvider>
    </AuthProvider>
  );
}