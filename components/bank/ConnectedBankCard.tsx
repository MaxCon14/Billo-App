import React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { RefreshCw, Unlink, AlertTriangle } from "lucide-react-native";
import { colors, shadows, radius } from "@/lib/theme";
import type { ConnectedBank } from "@/types/gocardless";

interface ConnectedBankCardProps {
  bank: ConnectedBank;
  onSync: (requisitionId: string) => void;
  onReconnect: () => void;
  onDisconnect: (bankId: string) => void;
  isSyncing: boolean;
}

function getStatusInfo(bank: ConnectedBank) {
  if (bank.status === "expired") {
    return { label: "Expired", color: colors.red[500], bgColor: colors.red[50] };
  }
  if (bank.status === "pending") {
    return { label: "Pending", color: colors.amber[500], bgColor: colors.amber[50] };
  }
  // Check if expiring within 14 days
  if (bank.expires_at) {
    const daysUntilExpiry = Math.ceil(
      (new Date(bank.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiry <= 0) {
      return { label: "Expired", color: colors.red[500], bgColor: colors.red[50] };
    }
    if (daysUntilExpiry <= 14) {
      return {
        label: `Expires in ${daysUntilExpiry}d`,
        color: colors.amber[500],
        bgColor: colors.amber[50],
      };
    }
  }
  return { label: "Connected", color: colors.green[500], bgColor: colors.green[50] };
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
            <AlertTriangle size={14} color={colors.amber[600]} />
            <Text style={s.reconnectText}>Reconnect</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => bank.requisition_id && onSync(bank.requisition_id)}
            disabled={isSyncing || !bank.requisition_id}
            style={({ pressed }) => [
              s.actionBtn,
              s.syncBtn,
              pressed && s.pressed,
              isSyncing && s.disabled,
            ]}
          >
            <RefreshCw size={14} color={colors.primary[600]} />
            <Text style={s.syncBtnText}>
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleDisconnect}
          style={({ pressed }) => [s.actionBtn, s.disconnectBtn, pressed && s.pressed]}
        >
          <Unlink size={14} color={colors.red[500]} />
          <Text style={s.disconnectText}>Disconnect</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 16,
    ...shadows.sm,
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
    backgroundColor: colors.stone[200],
    alignItems: "center",
    justifyContent: "center",
  },
  logoInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[500],
  },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
  },
  syncText: {
    marginTop: 2,
    fontSize: 12,
    color: colors.stone[400],
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.stone[100],
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
    backgroundColor: colors.primary[50],
  },
  syncBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary[600],
  },
  reconnectBtn: {
    backgroundColor: colors.amber[50],
    borderWidth: 1,
    borderColor: colors.amber[200],
  },
  reconnectText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.amber[600],
  },
  disconnectBtn: {
    backgroundColor: colors.red[50],
  },
  disconnectText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.red[500],
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
});
