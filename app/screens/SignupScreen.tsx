import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/core';
import { IdContext } from '@/Global/IdContext';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const SignupScreen = ({ navigation }: RouterProps) => {
   const { globUser, setGlobUser } = useContext(IdContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async () => {
    try {

      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);

      await updateProfile(userCredential.user, {
        displayName: name,
      });
  
      
      console.log('Display name is now:', userCredential.user.displayName);

      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name,
        email,
        balance: 0,
        createdAt: new Date(),
      });
  
      console.log('User registered successfully');
      
      //navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default SignupScreen;