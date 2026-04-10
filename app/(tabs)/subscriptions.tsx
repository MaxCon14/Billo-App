import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Plus, Search, SlidersHorizontal } from "lucide-react-native";
import { SubscriptionList } from "@/components/subscription/SubscriptionList";
import { CategoryBadge } from "@/components/subscription/CategoryBadge";
import { useSubscriptions, useCategories } from "@/hooks/useSubscriptions";
import { useFilterStore } from "@/stores/filterStore";
import { colors, shadows, radius } from "@/lib/theme";

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
            <Plus size={24} color="#fff" />
          </Pressable>
        </View>

        <View style={s.searchRow}>
          <View style={s.searchBox}>
            <Search size={18} color={colors.stone[400]} />
            <TextInput
              style={s.searchInput}
              placeholder="Search subscriptions..."
              placeholderTextColor={colors.stone[400]}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            style={[s.filterBtn, showFilters && s.filterBtnActive]}
          >
            <SlidersHorizontal size={20} color={showFilters ? colors.primary[600] : colors.stone[500]} />
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
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  header: { paddingHorizontal: 20, paddingBottom: 12, paddingTop: 16 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.stone[900],
  },
  addBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
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
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.stone[50],
    paddingHorizontal: 16,
    height: 44,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
    color: colors.stone[900],
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnActive: {
    borderColor: colors.primary[200],
    backgroundColor: colors.primary[50],
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
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary[600],
  },
  filterChipInactive: {
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.white,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: colors.white,
  },
  filterChipTextInactive: {
    color: colors.stone[600],
  },
});
