import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db, FIREBASE_AUTH } from '../../FirebaseConfig';

const Details = () => {

    const user = FIREBASE_AUTH.currentUser;
    const [expenses, setExpenses] = useState<{ id: string; [key: string]: any }[]>([]);
    const [receivables, setReceivables] = useState<{ id: string; [key: string]: any}[]>([]);

    if (!user) {
        console.log('No authenticated user');
        return;
      }

    const relevantExpensesQuery = query(
        collection(db, 'indivExpenses'),
        where('participantId', '==', user.uid), 
        where('status', '==', 'pending'),
        orderBy('deadline', 'asc') 
    );

    const unsubscribeRelevantExpenses = onSnapshot(relevantExpensesQuery, (snapshot) => {
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() 
        }));
        setExpenses(expensesData);
    });

    const relevantReceivablesQuery = query(
      collection(db, 'indivExpenses'),
      where('paidBy', '==', user.uid),
      where('status', '==', 'pending'),
      orderBy('deadline', 'asc'),
    );

    const unsubscribeRelevantReceivables = onSnapshot(relevantReceivablesQuery, (snapshot) => {
      const receivablesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReceivables(receivablesData);
    });

    useEffect(() => {
        return () => {
            unsubscribeRelevantExpenses();
            unsubscribeRelevantReceivables();
        }
    });

    const markAsPaid = async (receivableId: string) => {
      try {
        if (!user) {
          console.log('No authenticated user');
          return;
        }
        const receivableRef = doc(db, 'indivExpenses', receivableId);
        await updateDoc(receivableRef, { 
          status: 'paid'
        });
        console.log('Status updated to paid');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

  return (
    <View>
        <Text style={styles.title}>Balances</Text>
        <Text style={styles.subtitle}>Pending Balances You Owe:</Text>
        <FlatList
            data={expenses}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.listContainer}>
                <View style={styles.inner}>
                    <Text style={styles.detailText}>{item.description} | Paid By: {item.paidByName}</Text>
                    <Text style={styles.detailText}> | Amount owed: ${item.amount}</Text>
                </View>
                <Text style={styles.detailText}>Deadline: {item.deadline ? 
                item.deadline
                .toDate()
                .toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }) : 'no deadline set'}</Text>
                </View>
            )}
        />
        <Text style={styles.subtitle}>Pending Receivables:</Text>
        <FlatList
            data={receivables}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.receivablesContainer}>
                <View>
                <View style={styles.inner}>
                    <Text style={styles.detailText}>{item.description} | Receivable from: {item.participant}</Text>
                </View>
                <Text style={styles.detailText}>Amount Owed: {item.amount} | Deadline: {item.deadline ? 
                item.deadline
                .toDate()
                .toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }) : 'no deadline set'}</Text>
                </View>
                <Pressable onPress={() => markAsPaid(item.id)} style={styles.status}>
                    <Text style={styles.statusText}>Settled</Text>
                </Pressable>
                </View>
            )}
        />
    </View>
  )
}

export default Details;

const styles = StyleSheet.create({
    title: {
        fontFamily: 'ZenDots',
        fontWeight: 'bold',
        color: '#00177d',
        fontSize: 32,
        marginBottom: 20,
        alignSelf: 'center',
        marginTop: 50,
      },
      subtitle: {
        fontFamily: 'ZenDots',
        fontWeight: 'bold',
        color: '#00177d',
        fontSize: 22,
        marginBottom: 20,
        alignSelf: 'center',
        marginTop: 10,
      },
      listContainer: {
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        alignItems: "center",
        marginVertical: 10,
      },
      receivablesContainer: {
        flexDirection: 'row',
        gap: 20,
        flex: 1,
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'center',

      },
      inner: {
        flexDirection: 'row',
      },
      detailText: {
        color: '#00177d',
        fontWeight: 'bold',
      },
      status: {
        backgroundColor: 'green',
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 5,
      },
      statusText: {
        color: 'white',
        fontWeight: 'bold',
      },
})
