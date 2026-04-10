import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { colors } from "@/lib/theme";

export function SubscriptionCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton style={{ height: 40, width: 40 }} circle />
      <View style={styles.cardMiddle}>
        <Skeleton style={{ marginBottom: 8, height: 16, width: 128 }} />
        <Skeleton style={{ height: 12, width: 80 }} />
      </View>
      <View style={styles.cardRight}>
        <Skeleton style={{ marginBottom: 8, height: 16, width: 64 }} />
        <Skeleton style={{ height: 12, width: 48 }} />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.dashboardContainer}>
      <Skeleton style={{ height: 160, width: "100%", borderRadius: 16 }} />
      <View style={styles.doubleRow}>
        <Skeleton style={{ height: 96, flex: 1, borderRadius: 16 }} />
        <Skeleton style={{ height: 96, flex: 1, borderRadius: 16 }} />
      </View>
      <Skeleton style={{ marginBottom: 8, height: 20, width: 160 }} />
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
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.white,
    padding: 16,
  },
  cardMiddle: {
    marginLeft: 12,
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
