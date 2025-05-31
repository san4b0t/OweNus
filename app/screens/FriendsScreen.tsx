import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/core';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const FriendsScreen = ({ navigation }: RouterProps) => {
  const [friends, setFriends] = useState<string[]>([]);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    const fetchFriends = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;

      const friendsQuery = query(
        collection(db, 'friendships'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(friendsQuery);
      setFriends(snapshot.docs.map(doc => doc.data().friendId));
    };

    fetchFriends();
  }, []);

  const handleAddFriend = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;

      // Find user by email
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', searchEmail)
      );
      const snapshot = await getDocs(usersQuery);
      
      if (snapshot.empty) {
        alert('User not found');
        return;
      }

      const friend = snapshot.docs[0].data();
      
      // Create friendship in both directions
      await addDoc(collection(db, 'friendships'), {
        userId: user.uid,
        friendId: friend.uid,
        createdAt: new Date()
      });

      await addDoc(collection(db, 'friendships'), {
        userId: friend.uid,
        friendId: user.uid,
        createdAt: new Date()
      });

      setFriends([...friends, friend.uid]);
      setSearchEmail('');
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Search by email"
        value={searchEmail}
        onChangeText={setSearchEmail}
        keyboardType="email-address"
      />
      <Button title="Add Friend" onPress={handleAddFriend} />
      
      <FlatList
        data={friends}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 8 },
  friendItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }
});

export default FriendsScreen;