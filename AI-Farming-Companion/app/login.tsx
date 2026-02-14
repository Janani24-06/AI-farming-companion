import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Platform, Alert, KeyboardAvoidingView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/AuthContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert("Invalid", "Please enter a valid 10-digit phone number");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setOtpSent(true);
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      Alert.alert("Invalid", "Please enter the 4-digit OTP");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    await login(phone);
    setLoading(false);
    router.replace("/language");
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.primaryLight]}
          style={styles.header}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="leaf" size={40} color="#fff" />
          </View>
          <Text style={styles.appName}>ANTHAATHI</Text>
          <Text style={styles.appSub}>AI Farming Companion</Text>
        </LinearGradient>

        <View style={styles.formArea}>
          <Text style={styles.formTitle}>
            {otpSent ? "Verify OTP" : "Phone Login"}
          </Text>
          <Text style={styles.formDesc}>
            {otpSent
              ? "Enter the 4-digit code sent to your phone"
              : "Enter your phone number to get started"}
          </Text>

          {!otpSent ? (
            <View style={styles.inputRow}>
              <View style={styles.prefixBox}>
                <Text style={styles.prefix}>+91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={Colors.light.textLight}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          ) : (
            <View style={styles.otpRow}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={styles.otpBox}>
                  <Text style={styles.otpDigit}>{otp[i] || ""}</Text>
                </View>
              ))}
              <TextInput
                style={styles.hiddenInput}
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                autoFocus
              />
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
            onPress={otpSent ? handleVerifyOtp : handleSendOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>

          {otpSent && (
            <Pressable onPress={() => setOtpSent(false)} style={styles.resend}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </Pressable>
          )}

          <Text style={styles.demoNote}>
            Demo: Any phone + any 4-digit OTP works
          </Text>
        </View>

        <View style={{ height: Platform.OS === "web" ? 34 : insets.bottom + 16 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingVertical: 48,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontFamily: "Nunito_800ExtraBold",
    color: "#fff",
    letterSpacing: 3,
  },
  appSub: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },
  formArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  formDesc: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textSecondary,
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  prefixBox: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  prefix: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    fontSize: 18,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.text,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: Colors.light.border,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
    position: "relative",
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  otpDigit: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: Colors.light.text,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  resend: {
    alignSelf: "center",
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: Colors.light.primary,
  },
  demoNote: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: Colors.light.textLight,
  },
});
