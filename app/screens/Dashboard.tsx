import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../FirebaseConfig';
import { IdContext } from '@/Global/IdContext';
import { UserDataContext } from '@/Global/UserDataContext';
import ActionButton from '@/assets/components/ActionButton';


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

  useEffect(() => {
    if (globUser) {
      fetchSingleDocument('users', globUser);
    }
  }, [globUser]);
  

  return (
    <LinearGradient colors = {['rgba(153, 255, 252, 1)', 'rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
      <View style={styles.infoCard}>
        <Text style={styles.header}>Welcome, {userData?.name || 'User'}</Text>
        <Text style={styles.balance}> Balance:${userData?.balance||0}</Text>
      </View>

      <View style={styles.verticalButtons}>
        <ActionButton
          imageSource={require('@/assets/assets/images/transfer.png')}
          label="Transfer"
          onPress={() => navigation.navigate('Transfer')}
          
        />
        <ActionButton
          imageSource={require('@/assets/assets/images/topup.png')}
          label="Top Up"
          onPress={() => navigation.navigate('Top Up')}
        />
        <ActionButton
          imageSource={require('@/assets/assets/images/details.png')}
          label="Details"
          onPress={() => navigation.navigate('details')}
        />
        

        <ActionButton
          imageSource={require('@/assets/assets/images/logout.png')}
          label="Logout"
          onPress={() => FIREBASE_AUTH.signOut()}
          
        />
        </View>
      <Image source={require('@/assets/assets/images/cash.png')} style={styles.cash}/>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.36)', // translucent card
    paddingVertical: 30,
    paddingHorizontal: 26,
    marginHorizontal: 12,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  header: {
    fontFamily: 'Orbitron',
    fontSize: 28,
    fontWeight: '600',
    color: '#000352',
    marginBottom: 8,
    textAlign: 'center',
  },
  balance: {
    fontFamily:'PressStart2P' ,
    fontSize: 24,
    color: '#001561',
    marginBottom: 24,
    textAlign: 'center',
  },
  verticalButtons: {
    flexDirection: 'column',
    gap: 26,
  },
  cash: {
    position: 'absolute',
    width: 300,
    height: 300,
    left: -100,
    bottom: -100,
  },
});

export default Dashboard;
