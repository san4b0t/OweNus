import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../../firebaseConfig';

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user');
    return;
  }

    // Fetch expenses
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expensesData);
    });

    // Fetch balances (simplified)
    const balancesQuery = query(collection(db, 'balances'), where('userId', '==', user.uid));
    const unsubscribeBalances = onSnapshot(balancesQuery, (snapshot) => {
      const balancesData = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        balancesData[data.friendId] = data.amount;
      });
      setBalances(balancesData);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeBalances();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Expenses</Text>
      <Button
        title="Add Expense"
        onPress={() => navigation.navigate('AddExpense')}
      />
      <Button
        title="Settle Up"
        onPress={() => navigation.navigate('SettleUp')}
      />

      <Button
        title="Friends"
        onPress={() => navigation.navigate('Friends')}
      />

      <Text style={styles.subtitle}>Recent Expenses:</Text>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text>{item.description}: ${item.amount}</Text>
            <Text>Paid by: {item.paidBy}</Text>
          </View>
        )}
      />

      <Text style={styles.subtitle}>Balances:</Text>
      {Object.entries(balances).map(([friendId, amount]) => (
        <Text key={friendId}>
          {friendId}: {amount < 0 ? 'You owe' : 'Owes you'} ${Math.abs(amount)}
        </Text>
      ))}
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
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  expenseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HomeScreen;