import { db, FIREBASE_AUTH } from '@/FirebaseConfig';
import { IdContext } from '@/Global/IdContext';
import { UserDataContext } from '@/Global/UserDataContext';
import { NavigationProp } from '@react-navigation/core';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { View, Text, Button, TextInput, StyleSheet, Keyboard, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ActionButton from '@/assets/components/ActionButton';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const TopUpScreen = ({ navigation }: RouterProps) => {
  const [amount, setAmount] = useState('');

  const handleTopUp = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) throw new Error('Not authenticated');

      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', user.uid),
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) return; 

      const doc = snapshot.docs[0];
      await updateDoc(doc.ref, {
      balance: doc.data().balance + parseFloat(amount)
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error topping up:', error);
    }
  };

  return (
    <LinearGradient colors = {['rgb(157, 255, 252)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
    <View style={styles.container}>
      <Text style={styles.title}>Top Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <ActionButton
          imageSource={require('@/assets/assets/images/cash2.png')}
          label="Top Up"
          onPress={handleTopUp}
          
        />
        <Image source={require('@/assets/assets/images/coin2.png')} style={styles.coin}/>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  title: {
    fontFamily: 'ZenDots',
    fontWeight: 'bold',
    color: '#00177d',
    fontSize: 32,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 100,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  gradient: {
    flex: 1,
  },
  coin: {
    position: 'relative',
    marginTop: 20,
  },
});

export default TopUpScreen;
