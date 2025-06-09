import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
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
  const user = FIREBASE_AUTH.currentUser;
  

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

  const [expenses, setExpenses] = useState<{ id: string; [key: string]: any }[]>([]);
    const [balances, setBalances] = useState<Record<string, number>>({});
  
    useEffect(() => {
      const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.log('No authenticated user');
      return;
    }
  
      // Fetch expenses
      const expensesQuery = query(
        collection(db, 'expenses'),
        where('paidBy', '==', user.uid)
      );
  
      const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExpenses(expensesData);
      });
  
      // Fetch balances (simplified)
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
      };
    }, []);

    const getUserName = async (uid: string) => {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
    
      if (userSnap.exists()) {
        const data = userSnap.data();
        return data.name; 
      } else {
        throw new Error("User document not found in Firestore");
      }
    };
  

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
                    <Text>{item.description}: ${item.amount} | </Text>
                    <Text>Paid by: {item.paidByName}</Text>
                  </View>
                )}
              />
              
              <Text style={styles.subtitle2}>Balances:</Text>
              {Object.entries(balances).map(async ([friendId, amount]) => (
                <Text key={friendId}>
                  {friendId}: {amount < 0 ? 'You owe' : 'Owes you'} ${Math.abs(amount)}
                </Text>
              ))}
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
        {/* <ActionButton
          imageSource={require('@/assets/assets/images/details.png')}
          label="Details"
          onPress={() => navigation.navigate('details')}
        /> */}

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
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  gradient: {
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  wallet: {
    position: 'absolute',
    zIndex: -1,
  },
});

export default Dashboard;
