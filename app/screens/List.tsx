import { NavigationProp } from '@react-navigation/core';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { FIREBASE_AUTH } from '@/FirebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List = ({ navigation } : RouterProps) => {
  return (
    <View>
        <Button onPress={() => navigation.navigate('details')} title='Open Details' />
        <Button onPress={() => FIREBASE_AUTH.signOut()} title='Logout' />
    </View>
  )
}

export default List
