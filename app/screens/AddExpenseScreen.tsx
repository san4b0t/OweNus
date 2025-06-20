import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import ActionButton from '@/assets/components/ActionButton';
import { AddExpenseService } from '../services/AddExpenseService';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DatePickerComponent from '@/assets/components/DatePickerComponent';
import { DateContext } from '@/Global/DateContext';

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

    setIsProcessing(true);
    try {
      await AddExpenseService.createExpense(description, amountNumber, participantNames,deadline);
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
      <DatePickerComponent/>
      <ActionButton
          imageSource={require('@/assets/assets/images/expenses.png')}
          label="Add Expense"
          onPress={handleAddExpense}
          
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
});

