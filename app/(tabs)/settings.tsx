import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  User,
  Bell,
  Building2,
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
import { colors } from "@/lib/theme";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}

function SettingsItem({ icon, title, subtitle, onPress, trailing }: SettingsItemProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={s.itemRow}>
        <View style={s.iconBox}>{icon}</View>
        <View style={s.itemContent}>
          <Text style={s.itemTitle}>{title}</Text>
          {subtitle && <Text style={s.itemSubtitle}>{subtitle}</Text>}
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
    <SafeAreaView style={s.screen} edges={["top"]}>
      <ScrollView style={s.flex1} contentContainerStyle={s.scrollContent}>
        <Text style={s.title}>Settings</Text>

        <Card>
          <CardContent>
            <View style={s.profileRow}>
              <Avatar fallback={initials} src={profile?.avatar_url ?? undefined} size="lg" />
              <View style={s.profileInfo}>
                <Text style={s.profileName}>{profile?.full_name ?? "User"}</Text>
                <Text style={s.profileEmail}>{user?.email ?? ""}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text style={s.sectionLabel}>Account</Text>
            <SettingsItem icon={<User size={18} color="#0D9488" />} title="Edit Profile" subtitle="Name, email, avatar" />
            <SettingsItem icon={<CircleDollarSign size={18} color="#0D9488" />} title="Currency" subtitle={profile?.currency ?? "USD"} />
            <SettingsItem icon={<Building2 size={18} color="#0D9488" />} title="Connected Banks" subtitle="Manage linked accounts" onPress={() => router.push("/plaid/link")} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text style={s.sectionLabel}>Notifications</Text>
            <SettingsItem
              icon={<Bell size={18} color="#0D9488" />}
              title="Push Notifications"
              subtitle="Renewal reminders on your device"
              trailing={<Switch checked={pushEnabled} onCheckedChange={handleTogglePush} />}
            />
            <SettingsItem
              icon={<Bell size={18} color="#0D9488" />}
              title="Email Notifications"
              subtitle="Renewal reminders via email"
              trailing={<Switch checked={emailEnabled} onCheckedChange={handleToggleEmail} />}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text style={s.sectionLabel}>About</Text>
            <SettingsItem icon={<Shield size={18} color="#0D9488" />} title="Privacy Policy" />
            <SettingsItem icon={<Shield size={18} color="#0D9488" />} title="Terms of Service" />
          </CardContent>
        </Card>

        <Pressable onPress={handleSignOut}>
          <View style={s.signOutBtn}>
            <LogOut size={18} color="#EF4444" />
            <Text style={s.signOutText}>Sign Out</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  flex1: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: colors.stone[900] },
  profileRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  profileInfo: { marginLeft: 16, flex: 1 },
  profileName: { fontSize: 18, fontWeight: "600", color: colors.stone[900] },
  profileEmail: { fontSize: 14, color: colors.stone[500] },
  sectionLabel: {
    marginBottom: 8, fontSize: 12, fontWeight: "600",
    textTransform: "uppercase", letterSpacing: 1, color: colors.stone[500],
  },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  iconBox: {
    marginRight: 12, borderRadius: 12, backgroundColor: colors.stone[100], padding: 10,
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: "500", color: colors.stone[900] },
  itemSubtitle: { marginTop: 2, fontSize: 12, color: colors.stone[500] },
  signOutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 16, borderWidth: 1, borderColor: colors.red[200],
    backgroundColor: colors.red[50], paddingVertical: 14,
  },
  signOutText: { marginLeft: 8, fontSize: 14, fontWeight: "600", color: colors.red[500] },
});
