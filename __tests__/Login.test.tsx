import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../app/screens/Login'; // adjust path
import { IdContext } from '@/Global/IdContext';
import { Auth } from '../app/services/AuthService';

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
}));

// Mock Auth service
jest.mock('../app/services/AuthService', () => ({
  Auth: {
    signIn: jest.fn(),
  },
}));

describe('Login Screen', () => {
  it('renders and shows Email input', async () => {
    const mockContext = {
      globUser: null,
      setGlobUser: jest.fn(),
    };

    const { findByPlaceholderText } = render(
      <IdContext.Provider value={mockContext}>
        <Login navigation={{ navigate: jest.fn() } as any} />
      </IdContext.Provider>
    );

    const emailInput = await findByPlaceholderText('Email');
    expect(emailInput).toBeTruthy();
  });

  it('calls signIn and updates context on login button press', async () => {
    const mockUser = { uid: 'user123' };
    (Auth.signIn as jest.Mock).mockResolvedValueOnce(mockUser);

    const setGlobUserMock = jest.fn();

    const { findByPlaceholderText, findByText } = render(
      <IdContext.Provider value={{ globUser: null, setGlobUser: setGlobUserMock }}>
        <Login navigation={{ navigate: jest.fn() } as any} />
      </IdContext.Provider>
    );

    const emailInput = await findByPlaceholderText('Email');
    const passwordInput = await findByPlaceholderText('Password');
    const loginButton = await findByText(/login/i);

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Auth.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(setGlobUserMock).toHaveBeenCalledWith('user123');
    });
  });
});

