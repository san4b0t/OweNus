import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, StatusBar } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/core';
import { IdContext } from '@/Global/IdContext';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedButton from '@/assets/components/AnimatedButton';


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
    <>
      <LinearGradient colors = {['rgb(157, 255, 252)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
        <View style={styles.container}>
          <Image source={require('@/assets/assets/images/locker.png')} style={[styles.locker]}/>
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
          <View style={styles.buttonContainer}>
          <AnimatedButton style={styles.signUpButton} onPress={handleSignup}>
            <Text style={styles.buttonText}>sign up</Text>
          </AnimatedButton>
          <AnimatedButton style={styles.logInButton}
            onPress={() => navigation.navigate('Login')} >
            <Text style={styles.buttonText}>already have an account? log in</Text>
          </AnimatedButton>
          </View>
        </View>
      </LinearGradient>
      </>
  );
};

const styles = StyleSheet.create({
  locker: {
    width: 160,
    height: 110,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  signUpButton: {
    backgroundColor: '#1520A6',
    borderWidth: 2,
    borderColor: '#1520A6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText:{
    fontFamily: 'Orbitron',
    color: '#FDE8B6',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  logInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FDE8B6',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },

  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    padding: 20,              
    
  },
  title: {
    fontFamily: 'PressStart2P',
    color: '#ffc908',
    fontSize: 36,
    marginBottom: 20,   
    fontWeight: "bold",      
    textAlign: 'center',      
  },
  input: {
    width: '100%',            
    height: 40,
    borderColor: 'grey',
    backgroundColor: 'background',
    borderWidth: 1,
    marginBottom: 20,         
    paddingHorizontal: 10,    
    borderRadius: 10,
    color: 'black',
  },
  gradient: {
    flex: 1,                  
  },
});

export default SignupScreen;