import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, Switch, FlatList } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import ActionButton from '@/assets/components/ActionButton';
import { AddExpenseService } from '../services/AddExpenseService';
import DatePickerComponent from '@/assets/components/DatePickerComponent';
import { DateContext } from '@/Global/DateContext';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const AddExpenseScreen = ({ navigation }: RouterProps) => {
  const { deadline, setDeadline } = useContext(DateContext);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [participants, setParticipants] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [custom, setCustom] = useState(false);
  const [splits, setSplits] = useState('');

  //friends
  const fetchFriends = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const friendsQuery = query(
      collection(db, 'friendships'),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(friendsQuery);
    setFriends(snapshot.docs.map(doc => doc.data().friendName));
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleAddExpense = async () => {
    // input validation
    if (!description || !amount || !participants) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (deadline < new Date()) {
      Alert.alert('Error', 'Deadline cannot be in the past');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const participantNames = participants.split(',').map(p => p.trim()).filter(p => p !== '');
    if (participantNames.length === 0) {
      Alert.alert('Error', 'Please add at least one participant');
      return;
    }

    const splitsProcessed = splits.split(',').map(s => s.trim()).filter(s => s != '').map(s => parseFloat(s)); 

    setIsProcessing(true);
    try {
      if (custom) {
        await AddExpenseService.createCustomExpense(description, amountNumber, participantNames, splitsProcessed, deadline);
      } else {
        await AddExpenseService.createExpense(description, amountNumber, participantNames, deadline);
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
      console.error('Add expense error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors = {['rgb(157, 255, 252)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
      {/* <Image source={require('@/assets/assets/images/money-cash.gif')} style={styles.expense}/> */}
      <Text style={styles.title}>Add New Expense</Text>
      <View style={styles.toggle}>
      <Text style={styles.toggleText}>Expense type: {custom ? 'Custom' : 'Equal'}</Text>
      <Switch
        onValueChange={() => setCustom(previousState => !previousState)}
        value={custom}
      />
    </View>
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
      {custom ?
        <TextInput 
        style={styles.input}
        placeholder="Splits (comma separated, in order of names listed)"
        value={splits}
        onChangeText={setSplits}
        /> : <View></View>
      }
      <DatePickerComponent/>
      <ActionButton
          imageSource={require('@/assets/assets/images/expenses.png')}
          label="Add Expense"
          onPress={handleAddExpense}
          
        />
      <Text style={styles.subtitle}>Your Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
        <View style={styles.friendItem}>
          <Text style={styles.friends}>{item}</Text>
        </View>
        )}
        style = {styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require('@/assets/assets/images/nofriends.png')} // 
              style={styles.emptyImage}
            />
          <Text style={styles.emptyText}>"you tried to console.log(myFriends) but it returned an empty array... guess you need to fetch some new ones!"</Text>
          </View>
        }
        />
      </LinearGradient>
    </View>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    marginTop: 20,
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
    marginBottom: 10,
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
   dateInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  dateText: {
    color: '#00177d',
    fontWeight: 'bold',
  },
  friendItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: 'transparent' ,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 22,
    fontFamily: 'Jersey25',
    color: '#ffb300',
    textAlign: 'center',
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
    width: '95%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  friends: {
    textAlign: 'center',
    fontFamily: 'ZenDots',
    color: '#00177d',
    fontSize: 20,
    fontWeight: '600',
    width: 'auto',
  },
  subtitle: {
    fontFamily: 'ZenDots',
    fontWeight: 'bold',
    color: '#00177d',
    fontSize: 22,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  toggle: {
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },
  toggleText: {
    fontSize: 22,
    fontFamily: 'Jersey25',
    color: '#00177d',
    textAlign: 'center',
  },
});

