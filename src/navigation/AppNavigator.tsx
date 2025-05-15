import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AuthScreen } from '../screens/AuthScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ExpensesScreen } from '../screens/ExpensesScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    return null; 
  }

  const { user } = authContext;

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Payments" component={PaymentsScreen} />
          <Stack.Screen name="Expenses" component={ExpensesScreen} />
        </>
      ) : (
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}