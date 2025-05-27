// components/AnimatedButton.js

import React, { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet } from 'react-native';

const AnimatedButton = ({ style, onPress, children }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    Animated.timing(rippleOpacity, {
      toValue: 0.3,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    Animated.timing(rippleOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleValue }],
            overflow: 'hidden',
            borderRadius: 8, // Match your button's border radius
          },
        ]}
      >
        {/* Ripple Layer */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(255,255,255,0.5)', opacity: rippleOpacity },
          ]}
        />

        {/* Button Content */}
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedButton;