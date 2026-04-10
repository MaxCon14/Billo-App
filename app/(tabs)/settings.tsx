import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  User,
  Bell,
  Building2,
  Palette,
  CircleDollarSign,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}

function SettingsItem({ icon, title, subtitle, onPress, trailing }: SettingsItemProps) {
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <View className="flex-row items-center py-3">
        <View className="mr-3 rounded-xl bg-surface-100 p-2.5 dark:bg-dark-border">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
            {title}
          </Text>
          {subtitle && (
            <Text className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              {subtitle}
            </Text>
          )}
        </View>
        {trailing || <ChevronRight size={18} color="#A8A29E" />}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, user, signOut, updateProfile } = useAuth();
  const { toast } = useToast();

  const pushEnabled = profile?.notification_push ?? true;
  const emailEnabled = profile?.notification_email ?? true;

  async function handleTogglePush(value: boolean) {
    try {
      await updateProfile({ notification_push: value });
    } catch {
      toast("Failed to update setting", "error");
    }
  }

  async function handleToggleEmail(value: boolean) {
    try {
      await updateProfile({ notification_email: value });
    } catch {
      toast("Failed to update setting", "error");
    }
  }

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch {
            toast("Failed to sign out", "error");
          }
        },
      },
    ]);
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Settings
        </Text>

        <Card>
          <CardContent>
            <View className="flex-row items-center py-2">
              <Avatar
                fallback={initials}
                src={profile?.avatar_url ?? undefined}
                size="lg"
              />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {profile?.full_name ?? "User"}
                </Text>
                <Text className="text-sm text-stone-500 dark:text-stone-400">
                  {user?.email ?? ""}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Account
            </Text>
            <SettingsItem
              icon={<User size={18} color="#0D9488" />}
              title="Edit Profile"
              subtitle="Name, email, avatar"
            />
            <SettingsItem
              icon={<CircleDollarSign size={18} color="#0D9488" />}
              title="Currency"
              subtitle={profile?.currency ?? "USD"}
            />
            <SettingsItem
              icon={<Building2 size={18} color="#0D9488" />}
              title="Connected Banks"
              subtitle="Manage linked accounts"
              onPress={() => router.push("/plaid/link")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Notifications
            </Text>
            <SettingsItem
              icon={<Bell size={18} color="#0D9488" />}
              title="Push Notifications"
              subtitle="Renewal reminders on your device"
              trailing={
                <Switch checked={pushEnabled} onCheckedChange={handleTogglePush} />
              }
            />
            <SettingsItem
              icon={<Bell size={18} color="#0D9488" />}
              title="Email Notifications"
              subtitle="Renewal reminders via email"
              trailing={
                <Switch checked={emailEnabled} onCheckedChange={handleToggleEmail} />
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              About
            </Text>
            <SettingsItem icon={<Shield size={18} color="#0D9488" />} title="Privacy Policy" />
            <SettingsItem icon={<Shield size={18} color="#0D9488" />} title="Terms of Service" />
          </CardContent>
        </Card>

        <Pressable onPress={handleSignOut} className="active:opacity-80">
          <View className="flex-row items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-3.5 dark:border-red-900 dark:bg-red-950">
            <LogOut size={18} color="#EF4444" />
            <Text className="ml-2 text-sm font-semibold text-red-500">Sign Out</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
