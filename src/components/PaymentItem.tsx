import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';

interface PaymentItemProps {
  payment: {
    description: string;
    amount: number;
    dueDate?: string;
    status?: string;
  };
}

export const PaymentItem: React.FC<PaymentItemProps> = ({ payment }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Text style={styles.title}>{payment.description}</Text>
      <Text>Amount: ${payment.amount.toFixed(2)}</Text>
      {payment.dueDate && <Text>Due: {payment.dueDate}</Text>}
      {payment.status && <Text>Status: {payment.status}</Text>}
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { margin: 8 },
  title: { fontWeight: 'bold' }
});