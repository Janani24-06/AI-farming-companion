import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, TextInput, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/lib/LanguageContext";
import Colors from "@/constants/colors";

interface MarketPrice {
  id: string;
  crop: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
}

const SAMPLE_PRICES: MarketPrice[] = [
  { id: "1", crop: "Rice (Paddy)", market: "Koyambedu", minPrice: 2100, maxPrice: 2350, modalPrice: 2200 },
  { id: "2", crop: "Wheat", market: "Chennai", minPrice: 2500, maxPrice: 2800, modalPrice: 2650 },
  { id: "3", crop: "Tomato", market: "Madurai", minPrice: 800, maxPrice: 1200, modalPrice: 1000 },
  { id: "4", crop: "Onion", market: "Koyambedu", minPrice: 1500, maxPrice: 2000, modalPrice: 1750 },
  { id: "5", crop: "Potato", market: "Salem", minPrice: 1200, maxPrice: 1600, modalPrice: 1400 },
  { id: "6", crop: "Cotton", market: "Coimbatore", minPrice: 6200, maxPrice: 6800, modalPrice: 6500 },
  { id: "7", crop: "Sugarcane", market: "Tiruchirappalli", minPrice: 3100, maxPrice: 3500, modalPrice: 3300 },
  { id: "8", crop: "Groundnut", market: "Villupuram", minPrice: 5500, maxPrice: 6200, modalPrice: 5800 },
  { id: "9", crop: "Turmeric", market: "Erode", minPrice: 8000, maxPrice: 9500, modalPrice: 8700 },
  { id: "10", crop: "Banana", market: "Theni", minPrice: 600, maxPrice: 900, modalPrice: 750 },
  { id: "11", crop: "Coconut", market: "Pollachi", minPrice: 2800, maxPrice: 3200, modalPrice: 3000 },
  { id: "12", crop: "Chilli", market: "Guntur", minPrice: 12000, maxPrice: 15000, modalPrice: 13500 },
];

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const filtered = useMemo(() => {
    if (!search.trim()) return SAMPLE_PRICES;
    const q = search.toLowerCase();
    return SAMPLE_PRICES.filter(
      (p) => p.crop.toLowerCase().includes(q) || p.market.toLowerCase().includes(q)
    );
  }, [search]);

  const renderItem = ({ item }: { item: MarketPrice }) => (
    <View style={styles.priceCard}>
      <View style={styles.priceHeader}>
        <View style={styles.cropBadge}>
          <Ionicons name="leaf" size={14} color={Colors.light.primary} />
        </View>
        <View style={styles.cropInfo}>
          <Text style={styles.cropName}>{item.crop}</Text>
          <Text style={styles.marketName}>{item.market}</Text>
        </View>
      </View>
      <View style={styles.priceRow}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Min</Text>
          <Text style={styles.priceValue}>{item.minPrice}</Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Modal</Text>
          <Text style={[styles.priceValue, styles.modalPrice]}>{item.modalPrice}</Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Max</Text>
          <Text style={styles.priceValue}>{item.maxPrice}</Text>
        </View>
      </View>
      <Text style={styles.perUnit}>{t.pricePerQuintal} (INR)</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.marketPrices}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color={Colors.light.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder={t.searchCrop}
          placeholderTextColor={Colors.light.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color={Colors.light.textLight} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search" size={40} color={Colors.light.textLight} />
            <Text style={styles.emptyText}>{t.noResults}</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.apiNote}>
            <Ionicons name="information-circle" size={16} color={Colors.light.textLight} />
            <Text style={styles.apiNoteText}>Sample data - Connect AGMARKNET API for live prices</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.text,
  },
  priceCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  priceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  cropBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  marketName: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceCol: {
    flex: 1,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  modalPrice: {
    color: Colors.light.primary,
  },
  priceDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
  },
  perUnit: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
    textAlign: "center",
    marginTop: 10,
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.textSecondary,
  },
  apiNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  apiNoteText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
  },
});
