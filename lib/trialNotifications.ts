import * as Notifications from "expo-notifications";

/**
 * Schedule a local notification 3 days before a trial ends.
 * Uses the subscription ID as the notification identifier so
 * re-scheduling replaces the previous notification.
 */
export async function scheduleTrialReminder(
  subscriptionId: string,
  subscriptionName: string,
  trialEndsAt: string
) {
  const endDate = new Date(trialEndsAt);
  const reminderDate = new Date(endDate);
  reminderDate.setDate(reminderDate.getDate() - 3);
  reminderDate.setHours(10, 0, 0, 0); // 10:00 AM

  // Only schedule if the reminder date is in the future
  if (reminderDate <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    identifier: `trial-${subscriptionId}`,
    content: {
      title: "Trial Ending Soon",
      body: `Your ${subscriptionName} free trial ends in 3 days. Decide if you want to keep it!`,
      data: { subscriptionId, type: "trial_reminder" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });
}

/**
 * Cancel a previously scheduled trial reminder.
 */
export async function cancelTrialReminder(subscriptionId: string) {
  await Notifications.cancelScheduledNotificationAsync(`trial-${subscriptionId}`);
}
