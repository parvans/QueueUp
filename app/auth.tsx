import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const [role, setRole] = useState<"customer" | "business">("customer");
  const [mode, setMode] = useState<"signin" | "register">("signin");

  // Form states
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("parvan.k@example.com");
  const [password, setPassword] = useState("secretpass123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Animated sliding pill for role segment
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleRoleChange = (newRole: "customer" | "business") => {
    if (newRole === role) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Haptics fallback
    }
    setRole(newRole);

    Animated.spring(slideAnim, {
      toValue: newRole === "customer" ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();

    // Set appropriate mock defaults matching Stitch design
    if (newRole === "customer") {
      setEmail("parvan.k@example.com");
      setPassword("secretpass123");
    } else {
      setEmail("dr.martinez@citycareclinic.com");
      setPassword("ClinicAdmin#2025");
    }
  };

  const handleModeToggle = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    setMode(mode === "signin" ? "register" : "signin");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      `A password reset link has been dispatched to ${email || "your email address"}.`,
      [{ text: "OK" }]
    );
  };

  const handleAuthSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Required", "Please provide a valid email address.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Required", "Please enter your password.");
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics fallback
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (role === "customer") {
        router.replace("/(customer)/home" as any);
      } else {
        router.replace("/(business)/dashboard" as any);
      }
    }, 700);
  };

  const handleGoogleAuth = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics fallback
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === "customer") {
        router.replace("/(customer)/home" as any);
      } else {
        router.replace("/(business)/dashboard" as any);
      }
    }, 700);
  };

  const [segmentWidth, setSegmentWidth] = useState(0);

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8FF]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-4 sm:px-6 py-4"
        >
          {/* Main Central Capsule Card */}
          <View className="w-full max-w-md mx-auto bg-white rounded-[28px] p-6 border border-[#E2E7FF] shadow-lg shadow-blue-900/5">
            {/* Brand Header Inside Capsule */}
            <View className="flex-row items-center gap-3.5 pb-5 border-b border-[#EAEDFF]">
              <View className="w-12 h-12 rounded-xl bg-[#FAF8FF] border border-[#E2E7FF] p-1.5 items-center justify-center shadow-xs">
                <Image
                  source={require("../assets/images/queueup-logo.png")}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[22px] font-bold text-[#131B2E] tracking-tight leading-none">
                  QueueUp
                </Text>
                <Text className="text-[13px] font-medium text-[#434655] mt-1 leading-tight">
                  Skip the wait, join virtually
                </Text>
              </View>
            </View>

            {/* Segmented Role Pill */}
            <View className="w-full my-5">
              <View
                onLayout={(e) => setSegmentWidth(e.nativeEvent.layout.width)}
                className="relative bg-[#EAEDFF] p-[3px] rounded-full flex-row items-center h-[42px]"
              >
                {/* Sliding White Active Pill */}
                {segmentWidth > 0 && (
                  <Animated.View
                    style={{
                      position: "absolute",
                      left: 3,
                      top: 3,
                      bottom: 3,
                      width: (segmentWidth - 6) / 2,
                      transform: [
                        {
                          translateX: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (segmentWidth - 6) / 2],
                          }),
                        },
                      ],
                    }}
                    className="bg-white rounded-full shadow-sm"
                  />
                )}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleRoleChange("customer")}
                  className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-full z-10"
                >
                  <Ionicons
                    name="person"
                    size={15}
                    color={role === "customer" ? "#131B2E" : "#434655"}
                  />
                  <Text
                    className={`text-[13px] ${role === "customer"
                        ? "font-bold text-[#131B2E]"
                        : "font-semibold text-[#434655]"
                      }`}
                  >
                    Customer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleRoleChange("business")}
                  className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-full z-10"
                >
                  <Ionicons
                    name="storefront"
                    size={15}
                    color={role === "business" ? "#131B2E" : "#434655"}
                  />
                  <Text
                    className={`text-[13px] ${role === "business"
                        ? "font-bold text-[#131B2E]"
                        : "font-semibold text-[#434655]"
                      }`}
                  >
                    Business / Staff
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Portal Badge & Headers */}
            <View className="mb-5">
              {role === "customer" ? (
                <View className="self-start flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DBE1FF] mb-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <Text className="text-[11px] font-bold text-primary tracking-wide">
                    PASSHOLDER PORTAL
                  </Text>
                </View>
              ) : (
                <View className="self-start flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200/80 mb-2">
                  <Ionicons name="shield-checkmark" size={12} color="#334155" />
                  <Text className="text-[11px] font-bold text-slate-700 tracking-wide">
                    STAFF CONSOLE
                  </Text>
                </View>
              )}

              <Text className="text-[24px] font-bold text-[#131B2E] tracking-tight leading-snug">
                {mode === "signin"
                  ? "Sign In to QueueUp"
                  : role === "customer"
                    ? "Create Customer Account"
                    : "Register Your Facility"}
              </Text>
              <Text className="text-[13.5px] text-[#434655] mt-1 leading-relaxed">
                {mode === "signin"
                  ? "Sign in to access your active queue passes and live counter pacing."
                  : role === "customer"
                    ? "Join queues remotely, track live positions, and eliminate waiting room stress."
                    : "Deploy digital ticketing, assign counter stations, and pace service volume."}
              </Text>
            </View>

            {/* Inputs Group Container */}
            <View className="bg-[#FAF8FF] border border-[#E2E7FF] rounded-2xl overflow-hidden divide-y divide-[#EAEDFF] mb-4">
              {/* Optional Registration Fields */}
              {mode === "register" && (
                <View className="flex-row items-center px-4 py-2.5 bg-white/70">
                  <Ionicons
                    name="person-outline"
                    size={19}
                    color="#434655"
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <Text className="text-[11px] font-medium text-[#434655] mb-0.5">
                      Full Name
                    </Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder={
                        role === "customer"
                          ? "e.g., Parvan Kumar"
                          : "e.g., Dr. Sarah Martinez"
                      }
                      placeholderTextColor="#94A3B8"
                      className="text-[15px] text-[#131B2E] font-normal p-0"
                    />
                  </View>
                </View>
              )}

              {mode === "register" && role === "business" && (
                <View className="flex-row items-center px-4 py-2.5 bg-white/70">
                  <Ionicons
                    name="business-outline"
                    size={19}
                    color="#434655"
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <Text className="text-[11px] font-medium text-[#434655] mb-0.5">
                      Facility or Business Name
                    </Text>
                    <TextInput
                      value={organization}
                      onChangeText={setOrganization}
                      placeholder="e.g., City Care Clinic"
                      placeholderTextColor="#94A3B8"
                      className="text-[15px] text-[#131B2E] font-normal p-0"
                    />
                  </View>
                </View>
              )}

              {/* Email Row */}
              <View className="flex-row items-center px-4 py-2.5 bg-white/70">
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color="#434655"
                  style={{ marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className="text-[11px] font-medium text-[#434655] mb-0.5">
                    Email Address
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder={
                      role === "customer"
                        ? "name@example.com"
                        : "staff@organization.com"
                    }
                    placeholderTextColor="#94A3B8"
                    className="text-[15px] text-[#131B2E] font-normal p-0"
                  />
                </View>
              </View>

              {/* Password Row */}
              <View className="flex-row items-center px-4 py-2.5 bg-white/70">
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color="#434655"
                  style={{ marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className="text-[11px] font-medium text-[#434655] mb-0.5">
                    Password
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Required"
                    placeholderTextColor="#94A3B8"
                    className="text-[15px] text-[#131B2E] font-normal p-0"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="p-1"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={19}
                    color="#434655"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Options Row (Remember me & Forgot Password) */}
            {mode === "signin" && (
              <View className="flex-row items-center justify-between px-1 mb-4">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center gap-2"
                >
                  <View
                    className={`w-4 h-4 rounded border items-center justify-center ${rememberMe
                        ? "bg-primary border-primary"
                        : "border-[#CBD5E1] bg-white"
                      }`}
                  >
                    {rememberMe && (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <Text className="text-[13px] text-[#131B2E] font-medium">
                    Remember me
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleForgotPassword}
                >
                  <Text className="text-[13px] font-semibold text-primary">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Primary Submit Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleAuthSubmit}
              className="w-full h-12 bg-primary rounded-[14px] flex-row items-center justify-center gap-2 shadow-sm shadow-blue-500/20 active:bg-blue-700"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-[15px] font-semibold text-white">
                    {mode === "signin" ? "Sign In" : "Create Account"}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Social Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-[#EAEDFF]" />
              <Text className="px-3 text-[11px] font-semibold text-[#434655] tracking-wider">
                OR
              </Text>
              <View className="flex-1 h-[1px] bg-[#EAEDFF]" />
            </View>

            {/* Continue with Google */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleGoogleAuth}
              className="w-full h-12 rounded-[14px] bg-[#FAF8FF] border border-[#E2E7FF] flex-row items-center justify-center gap-2.5 px-4 shadow-2xs active:bg-white"
            >
              <Ionicons name="logo-google" size={17} color="#4285F4" />
              <Text className="text-[14px] font-semibold text-[#131B2E]">
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Helper Text / Toggle Sign In & Register */}
          <View className="mt-5 mb-3 items-center justify-center w-full">
            <View className="flex-row items-center gap-1">
              <Text className="text-[13px] text-[#434655]">
                {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </Text>
              <TouchableOpacity
                onPress={handleModeToggle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text className="text-[13px] text-primary font-bold">
                  {mode === "signin" ? "Create one" : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
