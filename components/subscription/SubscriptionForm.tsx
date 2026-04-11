import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows } from "@/lib/theme";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BillingCycleSelector } from "./BillingCycleSelector";
import { CategoryBadge } from "./CategoryBadge";
import type { BillingCycle, Category, SubscriptionFormData } from "@/types/subscription";
import { getWebsiteForService } from "@/lib/knownServices";

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
  const [isTrial, setIsTrial] = useState(initialData?.is_trial ?? false);
  const [trialEndsAt, setTrialEndsAt] = useState(
    initialData?.trial_ends_at ?? ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill website URL when user types a known service name
  function handleNameChange(text: string) {
    setName(text);
    // Only auto-fill if user hasn't manually entered a URL
    if (!websiteUrl) {
      const url = getWebsiteForService(text);
      if (url) setWebsiteUrl(url);
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!isTrial && (!amount || isNaN(Number(amount)) || Number(amount) <= 0))
      newErrors.amount = "Enter a valid amount";
    if (!isTrial && !nextBillingDate)
      newErrors.nextBillingDate = "Next billing date is required";
    if (isTrial && !trialEndsAt)
      newErrors.trialEndsAt = "Trial end date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      amount: isTrial ? 0 : Number(amount),
      currency: "USD",
      billing_cycle: billingCycle,
      billing_day: isTrial
        ? new Date(trialEndsAt).getDate()
        : new Date(nextBillingDate).getDate(),
      next_billing_date: isTrial ? trialEndsAt : nextBillingDate,
      start_date: isTrial ? trialEndsAt : nextBillingDate,
      category_id: categoryId,
      logo_url: null,
      website_url: websiteUrl || null,
      notes: notes || null,
      notify_before_renewal: true,
      is_trial: isTrial,
      trial_ends_at: isTrial ? trialEndsAt : null,
    });
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.formGroup}>
        <Input
          label="Subscription Name"
          placeholder="e.g., Netflix, Spotify"
          value={name}
          onChangeText={handleNameChange}
          error={errors.name}
        />

        {/* Trial Toggle */}
        <View style={styles.trialRow}>
          <View style={styles.trialInfo}>
            <Text style={styles.trialLabel}>This is a free trial</Text>
            <Text style={styles.trialHint}>Track trial expiration dates</Text>
          </View>
          <Switch checked={isTrial} onCheckedChange={setIsTrial} />
        </View>

        {isTrial ? (
          <Input
            label="Trial End Date"
            placeholder="YYYY-MM-DD"
            value={trialEndsAt}
            onChangeText={setTrialEndsAt}
            error={errors.trialEndsAt}
          />
        ) : (
          <>
            <Input
              label="Amount"
              placeholder="9.99"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              error={errors.amount}
            />

            <BillingCycleSelector value={billingCycle} onChange={setBillingCycle} />
          </>
        )}

        <View>
          <Text style={styles.sectionLabel}>Category</Text>
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

        {!isTrial && (
          <Input
            label="Next Billing Date"
            placeholder="YYYY-MM-DD"
            value={nextBillingDate}
            onChangeText={setNextBillingDate}
            error={errors.nextBillingDate}
          />
        )}

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

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitPressed,
            isLoading && styles.submitDisabled,
          ]}
        >
          <Text style={styles.submitText}>
            {isLoading
              ? "Saving..."
              : initialData
                ? "Update Subscription"
                : "Add Subscription"}
          </Text>
        </Pressable>
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
    paddingBottom: 40,
  },
  formGroup: {
    gap: 16,
  },
  trialRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.amber[50],
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.amber[200],
  },
  trialInfo: {
    flex: 1,
  },
  trialLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
  },
  trialHint: {
    fontSize: 13,
    color: colors.stone[400],
    marginTop: 2,
  },
  sectionLabel: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
    color: colors.stone[700],
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.primary[600],
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  submitPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
});
