import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  Payments: undefined;
  Expenses: undefined;
  AddPayment: undefined;
  AddExpense: undefined;
};

export type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;
export type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
export type PaymentsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payments'>;
