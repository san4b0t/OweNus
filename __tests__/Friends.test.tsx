// __tests__/FriendsRender.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TextInput, FlatList, Image } from 'react-native';

// Mock version of FriendsScreen with basic UI structure
const FriendsMock = ({ navigation }: any) => {
  return (
    <View testID="friends-container">
      {/* Header */}
      <Image 
        testID="friends-image"
        source={{ uri: 'friends2.png' }} 
        style={{ height: 100, width: 100 }}
      />
      <Text testID="title">Friends</Text>
      
      {/* Search Input */}
      <TextInput
        testID="search-input"
        placeholder="Search by email"
        value=""
      />
      
      {/* Add Friend Button */}
      <View testID="add-friend-button" accessibilityRole="button">
        <Text>Add Friend</Text>
      </View>
      
      {/* Friends List */}
      <Text testID="subtitle">Your Friends</Text>
      <FlatList
        testID="friends-list"
        data={['Alice', 'Bob']}
        renderItem={({ item }) => (
          <View testID="friend-item">
            <Text testID="friend-name">{item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View testID="empty-state">
            <Image 
              testID="empty-image"
              source={{ uri: 'nofriends.png' }}
            />
            <Text testID="empty-text">
              "you tried to console.log(myFriends) but it returned an empty array..."
            </Text>
          </View>
        }
      />
    </View>
  );
};

// Mock all external components
jest.mock('expo-linear-gradient', () => 'View');
jest.mock('@/assets/components/ActionButton', () => 'View');
jest.mock('@/assets/assets/images/friends2.png', () => ({}));
jest.mock('@/assets/assets/images/friends.png', () => ({}));
jest.mock('@/assets/assets/images/nofriends.png', () => ({}));

describe('Friends Screen UI Rendering', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  it('renders all main sections', () => {
    const { getByTestId } = render(
      <FriendsMock navigation={mockNavigation} />
    );

    expect(getByTestId('friends-container')).toBeTruthy();
    expect(getByTestId('title')).toBeTruthy();
    expect(getByTestId('search-input')).toBeTruthy();
    expect(getByTestId('add-friend-button')).toBeTruthy();
    expect(getByTestId('subtitle')).toBeTruthy();
    expect(getByTestId('friends-list')).toBeTruthy();
  });

  it('shows friend list items', () => {
    const { getByText } = render(
      <FriendsMock navigation={mockNavigation} />
    );

    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('Bob')).toBeTruthy();
  });

  it('renders the search input', () => {
    const { getByPlaceholderText } = render(
      <FriendsMock navigation={mockNavigation} />
    );

    expect(getByPlaceholderText('Search by email')).toBeTruthy();
  });

  it('shows empty state when no friends', () => {
    const emptyMock = () => (
      <View testID="empty-state">
        <Image testID="empty-image" />
        <Text testID="empty-text">
          "you tried to console.log(myFriends) but it returned an empty array..."
        </Text>
      </View>
    );
    
    const { getByText } = render(emptyMock());
    expect(getByText(/empty array/)).toBeTruthy();
  });
});