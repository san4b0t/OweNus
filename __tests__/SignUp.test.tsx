import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupScreen from '../app/screens/SignupScreen';
import { Auth } from '../app/services/AuthService';

// Mock dependencies
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('../app/services/AuthService', () => ({
  Auth: {
    signUp: jest.fn(),
  },
}));

// Create a manual mock for Alert
const mockAlert = jest.fn();
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: mockAlert,
}));

describe('SignupScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAlert.mockClear();
  });

  it('renders all form fields and buttons', async () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupScreen navigation={mockNavigation as any} />
    );

    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('sign up')).toBeTruthy();
    expect(getByText('already have an account? log in')).toBeTruthy();
  });

  it('calls Auth.signUp with correct parameters when form is valid', async () => {
    (Auth.signUp as jest.Mock).mockResolvedValueOnce({});
    
    const { getByPlaceholderText, getByText } = render(
      <SignupScreen navigation={mockNavigation as any} />
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Wallet ID'), '0xeA7512eB6E2b62B3724367948FBcf9f2e6F32A5D');
    fireEvent.press(getByText('sign up'));

    await waitFor(() => {
      expect(Auth.signUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'Test User',
        '0xeA7512eB6E2b62B3724367948FBcf9f2e6F32A5D',
      );
    });
  });

  it('navigates to Login screen when log in button is pressed', async () => {
    const { getByText } = render(
      <SignupScreen navigation={mockNavigation as any} />
    );

    fireEvent.press(getByText('already have an account? log in'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});