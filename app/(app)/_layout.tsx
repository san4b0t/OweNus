import { Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();
  
  if (!user) {
    return <Stack.Screen name="(auth)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="expenses" />
    </Stack>
  );
}