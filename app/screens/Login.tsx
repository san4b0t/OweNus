import React, { useEffect, useState, useRef, createContext, useContext, useReducer } from 'react'
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, Image, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import * as Font from 'expo-font';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AnimatedButton from '@/assets/components/AnimatedButton';
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from '../../FirebaseConfig';
import {IdProvider, IdContext} from '../../Global/IdContext';
import { NavigationProp } from '@react-navigation/core';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: RouterProps) => {

    const addUserWithCustomId = async (userId: string, name: string, email: string) => {
        try {
          const userDocRef = doc(db, "users", userId);
      
          await setDoc(userDocRef, {
            name: name,
            email: email,
            balance: 0
          });
      
          console.log("Document successfully written with ID: ", userId);
      
        } catch (e) {
          console.error("Error writing document: ", e);
        }
      }

    const [fontLoaded, setFontLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const{ globUser, setGlobUser } = useContext(IdContext);

    useEffect(() => {
        (async() => {
            await Font.loadAsync({
                'PressStart2P': require('@/assets/assets/fonts/PressStart2P-Regular.ttf'),
                'Orbitron': require('@/assets/assets/fonts/Orbitron.ttf'),
                'Jersey25': require('@/assets/assets/fonts/Jersey25.ttf'),
                'ZenDots': require('@/assets/assets/fonts/ZenDots.ttf'),
            });
            setFontLoaded(true);
        })();
    },[]);

    if(!fontLoaded) return null;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            setGlobUser(response.user.uid);
            console.log(response);
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed' + error.message);
        } finally {
            setLoading(false);
        }
    }

    // const signUp = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await createUserWithEmailAndPassword(auth, email, password);
    //         const uid = response.user.uid;
    //         setGlobUser(uid);
    //         console.log(globUser);
    //         const targetChar = "@";
    //         const index = email.indexOf(targetChar);
    //         const name = index !== -1 ? email.slice(0, index) : email;
    //         addUserWithCustomId(uid, name, email);
    //         console.log(name + '' + email);
    //         console.log(response); 
    //     } catch (error: any) {
    //         console.log(error);
    //         alert('Sign up failed' + error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }
 
  return (
    <LinearGradient colors = {['rgba(153, 255, 252, 1)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
    <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding' style = {styles.container}>
            <View style={styles.coinRow}>
            <Image source={require('@/assets/assets/images/coin.png')} style={[styles.coin, styles.firstCoin]}/>
            <Image source={require('@/assets/assets/images/coin.png')} style={[styles.coin, styles.secondCoin]}/>
            <Image source={require('@/assets/assets/images/coin.png')} style={[styles.coin, styles.thirdCoin]}/>
            </View>
            <Text style = {styles.header}>OweNUS</Text>
        <TextInput 
        value={email} 
        style={styles.input} 
        placeholder='Email' 
        autoCapitalize='none' 
        onChangeText={(text) => setEmail(text)}></TextInput>
        <TextInput 
        secureTextEntry={true} 
        value={password} 
        style={styles.input} 
        placeholder='Password' 
        autoCapitalize='none' 
        onChangeText={(text) => setPassword(text)}></TextInput>

        { loading 
        ? (<ActivityIndicator 
        size='large'
        color='#FFFFFF'/>
        ):(
            <View style={styles.buttonContainer}>
                <AnimatedButton 
      style={styles.loginButton} 
      onPress={signIn}
    >
      <Text style={styles.buttonText}>login</Text>
    </AnimatedButton>

    <AnimatedButton 
      style={styles.signUpButton} 
      onPress={() => navigation.navigate('Sign Up')}
    >
      <Text style={styles.signUpButtonText}>sign up</Text>
    </AnimatedButton>
            </View>
        )}
        <Image source={require('@/assets/assets/images/cash.png')} style={styles.cash}/>
        
    </KeyboardAvoidingView>
    </View>
    </LinearGradient>
  )
}

export default Login;

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    loginButton: {
        backgroundColor: '#1520A6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
        elevation: 3, // Android shadow
        shadowColor: '#000000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    signUpButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#1520a6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Orbitron',
        color: '#FDE8B6',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    signUpButtonText: {
        fontFamily: 'Orbitron',
        color: '#FDE8B6',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    cash: {
        position: 'absolute',
        width: 100,
        height: 100,
        left: -40,
        bottom: -30,
    },
    coin: {
        width: 50,
        height: 50,
        position: 'absolute',
    },
    coinRow: {
        position: 'relative',
        width: 120,
        height: 60,
        marginBottom: 10,
        alignSelf: 'center',
    },
    firstCoin: {
        bottom: 30,
        left: 0,
    },
    secondCoin: {
        bottom: 50,
        left: 30,
        transform: [{ rotate: '90deg' }],
    },
    thirdCoin:{
        bottom: 70,
        left: 60,
        transform: [{ rotate: '90deg' }],
    },
    header: {
        fontFamily: 'PressStart2P',
        fontSize: 44,
        color: '#f8bf3c',
        textAlign: 'center',
        marginBottom: 20,
    },
    gradient: {
        flex: 1,
    },
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
})