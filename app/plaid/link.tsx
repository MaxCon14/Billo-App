import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Building2, Shield, CheckCircle2 } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/lib/theme";

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
            <Building2 size={40} color="#0D9488" />
          </View>
          <Text style={styles.title}>Connect Your Bank</Text>
          <Text style={styles.subtitle}>
            Securely link your bank account to automatically detect subscriptions
          </Text>
        </View>

        <Card style={{ marginBottom: 24 }}>
          <CardContent>
            <View style={styles.featureList}>
              <View style={styles.featureRow}>
                <CheckCircle2 size={20} color="#0D9488" />
                <View style={styles.featureTextWrap}>
                  <Text style={styles.featureTitle}>Auto-detect subscriptions</Text>
                  <Text style={styles.featureDesc}>
                    We scan your transactions to find recurring charges
                  </Text>
                </View>
              </View>
              <View style={styles.featureRow}>
                <CheckCircle2 size={20} color="#0D9488" />
                <View style={styles.featureTextWrap}>
                  <Text style={styles.featureTitle}>Track spending history</Text>
                  <Text style={styles.featureDesc}>
                    See how much you've spent on each subscription
                  </Text>
                </View>
              </View>
              <View style={styles.featureRow}>
                <Shield size={20} color="#0D9488" />
                <View style={styles.featureTextWrap}>
                  <Text style={styles.featureTitle}>Bank-grade security</Text>
                  <Text style={styles.featureDesc}>
                    Powered by Plaid with 256-bit encryption
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <Button onPress={handleConnect} disabled={isConnecting}>
          <Text style={styles.buttonText}>
            {isConnecting ? "Connecting..." : "Connect Bank Account"}
          </Text>
        </Button>

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
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.stone[900],
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    color: colors.stone[500],
  },
  featureList: {
    gap: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[900],
  },
  featureDesc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.stone[500],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  disclaimer: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    color: colors.stone[400],
  },
});
