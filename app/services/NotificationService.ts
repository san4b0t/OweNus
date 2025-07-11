import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '../../FirebaseConfig';
import { User } from 'firebase/auth';
import { Notification, NotificationResponse, TimeIntervalTriggerInput } from 'expo-notifications';

// Set notification handler for Expo
Notifications.setNotificationHandler({
  handleNotification: async (notification: Notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token: string | undefined;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Platform.OS === 'ios') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function schedulePaymentReminder(expenseId: string, deadline: Date) {
  const user = FIREBASE_AUTH.currentUser;
  if (!user) {
    console.error('No user authenticated');
    return;
  }

  try {
    // Calculate time until deadline
    const now = new Date();
    const timeUntilDeadline = deadline.getTime() - now.getTime();
    const hoursUntilDeadline = Math.floor(timeUntilDeadline / (1000 * 60 * 60));
    console.log(`Hours until deadline: ${hoursUntilDeadline}`);

    // If deadline is within 24 hours, show immediate notification
    if (hoursUntilDeadline <= 24) {
      console.log('Scheduling immediate notification');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Payment Due Today',
          body: `Payment for expense ${expenseId} is due today!`,
          data: { expenseId },
        },
        trigger: {
          type: 'timeInterval',
          value: 0,
          unit: 'seconds',
          repeats: false,
        } as any,
      });
    } else {
      // Schedule notification 24 hours before deadline
      console.log('Scheduling notification for 24 hours before deadline');
      const trigger = {
        type: 'timeInterval',
        value: Math.max(0, Math.floor(timeUntilDeadline / 1000) - (24 * 60 * 60)),
        unit: 'seconds',
        repeats: false,
      } as any;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Payment Reminder',
          body: `You have an upcoming payment due soon for expense ${expenseId}.`,
          data: { expenseId },
        },
        trigger,
      });
    }

    // Update Firebase with notification status
    const notificationsRef = collection(db, 'notifications');
    await updateDoc(doc(notificationsRef, expenseId), {
      scheduled: true,
      scheduledAt: new Date(),
      userId: user.uid,
    });

    console.log(`Notification scheduled for expense ${expenseId}`);
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

export async function updateNotificationStatus(expenseId: string, status: 'paid' | 'pending') {
  const user = FIREBASE_AUTH.currentUser;
  if (!user) return;

  try {
    const notificationsRef = collection(db, 'notifications');
    await updateDoc(doc(notificationsRef, expenseId), {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }

  try {
    const expenseRef = doc(db, 'indivExpenses', expenseId);
    await updateDoc(expenseRef, {
      notificationStatus: status,
    });
  } catch (error) {
    console.error('Error updating expense notification status:', error);
    throw error;
  }
}

export async function listenForPaymentReminders() {
  const user = FIREBASE_AUTH.currentUser;
  if (!user) return;

  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const notificationData = change.doc.data();
          const deadline = new Date(notificationData.deadline);
          const now = new Date();
          
          // If deadline is within 24 hours, show immediate notification
          if (deadline.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) {
            await Notifications.presentNotificationAsync({
              title: 'Payment Due Today',
              body: `Payment for expense ${notificationData.expenseId} is due today!`,
              data: { expenseId: notificationData.expenseId },
            });
          }
        }
      });
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error listening for payment reminders:', error);
    throw error;
  }

  const expensesQuery = query(
    collection(db, 'indivExpenses'),
    where('participantId', '==', user?.uid),
    where('status', '==', 'pending')
  );

  return onSnapshot(expensesQuery, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added' || change.type === 'modified') {
        const expense = change.doc.data();
        const deadline = expense.deadline?.toDate();
        
        if (deadline) {
          // Schedule notification if it's not already scheduled
          await schedulePaymentReminder(change.doc.id, deadline);
        }
      }
    });
  });
}
