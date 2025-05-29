import { NavigationProp } from '@react-navigation/core';
import React, { useContext, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../FirebaseConfig';
import { IdContext } from '@/Global/IdContext';
import { UserDataContext } from '@/Global/UserDataContext';


interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Dashboard = ({ navigation } : RouterProps) => {

  const { globUser, setGlobUser} = useContext(IdContext);
  const { userData, setUserData } = useContext(UserDataContext);
  

  async function fetchSingleDocument(collectionId: string, documentId: string) {
    const docRef = doc(db, collectionId, documentId);
  
    try {
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setUserData(docSnap.data())
        return docSnap.data(); 
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (e) {
      console.error("Error fetching document: ", e);
    }
  }

  fetchSingleDocument('users', globUser);
  

  return (
    <View>
        <Text>Hello {userData?.name}</Text>
        <Text>Balance: {userData?.balance}</Text>
        <Button onPress={() => navigation.navigate('details')} title='Open Details' />
        <Button onPress={() => navigation.navigate('Top Up')} title='Top Up' />
        <Button onPress={() => navigation.navigate('Transfer')} title='Transfer' />
        <Button onPress={() => FIREBASE_AUTH.signOut()} title='Logout' />
    </View>
  )
}

export default Dashboard;
