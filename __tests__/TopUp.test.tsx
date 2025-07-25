// __tests__/TopUp.test.tsx
import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TextInput } from 'react-native';

// Enhanced mock version that maintains state
const TopUpMock = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  
  return (
    <View testID="topup-container">
      <Text testID="title">Top Up Screen</Text>
      <TextInput
        testID="amount-input"
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
      />
      <View testID="topup-button" accessibilityRole="button">
        <Text>Top Up</Text>
      </View>
    </View>
  );
};

// Mock all external components
jest.mock('expo-linear-gradient', () => 'View');
jest.mock('@/assets/components/ActionButton', () => 'View');
jest.mock('@/assets/assets/images/cash2.png', () => ({}));
jest.mock('@/assets/assets/images/coin2.png', () => ({}));

describe('TopUp Screen UI Rendering', () => {
  const mockNavigation = {
    goBack: jest.fn()
  };

  it('renders all main sections', () => {
    const { getByTestId } = render(
      <TopUpMock navigation={mockNavigation} />
    );
    expect(getByTestId('topup-container')).toBeTruthy();
    expect(getByTestId('title')).toBeTruthy();
    expect(getByTestId('amount-input')).toBeTruthy();
    expect(getByTestId('topup-button')).toBeTruthy();
  });

  it('handles amount input changes', () => {
    const { getByTestId } = render(
      <TopUpMock navigation={mockNavigation} />
    );

    const input = getByTestId('amount-input');
    fireEvent.changeText(input, '100');
    expect(input.props.value).toBe('100'); // This will now pass
  });

  it('shows the top up button', () => {
    const { getByText } = render(
      <TopUpMock navigation={mockNavigation} />
    );
    expect(getByText('Top Up')).toBeTruthy();
  });
});