import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * Configure default notification behavior.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for push notifications and return the Expo push token.
 * Returns null if registration fails or the app is running on a simulator.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device.');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission not granted.');
    return null;
  }

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

/**
 * Schedule a local notification to remind the user about an upcoming billing date.
 *
 * @param subscriptionName - The name of the subscription (e.g. "Netflix").
 * @param billingDate - The date the subscription will be billed.
 * @param daysBefore - How many days before the billing date to send the reminder.
 * @returns The notification identifier string, or null if scheduling failed.
 */
export async function scheduleBillingReminder(
  subscriptionName: string,
  billingDate: Date,
  daysBefore: number
): Promise<string | null> {
  const triggerDate = new Date(billingDate);
  triggerDate.setDate(triggerDate.getDate() - daysBefore);

  // Set the notification time to 9:00 AM
  triggerDate.setHours(9, 0, 0, 0);

  // Don't schedule if the trigger date is in the past
  if (triggerDate.getTime() <= Date.now()) {
    return null;
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Upcoming Renewal',
      body:
        daysBefore === 1
          ? `${subscriptionName} renews tomorrow.`
          : `${subscriptionName} renews in ${daysBefore} days.`,
      data: {
        subscriptionName,
        billingDate: billingDate.toISOString(),
      },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return identifier;
}

/**
 * Cancel a previously scheduled notification by its identifier.
 *
 * @param notificationId - The identifier returned by scheduleNotificationAsync.
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
