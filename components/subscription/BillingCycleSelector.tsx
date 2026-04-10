import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "@/lib/theme";
import { BILLING_CYCLES } from "@/lib/constants";
import type { BillingCycle } from "@/types/subscription";

interface BillingCycleSelectorProps {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export function BillingCycleSelector({ value, onChange }: BillingCycleSelectorProps) {
  return (
    <View>
      <Text style={styles.label}>Billing Cycle</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {BILLING_CYCLES.map((cycle) => {
            const isSelected = value === cycle.value;
            return (
              <Pressable
                key={cycle.value}
                onPress={() => onChange(cycle.value)}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <View
                  style={[
                    styles.chip,
                    isSelected ? styles.chipSelected : styles.chipUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected
                        ? styles.chipTextSelected
                        : styles.chipTextUnselected,
                    ]}
                  >
                    {cycle.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  label: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
    color: colors.stone[700],
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipSelected: {
    backgroundColor: colors.primary[600],
  },
  chipUnselected: {
    backgroundColor: colors.stone[100],
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: colors.white,
  },
  chipTextUnselected: {
    color: colors.stone[600],
  },
});
