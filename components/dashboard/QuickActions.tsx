import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Plus, Building2 } from "lucide-react-native";
import { colors, radius, typography } from "@/lib/theme";

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
        <View style={[styles.card, styles.primaryCard]}>
          <View style={styles.primaryIconCircle}>
            <Plus size={22} color={colors.background} strokeWidth={2.5} />
          </View>
          <Text style={styles.primaryLabel}>Add Subscription</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onConnectBank}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={[styles.card, styles.secondaryCard]}>
          <View style={styles.secondaryIconCircle}>
            <Building2 size={22} color={colors.accent.yellow} strokeWidth={2} />
          </View>
          <Text style={styles.secondaryLabel}>Connect Bank</Text>
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
    opacity: 0.85,
  },
  card: {
    alignItems: "center",
    borderRadius: radius.lg,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  primaryCard: {
    backgroundColor: colors.accent.yellow,
  },
  secondaryCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryIconCircle: {
    width: 48,
    height: 48,
    marginBottom: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryIconCircle: {
    width: 48,
    height: 48,
    marginBottom: 10,
    borderRadius: 24,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryLabel: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.background,
  },
  secondaryLabel: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.foreground,
  },
});
