import React, { useCallback } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import type { Subscription } from "@/types/subscription";
import { SubscriptionCard } from "./SubscriptionCard";
import { ListSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { CreditCard } from "lucide-react-native";

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
      <View className="mb-3">
        <SubscriptionCard subscription={item} onPress={onSubscriptionPress} />
      </View>
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
        icon={<CreditCard size={32} color="#A8A29E" />}
      />
    );
  }

  return (
    <FlatList
      data={subscriptions}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
}
