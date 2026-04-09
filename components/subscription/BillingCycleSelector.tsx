import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { BILLING_CYCLES } from "@/lib/constants";
import type { BillingCycle } from "@/types/subscription";

interface BillingCycleSelectorProps {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export function BillingCycleSelector({ value, onChange }: BillingCycleSelectorProps) {
  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">
        Billing Cycle
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {BILLING_CYCLES.map((cycle) => (
            <Pressable
              key={cycle.value}
              onPress={() => onChange(cycle.value)}
              className="active:opacity-80"
            >
              <View
                className={cn(
                  "rounded-xl px-4 py-2.5 border",
                  value === cycle.value
                    ? "bg-primary-600 border-primary-600"
                    : "border-surface-300 bg-white dark:border-dark-border dark:bg-dark-card"
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-medium",
                    value === cycle.value
                      ? "text-white"
                      : "text-stone-700 dark:text-stone-300"
                  )}
                >
                  {cycle.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
