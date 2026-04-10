import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Plus, Search, SlidersHorizontal } from "lucide-react-native";
import { SubscriptionList } from "@/components/subscription/SubscriptionList";
import { CategoryBadge } from "@/components/subscription/CategoryBadge";
import { useSubscriptions, useCategories } from "@/hooks/useSubscriptions";
import { useFilterStore } from "@/stores/filterStore";
import type { Subscription } from "@/types/subscription";

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { data: subscriptions = [], isLoading, refetch, isRefetching } = useSubscriptions();
  const { data: categories = [] } = useCategories();
  const { search, category_id, setSearch, setCategoryFilter } = useFilterStore();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["top"]}>
      <View className="px-4 pb-2 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Subscriptions
          </Text>
          <Pressable
            onPress={() => router.push("/subscription/add")}
            className="rounded-full bg-primary-600 p-2.5"
          >
            <Plus size={20} color="#fff" />
          </Pressable>
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center rounded-xl border border-surface-300 bg-white px-3 dark:border-dark-border dark:bg-dark-card">
            <Search size={18} color="#A8A29E" />
            <TextInput
              className="ml-2 flex-1 py-2.5 text-sm text-stone-900 dark:text-stone-100"
              placeholder="Search subscriptions..."
              placeholderTextColor="#A8A29E"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            className="rounded-xl border border-surface-300 bg-white p-2.5 dark:border-dark-border dark:bg-dark-card"
          >
            <SlidersHorizontal size={20} color="#78716C" />
          </Pressable>
        </View>

        {showFilters && (
          <View className="mt-3 flex-row flex-wrap gap-2">
            <Pressable onPress={() => setCategoryFilter(null)}>
              <View
                className={`rounded-full px-3 py-1.5 ${
                  !category_id
                    ? "bg-primary-600"
                    : "border border-surface-300 bg-white dark:border-dark-border dark:bg-dark-card"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    !category_id ? "text-white" : "text-stone-600 dark:text-stone-400"
                  }`}
                >
                  All
                </Text>
              </View>
            </Pressable>
            {categories.map((cat) => (
              <CategoryBadge
                key={cat.id}
                category={cat}
                selected={category_id === cat.id}
                onPress={() =>
                  setCategoryFilter(category_id === cat.id ? null : cat.id)
                }
              />
            ))}
          </View>
        )}
      </View>

      <SubscriptionList
        subscriptions={subscriptions}
        isLoading={isLoading}
        onSubscriptionPress={(sub) => router.push(`/subscription/${sub.id}`)}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />
    </SafeAreaView>
  );
}
