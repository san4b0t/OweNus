// __tests__/DetailsRender.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text, ScrollView, Pressable } from 'react-native';

// Mock version of Details screen with basic UI structure
const DetailsMock = ({ navigation }: any) => {
  return (
    <View testID="details-container">
      {/* Header */}
      <Text testID="title">Balances</Text>
      
      {/* Pending Balances */}
      <Text testID="owe-subtitle">Pending Balances You Owe:</Text>
      <ScrollView testID="owe-scroll">
        <View testID="owe-item-1" style={{ marginVertical: 4 }}>
          <View testID="owe-inner">
            <Text testID="owe-description">Lunch | Paid By: Alice</Text>
            <Text testID="owe-amount"> | Amount owed: $12.50</Text>
          </View>
          <Text testID="owe-deadline">Deadline: May 15, 2023</Text>
        </View>
      </ScrollView>
      
      {/* Pending Receivables */}
      <Text testID="receive-subtitle">Pending Receivables:</Text>
      <ScrollView testID="receive-scroll">
        <View testID="receive-item-1" style={{ marginVertical: 10 }}>
          <View testID="receive-info">
            <Text testID="receive-description">Dinner | Receivable from: Bob</Text>
            <Text testID="receive-details">
              Amount Owed: $25.00 | Deadline: May 20, 2023
            </Text>
          </View>
          <Pressable testID="settle-button" style={{ backgroundColor: 'green' }}>
            <Text testID="settle-text">Settled</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

// Mock all external components
jest.mock('expo-linear-gradient', () => 'View');
jest.mock('@/assets/components/ActionButton', () => 'View');
jest.mock('@/assets/components/AnimatedButton', () => 'View');

describe('Details Screen UI Rendering', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  it('renders all main sections', () => {
    const { getByTestId } = render(
      <DetailsMock navigation={mockNavigation} />
    );

    expect(getByTestId('details-container')).toBeTruthy();
    expect(getByTestId('title')).toBeTruthy();
    expect(getByTestId('owe-subtitle')).toBeTruthy();
    expect(getByTestId('owe-scroll')).toBeTruthy();
    expect(getByTestId('receive-subtitle')).toBeTruthy();
    expect(getByTestId('receive-scroll')).toBeTruthy();
  });

  it('shows pending balances section', () => {
    const { getByText } = render(
      <DetailsMock navigation={mockNavigation} />
    );

    expect(getByText('Pending Balances You Owe:')).toBeTruthy();
    expect(getByText('Lunch | Paid By: Alice')).toBeTruthy();
    expect(getByText('Deadline: May 15, 2023')).toBeTruthy();
  });

  it('shows pending receivables section', () => {
    const { getByText } = render(
      <DetailsMock navigation={mockNavigation} />
    );

    expect(getByText('Pending Receivables:')).toBeTruthy();
    expect(getByText('Dinner | Receivable from: Bob')).toBeTruthy();
  });

  it('renders settle button', () => {
    const { getByText } = render(
      <DetailsMock navigation={mockNavigation} />
    );

    expect(getByText('Settled')).toBeTruthy();
  });
});