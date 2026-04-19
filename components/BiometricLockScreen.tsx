import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CreditCard, Fingerprint } from "lucide-react-native";
import { colors, radius } from "@/lib/theme";

interface BiometricLockScreenProps {
  onUnlock: () => void;
}

export function BiometricLockScreen({ onUnlock }: BiometricLockScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <CreditCard size={40} color={colors.black} />
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
          <Fingerprint size={24} color={colors.black} />
          <Text style={styles.unlockText}>Unlock</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.accent.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 28,
    letterSpacing: -0.56,
    color: colors.foreground,
    marginTop: 8,
  },
  subtitle: {
    fontFamily: 'Syne_400Regular',
    fontSize: 16,
    color: colors.muted,
    marginBottom: 24,
  },
  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.accent.yellow,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: radius.xl,
  },
  unlockBtnPressed: {
    opacity: 0.85,
  },
  unlockText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: colors.black,
  },
});
