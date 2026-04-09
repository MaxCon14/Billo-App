import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Building2, Shield, CheckCircle2 } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["bottom"]}>
      <View className="flex-1 justify-center px-6">
        <View className="mb-8 items-center">
          <View className="mb-4 rounded-3xl bg-primary-100 p-5 dark:bg-primary-900">
            <Building2 size={40} color="#0D9488" />
          </View>
          <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Connect Your Bank
          </Text>
          <Text className="mt-2 text-center text-sm text-stone-500 dark:text-stone-400">
            Securely link your bank account to automatically detect subscriptions
          </Text>
        </View>

        <Card className="mb-6">
          <CardContent>
            <View className="gap-4">
              <View className="flex-row items-start">
                <CheckCircle2 size={20} color="#0D9488" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    Auto-detect subscriptions
                  </Text>
                  <Text className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    We scan your transactions to find recurring charges
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <CheckCircle2 size={20} color="#0D9488" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    Track spending history
                  </Text>
                  <Text className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    See how much you've spent on each subscription
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Shield size={20} color="#0D9488" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    Bank-grade security
                  </Text>
                  <Text className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Powered by Plaid with 256-bit encryption
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <Button onPress={handleConnect} disabled={isConnecting}>
          <Text className="text-base font-semibold text-white">
            {isConnecting ? "Connecting..." : "Connect Bank Account"}
          </Text>
        </Button>

        <Text className="mt-4 text-center text-xs text-stone-400 dark:text-stone-500">
          We use Plaid to securely connect to your bank.{"\n"}
          We never store your bank credentials.
        </Text>
      </View>
    </SafeAreaView>
  );
}
