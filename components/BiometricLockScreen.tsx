import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CreditCard, Fingerprint } from "lucide-react-native";
import { colors, shadows, radius } from "@/lib/theme";

interface BiometricLockScreenProps {
  onUnlock: () => void;
}

export function BiometricLockScreen({ onUnlock }: BiometricLockScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <CreditCard size={40} color={colors.white} />
        </View>
        <Text style={styles.appName}>SubTracker</Text>
        <Text style={styles.subtitle}>App is locked</Text>

        <Pressable
          onPress={onUnlock}
          style={({ pressed }) => [
            styles.unlockBtn,
            pressed && styles.unlockBtnPressed,
          ]}
        >
          <Fingerprint size={24} color={colors.white} />
          <Text style={styles.unlockText}>Unlock</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stone[50],
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.stone[900],
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.stone[400],
    fontWeight: "500",
    marginBottom: 24,
  },
  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.primary[600],
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: radius.xl,
    ...shadows.md,
  },
  unlockBtnPressed: {
    backgroundColor: colors.primary[700],
  },
  unlockText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
});
