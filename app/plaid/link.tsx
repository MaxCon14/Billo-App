import React, { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Building2, Shield, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react-native";
import { colors, shadows, radius } from "@/lib/theme";

const PLAID_SIGNUP_URL = "https://dashboard.plaid.com/signup";

// Check if real Plaid credentials are configured
const hasPlaidCredentials =
  !!process.env.EXPO_PUBLIC_PLAID_CLIENT_ID &&
  process.env.EXPO_PUBLIC_PLAID_CLIENT_ID !== "your_plaid_client_id";

export default function PlaidLinkScreen() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  function handleConnect() {
    if (!hasPlaidCredentials) return;
    setIsConnecting(true);
    // In production, this would:
    // 1. Call a Supabase Edge Function to generate a link_token
    // 2. Open Plaid Link SDK with that token
    // 3. Exchange the public_token for an access_token server-side
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  }

  function handleOpenPlaidSignup() {
    Linking.openURL(PLAID_SIGNUP_URL);
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

        {!hasPlaidCredentials && (
          <View style={styles.setupCard}>
            <View style={styles.setupHeader}>
              <AlertTriangle size={20} color={colors.amber[600]} />
              <Text style={styles.setupTitle}>Setup Required</Text>
            </View>
            <Text style={styles.setupDesc}>
              Bank connection requires a Plaid developer account. To enable this feature:
            </Text>
            <View style={styles.setupSteps}>
              <Text style={styles.setupStep}>1. Create a free Plaid account</Text>
              <Text style={styles.setupStep}>2. Get your API keys from the Plaid dashboard</Text>
              <Text style={styles.setupStep}>3. Add them to your .env file:</Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>EXPO_PUBLIC_PLAID_CLIENT_ID=your_id</Text>
                <Text style={styles.codeText}>PLAID_SECRET=your_secret</Text>
              </View>
              <Text style={styles.setupStep}>4. Create a Supabase Edge Function for link token generation</Text>
            </View>
            <Pressable
              onPress={handleOpenPlaidSignup}
              style={({ pressed }) => [
                styles.setupBtn,
                pressed && styles.setupBtnPressed,
              ]}
            >
              <Text style={styles.setupBtnText}>Sign Up for Plaid</Text>
              <ExternalLink size={16} color={colors.primary[600]} />
            </Pressable>
          </View>
        )}

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
          disabled={isConnecting || !hasPlaidCredentials}
          style={({ pressed }) => [
            styles.connectBtn,
            pressed && styles.connectBtnPressed,
            (isConnecting || !hasPlaidCredentials) && styles.connectBtnDisabled,
          ]}
        >
          <Text style={styles.connectBtnText}>
            {!hasPlaidCredentials
              ? "Setup Required"
              : isConnecting
                ? "Connecting..."
                : "Connect Bank Account"}
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
  setupCard: {
    backgroundColor: colors.amber[50],
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.amber[200],
  },
  setupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  setupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.amber[600],
  },
  setupDesc: {
    fontSize: 14,
    color: colors.stone[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  setupSteps: {
    gap: 6,
    marginBottom: 16,
  },
  setupStep: {
    fontSize: 13,
    color: colors.stone[600],
    lineHeight: 20,
    paddingLeft: 4,
  },
  codeBlock: {
    backgroundColor: colors.stone[100],
    borderRadius: radius.md,
    padding: 10,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
  },
  codeText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: colors.stone[700],
    lineHeight: 18,
  },
  setupBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  setupBtnPressed: {
    backgroundColor: colors.primary[50],
  },
  setupBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary[600],
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
