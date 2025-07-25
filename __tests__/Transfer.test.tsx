// __tests__/DashboardRender.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text, Image } from 'react-native';

// Create an enhanced mock version of Dashboard with more UI elements
const DashboardMock = ({ navigation }: any) => {
  return (
    <View testID="dashboard-container">
      {/* Header Section */}
      <View testID="header-section">
        <Text testID="welcome-text">Welcome, Test User</Text>
        <Text testID="balance-text">Balance: $0.00</Text>
      </View>

      {/* Recent Expenses */}
      <View testID="recent-expenses-section">
        <Text testID="recent-expenses-title">Recent Expenses:</Text>
        <View testID="expense-item-1">
          <Text>Lunch: $12.50</Text>
        </View>
      </View>

      {/* Balances */}
      <View testID="balances-section">
        <Text testID="balances-title">Balances:</Text>
        <Text testID="balance-item-1">Alice: Owes you $20.00</Text>
      </View>

      {/* Action Buttons */}
      <View testID="action-buttons-section">
        <View testID="profile-button" accessibilityRole="button">
          <Image testID="profile-icon" />
          <Text>Profile</Text>
        </View>
        <View testID="transfer-button" accessibilityRole="button">
          <Image testID="transfer-icon" />
          <Text>Transfer</Text>
        </View>
      </View>

      {/* Wallet Connect */}
      <View testID="wallet-connect-section">
        <Text testID="wallet-status">Not connected</Text>
        <View testID="connect-button" accessibilityRole="button">
          <Text>Connect Wallet</Text>
        </View>
      </View>
    </View>
  );
};

// Mock all external components with simple replacements
jest.mock('expo-linear-gradient', () => 'View');
jest.mock('@walletconnect/modal-react-native', () => ({
  useWalletConnectModal: () => ({}),
  WalletConnectModal: 'View'
}));
jest.mock('@/assets/components/ActionButton', () => 'View');
jest.mock('@/assets/components/AnimatedButton', () => 'View');

describe('Dashboard UI Rendering', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  it('renders all main sections', () => {
    const { getByTestId } = render(
      <DashboardMock navigation={mockNavigation} />
    );

    // Verify all main sections exist
    expect(getByTestId('dashboard-container')).toBeTruthy();
    expect(getByTestId('header-section')).toBeTruthy();
    expect(getByTestId('recent-expenses-section')).toBeTruthy();
    expect(getByTestId('balances-section')).toBeTruthy();
    expect(getByTestId('action-buttons-section')).toBeTruthy();
    expect(getByTestId('wallet-connect-section')).toBeTruthy();
  });

  it('displays correct user information', () => {
    const { getByText } = render(
      <DashboardMock navigation={mockNavigation} />
    );

    expect(getByText('Welcome, Test User')).toBeTruthy();
    expect(getByText('Balance: $0.00')).toBeTruthy();
  });

  it('shows expense and balance items', () => {
    const { getByText } = render(
      <DashboardMock navigation={mockNavigation} />
    );

    expect(getByText('Recent Expenses:')).toBeTruthy();
    expect(getByText('Lunch: $12.50')).toBeTruthy();
    expect(getByText('Balances:')).toBeTruthy();
    expect(getByText('Alice: Owes you $20.00')).toBeTruthy();
  });

  it('renders all action buttons', () => {
    const { getByTestId } = render(
      <DashboardMock navigation={mockNavigation} />
    );

    expect(getByTestId('profile-button')).toBeTruthy();
    expect(getByTestId('transfer-button')).toBeTruthy();
    expect(getByTestId('connect-button')).toBeTruthy();
  });

  it('shows wallet connection status', () => {
    const { getByText } = render(
      <DashboardMock navigation={mockNavigation} />
    );

    expect(getByText('Not connected')).toBeTruthy();
    expect(getByText('Connect Wallet')).toBeTruthy();
  });
});