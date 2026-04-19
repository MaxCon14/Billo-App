import React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { RefreshCw, Unlink, AlertTriangle } from "lucide-react-native";
import { colors, radius } from "@/lib/theme";
import type { ConnectedBank } from "@/types/truelayer";

interface ConnectedBankCardProps {
  bank: ConnectedBank;
  onSync: (bankId: string) => void;
  onReconnect: () => void;
  onDisconnect: (bankId: string) => void;
  isSyncing: boolean;
}

function getStatusInfo(bank: ConnectedBank) {
  if (bank.status === "expired") {
    return { label: "Expired", color: colors.destructive, bgColor: colors.surfaceRaised };
  }
  if (bank.status === "pending") {
    return { label: "Pending", color: colors.accent.yellow, bgColor: colors.surfaceRaised };
  }
  // Check if expiring within 14 days
  if (bank.expires_at) {
    const daysUntilExpiry = Math.ceil(
      (new Date(bank.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiry <= 0) {
      return { label: "Expired", color: colors.destructive, bgColor: colors.surfaceRaised };
    }
    if (daysUntilExpiry <= 14) {
      return {
        label: `Expires in ${daysUntilExpiry}d`,
        color: colors.accent.yellow,
        bgColor: colors.surfaceRaised,
      };
    }
  }
  return { label: "Connected", color: colors.accent.green, bgColor: colors.surfaceRaised };
}

export function ConnectedBankCard({
  bank,
  onSync,
  onReconnect,
  onDisconnect,
  isSyncing,
}: ConnectedBankCardProps) {
  const status = getStatusInfo(bank);
  const isExpired = bank.status === "expired" || (bank.expires_at && new Date(bank.expires_at) < new Date());

  function handleDisconnect() {
    Alert.alert(
      "Disconnect Bank",
      `Remove ${bank.institution_name} and all associated transaction data?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => onDisconnect(bank.id),
        },
      ]
    );
  }

  const lastSync = bank.last_synced_at
    ? new Date(bank.last_synced_at).toLocaleDateString()
    : "Never";

  return (
    <View style={s.card}>
      <View style={s.row}>
        {bank.institution_logo ? (
          <Image
            source={{ uri: bank.institution_logo }}
            style={s.logo}
            resizeMode="contain"
          />
        ) : (
          <View style={[s.logo, s.logoPlaceholder]}>
            <Text style={s.logoInitial}>{bank.institution_name.charAt(0)}</Text>
          </View>
        )}
        <View style={s.info}>
          <Text style={s.name} numberOfLines={1}>
            {bank.institution_name}
          </Text>
          <Text style={s.syncText}>Last synced: {lastSync}</Text>
        </View>
        <View style={[s.badge, { backgroundColor: status.bgColor }]}>
          <Text style={[s.badgeText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={s.actions}>
        {isExpired ? (
          <Pressable
            onPress={onReconnect}
            style={({ pressed }) => [s.actionBtn, s.reconnectBtn, pressed && s.pressed]}
          >
            <AlertTriangle size={14} color={colors.accent.yellow} />
            <Text style={s.reconnectText}>Reconnect</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => onSync(bank.id)}
            disabled={isSyncing}
            style={({ pressed }) => [
              s.actionBtn,
              s.syncBtn,
              pressed && s.pressed,
              isSyncing && s.disabled,
            ]}
          >
            <RefreshCw size={14} color={colors.accent.yellow} />
            <Text style={s.syncBtnText}>
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleDisconnect}
          style={({ pressed }) => [s.actionBtn, s.disconnectBtn, pressed && s.pressed]}
        >
          <Unlink size={14} color={colors.destructive} />
          <Text style={s.disconnectText}>Disconnect</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  logoPlaceholder: {
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  logoInitial: {
    fontSize: 18,
    fontFamily: 'Syne_700Bold',
    color: colors.muted,
  },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontFamily: 'Syne_700Bold',
    color: colors.foreground,
  },
  syncText: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: 'Syne_400Regular',
    color: colors.muted,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    flex: 1,
    justifyContent: "center",
  },
  syncBtn: {
    backgroundColor: colors.surfaceRaised,
  },
  syncBtnText: {
    fontSize: 13,
    fontFamily: 'Syne_600SemiBold',
    color: colors.accent.yellow,
  },
  reconnectBtn: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reconnectText: {
    fontSize: 13,
    fontFamily: 'Syne_600SemiBold',
    color: colors.accent.yellow,
  },
  disconnectBtn: {
    backgroundColor: colors.surfaceRaised,
  },
  disconnectText: {
    fontSize: 13,
    fontFamily: 'Syne_600SemiBold',
    color: colors.destructive,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
