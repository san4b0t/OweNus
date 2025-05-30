import React, { useState } from 'react';
import { Pressable, Text, Image, StyleSheet, View } from 'react-native';

const ActionButton = ({ imageSource, label, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={[styles.wrapper]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[
          styles.actionButton,
          isPressed && styles.actionButtonPressed,
        ]}
      >
        <Image source={imageSource} style={styles.actionImage} resizeMode="contain" />
        <View style={styles.labelWrapper}>
          <Text style={styles.actionLabel}>{label}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    marginHorizontal: 10,
  },
  actionButton: {
    backgroundColor: '#1E293B50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  actionButtonPressed: {
    borderColor: '#38BDF8',
    borderWidth: 1,
  },
  actionImage: {
    width: 36,
    height: 36,
    marginBottom: 6,
  },
  labelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontFamily: 'PressStart2P',
    color: '#FFBB00',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ActionButton;
