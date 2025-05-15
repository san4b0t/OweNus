import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { PaymentItem } from '../../src/components/PaymentItem';
import { ExpenseContext } from '../../src/context/ExpenseContext';
import { PaymentContext } from '../../src/context/PaymentContext';

export default function DashboardScreen() {
  const { payments } = useContext(PaymentContext);
  const { expenses } = useContext(ExpenseContext);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Recent Payments" />
        <Card.Content>
          {payments.slice(0, 3).map(payment => (
            <PaymentItem key={payment.id} payment={payment} />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Recent Expenses" />
        <Card.Content>
          {expenses.slice(0, 3).map(expense => (
            <View key={expense.id} style={styles.expenseItem}>
              <Text>{expense.title}: ${expense.amount}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        //onPress={() => router.push('/(app)/payments')}
        style={styles.button}
      >
        View All Payments
      </Button>
      <Button 
        mode="outlined" 
        //onPress={() => router.push('/(app)/expenses')}
        style={styles.button}
      >
        View All Expenses
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { marginBottom: 16 },
  expenseItem: { paddingVertical: 8 },
  button: { marginVertical: 8 }
});