import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Plus, Building2 } from "lucide-react-native";
import { colors } from "@/lib/theme";

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
            <Plus size={22} color={colors.primary[600]} />
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
            <Building2 size={22} color={colors.primary[600]} />
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
  },
  card: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.white,
    padding: 16,
  },
  iconCircle: {
    marginBottom: 8,
    borderRadius: 9999,
    backgroundColor: colors.primary[100],
    padding: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[900],
  },
});
