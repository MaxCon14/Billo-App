import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Plus, Search, SlidersHorizontal } from "lucide-react-native";
import { SubscriptionList } from "@/components/subscription/SubscriptionList";
import { CategoryBadge } from "@/components/subscription/CategoryBadge";
import { useSubscriptions, useCategories } from "@/hooks/useSubscriptions";
import { useFilterStore } from "@/stores/filterStore";
import { colors, radius } from "@/lib/theme";

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { data: subscriptions = [], isLoading, refetch, isRefetching } = useSubscriptions();
  const { data: categories = [] } = useCategories();
  const { search, category_id, setSearch, setCategoryFilter } = useFilterStore();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={s.title}>Subscriptions</Text>
          <Pressable
            onPress={() => router.push("/subscription/add")}
            style={s.addBtn}
          >
            <Plus size={24} color={colors.background} />
          </Pressable>
        </View>

        <View style={s.searchRow}>
          <View style={s.searchBox}>
            <Search size={18} color={colors.muted} />
            <TextInput
              style={s.searchInput}
              placeholder="Search subscriptions..."
              placeholderTextColor={colors.muted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            style={[s.filterBtn, showFilters && s.filterBtnActive]}
          >
            <SlidersHorizontal size={20} color={showFilters ? colors.accent.yellow : colors.muted} />
          </Pressable>
        </View>

        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.filterScroll}
            contentContainerStyle={s.filterRow}
          >
            <Pressable onPress={() => setCategoryFilter(null)}>
              <View
                style={[
                  s.filterChip,
                  !category_id ? s.filterChipActive : s.filterChipInactive,
                ]}
              >
                <Text
                  style={[
                    s.filterChipText,
                    !category_id ? s.filterChipTextActive : s.filterChipTextInactive,
                  ]}
                >
                  All
                </Text>
              </View>
            </Pressable>
            {categories.map((cat) => (
              <CategoryBadge
                key={cat.id}
                category={cat}
                selected={category_id === cat.id}
                onPress={() =>
                  setCategoryFilter(category_id === cat.id ? null : cat.id)
                }
              />
            ))}
          </ScrollView>
        )}
      </View>

      <SubscriptionList
        subscriptions={subscriptions}
        isLoading={isLoading}
        onSubscriptionPress={(sub) => router.push(`/subscription/${sub.id}`)}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 12, paddingTop: 16 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontFamily: "Syne_800ExtraBold",
    letterSpacing: -0.56,
    color: colors.foreground,
  },
  addBtn: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    backgroundColor: colors.accent.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    height: 44,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.foreground,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnActive: {
    borderColor: colors.accent.yellow,
    backgroundColor: colors.surfaceRaised,
  },
  filterScroll: {
    marginTop: 14,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: colors.accent.yellow,
  },
  filterChipInactive: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Syne_600SemiBold",
  },
  filterChipTextActive: {
    color: colors.background,
  },
  filterChipTextInactive: {
    color: colors.muted,
  },
});
