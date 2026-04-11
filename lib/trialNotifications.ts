/**
 * Trial notification helpers.
 * Wrapped in try-catch to gracefully handle Expo Go limitations
 * (push notifications were removed from Expo Go in SDK 53+).
 */

export async function scheduleTrialReminder(
  subscriptionId: string,
  subscriptionName: string,
  trialEndsAt: string
) {
  try {
    const Notifications = await import("expo-notifications");

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
  } catch {
    // Notifications not available (e.g., Expo Go) — silently skip
  }
}

export async function cancelTrialReminder(subscriptionId: string) {
  try {
    const Notifications = await import("expo-notifications");
    await Notifications.cancelScheduledNotificationAsync(`trial-${subscriptionId}`);
  } catch {
    // Notifications not available — silently skip
  }
}
