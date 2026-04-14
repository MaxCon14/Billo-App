import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, ChevronRight, Globe, Shield } from "lucide-react-native";
import { useProviders, useConnectBank } from "@/hooks/useTrueLayer";
import {
  SUPPORTED_COUNTRIES,
  type Country,
  type Provider,
} from "@/types/truelayer";
import { colors, shadows, radius } from "@/lib/theme";

export default function BankConnectScreen() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [search, setSearch] = useState("");

  const { data: providers, isLoading, error } = useProviders(
    selectedCountry?.tlCode ?? ""
  );

  const connectBank = useConnectBank();

  const filtered = (providers ?? []).filter((p) =>
    p.display_name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSelectProvider(provider: Provider) {
    try {
      await connectBank.mutateAsync({
        id: provider.provider_id,
        name: provider.display_name,
        logo: provider.logo_url ?? null,
        country: provider.country ?? selectedCountry?.tlCode ?? null,
      });
    } catch (err) {
      console.error("Failed to create auth link:", err);
    }
  }

  // Country Picker
  if (!selectedCountry) {
    return (
      <SafeAreaView style={s.screen} edges={["bottom"]}>
        <View style={s.container}>
          <View style={s.header}>
            <View style={s.iconCircle}>
              <Globe size={32} color={colors.primary[600]} />
            </View>
            <Text style={s.title}>Select Your Country</Text>
            <Text style={s.subtitle}>Choose where your bank is located</Text>
          </View>

          <FlatList
            data={SUPPORTED_COUNTRIES}
            keyExtractor={(item) => item.code}
            contentContainerStyle={s.listContent}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedCountry(item)}
                style={({ pressed }) => [s.countryRow, pressed && s.pressed]}
              >
                <Text style={s.countryFlag}>{item.flag}</Text>
                <Text style={s.countryName}>{item.name}</Text>
                <ChevronRight size={18} color={colors.stone[300]} />
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={s.separator} />}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Provider Picker
  return (
    <SafeAreaView style={s.screen} edges={["bottom"]}>
      <View style={s.container}>
        <Pressable
          onPress={() => {
            setSelectedCountry(null);
            setSearch("");
          }}
          style={s.backBtn}
        >
          <Text style={s.backText}>
            {selectedCountry.flag} {selectedCountry.name}
          </Text>
          <Text style={s.changeText}>Change</Text>
        </Pressable>

        <View style={s.searchBox}>
          <Search size={18} color={colors.stone[400]} />
          <TextInput
            style={s.searchInput}
            placeholder="Search banks..."
            placeholderTextColor={colors.stone[400]}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {isLoading ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[600]} />
            <Text style={s.loadingText}>Loading banks...</Text>
          </View>
        ) : error ? (
          <View style={s.emptyContainer}>
            <Text style={s.emptyText}>Unable to load banks</Text>
            <Text style={s.emptySubtext}>
              Check your connection and try again
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={s.emptyContainer}>
            <Text style={s.emptyText}>No banks found</Text>
            <Text style={s.emptySubtext}>
              Try a different search or country
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.provider_id}
            contentContainerStyle={s.listContent}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectProvider(item)}
                disabled={connectBank.isPending}
                style={({ pressed }) => [
                  s.institutionRow,
                  pressed && s.pressed,
                ]}
              >
                {item.logo_url ? (
                  <Image
                    source={{ uri: item.logo_url }}
                    style={s.instLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={[s.instLogo, s.instLogoPlaceholder]}>
                    <Text style={s.instLogoInitial}>
                      {item.display_name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View style={s.instInfo}>
                  <Text style={s.instName} numberOfLines={1}>
                    {item.display_name}
                  </Text>
                  <Text style={s.instDays}>
                    {(item.scopes ?? []).includes("transactions")
                      ? "Transaction history available"
                      : "Account info only"}
                  </Text>
                </View>
                {connectBank.isPending ? (
                  <ActivityIndicator size="small" color={colors.primary[500]} />
                ) : (
                  <ChevronRight size={18} color={colors.stone[300]} />
                )}
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={s.separator} />}
          />
        )}

        <View style={s.disclaimer}>
          <Shield size={14} color={colors.stone[400]} />
          <Text style={s.disclaimerText}>
            Secured by TrueLayer with PSD2 open banking. We never see or store
            your bank credentials.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", paddingTop: 16, paddingBottom: 24 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.stone[900],
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.stone[400],
  },
  listContent: {
    paddingBottom: 16,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 14,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.stone[900],
  },
  pressed: { opacity: 0.7 },
  separator: { height: 2 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary[50],
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary[600],
  },
  changeText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary[500],
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.stone[900],
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.stone[400],
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.stone[500],
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: colors.stone[400],
  },
  institutionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
  },
  instLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 14,
  },
  instLogoPlaceholder: {
    backgroundColor: colors.stone[200],
    alignItems: "center",
    justifyContent: "center",
  },
  instLogoInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[500],
  },
  instInfo: { flex: 1 },
  instName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
  },
  instDays: {
    marginTop: 2,
    fontSize: 12,
    color: colors.stone[400],
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: colors.stone[400],
    lineHeight: 16,
  },
});
