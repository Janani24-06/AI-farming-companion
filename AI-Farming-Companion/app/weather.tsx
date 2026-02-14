import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Platform, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "@/lib/LanguageContext";
import Colors from "@/constants/colors";

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  condition: string;
  location: string;
}

function WeatherCard({ icon, label, value, unit, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <View style={styles.weatherCard}>
      <View style={[styles.weatherCardIcon, { backgroundColor: color + "20" }]}>
        {icon}
      </View>
      <Text style={styles.weatherLabel}>{label}</Text>
      <Text style={styles.weatherValue}>
        {value}<Text style={styles.weatherUnit}>{unit}</Text>
      </Text>
    </View>
  );
}

export default function WeatherScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setWeather({
        temp: 28,
        feelsLike: 32,
        humidity: 72,
        windSpeed: 14,
        rainChance: 45,
        condition: "Partly Cloudy",
        location: "Chennai, Tamil Nadu",
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.weather}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : weather ? (
        <View style={styles.content}>
          <LinearGradient
            colors={["#1565C0", "#42A5F5"]}
            style={styles.mainCard}
          >
            <Text style={styles.locationText}>{weather.location}</Text>
            <View style={styles.tempRow}>
              <Ionicons name="partly-sunny" size={56} color="#FFD54F" />
              <View style={styles.tempInfo}>
                <Text style={styles.tempBig}>{weather.temp}°C</Text>
                <Text style={styles.conditionText}>{weather.condition}</Text>
              </View>
            </View>
            <Text style={styles.feelsLike}>
              {t.feelsLike}: {weather.feelsLike}°C
            </Text>
          </LinearGradient>

          <View style={styles.gridRow}>
            <WeatherCard
              icon={<Ionicons name="water" size={24} color="#1565C0" />}
              label={t.humidity}
              value={weather.humidity.toString()}
              unit="%"
              color="#1565C0"
            />
            <WeatherCard
              icon={<Feather name="wind" size={24} color="#00838F" />}
              label={t.wind}
              value={weather.windSpeed.toString()}
              unit=" km/h"
              color="#00838F"
            />
          </View>
          <View style={styles.gridRow}>
            <WeatherCard
              icon={<Ionicons name="rainy" size={24} color="#5C6BC0" />}
              label={t.rain}
              value={weather.rainChance.toString()}
              unit="%"
              color="#5C6BC0"
            />
            <WeatherCard
              icon={<MaterialCommunityIcons name="thermometer" size={24} color="#E65100" />}
              label={t.feelsLike}
              value={weather.feelsLike.toString()}
              unit="°C"
              color="#E65100"
            />
          </View>

          <View style={styles.apiNote}>
            <Ionicons name="information-circle" size={18} color={Colors.light.textLight} />
            <Text style={styles.apiNoteText}>
              Connect OpenWeather API for live data
            </Text>
          </View>
        </View>
      ) : null}

      <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 16 }} />
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
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  tempInfo: {
    flex: 1,
  },
  tempBig: {
    fontSize: 48,
    fontFamily: "Nunito_800ExtraBold",
    color: "#fff",
  },
  conditionText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(255,255,255,0.9)",
  },
  feelsLike: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  weatherCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  weatherCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  weatherLabel: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  weatherUnit: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
  },
  apiNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  apiNoteText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
  },
});
