import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, Switch, ScrollView, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import ActionButton from '@/assets/components/ActionButton';
import { AddExpenseService } from '../services/AddExpenseService';
import DatePickerComponent from '@/assets/components/DatePickerComponent';
import { DateContext } from '@/Global/DateContext';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { CreditScoringService } from '../services/CreditScoringService';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const AddExpenseScreen = ({ navigation }: RouterProps) => {
  const { deadline, setDeadline } = useContext(DateContext);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [custom, setCustom] = useState(false);
  const [splits, setSplits] = useState('');
  const [friends, setFriends] = useState<Array<[string, string]>>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const [selfName, setSelfName] = useState<string | null>(null);

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const name =
        user.displayName ||
        (user.email ? user.email.split('@')[0] : user.uid);
      setSelfName(name);
    }
  }, []);

  const fetchFriends = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const friendsQuery = query(
      collection(db, 'friendships'),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(friendsQuery);

    const friendsData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const friendName = doc.data().friendName;
        const score = await CreditScoringService.calculateCustomCreditScore(
          doc.data().friendId
        );
        return [friendName, score] as [string, string];
      })
    );
    setFriends(friendsData);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const toggleFriendSelection = (friendName: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendName)
        ? prev.filter((name) => name !== friendName)
        : [...prev, friendName]
    );
  };

  const toggleSelf = () => {
    if (!selfName) return;
    toggleFriendSelection(selfName);
  };

  const handleAddExpense = async () => {
    if (!description || !amount) {
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

    if (selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select at least one participant');
      return;
    }

    const splitsProcessed = splits
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => parseFloat(s));

    setIsProcessing(true);
    try {
      if (custom) {
        await AddExpenseService.createCustomExpense(
          description,
          amountNumber,
          selectedFriends,
          splitsProcessed,
          deadline
        );
      } else {
        await AddExpenseService.createExpense(
          description,
          amountNumber,
          selectedFriends,
          deadline
        );
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
      console.error('Add expense error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={[
            'rgba(153, 255, 252, 1)',
            'rgba(61,150,185,1)',
            'rgba(61,150,185,1)',
            'rgba(15,0,87,1)',
          ]}
          style={styles.gradient}
        >
          <Text style={styles.title}>Add New Expense</Text>

          <View style={styles.expenseTypeRow}>
            <Text style={styles.toggleText}>
              Expense type: {custom ? 'Custom' : 'Equal'}
            </Text>
            <View style={styles.switchRow}>
              <Switch onValueChange={() => setCustom((p) => !p)} value={custom} />
            </View>
          </View>
          
          <View style={{ gap: 0}}>
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

          <DatePickerComponent />

          <View style={{ height: 40,  marginBottom: 0 }}>
            {custom && (
              <TextInput
                style={[styles.input, {marginBottom : 0}]}
                placeholder="Splits (comma separated)"
                value={splits}
                onChangeText={setSplits}
              />
            )}
          </View>
          </View>

          <Text style={styles.subtitle}>Select Friends</Text>

          <View style={styles.friendListWrapper}>
            {selectedFriends.length > 0 ? (
              <View style={styles.selectedContainer}>
                <Text style={styles.selectedTitle}>Selected Participants:</Text>
                <View style={styles.selectedList}>
                  {selectedFriends.map((friend, idx) => (
                    <Text key={idx} style={styles.selectedName}>
                      {friend}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.noSelected}>No participants selected</Text>
            )}
            <View style={{ flex: 1 }}>
              <ScrollView
                style={styles.listContainer}
                contentContainerStyle={{ paddingBottom: 20 }}
                bounces={false}
                overScrollMode="never"
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {friends.length > 0 ? (
                  friends.map((item) => (
                    <TouchableOpacity
                      key={item[0]}
                      style={styles.friendItem}
                      activeOpacity={0.7}
                      delayPressIn={0}
                      onPress={() => toggleFriendSelection(item[0])}
                    >
                      <View style={styles.friendRow}>
                        <Text style={styles.friendName}>{item[0]}</Text>
                        <View
                          style={[
                            styles.iconButton,
                            selectedFriends.includes(item[0]) ? styles.removeButton : styles.addButton,
                          ]}
                          pointerEvents="none" // disable interaction on icon button itself, whole row toggles
                        >
                          <Text style={styles.buttonIcon}>
                            {selectedFriends.includes(item[0]) ? '－' : '＋'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.friendScore}>{capitalizeWords(item[1])}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Image
                      source={require('@/assets/assets/images/nofriends.png')}
                      style={styles.emptyImage}
                    />
                    <Text style={styles.emptyText}>
                      "you tried to console.log(myFriends) but it returned an empty array... guess you need to fetch some new ones!"
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>

          {(selfName || friends.length > 0) && (
            <View style={styles.friendActionsRow}>
              {selfName && (
                <TouchableOpacity
                  style={[
                    styles.includeSelfButton,
                    selectedFriends.includes(selfName)
                      ? styles.removeButton
                      : styles.addButton,
                  ]}
                  onPress={toggleSelf}
                >
                  <Text
                    style={[
                      styles.buttonIcon,
                      selectedFriends.includes(selfName)
                        ? styles.removeText
                        : styles.addText,
                    ]}
                  >
                    {selectedFriends.includes(selfName) ? '－' : '＋'}
                  </Text>

                  <Text
                    style={[
                      styles.includeSelfText,
                      selectedFriends.includes(selfName)
                        ? styles.removeText
                        : styles.addText,
                    ]}
                  >
                    {selectedFriends.includes(selfName)
                      ? 'Remove Myself'
                      : 'Include Myself'}
                  </Text>
                </TouchableOpacity>
              )}

              {friends.length > 0 && (
                <TouchableOpacity
                  style={styles.selectAllButton}
                  onPress={() => {
                    if (friends.every((f) => selectedFriends.includes(f[0]))) {
                      setSelectedFriends([]);
                    } else {
                      setSelectedFriends(friends.map((f) => f[0]));
                    }
                  }}
                >
                  <Text style={styles.selectAllText}>
                    {friends.every((f) => selectedFriends.includes(f[0]))
                      ? 'Deselect All Friends'
                      : 'Select All Friends'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={{ width: '90%', alignSelf: 'center' }}>
            <ActionButton
              testID="addExpenseScreen"
              imageSource={require('@/assets/assets/images/expenses.png')}
              label="Add Expense"
              onPress={handleAddExpense}
            />
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  title: {
    fontSize: 28,
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
    fontFamily: 'Jersey25',
    fontSize: 18,
  },
  toggleText: {
    left: 4,
    fontSize: 18,
    fontFamily: 'Jersey25',
    color: '#00177d',
    textAlign: 'center',
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
  selectedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedTitle: {
    fontFamily: 'ZenDots',
    fontSize: 18,
    color: '#00177d',
    marginBottom: 5,
    textAlign: 'center',
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  selectedName: {
    fontFamily: 'Jersey25',
    backgroundColor: '#c5e1f8',
    color: '#00177d',
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  noSelected: {
    fontFamily: 'Jersey25',
    fontSize: 24,
    color: '#ffb300',
    textAlign: 'center',
    marginBottom: 10,
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    width: '100%',
  },
  friendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  friendName: {
    fontFamily: 'ZenDots',
    fontSize: 18,
    color: '#001575ff',
    fontWeight: '600',
  },
  friendScore: {
    fontStyle: 'italic',
    fontFamily: 'Jersey25',
    fontSize: 16,
    color: '#00209eff',
    marginTop: 4,
    textAlign: 'left',
    width: '100%',
    right: 3,
  },
  iconButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#c5e1f8',
  },
  removeButton: {
    backgroundColor: 'rgba(255,255,255,0)',
    borderColor: '#c5e1f8',
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
  },
  buttonIcon: {
    color: '#12006eff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectAllButton: {
    backgroundColor: '#1e88e5',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    width: '40%',
  },
  selectAllText: {
    alignSelf: 'center',
    verticalAlign: 'middle',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Jersey25',
  },
  emptyContainer: {
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
  includeSelfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: '40%',
  },
  includeSelfText: {
    color: '#c5e1f8',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Jersey25',
  },
  friendActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  expenseTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addText: {
    color: '#12006eff',
  },
  removeText: {
    color: '#c5e1f8',
  },
  friendListWrapper: {
    height: 250,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
});