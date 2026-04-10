import React, { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import type { Subscription } from "@/types/subscription";
import { SubscriptionCard } from "./SubscriptionCard";
import { ListSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { CreditCard } from "lucide-react-native";
import { colors } from "@/lib/theme";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  onSubscriptionPress: (subscription: Subscription) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function SubscriptionList({
  subscriptions,
  isLoading,
  onSubscriptionPress,
  onRefresh,
  isRefreshing = false,
}: SubscriptionListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Subscription }) => (
      <SubscriptionCard subscription={item} onPress={onSubscriptionPress} />
    ),
    [onSubscriptionPress]
  );

  if (isLoading) {
    return <ListSkeleton />;
  }

  if (subscriptions.length === 0) {
    return (
      <EmptyState
        title="No subscriptions yet"
        description="Add your first subscription to start tracking your spending."
        icon={<CreditCard size={28} color={colors.stone[400]} />}
      />
    );
  }

  return (
    <FlatList
      data={subscriptions}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 12,
  },
  listContent: {
    padding: 16,
  },
});
