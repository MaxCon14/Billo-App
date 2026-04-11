import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { getDaysUntil } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { colors, shadows, radius } from "@/lib/theme";

interface TrialsEndingSoonProps {
  subscriptions: Subscription[];
  onSubscriptionPress: (subscription: Subscription) => void;
}

function getDaysColor(days: number): string {
  if (days < 3) return colors.red[500];
  if (days < 5) return colors.amber[600];
  return colors.amber[500];
}

function getDaysLabel(days: number): string {
  if (days <= 0) return "Expired";
  if (days === 1) return "Ends tomorrow";
  return `Ends in ${days} days`;
}

export function TrialsEndingSoon({
  subscriptions,
  onSubscriptionPress,
}: TrialsEndingSoonProps) {
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
        <AlertTriangle size={18} color={colors.amber[500]} />
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
              <View style={[styles.urgencyBadge, { backgroundColor: days < 3 ? colors.red[100] : colors.amber[100] }]}>
                <Text style={[styles.urgencyText, { color: days < 3 ? colors.red[600] : colors.amber[600] }]}>
                  {days === 0 ? "NOW" : `${days}d`}
                </Text>
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
    borderRadius: radius.xl,
    backgroundColor: colors.amber[50],
    padding: 20,
    borderWidth: 1,
    borderColor: colors.amber[200],
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[900],
  },
  list: { gap: 0 },
  pressed: { opacity: 0.7 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  nameCol: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
    marginBottom: 2,
  },
  daysText: {
    fontSize: 13,
    fontWeight: "500",
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: "700",
  },
  separator: {
    height: 1,
    backgroundColor: colors.amber[200],
    marginLeft: 54,
  },
});
