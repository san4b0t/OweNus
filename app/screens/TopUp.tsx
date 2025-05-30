import { db, FIREBASE_AUTH } from '@/FirebaseConfig';
import { IdContext } from '@/Global/IdContext';
import { UserDataContext } from '@/Global/UserDataContext';
import { NavigationProp } from '@react-navigation/core';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { View, Text, Button, TextInput, StyleSheet, Keyboard } from 'react-native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const TopUpScreen = ({ navigation }: RouterProps) => {
  const [friendId, setFriendId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSettleUp = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) throw new Error('Not authenticated');

      await addDoc(collection(db, 'transactions'), {
        from: user.uid,
        to: friendId,
        amount: parseFloat(amount),
        settledAt: new Date(),
      });

      // update balances
      // Check if balance exists
      const balanceQuery = query(
        collection(db, 'balances'),
        where('userId', '==', user.uid),
        where('friendId', '==', friendId)
      );

      const snapshot = await getDocs(balanceQuery);

      if (snapshot.empty) return; 

      const doc = snapshot.docs[0];
      await updateDoc(doc.ref, {
      amount: doc.data().amount + parseFloat(amount)
      });

      const balanceQuery2 = query(
        collection(db, 'balances'),
        where('userId', '==', friendId),
        where('friendId', '==', user.uid)
      );

      const snapshot2 = await getDocs(balanceQuery2);

      if (snapshot2.empty) return;

      const doc2 = snapshot2.docs[0];
      await updateDoc(doc2.ref, {
      amount: doc2.data().amount - parseFloat(amount)
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error settling up:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settle Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Friend's User ID"
        value={friendId}
        onChangeText={setFriendId}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="Settle Up" onPress={handleSettleUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default TopUpScreen;

// const TopUp = ({navigation}: RouterProps) => {

//     const { userData, setUserData } = useContext(UserDataContext);
//     const { globUser, setGlobUser} = useContext(IdContext);
//     const [ balance, setBalance ] = useState(userData.balance);
//     const [ topUp, setTopUp ] = useState('');
  
//     const updateBalanceField = async (collectionId: string, documentId: string, fieldsToUpdate: { [key: string]: number }) => {
//         const docRef = doc(db, collectionId, documentId);
//         setBalance(balance + parseFloat(topUp))
//         setTopUp('');
//         Keyboard.dismiss();
//         try {
//           await updateDoc(docRef, fieldsToUpdate);
//         } catch (e) {
//           console.error("Error updating document: ", e);
//         }
//       }
      

//   return (
//     <View>
//         <Text>TopUp Page</Text>
//         <Text>Balance: {balance}</Text>
//         <TextInput 
//                 value={topUp} 
//                 keyboardType='numeric'
//                 style={styles.input} 
//                 placeholder='Top Up Amount' 
//                 autoCapitalize='none' 
//                 onChangeText={setTopUp}></TextInput>
//         <Button title='Top Up' onPress={() => updateBalanceField('users', globUser, {balance: balance + parseFloat(topUp)})}></Button>
//     </View>
//   )
// }

// export default TopUp;
