import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { PaymentItem } from '../components/PaymentItem';
import { PaymentContext } from '../context/PaymentContext';

type RootStackParamList = {
  Payments: undefined;
  AddPayment: undefined;
};

type PaymentsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Payments'>;
};

export const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ navigation }) => {
  const { payments } = useContext(PaymentContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={payments}
        renderItem={({ item }) => <PaymentItem payment={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddPayment')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 }
});