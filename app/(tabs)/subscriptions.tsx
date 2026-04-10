import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Plus, Search, SlidersHorizontal } from "lucide-react-native";
import { SubscriptionList } from "@/components/subscription/SubscriptionList";
import { CategoryBadge } from "@/components/subscription/CategoryBadge";
import { useSubscriptions, useCategories } from "@/hooks/useSubscriptions";
import { useFilterStore } from "@/stores/filterStore";
import { colors } from "@/lib/theme";

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
            <Plus size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={s.searchRow}>
          <View style={s.searchBox}>
            <Search size={18} color="#A8A29E" />
            <TextInput
              style={s.searchInput}
              placeholder="Search subscriptions..."
              placeholderTextColor="#A8A29E"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            style={s.filterBtn}
          >
            <SlidersHorizontal size={20} color="#78716C" />
          </Pressable>
        </View>

        {showFilters && (
          <View style={s.filterRow}>
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
          </View>
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
  header: { paddingHorizontal: 16, paddingBottom: 8, paddingTop: 16 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 24, fontWeight: "bold", color: colors.stone[900] },
  addBtn: { borderRadius: 9999, backgroundColor: colors.primary[600], padding: 10 },
  searchRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  searchBox: {
    flex: 1, flexDirection: "row", alignItems: "center", borderRadius: 12,
    borderWidth: 1, borderColor: colors.stone[300], backgroundColor: colors.white, paddingHorizontal: 12,
  },
  searchInput: { marginLeft: 8, flex: 1, paddingVertical: 10, fontSize: 14, color: colors.stone[900] },
  filterBtn: {
    borderRadius: 12, borderWidth: 1, borderColor: colors.stone[300],
    backgroundColor: colors.white, padding: 10,
  },
  filterRow: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterChip: { borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 6 },
  filterChipActive: { backgroundColor: colors.primary[600] },
  filterChipInactive: { borderWidth: 1, borderColor: colors.stone[300], backgroundColor: colors.white },
  filterChipText: { fontSize: 12, fontWeight: "500" },
  filterChipTextActive: { color: colors.white },
  filterChipTextInactive: { color: colors.stone[600] },
});
