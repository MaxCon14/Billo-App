import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Plus, Building2 } from "lucide-react-native";
import { colors, shadows, radius } from "@/lib/theme";

interface QuickActionsProps {
  onAddSubscription: () => void;
  onConnectBank: () => void;
}

export function QuickActions({ onAddSubscription, onConnectBank }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onAddSubscription}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Plus size={22} color={colors.primary[600]} strokeWidth={2.5} />
          </View>
          <Text style={styles.label}>Add Subscription</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onConnectBank}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Building2 size={22} color={colors.primary[600]} strokeWidth={2} />
          </View>
          <Text style={styles.label}>Connect Bank</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  card: {
    alignItems: "center",
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
    ...shadows.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    marginBottom: 10,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.stone[900],
  },
});
