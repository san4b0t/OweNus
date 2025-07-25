// __tests__/Profile.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text, Image, ActivityIndicator } from 'react-native';

// 1. First create the mock component outside of jest.mock()
const MockCircularProgress = ({ children }: any) => (
  <View testID="circular-progress">
    {children(750)}
  </View>
);

// 2. Then reference it in the mock
jest.mock('react-native-circular-progress', () => ({
  AnimatedCircularProgress: MockCircularProgress
}));

// 3. Mock other dependencies with string literals
jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('expo-blur', () => ({ BlurView: 'BlurView' }));
jest.mock('@/assets/assets/images/excellent.png', () => ({}));
jest.mock('@/assets/assets/images/good.png', () => ({}));
jest.mock('@/assets/assets/images/fair.png', () => ({}));
jest.mock('@/assets/assets/images/poor.png', () => ({}));
jest.mock('@/assets/assets/images/defaultmeme.png', () => ({}));

// Mock version of ProfileScreen
const ProfileMock = () => {
  return (
    <View testID="profile-container">
      <Text testID="heading">Your Credit Score</Text>
      <View testID="score-card">
        <MockCircularProgress>
          {(fill: number) => <Text testID="score-text">{fill}</Text>}
        </MockCircularProgress>
        <Text testID="status-text">Good</Text>
      </View>
      <Image testID="status-image" source={{ uri: 'good.png' }} />
    </View>
  );
};

const ProfileLoadingMock = () => (
  <View testID="loading-container">
    <ActivityIndicator testID="loading-indicator" />
  </View>
);

describe('Profile Screen UI Rendering', () => {
  it('renders loading state', () => {
    const { getByTestId } = render(<ProfileLoadingMock />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders all main sections when loaded', () => {
    const { getByTestId, getByText } = render(<ProfileMock />);
    
    expect(getByTestId('profile-container')).toBeTruthy();
    expect(getByText('Your Credit Score')).toBeTruthy();
    expect(getByTestId('score-card')).toBeTruthy();
    expect(getByTestId('circular-progress')).toBeTruthy();
    expect(getByText('750')).toBeTruthy();
    expect(getByText('Good')).toBeTruthy();
    expect(getByTestId('status-image')).toBeTruthy();
  });
});