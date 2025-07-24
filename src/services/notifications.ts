import notifee, {EventType} from '@notifee/react-native';
import {Platform} from 'react-native';

interface Expense {
  id: string;
  amount: number;
  dueDate: Date;
  description: string;
}

export const initializeNotifications = async () => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create channels for different types of notifications
  const channels = await Promise.all([
    notifee.createChannel({
      id: 'expense-reminder',
      name: 'Expense Reminders',
      importance: Platform.select({
        ios: 4,
        android: 4,
      }),
    }),
    notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    }),
  ]);

  // Add event listeners
  notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('Notification dismissed:', detail.notification);
        break;
      case EventType.PRESS:
        console.log('Notification pressed:', detail.notification);
        break;
    }
  });

  return channels;
};

export const scheduleExpenseReminder = async (expense: Expense) => {
  // Calculate notification time (1 day before due date)
  const notificationTime = new Date(expense.dueDate);
  notificationTime.setDate(notificationTime.getDate() - 1);
  
  // Schedule the notification
  await notifee.createTriggerNotification({
    title: `Expense Due Tomorrow`,
    body: `You have a payment of ${expense.amount} due tomorrow for ${expense.description}`,
    android: {
      channelId: 'expense-reminder',
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      categoryId: 'expense-reminder',
    },
  }, {
    type: 'timestamp',
    timestamp: notificationTime.getTime(),
  });
};

export const cancelExpenseReminder = async (expenseId: string) => {
  await notifee.cancelTriggerNotification(expenseId);
};
