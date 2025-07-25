import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import InsightsScreen from '../app/screens/Insights';

// Mock TensorFlow.js with inline implementation
jest.mock('@tensorflow/tfjs', () => ({
  ready: jest.fn().mockResolvedValue(true),
  loadLayersModel: jest.fn().mockResolvedValue({
    predict: jest.fn(() => ({
      dataSync: jest.fn(() => [123.45]), // Mock prediction value
      dispose: jest.fn(),
    })),
    dispose: jest.fn(),
  }),
  tensor2d: jest.fn(),
  tensor1d: jest.fn(),
}));

// Mock tfjs-react-native (add to the top of your test file)
jest.mock('@tensorflow/tfjs-react-native', () => ({
  bundleResourceIO: jest.fn(),
}));

// Mock model files to avoid binary parsing errors
jest.mock('@/assets/model/model.json', () => ({}), { virtual: true });
jest.mock('@/assets/model/group1-shard1of1.bin', () => '', { virtual: true });

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
});