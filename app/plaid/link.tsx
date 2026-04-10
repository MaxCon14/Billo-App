import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Building2, Shield, CheckCircle2 } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { colors, shadows, radius } from "@/lib/theme";

export default function PlaidLinkScreen() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  function handleConnect() {
    setIsConnecting(true);
    // In production, use usePlaid().createLinkToken() then open Plaid Link
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Building2 size={36} color={colors.primary[600]} />
          </View>
          <Text style={styles.title}>Connect Your Bank</Text>
          <Text style={styles.subtitle}>
            Securely link your bank account to automatically detect subscriptions
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureList}>
            <View style={styles.featureRow}>
              <View style={styles.checkCircle}>
                <CheckCircle2 size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>Auto-detect subscriptions</Text>
                <Text style={styles.featureDesc}>
                  We scan your transactions to find recurring charges
                </Text>
              </View>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureRow}>
              <View style={styles.checkCircle}>
                <CheckCircle2 size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>Track spending history</Text>
                <Text style={styles.featureDesc}>
                  See how much you've spent on each subscription
                </Text>
              </View>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureRow}>
              <View style={styles.checkCircle}>
                <Shield size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>Bank-grade security</Text>
                <Text style={styles.featureDesc}>
                  Powered by Plaid with 256-bit encryption
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleConnect}
          disabled={isConnecting}
          style={({ pressed }) => [
            styles.connectBtn,
            pressed && styles.connectBtnPressed,
            isConnecting && styles.connectBtnDisabled,
          ]}
        >
          <Text style={styles.connectBtnText}>
            {isConnecting ? "Connecting..." : "Connect Bank Account"}
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          We use Plaid to securely connect to your bank.{"\n"}
          We never store your bank credentials.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.stone[50],
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  iconCircle: {
    marginBottom: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.stone[900],
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
    color: colors.stone[400],
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  featureCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 28,
    ...shadows.md,
  },
  featureList: {
    gap: 0,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  featureDivider: {
    height: 1,
    backgroundColor: colors.stone[100],
    marginLeft: 44,
  },
  checkCircle: {
    marginRight: 14,
    marginTop: 1,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
  },
  featureDesc: {
    marginTop: 3,
    fontSize: 13,
    color: colors.stone[400],
    lineHeight: 18,
  },
  connectBtn: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  connectBtnPressed: {
    backgroundColor: colors.primary[700],
  },
  connectBtnDisabled: {
    opacity: 0.6,
  },
  connectBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  disclaimer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: colors.stone[400],
    lineHeight: 20,
  },
});
