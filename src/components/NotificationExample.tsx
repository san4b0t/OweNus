import React, {useEffect} from 'react';
import {Button, View, StyleSheet} from 'react-native';
import {initializeNotifications, showNotification} from '../services/notifications';

export const NotificationExample = () => {
  useEffect(() => {
    // Initialize notifications when component mounts
    initializeNotifications();
  }, []);

  const handleShowNotification = () => {
    showNotification('Hello!', 'This is a test notification');
  };

  return (
    <View style={styles.container}>
      <Button title="Show Notification" onPress={handleShowNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
