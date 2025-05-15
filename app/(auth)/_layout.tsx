import { Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();
  
  if (user) {
    return <Stack.Screen name="(app)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" />
    </Stack>
  );
}