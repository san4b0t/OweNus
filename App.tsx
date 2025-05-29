import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import Details from './app/screens/Details';
import Dashboard from './app/screens/Dashboard';
import TopUp from './app/screens/TopUp';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';
import {IdProvider, IdContext} from './Global/IdContext';
import {UserDataProvider, UserDataContext} from './Global/UserDataContext';
import { useContext } from 'react';
import Transfer from './app/screens/Transfer';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout () {
  return (
    <UserDataProvider>
    <InsideStack.Navigator>
      <InsideStack.Screen name="Dashboard" component={Dashboard} />
      <InsideStack.Screen name="details" component={Details} />
      <InsideStack.Screen name="Top Up" component={TopUp} />
      <InsideStack.Screen name="Transfer" component={Transfer} />
    </InsideStack.Navigator>
    </UserDataProvider>
  )
}

export default function App() {
  return (
    <IdProvider>
      <MainApp />
    </IdProvider>
  );
}

function MainApp() {

  const [user, setUser] = useState<User | null>(null);
  const{ globUser, setGlobUser } = useContext(IdContext);

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
        { user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false}} />
        ) : (
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false}} />
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


