import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import InsightsScreen from '../app/screens/Insights';
import * as tf from '@tensorflow/tfjs';

// Mock TensorFlow.js and model loading
jest.mock('@tensorflow/tfjs', () => ({
  ready: jest.fn().mockResolvedValue(true),
  loadLayersModel: jest.fn().mockResolvedValue({
    predict: jest.fn(() => tf.tensor1d([123.45])), // Mock prediction
    dispose: jest.fn(),
  }),
  tensor2d: jest.fn(),
  tensor1d: jest.fn(),
}));

describe('InsightsScreen', () => {
  it('renders loading state initially', () => {
    const { getByText } = render(<InsightsScreen />);
    expect(getByText('Loading model...')).toBeTruthy();
  });

  it('renders input fields and button after model loads', async () => {
    const { findByText, getByPlaceholderText } = render(<InsightsScreen />);
    await waitFor(() => {
      expect(findByText('💰 Expense Predictor')).toBeTruthy();
      expect(getByPlaceholderText('e.g. 3')).toBeTruthy();
      expect(getByPlaceholderText('e.g. 7')).toBeTruthy();
      expect(findByText('Predict Expense')).toBeTruthy();
    });
  });

  it('shows error on invalid input', async () => {
    const { getByText, getByPlaceholderText } = render(<InsightsScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. 3'), 'abc'); // Invalid input
    fireEvent.press(getByText('Predict Expense'));
    await waitFor(() => {
      expect(getByText('Invalid Input')).toBeTruthy(); // Alert check
    });
  });

  it('displays prediction result on valid input', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<InsightsScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. 3'), '5'); // Valid participants
    fireEvent.changeText(getByPlaceholderText('e.g. 7'), '7'); // Valid month
    fireEvent.press(getByText('Predict Expense'));

    await waitFor(() => {
      expect(queryByText('$123.45')).toBeTruthy(); // Mocked prediction value
    });
  });
});