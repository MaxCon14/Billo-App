import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { colors, radius } from "@/lib/theme";

export function SubscriptionCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton style={{ height: 44, width: 44 }} circle />
      <View style={styles.cardMiddle}>
        <Skeleton style={{ marginBottom: 8, height: 14, width: 120, borderRadius: 6 }} />
        <Skeleton style={{ height: 10, width: 72, borderRadius: 5 }} />
      </View>
      <View style={styles.cardRight}>
        <Skeleton style={{ marginBottom: 8, height: 14, width: 56, borderRadius: 6 }} />
        <Skeleton style={{ height: 10, width: 40, borderRadius: 5 }} />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.dashboardContainer}>
      <Skeleton style={{ height: 160, width: "100%", borderRadius: radius.xl }} />
      <View style={styles.doubleRow}>
        <Skeleton style={{ height: 100, flex: 1, borderRadius: radius.xl }} />
        <Skeleton style={{ height: 100, flex: 1, borderRadius: radius.xl }} />
      </View>
      <Skeleton style={{ marginBottom: 12, height: 18, width: 160, borderRadius: 6 }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <SubscriptionCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function ListSkeleton() {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: 5 }).map((_, i) => (
        <SubscriptionCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardMiddle: {
    marginLeft: 14,
    flex: 1,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  dashboardContainer: {
    gap: 16,
    padding: 16,
  },
  doubleRow: {
    flexDirection: "row",
    gap: 12,
  },
  listContainer: {
    gap: 12,
    padding: 16,
  },
});
