import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image } from 'react-native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import ActionButton from '@/assets/components/ActionButton';

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

      // find user by email
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
      
      // create friendship in both directions
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
      <LinearGradient colors = {['rgb(157, 255, 252)', 'rgba(61,150,185,1)','rgba(61,150,185,1)','rgba(15,0,87,1)']} style={styles.gradient}>
      <Image source={require('@/assets/assets/images/friends2.png')} style={styles.friends2}/>
      <Text style={styles.title}>Friends</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Search by email"
        value={searchEmail}
        onChangeText={setSearchEmail}
        keyboardType="email-address"
      />
      <ActionButton
          imageSource={require('@/assets/assets/images/friends.png')}
          label="Add Friend"
          onPress={handleAddFriend}
          
        />
      
      {/* <FlatList
        data={friends}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text>{item}</Text>
          </View>
        )}
      /> */}
      
      <FlatList
      data={friends}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
      <View style={styles.friendItem}>
        <Text style={styles.friends}>{item}</Text>
      </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Image
            source={require('@/assets/assets/images/nofriends.png')} // 
            style={styles.emptyImage}
          />
        <Text style={styles.emptyText}>"you tried to console.log(myFriends) but it returned an empty array... guess you need to fetch some new ones!"</Text>
        </View>
      }
      />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  
   },
  title: { 
    fontSize: 40, 
    marginTop: 190,
    marginBottom: 20,
    fontFamily: 'ZenDots',
    color: '#00177d',
    alignSelf: 'center'

  },
  input: { 
      height: 60, 
      borderColor: 'gray', 
      borderWidth: 1,
      marginBottom: 10, 
      padding: 8, 
      width: '95%',
      alignSelf: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      textAlign: 'center',
      fontSize: 18,
    },
  friendItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: 'transparent' ,
  },
  friends: {
    textAlign: 'center',
    fontFamily: 'ZenDots',
    color: '#ffb300',
    fontSize: 14,
    fontWeight: '600',
    width: 'auto',
  },
  friends2: {
    position: 'absolute',
    marginTop: 50,
    marginBottom: 20,
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  gradient: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 22,
    fontFamily: 'Jersey25',
    color: '#ffb300',
    textAlign: 'center',
  },
});

export default FriendsScreen;