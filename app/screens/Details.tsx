import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, FIREBASE_AUTH } from '../../FirebaseConfig';

const Details = () => {

    const user = FIREBASE_AUTH.currentUser;
    const [expenses, setExpenses] = useState<{ id: string; [key: string]: any }[]>([]);

    if (!user) {
        console.log('No authenticated user');
        return;
      }

    const relevantExpensesQuery = query(
        collection(db, 'expenses'),
        where('paidBy', '!=', user.uid), 
        where('participants', 'array-contains', user.displayName), 
        orderBy('createdAt', 'desc') 
    );

    const unsubscribeRelevantExpenses = onSnapshot(relevantExpensesQuery, (snapshot) => {
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() 
        }));
        setExpenses(expensesData);
    });

    useEffect(() => {
        return () => {
            unsubscribeRelevantExpenses();
        }
    })

  return (
    <View>
        <Text style={styles.title}>Balances</Text>
        <Text style={styles.subtitle}>Balances you owe:</Text>
        <FlatList
            data={expenses}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.listContainer}>
                <View style={styles.inner}>
                    <Text style={styles.detailText}>{item.description} | Paid By: {item.paidByName}</Text>
                    <Text style={styles.detailText}> | Amount owed: ${item.amount / item.participants.length}</Text>
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
      inner: {
        flexDirection: 'row',
      },
      detailText: {
        color: '#00177d',
        fontWeight: 'bold',
      }
})
