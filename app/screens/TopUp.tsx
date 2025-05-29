import { db } from '@/FirebaseConfig';
import { IdContext } from '@/Global/IdContext';
import { UserDataContext } from '@/Global/UserDataContext';
import { NavigationProp } from '@react-navigation/core';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { View, Text, Button, TextInput, StyleSheet, Keyboard } from 'react-native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const TopUp = ({navigation}: RouterProps) => {

    const { userData, setUserData } = useContext(UserDataContext);
    const { globUser, setGlobUser} = useContext(IdContext);
    const [ balance, setBalance ] = useState(userData.balance);
    const [ topUp, setTopUp ] = useState('');
  
    const updateBalanceField = async (collectionId: string, documentId: string, fieldsToUpdate: { [key: string]: number }) => {
        const docRef = doc(db, collectionId, documentId);
        setBalance(balance + parseFloat(topUp))
        setTopUp('');
        Keyboard.dismiss();
        try {
          await updateDoc(docRef, fieldsToUpdate);
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      }
      

  return (
    <View>
        <Text>TopUp Page</Text>
        <Text>Balance: {balance}</Text>
        <TextInput 
                value={topUp} 
                keyboardType='numeric'
                style={styles.input} 
                placeholder='Top Up Amount' 
                autoCapitalize='none' 
                onChangeText={setTopUp}></TextInput>
        <Button title='Top Up' onPress={() => updateBalanceField('users', globUser, {balance: balance + parseFloat(topUp)})}></Button>
    </View>
  )
}

export default TopUp;

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
