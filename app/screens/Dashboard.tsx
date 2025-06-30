import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, Pressable, LogBox } from 'react-native';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from '../../FirebaseConfig';
import { IdContext } from '@/Global/IdContext';
import { UserDataContext } from '@/Global/UserDataContext';
import ActionButton from '@/assets/components/ActionButton';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import * as Updates from 'expo-updates';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Dashboard = ({ navigation } : RouterProps) => {

  const { globUser, setGlobUser} = useContext(IdContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const user = FIREBASE_AUTH.currentUser;
  
  const projectId = '0848228c792dfdbd3539a2bce980524d';
  const metadata = {
    name: 'YOUR_PROJECT_NAME',
    description: 'YOUR_PROJECT_DESCRIPTION',
    url: 'https://your-project-website.com',
    icons: ['https://your-project-logo.com'],
    redirect: {
      native: 'YOUR_APP_SCHEME://',
      universal: 'YOUR_APP_UNIVERSAL_LINK.com',
    }
  }

  const { open, isConnected, address, provider } = useWalletConnectModal();
  const connect = async () => {

    console.log('working...')

    if (isConnected) {
      return provider?.disconnect();
    }

    open();
  }

  const reloadApp = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Failed to reload app:", error);
    }
  };

  const [reload, setReload] = useState<Boolean>(false);
  useEffect(() => {
    console.log('address change detected')
    if (reload) {
      reloadApp();
    }
  }, [address])

LogBox.ignoreLogs([
  'react-native-compat: Application module is not available',
]);

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
  }, []);

  const [expenses, setExpenses] = useState<{ id: string; [key: string]: any }[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.log('No authenticated user');
      return;
    }

    // fetch user balance
    const userDocRef = doc(db, 'users', globUser);
    const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      setUserData(doc.data());
    }
  });


    //fetch 3 most recent expenses
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('paidBy', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).slice(0, 3);
      setExpenses(expensesData);
    });

    // fetch balances owed to and from other users
    const balancesQuery = query(
      collection(db, 'balances'), 
      where('userId', '==', user.uid),
      where('amount', '!=', 0));
    const unsubscribeBalances = onSnapshot(balancesQuery, (snapshot) => {
      const balancesData: Record<string, number> = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        balancesData[data.friendName as string] = data.amount as number;
      });
      setBalances(balancesData);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeBalances();
      unsubscribeUser();
    };
  }, []);

  return (
    <LinearGradient colors = {['rgba(153, 255, 252, 1)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
      <View style={styles.infoCard}>
        <Text style={styles.header}>Welcome, {user?.displayName || 'User'}</Text>
        <Text style={styles.balance}> Balance:${userData?.balance||0}</Text>
        <Text style={styles.subtitle1}>Recent Expenses:</Text>
              <FlatList
                data={expenses}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.expenseItem}>
                    <Text style={styles.text}>{item.description}: ${item.amount} | </Text>
                    <Text style={styles.text}>Paid by: {item.paidByName}</Text>
                  </View>
                )}
              />
              
              <Text style={styles.subtitle2}>Balances:</Text>
              {Object.entries(balances).map(async ([friendId, amount]) => (
                <Text key={friendId} style={styles.text}>
                  {friendId}: {amount < 0 ? 'You owe' : 'Owes you'} ${Math.abs(amount)}
                </Text>
              ))}
      <Text>WallectConnect</Text>
      <Text>{ isConnected ? address : 'no wallet connected' }</Text>
      <Pressable onPress={connect}>
        <Text>{ isConnected ? 'disconnect' : 'connect' }</Text>
      </Pressable>
      <WalletConnectModal
        explorerRecommendedWalletIds={[
          '0x9399b54B05D0b8711Eb2a5839770a5E87a6345b5',
        ]}
        projectId={projectId}
        providerMetadata={metadata}
      />
      </View>
      
      <View style={styles.verticalButtons}>
        <ScrollView
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={{ minHeight: '50%' }}>
        
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
          label="Balances"
          onPress={() => navigation.navigate('Details')}
        />

        <ActionButton
          imageSource={require('@/assets/assets/images/friends.png')}
          label="Friends"
          onPress={() => navigation.navigate('Friends')}
        />
        

        <ActionButton
          imageSource={require('@/assets/assets/images/expenses.png')}
          label="Add Expense"
          onPress={() => navigation.navigate('Add Expense')}  
        />

        <ActionButton
          imageSource={require('@/assets/assets/images/insights.png')}
          label="Insights"
          onPress={() => navigation.navigate('Insights')}
          
        />

        <ActionButton
          imageSource={require('@/assets/assets/images/logout.png')}
          label="Logout"
          onPress={() => FIREBASE_AUTH.signOut()}
          
        />
        </ScrollView>
        
        </View>
      <Image source={require('@/assets/assets/images/cash.png')} style={styles.cash}/>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.36)', 
    paddingVertical: 30,
    paddingHorizontal: 26,
    marginHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  gradient: {
    display: 'flex',
    flex: 1,
  },
  header: {
    fontFamily: 'Orbitron',
    fontSize: 24,
    fontWeight: '800',
    color: '#000352',
    textAlign: 'center',
    marginBottom: 'auto',
  },
  balance: {
    fontFamily:'Orbitron' ,
    fontSize: 24,
    color: '#001561',
    textAlign: 'center',
    fontWeight: '500',
  },
  verticalButtons: {
    flexDirection: 'column',
    gap: 6,
    flex: 1,
    paddingBottom: 40,
  },
  cash: {
    position: 'absolute',
    width: 300,
    height: 300,
    left: -140,
    bottom: -120,
    zIndex: -1, 
  },
  subtitle1: {
    fontFamily: 'orbitron',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'semibold',
    color: '#001561',
  },
  subtitle2: {
    fontFamily: 'orbitron',
    fontSize: 20,
    marginTop: 5,
    marginBottom: 10,
    fontWeight: 'semibold',
    color: '#001561',
  },
  expenseItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  wallet: {
    position: 'absolute',
    zIndex: -1,
  },
  text: {
    color: '#00177d',
    fontWeight: 'bold',
  },
});

export default Dashboard;
