import { db } from '@/FirebaseConfig';
import { IdContext } from '@/Global/IdContext';
import { UserDataContext } from '@/Global/UserDataContext';
import { NavigationProp } from '@react-navigation/core';
import { doc, increment, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { View, Text, Button, TextInput, StyleSheet, Keyboard } from 'react-native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Transfer = ({navigation}: RouterProps) => {

    const { userData, setUserData } = useContext(UserDataContext);
    const { globUser, setGlobUser} = useContext(IdContext);
    const [ balance, setBalance ] = useState(userData.balance);
    const [ trf, setTrf ] = useState('');
    const [ receipient, setReceipient ] = useState('');
  
    const transferTo = async (collectionId: string, documentId: string, trfAmt: number) => {
        const docRef = doc(db, collectionId, documentId);
        try {
          await updateDoc(docRef, {
            balance: increment(trfAmt)
          });
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      }
      
      const transferFrom = async (collectionId: string, documentId: string, fieldsToUpdate: { [key: string]: number }) => {
        const docRef = doc(db, collectionId, documentId);
        setBalance(balance - parseFloat(trf))
        try {
          await updateDoc(docRef, fieldsToUpdate);
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      }

      const transfer = (collectionId: string, senderId: string, receipientId: string, transferAmt: string) => {
        transferTo(collectionId, receipientId, parseFloat(transferAmt));
        transferFrom(collectionId, senderId, {balance: balance - parseFloat(transferAmt)});
        setTrf('');
        setReceipient('');
        Keyboard.dismiss();
      }

  return (
    <View>
        <Text>Transfer Page</Text>
        <Text>Balance: {balance}</Text>
        <TextInput 
                value={receipient} 
                style={styles.input} 
                placeholder='Transfer To' 
                autoCapitalize='none' 
                onChangeText={setReceipient}></TextInput>
        <TextInput 
                value={trf} 
                keyboardType='numeric'
                style={styles.input} 
                placeholder='Transfer Amount' 
                autoCapitalize='none' 
                onChangeText={setTrf}></TextInput>
        <Button title='Transfer' onPress={() => transfer('users', globUser, receipient, trf)}></Button>
    </View>
  )
}

export default Transfer;

const styles = StyleSheet.create({
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
})