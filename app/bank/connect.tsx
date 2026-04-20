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
import { colors, radius } from "@/lib/theme";

export default function BankConnectScreen() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [search, setSearch] = useState("");

  const { data: providers, isLoading, error } = useProviders(
    selectedCountry?.code ?? ""
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
        country: provider.country ?? selectedCountry?.code ?? null,
        aspsp_name: provider.aspsp_name ?? provider.display_name,
        aspsp_country: provider.aspsp_country ?? selectedCountry?.code ?? 'GB',
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
              <Globe size={32} color={colors.accent.yellow} />
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
                <ChevronRight size={18} color={colors.muted} />
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
          <Search size={18} color={colors.muted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search banks..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {isLoading ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent.yellow} />
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
                  <ActivityIndicator size="small" color={colors.accent.yellow} />
                ) : (
                  <ChevronRight size={18} color={colors.muted} />
                )}
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={s.separator} />}
          />
        )}

        <View style={s.disclaimer}>
          <Shield size={14} color={colors.muted} />
          <Text style={s.disclaimerText}>
            Secured by Enable Banking with PSD2 open banking. We never see or
            store your bank credentials.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", paddingTop: 16, paddingBottom: 24 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "Syne_800ExtraBold",
    letterSpacing: -0.56,
    color: colors.foreground,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    lineHeight: 21,
    color: colors.muted,
  },
  listContent: {
    paddingBottom: 16,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 14,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Syne_400Regular",
    color: colors.foreground,
  },
  pressed: { opacity: 0.85 },
  separator: { height: 2 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    fontSize: 14,
    fontFamily: "Syne_600SemiBold",
    color: colors.accent.yellow,
  },
  changeText: {
    fontSize: 13,
    fontFamily: "Syne_400Regular",
    color: colors.accent.yellow,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.foreground,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Syne_600SemiBold",
    color: colors.muted,
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
  },
  institutionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 14,
  },
  instLogoPlaceholder: {
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  instLogoInitial: {
    fontSize: 18,
    fontFamily: "Syne_700Bold",
    color: colors.muted,
  },
  instInfo: { flex: 1 },
  instName: {
    fontSize: 14,
    fontFamily: "Syne_600SemiBold",
    color: colors.foreground,
  },
  instDays: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
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
    fontFamily: "Syne_400Regular",
    color: colors.muted,
    lineHeight: 16,
  },
});
