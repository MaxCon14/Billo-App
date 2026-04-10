import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BillingCycleSelector } from "./BillingCycleSelector";
import { CategoryBadge } from "./CategoryBadge";
import type { BillingCycle, Category, SubscriptionFormData } from "@/types/subscription";

interface SubscriptionFormProps {
  initialData?: Partial<SubscriptionFormData>;
  onSubmit: (data: SubscriptionFormData) => void;
  isLoading: boolean;
  categories: Category[];
}

export function SubscriptionForm({
  initialData,
  onSubmit,
  isLoading,
  categories,
}: SubscriptionFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    initialData?.billing_cycle ?? "monthly"
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    initialData?.category_id ?? null
  );
  const [nextBillingDate, setNextBillingDate] = useState(
    initialData?.next_billing_date ?? new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.website_url ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!nextBillingDate) newErrors.nextBillingDate = "Next billing date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      amount: Number(amount),
      currency: "USD",
      billing_cycle: billingCycle,
      billing_day: new Date(nextBillingDate).getDate(),
      next_billing_date: nextBillingDate,
      start_date: nextBillingDate,
      category_id: categoryId,
      logo_url: null,
      website_url: websiteUrl || null,
      notes: notes || null,
      notify_before_renewal: true,
    });
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.formGroup}>
        <Input
          label="Subscription Name"
          placeholder="e.g., Netflix, Spotify"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

        <Input
          label="Amount"
          placeholder="9.99"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          error={errors.amount}
        />

        <BillingCycleSelector value={billingCycle} onChange={setBillingCycle} />

        <View>
          <Text style={styles.sectionLabel}>
            Category
          </Text>
          <View style={styles.categoryWrap}>
            {categories.map((cat) => (
              <CategoryBadge
                key={cat.id}
                category={cat}
                selected={categoryId === cat.id}
                onPress={() =>
                  setCategoryId(categoryId === cat.id ? null : cat.id)
                }
              />
            ))}
          </View>
        </View>

        <Input
          label="Next Billing Date"
          placeholder="YYYY-MM-DD"
          value={nextBillingDate}
          onChangeText={setNextBillingDate}
          error={errors.nextBillingDate}
        />

        <Input
          label="Website URL (optional)"
          placeholder="https://example.com"
          value={websiteUrl}
          onChangeText={setWebsiteUrl}
          keyboardType="url"
          autoCapitalize="none"
        />

        <Input
          label="Notes (optional)"
          placeholder="Any notes about this subscription..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <Button onPress={handleSubmit} disabled={isLoading} style={styles.submitButton}>
          <Text style={styles.submitText}>
            {isLoading ? "Saving..." : initialData ? "Update Subscription" : "Add Subscription"}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    gap: 16,
  },
  sectionLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[700],
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  submitButton: {
    marginTop: 16,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
