import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLanguage } from "@/lib/LanguageContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

interface AnalysisResult {
  disease: string;
  cause: string;
  treatment: string;
  prevention: string;
}

export default function PestScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const pickImage = async (useCamera: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let pickerResult;

    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") return;
      pickerResult = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: true,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        quality: 0.7,
        allowsEditing: true,
      });
    }

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setImageUri(pickerResult.assets[0].uri);
      setResult(null);
      analyzeImage();
    }
  };

  const analyzeImage = async () => {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setResult({
      disease: "Leaf Blight (Helminthosporium)",
      cause: "Fungal infection caused by high humidity and warm temperatures. Spores spread through wind and rain.",
      treatment: "Apply Mancozeb 75% WP at 2.5g/L or Propiconazole 25% EC at 1ml/L. Spray at 10-day intervals. Remove severely infected leaves.",
      prevention: "Use resistant varieties. Maintain proper spacing between plants. Avoid overhead irrigation. Apply preventive fungicide during monsoon season.",
    });
    setAnalyzing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.pestDetection}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }}
        showsVerticalScrollIndicator={false}
      >
        {!imageUri ? (
          <View style={styles.uploadArea}>
            <View style={styles.uploadIcon}>
              <MaterialCommunityIcons name="image-search" size={48} color={Colors.light.primary} />
            </View>
            <Text style={styles.uploadTitle}>{t.uploadImage}</Text>
            <Text style={styles.uploadDesc}>
              Take a photo or pick from gallery to detect crop diseases
            </Text>

            <View style={styles.buttonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.cameraBtn,
                  { transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
                onPress={() => pickImage(true)}
              >
                <Ionicons name="camera" size={22} color="#fff" />
                <Text style={styles.actionBtnText}>{t.takePhoto}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.galleryBtn,
                  { transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
                onPress={() => pickImage(false)}
              >
                <Ionicons name="images" size={22} color={Colors.light.primary} />
                <Text style={[styles.actionBtnText, { color: Colors.light.primary }]}>{t.pickGallery}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
              <Pressable
                style={styles.retakeBtn}
                onPress={() => {
                  setImageUri(null);
                  setResult(null);
                }}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </Pressable>
            </View>

            {analyzing ? (
              <View style={styles.analyzingWrap}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.analyzingText}>{t.analyzing}</Text>
              </View>
            ) : result ? (
              <View style={styles.resultArea}>
                <ResultCard
                  icon={<MaterialCommunityIcons name="virus" size={22} color="#D32F2F" />}
                  label={t.disease}
                  value={result.disease}
                  bgColor="#FFEBEE"
                />
                <ResultCard
                  icon={<Ionicons name="help-circle" size={22} color="#E65100" />}
                  label={t.cause}
                  value={result.cause}
                  bgColor="#FFF3E0"
                />
                <ResultCard
                  icon={<MaterialCommunityIcons name="medical-bag" size={22} color="#1565C0" />}
                  label={t.treatment}
                  value={result.treatment}
                  bgColor="#E3F2FD"
                />
                <ResultCard
                  icon={<Ionicons name="shield-checkmark" size={22} color={Colors.light.primary} />}
                  label={t.prevention}
                  value={result.prevention}
                  bgColor="#E8F5E9"
                />
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ResultCard({ icon, label, value, bgColor }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}) {
  return (
    <View style={[resultStyles.card, { backgroundColor: bgColor }]}>
      <View style={resultStyles.cardHeader}>
        {icon}
        <Text style={resultStyles.cardLabel}>{label}</Text>
      </View>
      <Text style={resultStyles.cardValue}>{value}</Text>
    </View>
  );
}

const resultStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  cardValue: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
});

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
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  uploadArea: {
    alignItems: "center",
    paddingTop: 40,
  },
  uploadIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  uploadDesc: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  buttonRow: {
    gap: 12,
    width: "100%",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  cameraBtn: {
    backgroundColor: Colors.light.primary,
  },
  galleryBtn: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  actionBtnText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
  },
  retakeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  analyzingWrap: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  analyzingText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.textSecondary,
  },
  resultArea: {
    gap: 0,
  },
});
