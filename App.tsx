import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import Dashboard from './app/screens/Dashboard';
import TopUpScreen from './app/screens/TopUp';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState, useContext } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { IdProvider, IdContext } from './Global/IdContext';
import { UserDataProvider } from './Global/UserDataContext';
import { DateProvider } from './Global/DateContext';
import Transfer from './app/screens/Transfer';
import SignupScreen from './app/screens/SignupScreen';
import AddExpenseScreen from './app/screens/AddExpenseScreen';
import FriendsScreen from './app/screens/FriendsScreen';
import Details from './app/screens/Details';
import InsightsScreen from './app/screens/Insights';
import ProfileScreen from './app/screens/ProfileScreen';
import { TouchableOpacity, Image } from 'react-native';

const backIcon = require('./assets/assets/images/back.png'); 

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <DateProvider>
      <UserDataProvider>
        <InsideStack.Navigator
          screenOptions={({ route, navigation }) => ({
            headerStyle: {
              backgroundColor: 'rgba(153, 255, 252, 1)',
            },
            headerTintColor: 'rgba(4, 0, 133, 1)',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontFamily: 'Jersey25',
              fontSize: 24
            },
            headerLeft: () =>
              route.name === 'Dashboard' ? 
                null : (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Dashboard')}
                  style={{marginRight: 10 }}
                >
                  <Image
                    source={backIcon}
                    style={{ width: 100, height: 100, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
              ),
          })}
        >
          <InsideStack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <InsideStack.Screen name="Top Up" component={TopUpScreen} />
          <InsideStack.Screen name="Transfer" component={Transfer} />
          <InsideStack.Screen name="Add Expense" component={AddExpenseScreen} />
          <InsideStack.Screen name="Friends" component={FriendsScreen} />
          <InsideStack.Screen name="Details" component={Details} />
          <InsideStack.Screen name="Insights" component={InsightsScreen} />
          <InsideStack.Screen name="Profile" component={ProfileScreen} />
        </InsideStack.Navigator>
      </UserDataProvider>
    </DateProvider>
  );
}

function MainApp() {
  const [user, setUser] = useState<User | null>(null);
  const { globUser, setGlobUser } = useContext(IdContext);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
      if (user) setGlobUser(user.uid);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Sign Up' component={SignupScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <IdProvider>
      <MainApp />
    </IdProvider>
  );
}