import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { collection, addDoc, updateDoc, getDocs, where, query } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import ActionButton from '@/assets/components/ActionButton';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const AddExpenseScreen = ({ navigation }: RouterProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [participants, setParticipants] = useState('');

  const handleAddExpense = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) throw new Error('Not authenticated');
  
      const participantIds = participants.split(',').map(p => p.trim());
      const amountPerPerson = parseFloat(amount) / (participantIds.length || 1);
  
      // Add expense
      await addDoc(collection(db, 'expenses'), {
        description,
        amount: parseFloat(amount),
        paidBy: user.displayName,
        participants: participantIds,
        createdAt: new Date(),
      });
  
      // Update balances for each participant
      for (const participantId of participantIds) {
        if (participantId === user.uid) continue;
        
        // Check if balance exists
        const balanceQuery = query(
          collection(db, 'balances'),
          where('userId', '==', user.uid),
          where('friendId', '==', participantId)
        );
        
        const snapshot = await getDocs(balanceQuery);
        
        if (snapshot.empty) {
          // Create new balance
          await addDoc(collection(db, 'balances'), {
            userId: user.uid,
            friendId: participantId,
            amount: amountPerPerson
          });
        } else {
          // Update existing balance
          const doc = snapshot.docs[0];
          await updateDoc(doc.ref, {
          amount: doc.data().amount + amountPerPerson
          });
        }
        //create mirror balance
        // Check if balance exists
        const balanceQuery2 = query(
          collection(db, 'balances'),
          where('userId', '==', participantId),
          where('friendId', '==', user.uid)
        );
        
        const snapshot2 = await getDocs(balanceQuery2);
        
        if (snapshot2.empty) {
          // Create new balance
          await addDoc(collection(db, 'balances'), {
            userId: participantId,
            friendId: user.uid,
            amount: -1 * amountPerPerson
          });
        } else {
          // Update existing balance
          const doc = snapshot2.docs[0];
          await updateDoc(doc.ref, {
          amount: doc.data().amount - amountPerPerson
          });
        }
      }
  
      navigation.goBack();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors = {['rgb(157, 255, 252)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
      <Image source={require('@/assets/assets/images/money-cash.gif')} style={styles.expense}/>
      <Text style={styles.title}>Add New Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Participant usernames (comma separated)"
        value={participants}
        onChangeText={setParticipants}
      />
      <ActionButton
          imageSource={require('@/assets/assets/images/expenses.png')}
          label="Add Expense"
          onPress={handleAddExpense}
          
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    marginTop: 220,
    marginBottom: 20,
    color: '#00177d',
    fontFamily: 'ZenDots',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlign: 'center',
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  expense: {
    position: 'absolute',
    marginTop: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default AddExpenseScreen;