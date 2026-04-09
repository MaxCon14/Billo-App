import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

// ─── Notification Setup ─────────────────────────────────────────────────────

/**
 * Configure how incoming notifications are displayed when the app is
 * in the foreground.
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

async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  // Android needs a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Check / request permissions
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission not granted');
    return null;
  }

  // Get the Expo push token
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return tokenData.data;
}

/**
 * On mount, registers for push notifications and sets up notification
 * listeners for both received and interaction (response) events.
 * Persists the push token to the user's profile in Supabase.
 */
export function useNotificationSetup() {
  const user = useAuthStore((s) => s.user);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Register and persist token
    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        setExpoPushToken(token);

        // Persist to profile so the backend can send pushes
        if (user?.id) {
          await supabase
            .from('profiles')
            .update({ expo_push_token: token })
            .eq('id', user.id);
        }
      }
    });

    // Foreground notification listener
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // The notification is available on notification.request.content
        // Components can subscribe to the Notifications event emitter if
        // they need to react to incoming notifications.
        console.log('Notification received:', notification);
      });

    // User tapped / interacted with a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response:', response);
        // Navigation or deeplink handling can be added here
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user?.id]);

  return expoPushToken;
}

// ─── Notifications Query ────────────────────────────────────────────────────

interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  sent_at: string;
  data?: Record<string, unknown>;
}

/**
 * Fetch all notifications for the current user, ordered newest first.
 */
export function useNotifications() {
  const user = useAuthStore((s) => s.user);

  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user?.id,
  });
}

// ─── Mark Read ──────────────────────────────────────────────────────────────

/**
 * Mark a single notification as read.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

// ─── Unread Count ───────────────────────────────────────────────────────────

/**
 * Query the count of unread notifications.
 */
export function useUnreadCount() {
  const user = useAuthStore((s) => s.user);

  return useQuery<number>({
    queryKey: ['unread-count'],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user?.id,
  });
}
