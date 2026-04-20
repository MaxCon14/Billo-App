import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle, XCircle } from "lucide-react-native";
import { findCancellationUrl } from "@/lib/cancellationLinks";
import { getDaysUntil } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { colors, radius, typography } from "@/lib/theme";

interface TrialsEndingSoonProps {
  subscriptions: Subscription[];
  onSubscriptionPress: (subscription: Subscription) => void;
  onCancelTrial?: (subscription: Subscription) => void;
}

function getDaysColor(days: number): string {
  if (days < 3) return colors.destructive;
  return colors.accent.pink;
}

function getDaysLabel(days: number): string {
  if (days <= 0) return "Expired";
  if (days === 1) return "Ends tomorrow";
  return `Ends in ${days} days`;
}

export function TrialsEndingSoon({
  subscriptions,
  onSubscriptionPress,
  onCancelTrial,
}: TrialsEndingSoonProps) {
  function handleCancelTrial(sub: Subscription) {
    const cancelUrl = findCancellationUrl(sub.name);
    Alert.alert(
      "Cancel Trial",
      `Cancel your ${sub.name} trial?${cancelUrl ? " Billo will open the cancellation page." : ""}`,
      [
        { text: "Not now", style: "cancel" },
        {
          text: "Cancel Trial",
          style: "destructive",
          onPress: () => {
            onCancelTrial?.(sub);
            if (cancelUrl) Linking.openURL(cancelUrl);
          },
        },
      ]
    );
  }
  // Filter trials ending within 7 days, sorted by urgency
  const trials = subscriptions
    .filter((sub) => sub.is_trial && sub.trial_ends_at)
    .map((sub) => ({ sub, days: getDaysUntil(sub.trial_ends_at!) }))
    .filter(({ days }) => days >= 0 && days <= 7)
    .sort((a, b) => a.days - b.days);

  if (trials.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <AlertTriangle size={18} color={colors.accent.pink} />
        <Text style={styles.title}>Trials Ending Soon</Text>
      </View>

      <View style={styles.list}>
        {trials.map(({ sub, days }, index) => (
          <Pressable
            key={sub.id}
            onPress={() => onSubscriptionPress(sub)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <View style={styles.row}>
              <Logo name={sub.name} logoUrl={sub.logo_url} websiteUrl={sub.website_url} size={40} />
              <View style={styles.nameCol}>
                <Text style={styles.name} numberOfLines={1}>
                  {sub.name}
                </Text>
                <Text style={[styles.daysText, { color: getDaysColor(days) }]}>
                  {getDaysLabel(days)}
                </Text>
              </View>
              <View style={styles.rightCol}>
                <View style={[styles.urgencyBadge, { backgroundColor: days < 3 ? colors.destructive : colors.accent.pink }]}>
                  <Text style={styles.urgencyText}>
                    {days === 0 ? "NOW" : `${days}d`}
                  </Text>
                </View>
                <Pressable
                  onPress={(e) => { e.stopPropagation?.(); handleCancelTrial(sub); }}
                  style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
                >
                  <XCircle size={14} color={colors.destructive} />
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
            {index < trials.length - 1 && <View style={styles.separator} />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  title: {
    fontFamily: "Syne_700Bold",
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
  },
  list: { gap: 0 },
  pressed: { opacity: 0.85 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
  },
  nameCol: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontFamily: typography.body.fontFamily,
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 2,
  },
  daysText: {
    fontFamily: typography.body.fontFamily,
    fontSize: 13,
    fontWeight: "500",
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  urgencyText: {
    fontFamily: typography.label.fontFamily,
    fontSize: 13,
    fontWeight: "700",
    color: colors.background,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 54,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  cancelText: {
    fontFamily: typography.body.fontFamily,
    fontSize: 12,
    fontWeight: "500",
    color: colors.destructive,
  },
});
