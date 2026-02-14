import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

function getGreeting(t: any) {
  const hour = new Date().getHours();
  if (hour < 12) return t.goodMorning;
  if (hour < 17) return t.goodAfternoon;
  return t.goodEvening;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  onPress: () => void;
}

function FeatureCard({ icon, label, color, bgColor, onPress }: FeatureCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={[styles.cardIcon, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      <Text style={styles.cardLabel} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { user } = useAuth();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const features = [
    {
      icon: <Ionicons name="cloud" size={28} color="#1565C0" />,
      label: t.weather,
      color: "#1565C0",
      bgColor: "#E3F2FD",
      route: "/weather",
    },
    {
      icon: <MaterialCommunityIcons name="bug" size={28} color="#E65100" />,
      label: t.pestDetection,
      color: "#E65100",
      bgColor: "#FFF3E0",
      route: "/pest",
    },
    {
      icon: <MaterialCommunityIcons name="robot" size={28} color={Colors.light.primary} />,
      label: t.aiChat,
      color: Colors.light.primary,
      bgColor: "#E8F5E9",
      route: "/chat",
    },
    {
      icon: <Ionicons name="trending-up" size={28} color="#6A1B9A" />,
      label: t.marketPrices,
      color: "#6A1B9A",
      bgColor: "#F3E5F5",
      route: "/market",
    },
    {
      icon: <Ionicons name="wallet" size={28} color="#F57F17" />,
      label: t.expenses,
      color: "#F57F17",
      bgColor: "#FFFDE7",
      route: "/expenses",
    },
    {
      icon: <Feather name="user" size={28} color="#00695C" />,
      label: t.profile,
      color: "#00695C",
      bgColor: "#E0F2F1",
      route: "/profile",
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <LinearGradient
        colors={[Colors.light.primaryDark, Colors.light.primary]}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting(t)}</Text>
            <Text style={styles.userName}>
              {user?.name || t.farmer}
            </Text>
          </View>
          <Pressable
            style={styles.profileBtn}
            onPress={() => router.push("/profile")}
          >
            <Feather name="user" size={22} color={Colors.light.primary} />
          </Pressable>
        </View>

        <View style={styles.weatherPreview}>
          <Ionicons name="partly-sunny" size={20} color="rgba(255,255,255,0.9)" />
          <Text style={styles.weatherText}>28°C, Partly Cloudy</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: insets.bottom + webBottomInset + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {features.map((f, i) => (
          <FeatureCard
            key={i}
            icon={f.icon}
            label={f.label}
            color={f.color}
            bgColor={f.bgColor}
            onPress={() => router.push(f.route as any)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  weatherPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 8,
  },
  weatherText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#fff",
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 20,
    gap: 14,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
    textAlign: "center",
  },
});
