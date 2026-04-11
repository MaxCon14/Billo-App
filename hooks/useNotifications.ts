import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

// ─── Notification Setup ─────────────────────────────────────────────────────

// Lazy-load expo-notifications to avoid crashes in Expo Go (SDK 53+ removed
// push notification support from Expo Go). All notification calls are wrapped
// in try-catch so the app degrades gracefully.

let Notifications: typeof import('expo-notifications') | null = null;

async function getNotificationsModule() {
  if (!Notifications) {
    try {
      Notifications = await import('expo-notifications');
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch {
      Notifications = null;
    }
  }
  return Notifications;
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    const N = await getNotificationsModule();
    if (!N) return null;

    // Push notifications only work on physical devices
    if (!Device.isDevice) {
      console.warn('Push notifications require a physical device');
      return null;
    }

    // Android needs a notification channel
    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: N.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Check / request permissions
    const { status: existingStatus } = await N.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await N.requestPermissionsAsync();
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

    const tokenData = await N.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch {
    // Notifications not available (e.g. Expo Go)
    return null;
  }
}

/**
 * On mount, registers for push notifications and sets up notification
 * listeners for both received and interaction (response) events.
 */
export function useNotificationSetup() {
  const user = useAuthStore((s) => s.user);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;

    async function setup() {
      // Register push token
      const token = await registerForPushNotificationsAsync();
      if (token && mounted) {
        setExpoPushToken(token);
        if (user?.id) {
          console.log('Push token registered:', token);
        }
      }

      // Set up listeners
      const N = await getNotificationsModule();
      if (!N || !mounted) return;

      const notifSub = N.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
      });

      const responseSub = N.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response:', response);
      });

      cleanupRef.current = () => {
        notifSub.remove();
        responseSub.remove();
      };
    }

    setup();

    return () => {
      mounted = false;
      cleanupRef.current?.();
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
        .update({ is_read: true } as any)
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
