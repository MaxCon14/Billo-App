import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Settings
        </Text>

        <Card>
          <CardContent>
            <View className="flex-row items-center py-2">
              <Avatar fallback="JD" size="lg" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  John Doe
                </Text>
                <Text className="text-sm text-stone-500 dark:text-stone-400">
                  john@example.com
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
              subtitle="USD ($)"
            />
            <SettingsItem
              icon={<Building2 size={18} color="#0D9488" />}
              title="Connected Banks"
              subtitle="Manage linked accounts"
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
                <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
              }
            />
            <SettingsItem
              icon={<Bell size={18} color="#0D9488" />}
              title="Email Notifications"
              subtitle="Renewal reminders via email"
              trailing={
                <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Appearance
            </Text>
            <SettingsItem
              icon={<Palette size={18} color="#0D9488" />}
              title="Dark Mode"
              subtitle="Toggle dark theme"
              trailing={
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              About
            </Text>
            <SettingsItem
              icon={<Shield size={18} color="#0D9488" />}
              title="Privacy Policy"
            />
            <SettingsItem
              icon={<Shield size={18} color="#0D9488" />}
              title="Terms of Service"
            />
          </CardContent>
        </Card>

        <Pressable className="active:opacity-80">
          <View className="flex-row items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-3.5 dark:border-red-900 dark:bg-red-950">
            <LogOut size={18} color="#EF4444" />
            <Text className="ml-2 text-sm font-semibold text-red-500">Sign Out</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
