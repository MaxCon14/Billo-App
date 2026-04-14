import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
  Fingerprint,
  Plus,
} from "lucide-react-native";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { ConnectedBankCard } from "@/components/bank/ConnectedBankCard";
import { useAuth } from "@/hooks/useAuth";
import {
  useConnectedBanks,
  useSyncTransactions,
  useDisconnectBank,
} from "@/hooks/useTrueLayer";
import { useBankStore } from "@/stores/bankStore";
import { useToast } from "@/components/ui/toast";
import { colors, shadows, radius } from "@/lib/theme";
import * as LocalAuthentication from "expo-local-authentication";

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
        {trailing || <ChevronRight size={18} color={colors.stone[300]} />}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, user, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  const { data: connectedBanks } = useConnectedBanks();
  const syncMutation = useSyncTransactions();
  const disconnectMutation = useDisconnectBank();
  const isSyncing = useBankStore((s) => s.isSyncing);

  const pushEnabled = profile?.notification_push ?? true;
  const emailEnabled = profile?.notification_email ?? true;
  const biometricEnabled = profile?.biometric_lock_enabled ?? false;

  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState("Biometric Lock");

  useEffect(() => {
    async function checkBiometrics() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);

      if (hasHardware) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricLabel("Face ID");
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricLabel("Touch ID");
        } else {
          setBiometricLabel("Biometric Lock");
        }
      }
    }
    checkBiometrics();
  }, []);

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

  async function handleToggleBiometric(value: boolean) {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verify to enable biometric lock",
        cancelLabel: "Cancel",
      });
      if (!result.success) {
        toast("Biometric verification failed", "error");
        return;
      }
    }
    try {
      await updateProfile({ biometric_lock_enabled: value } as any);
      toast(value ? `${biometricLabel} enabled` : `${biometricLabel} disabled`, "success");
    } catch {
      toast("Failed to update setting", "error");
    }
  }

  function handleSync(bankId: string) {
    syncMutation.mutate(bankId, {
      onSuccess: (data) => {
        toast(
          data.subscriptions_detected > 0
            ? `Synced! Found ${data.subscriptions_detected} new subscription(s)`
            : "Synced! No new subscriptions found",
          "success"
        );
        if (data.subscriptions_detected > 0) {
          router.push("/bank/review");
        }
      },
      onError: () => toast("Sync failed. Try again later.", "error"),
    });
  }

  function handleDisconnect(bankId: string) {
    disconnectMutation.mutate(bankId, {
      onSuccess: () => toast("Bank disconnected", "success"),
      onError: () => toast("Failed to disconnect", "error"),
    });
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

        <View style={s.card}>
          <View style={s.profileRow}>
            <Avatar fallback={initials} src={profile?.avatar_url ?? undefined} size="lg" />
            <View style={s.profileInfo}>
              <Text style={s.profileName}>{profile?.full_name ?? "User"}</Text>
              <Text style={s.profileEmail}>{user?.email ?? ""}</Text>
            </View>
            <ChevronRight size={18} color={colors.stone[300]} />
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.sectionLabel}>ACCOUNT</Text>
          <SettingsItem icon={<User size={18} color={colors.primary[500]} />} title="Edit Profile" subtitle="Name, email, avatar" />
          <View style={s.divider} />
          <SettingsItem icon={<CircleDollarSign size={18} color={colors.primary[500]} />} title="Currency" subtitle={profile?.currency ?? "USD"} />
        </View>

        {/* Connected Banks Section */}
        <View style={s.card}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionLabel}>CONNECTED BANKS</Text>
          </View>

          {connectedBanks && connectedBanks.length > 0 ? (
            <View style={s.banksList}>
              {connectedBanks.map((bank) => (
                <ConnectedBankCard
                  key={bank.id}
                  bank={bank}
                  onSync={handleSync}
                  onReconnect={() => router.push("/bank/connect")}
                  onDisconnect={handleDisconnect}
                  isSyncing={isSyncing}
                />
              ))}
            </View>
          ) : (
            <View style={s.noBanks}>
              <Building2 size={24} color={colors.stone[300]} />
              <Text style={s.noBanksText}>No banks connected</Text>
            </View>
          )}

          <Pressable
            onPress={() => router.push("/bank/connect")}
            style={({ pressed }) => [s.addBankBtn, pressed && s.pressed]}
          >
            <Plus size={16} color={colors.primary[600]} />
            <Text style={s.addBankText}>
              {connectedBanks && connectedBanks.length > 0 ? "Add Another Bank" : "Connect a Bank"}
            </Text>
          </Pressable>
        </View>

        <View style={s.card}>
          <Text style={s.sectionLabel}>SECURITY</Text>
          <SettingsItem
            icon={<Fingerprint size={18} color={colors.primary[500]} />}
            title={biometricLabel}
            subtitle={biometricAvailable ? "Require authentication to open app" : "Not available on this device"}
            trailing={
              <Switch
                checked={biometricEnabled}
                onCheckedChange={handleToggleBiometric}
                disabled={!biometricAvailable}
              />
            }
          />
        </View>

        <View style={s.card}>
          <Text style={s.sectionLabel}>NOTIFICATIONS</Text>
          <SettingsItem
            icon={<Bell size={18} color={colors.primary[500]} />}
            title="Push Notifications"
            subtitle="Renewal reminders on your device"
            trailing={<Switch checked={pushEnabled} onCheckedChange={handleTogglePush} />}
          />
          <View style={s.divider} />
          <SettingsItem
            icon={<Bell size={18} color={colors.primary[500]} />}
            title="Email Notifications"
            subtitle="Renewal reminders via email"
            trailing={<Switch checked={emailEnabled} onCheckedChange={handleToggleEmail} />}
          />
        </View>

        <View style={s.card}>
          <Text style={s.sectionLabel}>ABOUT</Text>
          <SettingsItem icon={<Shield size={18} color={colors.primary[500]} />} title="Privacy Policy" />
          <View style={s.divider} />
          <SettingsItem icon={<Shield size={18} color={colors.primary[500]} />} title="Terms of Service" />
        </View>

        <Pressable onPress={handleSignOut}>
          <View style={s.signOutBtn}>
            <LogOut size={18} color={colors.red[500]} />
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, gap: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.stone[900],
    paddingTop: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 16,
    ...shadows.md,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  profileInfo: { marginLeft: 16, flex: 1 },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[900],
  },
  profileEmail: {
    fontSize: 14,
    color: colors.stone[400],
    marginTop: 2,
  },
  sectionLabel: {
    marginBottom: 12,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.stone[400],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    backgroundColor: colors.stone[100],
    marginLeft: 52,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  iconBox: {
    marginRight: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: { flex: 1 },
  itemTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.stone[900],
  },
  itemSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.stone[400],
  },
  banksList: {
    gap: 10,
    marginBottom: 12,
  },
  noBanks: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  noBanksText: {
    fontSize: 14,
    color: colors.stone[400],
  },
  addBankBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderStyle: "dashed",
  },
  addBankText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary[600],
  },
  pressed: { opacity: 0.7 },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.red[200],
    backgroundColor: colors.red[50],
    paddingVertical: 16,
  },
  signOutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: colors.red[500],
  },
});
