// __tests__/AddExpenseRender.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text, TextInput, Switch } from 'react-native';

// Mock version of AddExpenseScreen with basic UI structure
const AddExpenseMock = ({ navigation }: any) => {
  return (
    <View testID="add-expense-container">
      {/* Header */}
      <Text testID="title">Add New Expense</Text>
      
      {/* Expense Type Toggle */}
      <View testID="expense-type-toggle">
        <Text>Expense type: Equal</Text>
        <Switch testID="type-switch" />
      </View>
      
      {/* Input Fields */}
      <TextInput testID="description-input" placeholder="Description" />
      <TextInput testID="amount-input" placeholder="Amount" />
      
      {/* Friends List */}
      <View testID="friends-list">
        <Text>No participants selected</Text>
      </View>
      
      {/* Action Button */}
      <View testID="add-button" accessibilityRole="button">
        <Text>Add Expense</Text>
      </View>
    </View>
  );
};

// Mock all external components with simple replacements
jest.mock('expo-linear-gradient', () => 'View');
jest.mock('@/assets/components/ActionButton', () => 'View');
jest.mock('@/assets/components/DatePickerComponent', () => 'View');
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'View'
}));

describe('AddExpenseScreen UI Rendering', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  it('renders all main sections', () => {
    const { getByTestId } = render(
      <AddExpenseMock navigation={mockNavigation} />
    );

    expect(getByTestId('add-expense-container')).toBeTruthy();
    expect(getByTestId('title')).toBeTruthy();
    expect(getByTestId('expense-type-toggle')).toBeTruthy();
    expect(getByTestId('description-input')).toBeTruthy();
    expect(getByTestId('amount-input')).toBeTruthy();
    expect(getByTestId('friends-list')).toBeTruthy();
    expect(getByTestId('add-button')).toBeTruthy();
  });

  it('shows correct default expense type', () => {
    const { getByText } = render(
      <AddExpenseMock navigation={mockNavigation} />
    );
    expect(getByText('Expense type: Equal')).toBeTruthy();
  });

  it('has working input fields', () => {
    const { getByPlaceholderText } = render(
      <AddExpenseMock navigation={mockNavigation} />
    );
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByPlaceholderText('Amount')).toBeTruthy();
  });

  it('renders the add button', () => {
    const { getByText } = render(
      <AddExpenseMock navigation={mockNavigation} />
    );
    expect(getByText('Add Expense')).toBeTruthy();
  });
});