import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const auth = useAuth(); // Get the full auth context
  const router = useRouter();

  const handleLogin = async () => {
    if (!auth) {
      console.error('Auth context not available');
      return;
    }

    try {
      await auth.login(email);
      router.replace('../(auth)/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      // Show error to user
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 15 }
});