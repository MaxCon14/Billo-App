import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionCardSkeleton() {
  return (
    <View className="flex-row items-center rounded-2xl border border-surface-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
      <Skeleton className="h-10 w-10" circle />
      <View className="ml-3 flex-1">
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </View>
      <View className="items-end">
        <Skeleton className="mb-2 h-4 w-16" />
        <Skeleton className="h-3 w-12" />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View className="gap-4 p-4">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <View className="flex-row gap-3">
        <Skeleton className="h-24 flex-1 rounded-2xl" />
        <Skeleton className="h-24 flex-1 rounded-2xl" />
      </View>
      <Skeleton className="mb-2 h-5 w-40" />
      {Array.from({ length: 3 }).map((_, i) => (
        <SubscriptionCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function ListSkeleton() {
  return (
    <View className="gap-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <SubscriptionCardSkeleton key={i} />
      ))}
    </View>
  );
}
