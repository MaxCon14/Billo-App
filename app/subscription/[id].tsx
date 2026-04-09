import React, { useMemo } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Pause,
  Play,
  Trash2,
  Edit3,
} from "lucide-react-native";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SAMPLE_SUBSCRIPTIONS } from "@/lib/sampleData";
import {
  formatCurrency,
  formatDate,
  getDaysUntil,
  getMonthlyAmount,
  getYearlyAmount,
} from "@/lib/utils";

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const subscription = SAMPLE_SUBSCRIPTIONS.find((s) => s.id === id);

  if (!subscription) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface-50 dark:bg-dark-bg">
        <Text className="text-stone-500">Subscription not found</Text>
      </SafeAreaView>
    );
  }

  const daysUntil = getDaysUntil(subscription.next_billing_date);
  const monthly = getMonthlyAmount(subscription.amount, subscription.billing_cycle);
  const yearly = getYearlyAmount(subscription.amount, subscription.billing_cycle);

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["bottom"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Header */}
        <View className="items-center py-4">
          <Logo name={subscription.name} logoUrl={subscription.logo_url} size={72} />
          <Text className="mt-3 text-2xl font-bold text-stone-900 dark:text-stone-100">
            {subscription.name}
          </Text>
          {subscription.description && (
            <Text className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {subscription.description}
            </Text>
          )}
          <View className="mt-2 flex-row gap-2">
            {subscription.category && (
              <Badge style={{ backgroundColor: subscription.category.color + "20" }}>
                <Text style={{ color: subscription.category.color }} className="text-xs font-medium">
                  {subscription.category.name}
                </Text>
              </Badge>
            )}
            <Badge variant={subscription.is_active ? "default" : "secondary"}>
              <Text className={`text-xs font-medium ${subscription.is_active ? "text-primary-800" : "text-stone-500"}`}>
                {subscription.is_active ? "Active" : "Paused"}
              </Text>
            </Badge>
          </View>
        </View>

        {/* Price cards */}
        <View className="flex-row gap-3">
          <Card className="flex-1">
            <CardContent className="items-center py-4">
              <DollarSign size={18} color="#0D9488" />
              <Text className="mt-1 text-xs text-stone-500 dark:text-stone-400">Per cycle</Text>
              <Text className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {formatCurrency(subscription.amount, subscription.currency)}
              </Text>
              <Text className="text-xs text-stone-400">{subscription.billing_cycle}</Text>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="items-center py-4">
              <Calendar size={18} color="#0D9488" />
              <Text className="mt-1 text-xs text-stone-500 dark:text-stone-400">Next billing</Text>
              <Text className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {daysUntil === 0 ? "Today" : `${daysUntil}d`}
              </Text>
              <Text className="text-xs text-stone-400">
                {formatDate(subscription.next_billing_date)}
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* Details */}
        <Card>
          <CardContent>
            <Text className="mb-3 text-sm font-semibold text-stone-900 dark:text-stone-100">
              Spending Summary
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-stone-500 dark:text-stone-400">Monthly cost</Text>
                <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  {formatCurrency(monthly, subscription.currency)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-stone-500 dark:text-stone-400">Yearly cost</Text>
                <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  {formatCurrency(yearly, subscription.currency)}
                </Text>
              </View>
              {subscription.start_date && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-stone-500 dark:text-stone-400">Member since</Text>
                  <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {formatDate(subscription.start_date)}
                  </Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {subscription.notes && (
          <Card>
            <CardContent>
              <Text className="mb-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
                Notes
              </Text>
              <Text className="text-sm text-stone-500 dark:text-stone-400">
                {subscription.notes}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <View className="gap-3">
          <Button variant="outline" onPress={() => {}}>
            <View className="flex-row items-center">
              <Edit3 size={16} color="#0D9488" />
              <Text className="ml-2 font-medium text-primary-600">Edit Subscription</Text>
            </View>
          </Button>

          <Button variant="outline" onPress={() => {}}>
            <View className="flex-row items-center">
              {subscription.is_active ? (
                <>
                  <Pause size={16} color="#78716C" />
                  <Text className="ml-2 font-medium text-stone-600 dark:text-stone-400">
                    Pause Subscription
                  </Text>
                </>
              ) : (
                <>
                  <Play size={16} color="#0D9488" />
                  <Text className="ml-2 font-medium text-primary-600">
                    Resume Subscription
                  </Text>
                </>
              )}
            </View>
          </Button>

          {subscription.website_url && (
            <Button variant="outline" onPress={() => {}}>
              <View className="flex-row items-center">
                <ExternalLink size={16} color="#78716C" />
                <Text className="ml-2 font-medium text-stone-600 dark:text-stone-400">
                  Visit Website
                </Text>
              </View>
            </Button>
          )}

          <Button
            variant="destructive"
            onPress={() =>
              Alert.alert(
                "Delete Subscription",
                "Are you sure you want to delete this subscription?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => router.back() },
                ]
              )
            }
          >
            <View className="flex-row items-center">
              <Trash2 size={16} color="#fff" />
              <Text className="ml-2 font-semibold text-white">Delete</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
