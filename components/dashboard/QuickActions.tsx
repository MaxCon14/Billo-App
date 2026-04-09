import React from "react";
import { Pressable, Text, View } from "react-native";
import { Plus, Building2 } from "lucide-react-native";

interface QuickActionsProps {
  onAddSubscription: () => void;
  onConnectBank: () => void;
}

export function QuickActions({ onAddSubscription, onConnectBank }: QuickActionsProps) {
  return (
    <View className="flex-row gap-3">
      <Pressable onPress={onAddSubscription} className="flex-1 active:opacity-80">
        <View className="items-center rounded-2xl border border-surface-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
          <View className="mb-2 rounded-full bg-primary-100 p-3 dark:bg-primary-900">
            <Plus size={22} color="#0D9488" />
          </View>
          <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Add Subscription
          </Text>
        </View>
      </Pressable>

      <Pressable onPress={onConnectBank} className="flex-1 active:opacity-80">
        <View className="items-center rounded-2xl border border-surface-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
          <View className="mb-2 rounded-full bg-primary-100 p-3 dark:bg-primary-900">
            <Building2 size={22} color="#0D9488" />
          </View>
          <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Connect Bank
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
