import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
  Modal,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  // Interactive UI States
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English (US)");
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState<boolean>(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // Pulsing animation for active pass dot
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Handlers
  const handleToggleNotifications = (value: boolean) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    setNotificationsEnabled(value);
  };

  const handleSelectTheme = (theme: "light" | "dark") => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    setSelectedTheme(theme);
    if (theme === "dark") {
      Alert.alert(
        "Theme Preference",
        "Dark mode preview is enabled. System theme follows your device settings."
      );
    }
  };

  const handleSelectLanguage = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    Alert.alert(
      "Select Language",
      "Choose your preferred clinical consultation language:",
      [
        {
          text: "English (US) ✓",
          onPress: () => setSelectedLanguage("English (US)"),
        },
        {
          text: "Español (Spanish)",
          onPress: () => setSelectedLanguage("Español"),
        },
        {
          text: "Français (French)",
          onPress: () => setSelectedLanguage("Français"),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleLocationAccess = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    Alert.alert(
      "Location Access",
      "Precise location is set to 'While Using App' to calculate your travel distance to clinics and ETA.",
      [{ text: "OK" }]
    );
  };

  const handleChangePassword = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    Alert.alert(
      "Reset Password",
      "A secure verification link has been sent to parvan.k@example.com to update your password.",
      [{ text: "Done" }]
    );
  };

  const handleReportProblem = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    Alert.alert(
      "Report a Problem",
      "Please describe any queue discrepancy or technical issue. Our support team will investigate within 15 minutes.",
      [
        {
          text: "Submit Diagnostic Report",
          onPress: () => {
            Alert.alert("Report Received", "Thank you. Diagnostic report #REP-4402 recorded.");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleOpenLegal = (title: string, content: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    Alert.alert(title, content, [{ text: "Close" }]);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {}
    setTimeout(() => {
      setIsLogoutModalVisible(false);
      setIsLoggingOut(false);
      router.replace("/auth" as any);
    }, 700);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* 1. Header matching Stitch Screen 16 */}
      <View className="h-16 px-4 bg-white/80 border-b border-[#E2E8F0] flex-row items-center justify-between z-30">
        <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
          <Image
            source={require("@/assets/images/queueup-logo.png")}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />

          <View className="flex-row items-center gap-1.5 min-w-0">
            <Text className="text-base font-bold text-[#004AC6] tracking-tight">QueueUp</Text>
            <Text className="text-xs text-[#CBD5E1] font-semibold">/</Text>
            <Text numberOfLines={1} className="text-base font-semibold text-[#131B2E] truncate">
              Profile
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1 shrink-0">
          <TouchableOpacity
            accessibilityLabel="Notifications"
            activeOpacity={0.7}
            onPress={() => router.push("/notifications" as any)}
            className="w-10 h-10 rounded-full items-center justify-center relative active:bg-[#EAEDFF]"
          >
            <Ionicons name="notifications-outline" size={20} color="#434655" />
            <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444] border border-white" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Account Settings"
            activeOpacity={0.7}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              } catch {}
              Alert.alert(
                "Account Settings",
                "QueueUp Patient Profile is active. All sync preferences are up to date."
              );
            }}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="settings-outline" size={20} color="#434655" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 28,
        }}
        className="flex-1"
      >
        <View className="flex-col gap-4 w-full">
          {/* 2. Hero Profile Card */}
          <View
            className="relative overflow-hidden rounded-2xl bg-white p-4 border border-[#E2E8F0]"
            style={styles.cardShadow}
          >
            {/* Ambient Background Glow */}
            <View className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-[#004AC6]/5 pointer-events-none" />

            <View className="flex-row items-start justify-between relative z-10">
              <View className="flex-row items-center gap-3.5 flex-1 mr-2">
                {/* Avatar with Verified Badge */}
                <View className="relative">
                  <Image
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP7Mhp8njaAt7djKEMf8JNItOl0rBLuAaL8_lss-VTEEr01LSk_sFaYbmqT10_Nqo_frko4IKS1Y-ak5lzzJJpajhi8PcPDv39CfwrxbixW9QZ3JtAxR2-HWYaLdvYcPe6r6XeLv3KO7tJxNZ11cJiSpyBAOay-hMtXdky0YVopIDRnpdfx3gwAEzfcD_Twl09mbD2iDmC4LxtHgGHeTpJJpm540Q6KlcEWrlhFIwgB6meYhEu_BIsfg",
                    }}
                    className="w-16 h-16 rounded-full bg-[#EAEDFF]"
                    resizeMode="cover"
                  />
                  <View
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#004AC6] items-center justify-center border-2 border-white"
                    style={styles.buttonShadow}
                  >
                    <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                  </View>
                </View>

                {/* Identity Information */}
                <View className="flex-col flex-1 min-w-0">
                  <View className="flex-row items-center gap-1.5">
                    <Text numberOfLines={1} className="text-lg font-bold text-[#131B2E] truncate">
                      Parvan Kumar
                    </Text>
                    <View className="rounded-full bg-[#EAEDFF] px-2 py-0.5">
                      <Text className="text-[10px] font-bold text-[#004AC6] tracking-wide">
                        PLUS
                      </Text>
                    </View>
                  </View>
                  <Text numberOfLines={1} className="text-xs text-[#737686] truncate mt-0.5">
                    parvan.k@example.com
                  </Text>
                  <Text numberOfLines={1} className="text-xs text-[#737686] truncate mt-0.5">
                    +1 (555) 019-2834
                  </Text>
                </View>
              </View>

              {/* Edit Profile Action Button */}
              <TouchableOpacity
                accessibilityLabel="Edit Profile"
                activeOpacity={0.8}
                onPress={() => router.push("/(customer)/edit-profile" as any)}
                className="w-11 h-11 rounded-full bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
              >
                <Ionicons name="create-outline" size={20} color="#004AC6" />
              </TouchableOpacity>
            </View>

            {/* 3-Column Metrics Grid */}
            <View className="mt-4 flex-row items-center justify-between rounded-xl bg-[#F2F3FF] p-2 text-center">
              {/* Col 1: Queues */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(customer)/history" as any)}
                className="flex-1 items-center justify-center py-1"
              >
                <Text className="text-base font-bold text-[#004AC6]">14</Text>
                <Text className="text-[10px] font-bold text-[#737686] mt-0.5 uppercase tracking-wider">
                  Queues
                </Text>
              </TouchableOpacity>

              {/* Col 2: Saved Time */}
              <View
                className="flex-1 items-center justify-center py-1.5 bg-white rounded-lg border border-[#E2E8F0]"
                style={styles.cardShadowSm}
              >
                <Text className="text-base font-bold text-[#007D55]">8.5 hrs</Text>
                <Text className="text-[10px] font-bold text-[#737686] mt-0.5 uppercase tracking-wider">
                  Saved
                </Text>
              </View>

              {/* Col 3: Active Pass */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(customer)/my-queues" as any)}
                className="flex-1 items-center justify-center py-1"
              >
                <View className="flex-row items-center gap-1.5">
                  <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-2 h-2 rounded-full bg-[#007D55]"
                  />
                  <Text className="text-base font-bold text-[#131B2E]">1</Text>
                </View>
                <Text className="text-[10px] font-bold text-[#737686] mt-0.5 uppercase tracking-wider">
                  Active Pass
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Section: Account & Security */}
          <View className="flex-col">
            <Text className="px-1 text-[11px] font-bold uppercase tracking-wider text-[#737686] mb-1.5">
              Account & Security
            </Text>

            <View
              className="overflow-hidden rounded-2xl bg-white border border-[#E2E8F0]"
              style={styles.cardShadowSm}
            >
              {/* Personal Information */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(customer)/edit-profile" as any)}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="person-outline" size={18} color="#004AC6" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Personal Information</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#737686" />
              </TouchableOpacity>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Phone & SMS Alerts */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(customer)/edit-profile" as any)}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1 mr-2">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="phone-portrait-outline" size={18} color="#004AC6" />
                  </View>
                  <View className="flex-col min-w-0 flex-1">
                    <Text className="text-sm font-semibold text-[#131B2E]">Phone & SMS Alerts</Text>
                    <Text className="text-xs text-[#737686] mt-0.5">+1 (555) 019-2834</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <View className="rounded-full bg-[#007D55]/10 px-2 py-0.5">
                    <Text className="text-[10px] font-bold text-[#007D55]">Verified</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#737686" />
                </View>
              </TouchableOpacity>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Email Address */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(customer)/edit-profile" as any)}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="mail-outline" size={18} color="#004AC6" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Email Address</Text>
                </View>
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Text className="text-xs text-[#737686]">parvan.k@...</Text>
                  <Ionicons name="chevron-forward" size={18} color="#737686" />
                </View>
              </TouchableOpacity>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Change Password */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleChangePassword}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="lock-closed-outline" size={18} color="#004AC6" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Change Password</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#737686" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Section: Preferences */}
          <View className="flex-col">
            <Text className="px-1 text-[11px] font-bold uppercase tracking-wider text-[#737686] mb-1.5">
              Preferences
            </Text>

            <View
              className="overflow-hidden rounded-2xl bg-white border border-[#E2E8F0]"
              style={styles.cardShadowSm}
            >
              {/* Notifications Toggle */}
              <View className="flex-row items-center justify-between p-3.5">
                <View className="flex-row items-center gap-3 min-w-0 flex-1 mr-2">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="notifications-outline" size={18} color="#3755C3" />
                  </View>
                  <View className="flex-col min-w-0 flex-1">
                    <Text className="text-sm font-semibold text-[#131B2E]">Notifications</Text>
                    <Text className="text-xs text-[#737686] mt-0.5">Sound, Banner & Haptics</Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  trackColor={{ false: "#CBD5E1", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Language Selection */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSelectLanguage}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="globe-outline" size={18} color="#3755C3" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Language</Text>
                </View>
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Text className="text-xs text-[#737686]">{selectedLanguage}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#737686" />
                </View>
              </TouchableOpacity>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Location Access */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLocationAccess}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="navigate-outline" size={18} color="#3755C3" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Location Access</Text>
                </View>
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Text className="text-xs text-[#737686]">While Using App</Text>
                  <Ionicons name="chevron-forward" size={18} color="#737686" />
                </View>
              </TouchableOpacity>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Theme Segmented Toggle */}
              <View className="flex-row items-center justify-between p-3.5">
                <View className="flex-row items-center gap-3 min-w-0 flex-1 mr-2">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="moon-outline" size={18} color="#3755C3" />
                  </View>
                  <View className="flex-col min-w-0 flex-1">
                    <Text className="text-sm font-semibold text-[#131B2E]">Theme</Text>
                    <Text className="text-xs text-[#737686] mt-0.5">
                      {selectedTheme === "light" ? "Light Mode Active" : "Dark Mode Active"}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center rounded-full bg-[#EAEDFF] p-1">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleSelectTheme("light")}
                    className="px-3 py-1 rounded-full"
                    style={selectedTheme === "light" ? styles.activeTabPill : undefined}
                  >
                    <Text
                      className={`text-xs ${
                        selectedTheme === "light"
                          ? "font-bold text-[#004AC6]"
                          : "font-medium text-[#737686]"
                      }`}
                    >
                      Light
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleSelectTheme("dark")}
                    className="px-3 py-1 rounded-full"
                    style={selectedTheme === "dark" ? styles.activeTabPill : undefined}
                  >
                    <Text
                      className={`text-xs ${
                        selectedTheme === "dark"
                          ? "font-bold text-[#004AC6]"
                          : "font-medium text-[#737686]"
                      }`}
                    >
                      Dark
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* 5. Section: Support & Feedback */}
          <View className="flex-col">
            <Text className="px-1 text-[11px] font-bold uppercase tracking-wider text-[#737686] mb-1.5">
              Support & Feedback
            </Text>

            <View
              className="overflow-hidden rounded-2xl bg-white border border-[#E2E8F0]"
              style={styles.cardShadowSm}
            >
              {/* Help Center & FAQs */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/help-support" as any)}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#007D55]/10 items-center justify-center shrink-0">
                    <Ionicons name="help-circle-outline" size={18} color="#007D55" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Help Center & FAQs</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#737686" />
              </TouchableOpacity>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Contact Support */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsSupportModalVisible(true)}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1 mr-2">
                  <View className="w-9 h-9 rounded-xl bg-[#007D55]/10 items-center justify-center shrink-0">
                    <Ionicons name="headset-outline" size={18} color="#007D55" />
                  </View>
                  <View className="flex-col min-w-0 flex-1">
                    <Text className="text-sm font-semibold text-[#131B2E]">Contact Support</Text>
                    <Text className="text-xs text-[#007D55] font-semibold mt-0.5">
                      24/7 Live Agent Available
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#737686" />
              </TouchableOpacity>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Report a Problem */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleReportProblem}
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#007D55]/10 items-center justify-center shrink-0">
                    <Ionicons name="warning-outline" size={18} color="#007D55" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Report a Problem</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#737686" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 6. Section: Legal */}
          <View className="flex-col">
            <Text className="px-1 text-[11px] font-bold uppercase tracking-wider text-[#737686] mb-1.5">
              Legal
            </Text>

            <View
              className="overflow-hidden rounded-2xl bg-white border border-[#E2E8F0]"
              style={styles.cardShadowSm}
            >
              {/* Terms & Conditions */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  handleOpenLegal(
                    "Terms & Conditions",
                    "QueueUp provides real-time virtual queue telemetry and check-in confirmation for healthcare facilities. Estimated wait times are advisory and subject to emergency prioritization."
                  )
                }
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="document-text-outline" size={18} color="#434655" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Terms & Conditions</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#737686" />
              </TouchableOpacity>

              <View className="h-px w-full bg-[#F2F3FF]" />

              {/* Privacy Policy */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  handleOpenLegal(
                    "Privacy Policy",
                    "Patient health telemetry, contact information, and ticket records are strictly protected under HIPAA-compliant guidelines with end-to-end TLS encryption."
                  )
                }
                className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
              >
                <View className="flex-row items-center gap-3 min-w-0 flex-1">
                  <View className="w-9 h-9 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0">
                    <Ionicons name="shield-checkmark-outline" size={18} color="#434655" />
                  </View>
                  <Text className="text-sm font-semibold text-[#131B2E]">Privacy Policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#737686" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 7. Logout CTA & Version Footer */}
          <View className="mt-3 flex-col items-center gap-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsLogoutModalVisible(true)}
              className="w-full h-12 rounded-xl bg-[#FFDAD6] active:bg-[#FFC0BB] flex-row items-center justify-center gap-2"
            >
              <Ionicons name="log-out-outline" size={19} color="#BA1A1A" />
              <Text className="text-sm font-bold text-[#BA1A1A]">Log Out of QueueUp</Text>
            </TouchableOpacity>

            <View className="flex-col items-center text-center mt-1">
              <Text className="text-xs text-[#737686]">QueueUp v2.4.0 (Build 384)</Text>
              <Text className="text-[11px] text-[#94A3B8] mt-0.5">Encrypted with 256-bit TLS</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 8. Logout Confirmation Modal */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsLogoutModalVisible(false)}
          className="flex-1 bg-black/50 items-center justify-center p-5"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl p-6 items-center text-center"
            style={styles.sheetShadow}
          >
            <View className="w-14 h-14 rounded-full bg-[#FFDAD6] items-center justify-center mb-3">
              <Ionicons name="log-out-outline" size={26} color="#BA1A1A" />
            </View>

            <Text className="text-lg font-bold text-[#131B2E] text-center mb-1">
              Log Out of QueueUp?
            </Text>
            <Text className="text-xs text-[#434655] text-center leading-relaxed mb-5">
              Are you sure you want to end your session? Your active queues and digital tickets will
              remain saved.
            </Text>

            <View className="w-full flex-col gap-2.5">
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isLoggingOut}
                onPress={handleConfirmLogout}
                className="w-full h-12 rounded-xl bg-[#BA1A1A] items-center justify-center"
                style={styles.buttonShadow}
              >
                <Text className="text-sm font-bold text-white">
                  {isLoggingOut ? "Logging out..." : "Log Out"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                disabled={isLoggingOut}
                onPress={() => setIsLogoutModalVisible(false)}
                className="w-full h-11 rounded-xl bg-[#F2F3FF] items-center justify-center active:bg-[#EAEDFF]"
              >
                <Text className="text-sm font-semibold text-[#131B2E]">Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 9. Contact Support Action Sheet Modal */}
      <Modal
        visible={isSupportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSupportModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsSupportModalVisible(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-lg mx-auto bg-white rounded-t-3xl p-5 overflow-hidden"
            style={styles.sheetShadow}
          >
            <View className="w-full items-center pb-3">
              <View className="w-12 h-1.5 bg-[#CBD5E1] rounded-full" />
            </View>

            <View className="flex-row items-center justify-between pb-3 border-b border-[#F2F3FF]">
              <View className="flex-row items-center gap-2">
                <View className="w-9 h-9 rounded-full bg-[#007D55]/15 items-center justify-center">
                  <Ionicons name="headset" size={18} color="#007D55" />
                </View>
                <View className="flex-col">
                  <Text className="text-base font-bold text-[#131B2E]">Contact Support</Text>
                  <Text className="text-xs text-[#007D55] font-semibold">Live Assistance 24/7</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setIsSupportModalVisible(false)}
                className="w-8 h-8 rounded-full bg-[#F2F3FF] items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#434655" />
              </TouchableOpacity>
            </View>

            <View className="flex-col gap-2.5 py-4">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsSupportModalVisible(false);
                  Alert.alert("Live Chat", "Connecting to a QueueUp patient care specialist...");
                }}
                className="p-3.5 rounded-xl bg-[#F2F3FF] flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="chatbubbles-outline" size={20} color="#004AC6" />
                  <View className="flex-col">
                    <Text className="text-sm font-semibold text-[#131B2E]">Start Live Chat</Text>
                    <Text className="text-xs text-[#737686]">Average response time: 2 min</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#737686" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsSupportModalVisible(false);
                  Alert.alert("Clinic Helpline", "Calling QueueUp Concierge at (800) 555-0199...");
                }}
                className="p-3.5 rounded-xl bg-[#F2F3FF] flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="call-outline" size={20} color="#007D55" />
                  <View className="flex-col">
                    <Text className="text-sm font-semibold text-[#131B2E]">Toll-Free Phone</Text>
                    <Text className="text-xs text-[#737686]">(800) 555-0199 • 24/7</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#737686" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsSupportModalVisible(false);
                  Alert.alert(
                    "Email Support",
                    "Email ticket created. Please send queries to support@queueup.app"
                  );
                }}
                className="p-3.5 rounded-xl bg-[#F2F3FF] flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="mail-outline" size={20} color="#3755C3" />
                  <View className="flex-col">
                    <Text className="text-sm font-semibold text-[#131B2E]">Email Desk</Text>
                    <Text className="text-xs text-[#737686]">support@queueup.app</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#737686" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsSupportModalVisible(false)}
              className="w-full h-11 rounded-xl bg-[#EAEDFF] items-center justify-center mb-2"
            >
              <Text className="text-sm font-semibold text-[#004AC6]">Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardShadowSm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  buttonShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sheetShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  activeTabPill: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
