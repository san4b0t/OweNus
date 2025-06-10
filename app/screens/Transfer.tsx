import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { UserDataContext } from '@/Global/UserDataContext';
import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import ActionButton from '@/assets/components/ActionButton';
import { TransferService } from '../services/TransferService';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Transfer = ({ navigation }: RouterProps) => {
  // const [friendName, setFriendName] = useState('');
  // const [amount, setAmount] = useState('');

  // const handleSettleUp = async () => {
  //   try {
  //     const user = FIREBASE_AUTH.currentUser;
  //     if (!user) throw new Error('Not authenticated');

  //     const friendDoc = query(
  //       collection(db, 'users'),
  //       where('name', '==', friendName),
  //     );

  //     const friendSnapshot = await getDocs(friendDoc);
  //     if (friendSnapshot.empty) {
  //       console.error(`User with name ${friendName} not found`);
  //       return;
  //     }
  //     const friendId = friendSnapshot.docs[0].data().uid;

  //     await addDoc(collection(db, 'transactions'), {
  //       from: user.uid,
  //       fromName: user.displayName,
  //       to: friendId,
  //       toName: friendName,
  //       amount: parseFloat(amount),
  //       settledAt: new Date(),
  //     });

  //     // update balances
      
  //     const balanceQuery = query(
  //       collection(db, 'balances'),
  //       where('userId', '==', user.uid),
  //       where('friendName', '==', friendName)
  //     );

  //     const snapshot = await getDocs(balanceQuery);
  //     // check if balance exists
  //     if (snapshot.empty) {
  //       // create new balance
  //       await addDoc(collection(db, 'balances'), {
  //         userId: user.uid,
  //         userName: user.displayName,
  //         friendId: friendId,
  //         friendName: friendName,
  //         amount: parseFloat(amount)
  //       });
  //     } else {
  //       const doc = snapshot.docs[0];
  //       await updateDoc(doc.ref, {
  //         amount: doc.data().amount + parseFloat(amount)
  //     });
  //     }

  //     //update user balance
  //     const userQuery = query(
  //       collection(db, 'users'),
  //       where('uid', '==', user.uid),
  //     );

  //     const usersnapshot = await getDocs(userQuery);

  //     if (usersnapshot.empty) return; 

  //     const userdoc = usersnapshot.docs[0];
  //     await updateDoc(userdoc.ref, {
  //     balance: userdoc.data().balance - parseFloat(amount)
  //     });

  //     //update mirror balance

  //     const balanceQuery2 = query(
  //       collection(db, 'balances'),
  //       where('userName', '==', friendName),
  //       where('friendId', '==', user.uid)
  //     );

  //     const snapshot2 = await getDocs(balanceQuery2);

  //     if (snapshot2.empty) {
  //       // create new balance
  //       await addDoc(collection(db, 'balances'), {
  //         userId: friendId,
  //         userName: friendName,
  //         friendId: user.uid,
  //         friendName: user.displayName,
  //         amount: -1 *parseFloat(amount)
  //       });
  //     } else {
  //       const doc2 = snapshot2.docs[0];
  //       await updateDoc(doc2.ref, {
  //         amount: doc2.data().amount - parseFloat(amount)
  //       });
  //     }

  //     //update friend's balance
  //     const friendQuery = query(
  //       collection(db, 'users'),
  //       where('uid', '==', friendSnapshot.docs[0].data().uid),  
  //     );
      
  //     const friendDataSnapshot = await getDocs(friendQuery);

  //     if (friendDataSnapshot.empty) return;

  //     const frienddoc = friendDataSnapshot.docs[0];
  //     await updateDoc(frienddoc.ref, {
  //     balance: frienddoc.data().balance + parseFloat(amount)
  //     });
      

  //     navigation.goBack();
  //   } catch (error) {
  //     console.error('Error settling up:', error);
  //   }
  // };

  const [friendName, setFriendName] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    if (!friendName || !amount) {
      Alert.alert('Error', 'Please enter both friend name and amount');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user || !user.displayName) throw new Error('Not authenticated');

      // Find friend
      const friendDoc = await TransferService.findUserByName(friendName);
      const friendData = friendDoc.data();
      
      // Create transaction
      await TransferService.createTransaction(
        user.uid,
        friendData.uid,
        user.displayName,
        friendName,
        amountNumber
      );

      // Update balances
      await Promise.all([
        // Update sender's balance
        TransferService.updateUserBalance(user.uid, -amountNumber),
        // Update receiver's balance
        TransferService.updateUserBalance(friendData.uid, amountNumber),
        // Update balance records
        TransferService.updateBalanceRecord(
          user.uid,
          friendData.uid,
          user.displayName,
          friendName,
          amountNumber
        ),
        TransferService.updateBalanceRecord(
          friendData.uid,
          user.uid,
          friendName,
          user.displayName,
          -amountNumber
        )
      ]);

      Alert.alert(
        'Success', 
        `Successfully transferred $${amountNumber.toFixed(2)} to ${friendName}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Transfer Failed', error.message);
      console.error('Transfer error:', error);
    }
  };

  return (
    <LinearGradient colors = {['rgba(153, 255, 252, 1)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
    <View style={styles.container}>
      <Image source={require('@/assets/assets/images/coindropping1.png')} style={styles.coin1}/>
      <Text style={styles.title}>Transfer</Text>
      <TextInput
        style={styles.input}
        placeholder="Friend's Username"
        value={friendName}
        onChangeText={setFriendName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <ActionButton
          imageSource={require('@/assets/assets/images/moneybag.png')}
          label="Transfer"
          onPress={handleTransfer}
        />
        <Image source={require('@/assets/assets/images/coindropping2.png')} style={styles.coin2}/>
    
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: 'ZenDots',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#00177d',
    marginTop: 200,
  },
  input: {
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  coin1: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: 10,
  },
  coin2: {
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center',
    height: 255,
    width: 255,
    alignSelf: 'center',
  },
});

export default Transfer;