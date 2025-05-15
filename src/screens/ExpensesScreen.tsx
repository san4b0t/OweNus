import React, { useContext } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, FAB, Text } from 'react-native-paper';
import { ExpenseContext } from '../context/ExpenseContext';
import { AuthScreenNavigationProp } from '../types/navigation';

type AuthScreenProps = {
    navigation: AuthScreenNavigationProp;
};

export const ExpensesScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const { expenses } = useContext(ExpenseContext);

  return (
    <View style={styles.container}>
      {expenses.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No expenses recorded yet!</Text>
        </Card>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title 
                title={item.title}
                subtitle={`$${item.amount} • ${new Date(item.createdAt).toLocaleDateString()}`}
              />
              <Card.Content>
                <Text>Split between: {item.members.join(', ')}</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddExpense')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  card: { margin: 8 },
  emptyCard: { margin: 16, padding: 20, alignItems: 'center' },
  emptyText: { color: 'gray' },
  fab: { position: 'absolute', right: 16, bottom: 16 }
});