import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

type SimulatorState = "default" | "saving" | "success" | "error";
type NotificationPreference = "push_sms" | "push_only" | "sms_only";

const DEFAULT_AVATAR_URI =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuATtY5tjCJZHbhEwJsmlK_dWWDfNkFnCZ8B_bW-y1oxRZFNT4RDZ2ZllQ5EQTLaG6Y3ETTUZSTXfXM1BI6X_6UL32Ob0MqkVj8EJey0KJpPqSWc-T51c1T1T1GV750IxOYZo6Vq6MO7Pg1MpUFRIsaU_6MmS_PIGLwaVIkP_iL4ZfyDwSa0i1fgq-cfD_4htSu-2JHxmjaiu7iXiG1Uyub3ZVUEpwVzjpqZhUUlljY1TVgmdxO9f1h1-A";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();

  // UX Simulator State
  const [activeState, setActiveState] = useState<SimulatorState>("default");

  // Form Fields
  const [fullName, setFullName] = useState<string>("Parvan Kumar");
  const [email, setEmail] = useState<string>("parvan.k@example.com");
  const [phone, setPhone] = useState<string>("+1 (555) 019-2834");
  const [notificationPref, setNotificationPref] =
    useState<NotificationPreference>("push_sms");

  // Photo & Visual Feedback States
  const [hasPhoto, setHasPhoto] = useState<boolean>(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);
  const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Micro-interaction bounce animation
  const avatarScale = useRef(new Animated.Value(1)).current;

  // State Simulator Switcher
  const handleSetState = (state: SimulatorState) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}

    setActiveState(state);

    if (state === "default") {
      setPhone("+1 (555) 019-2834");
      setPhoneError(false);
      setShowSuccessBanner(false);
      setShowErrorBanner(false);
      setIsSaving(false);
    } else if (state === "saving") {
      setShowSuccessBanner(false);
      setShowErrorBanner(false);
      setPhoneError(false);
      setIsSaving(true);
    } else if (state === "success") {
      setIsSaving(false);
      setShowSuccessBanner(true);
      setShowErrorBanner(false);
      setPhoneError(false);
    } else if (state === "error") {
      setIsSaving(false);
      setShowSuccessBanner(false);
      setShowErrorBanner(true);
      setPhone("+1 (555) INVALID");
      setPhoneError(true);
    }
  };

  // Avatar Actions
  const triggerPhotoBounce = () => {
    Animated.sequence([
      Animated.timing(avatarScale, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(avatarScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTriggerPhotoChange = () => {
    triggerPhotoBounce();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}

    if (!hasPhoto) {
      setHasPhoto(true);
    } else {
      Alert.alert(
        "Update Photo",
        "Choose an option to update your profile photo",
        [
          { text: "Take Photo", onPress: () => setHasPhoto(true) },
          { text: "Choose from Library", onPress: () => setHasPhoto(true) },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const handleRemovePhoto = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {}
    setHasPhoto((prev) => !prev);
  };

  // Input Clear
  const handleClearName = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    setFullName("");
  };

  // Notification Preference Handler
  const handleSelectPreference = (pref: NotificationPreference) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    setNotificationPref(pref);
  };

  // Form Submission
  const handleSave = () => {
    if (isSaving) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {}

    // Validation check
    const isPhoneInvalid =
      phone.includes("INVALID") || phone.trim().length < 8;

    if (isPhoneInvalid) {
      setPhoneError(true);
      setShowErrorBanner(true);
      setShowSuccessBanner(false);
      setActiveState("error");
      try {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error
        ).catch(() => {});
      } catch {}
      return;
    }

    // Save simulation
    setIsSaving(true);
    setActiveState("saving");
    setShowErrorBanner(false);
    setPhoneError(false);

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessBanner(true);
      setActiveState("success");
      try {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        ).catch(() => {});
      } catch {}

      // Return to Profile after showing success state
      setTimeout(() => {
        router.back();
      }, 1200);
    }, 1000);
  };

  const handleCancel = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    router.back();
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Header matching Stitch */}
      <View className="h-16 px-4 bg-[#FAF8FF]/90 border-b border-[#E2E8F0] flex-row items-center justify-between z-50">
        <View className="flex-row items-center gap-2 flex-1 min-w-0">
          <TouchableOpacity
            accessibilityLabel="Go back"
            activeOpacity={0.7}
            onPress={handleCancel}
            className="w-10 h-10 -ml-1 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="arrow-back" size={22} color="#131B2E" />
          </TouchableOpacity>
          <View className="flex-col min-w-0">
            <Text className="text-[11px] font-bold text-[#004AC6] uppercase tracking-wider leading-none">
              QueueUp
            </Text>
            <Text
              numberOfLines={1}
              className="text-base font-semibold text-[#131B2E] truncate leading-tight mt-0.5"
            >
              Edit Profile
            </Text>
          </View>
        </View>

        {/* Right Header Actions */}
        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            accessibilityLabel="Search"
            activeOpacity={0.7}
            onPress={() => router.push("/(customer)/search" as any)}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="search-outline" size={20} color="#434655" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Mark all as read"
            activeOpacity={0.7}
            onPress={() => {
              try {
                Haptics.selectionAsync().catch(() => {});
              } catch {}
            }}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="checkmark-done-outline" size={20} color="#434655" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="More options"
            activeOpacity={0.7}
            onPress={() => {
              try {
                Haptics.selectionAsync().catch(() => {});
              } catch {}
            }}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#434655" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 24) + 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Interactive State Simulator Toolbar */}
          <View
            className="w-full bg-[#EAEDFF]/90 rounded-2xl p-2.5 mb-4 border border-[#DAE2FD]"
            style={styles.cardShadow}
          >
            <View className="flex-row items-center justify-between px-1 mb-2">
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="options-outline" size={14} color="#004AC6" />
                <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                  Interactive State Preview
                </Text>
              </View>
              <Text className="text-xs text-[#737686]">UX Sandbox</Text>
            </View>

            <View className="flex-row gap-1.5">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSetState("default")}
                className={`flex-1 py-1.5 px-1 rounded-lg items-center justify-center ${
                  activeState === "default"
                    ? "bg-[#004AC6]"
                    : "bg-white"
                }`}
                style={activeState === "default" ? styles.activeStateShadow : undefined}
              >
                <Text
                  className={`text-xs font-semibold ${
                    activeState === "default" ? "text-white" : "text-[#434655]"
                  }`}
                >
                  Default Form
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSetState("saving")}
                className={`flex-1 py-1.5 px-1 rounded-lg items-center justify-center ${
                  activeState === "saving"
                    ? "bg-[#004AC6]"
                    : "bg-white"
                }`}
                style={activeState === "saving" ? styles.activeStateShadow : undefined}
              >
                <Text
                  className={`text-xs font-semibold ${
                    activeState === "saving" ? "text-white" : "text-[#434655]"
                  }`}
                >
                  Saving State
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSetState("success")}
                className={`flex-1 py-1.5 px-1 rounded-lg items-center justify-center ${
                  activeState === "success"
                    ? "bg-[#004AC6]"
                    : "bg-white"
                }`}
                style={activeState === "success" ? styles.activeStateShadow : undefined}
              >
                <Text
                  className={`text-xs font-semibold ${
                    activeState === "success" ? "text-white" : "text-[#434655]"
                  }`}
                >
                  Success Toast
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSetState("error")}
                className={`flex-1 py-1.5 px-1 rounded-lg items-center justify-center ${
                  activeState === "error"
                    ? "bg-[#004AC6]"
                    : "bg-white"
                }`}
                style={activeState === "error" ? styles.activeStateShadow : undefined}
              >
                <Text
                  className={`text-xs font-semibold ${
                    activeState === "error" ? "text-white" : "text-[#434655]"
                  }`}
                >
                  Validation Error
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dynamic Notification / Status Banner Area */}
          {showSuccessBanner && (
            <View
              className="w-full bg-[#007D55] rounded-xl px-3.5 py-3 mb-4 flex-row items-center justify-between"
              style={styles.bannerShadow}
            >
              <View className="flex-row items-center gap-2.5 flex-1 mr-2">
                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center flex-shrink-0">
                  <Ionicons name="checkmark-circle" size={20} color="#BDFFDB" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-white leading-tight">
                    Profile updated successfully!
                  </Text>
                  <Text className="text-xs text-white/90 mt-0.5">
                    Your queue notifications are synchronized.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowSuccessBanner(false)}
                className="w-8 h-8 items-center justify-center rounded-full active:bg-white/10"
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {showErrorBanner && (
            <View
              className="w-full bg-[#FFDAD6] border border-[#BA1A1A]/20 rounded-xl px-3.5 py-3 mb-4 flex-row items-center justify-between"
              style={styles.bannerShadow}
            >
              <View className="flex-row items-center gap-2.5 flex-1 mr-2">
                <View className="w-8 h-8 rounded-full bg-[#BA1A1A]/15 items-center justify-center flex-shrink-0">
                  <Ionicons name="alert-circle" size={20} color="#BA1A1A" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#93000A] leading-tight">
                    Update failed
                  </Text>
                  <Text className="text-xs text-[#93000A]/90 mt-0.5">
                    Please enter a valid phone number.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowErrorBanner(false)}
                className="w-8 h-8 items-center justify-center rounded-full active:bg-[#BA1A1A]/10"
              >
                <Ionicons name="close" size={18} color="#93000A" />
              </TouchableOpacity>
            </View>
          )}

          {/* Profile Photo Uploader Section */}
          <View className="w-full items-center justify-center pt-2 pb-4">
            <View className="relative">
              {/* Avatar Glow Backdrop */}
              <View className="absolute -inset-1.5 bg-[#2563EB]/25 rounded-full" />

              {/* Avatar Circle */}
              <Animated.View
                style={[
                  styles.avatarShadow,
                  { transform: [{ scale: avatarScale }] },
                ]}
                className="w-28 h-28 rounded-full overflow-hidden bg-[#EAEDFF] items-center justify-center border-2 border-white"
              >
                {hasPhoto ? (
                  <Image
                    source={{ uri: DEFAULT_AVATAR_URI }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full bg-[#DAE2FD] items-center justify-center">
                    <Text className="text-2xl font-bold text-[#004AC6]">PK</Text>
                    <Text className="text-[10px] font-semibold text-[#434655] mt-0.5">
                      No Photo
                    </Text>
                  </View>
                )}
              </Animated.View>

              {/* Quick Camera Badge Floating Button */}
              <TouchableOpacity
                accessibilityLabel="Change photo"
                activeOpacity={0.8}
                onPress={handleTriggerPhotoChange}
                className="absolute bottom-0 right-0 w-9 h-9 bg-[#004AC6] rounded-full items-center justify-center border-2 border-white"
                style={styles.cameraBadgeShadow}
              >
                <Ionicons name="camera" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Action Links */}
            <View className="flex-row items-center gap-3 mt-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleTriggerPhotoChange}
                className="flex-row items-center gap-1 py-1 px-2 rounded-lg active:bg-[#EAEDFF]"
              >
                <Ionicons name="create-outline" size={15} color="#004AC6" />
                <Text className="text-sm font-semibold text-[#004AC6]">
                  {hasPhoto ? "Change Photo" : "Upload Photo"}
                </Text>
              </TouchableOpacity>
              <Text className="text-[#C3C6D7] text-xs">•</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleRemovePhoto}
                className="flex-row items-center gap-1 py-1 px-2 rounded-lg active:bg-[#FFDAD6]/30"
              >
                <Ionicons
                  name={hasPhoto ? "trash-outline" : "refresh-outline"}
                  size={15}
                  color={hasPhoto ? "#BA1A1A" : "#004AC6"}
                />
                <Text
                  className={`text-sm font-semibold ${
                    hasPhoto ? "text-[#BA1A1A]" : "text-[#004AC6]"
                  }`}
                >
                  {hasPhoto ? "Remove Photo" : "Restore Photo"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields Container */}
          <View className="space-y-4">
            {/* Field 1: Full Legal Name */}
            <View className="mb-3.5">
              <View className="flex-row items-center justify-between mb-1.5 px-0.5">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Full Legal Name
                </Text>
                <Text className="text-xs text-[#737686]">
                  Ticket Display Name
                </Text>
              </View>
              <View
                className="h-12 px-3.5 rounded-xl bg-white border border-[#E2E8F0] flex-row items-center"
                style={styles.inputShadow}
              >
                <Ionicons name="person-outline" size={19} color="#434655" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isSaving}
                  placeholder="Enter your name"
                  placeholderTextColor="#737686"
                  className="flex-1 ml-2.5 text-base text-[#131B2E] font-normal h-full"
                />
                {fullName.length > 0 && !isSaving && (
                  <TouchableOpacity
                    accessibilityLabel="Clear full name"
                    onPress={handleClearName}
                    className="w-7 h-7 rounded-full items-center justify-center active:bg-[#EAEDFF]"
                  >
                    <Ionicons name="close-circle" size={18} color="#C3C6D7" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Field 2: Email Address */}
            <View className="mb-3.5">
              <View className="flex-row items-center justify-between mb-1.5 px-0.5">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Email Address
                </Text>
                <View className="flex-row items-center gap-1 bg-[#007D55]/15 px-2 py-0.5 rounded-full">
                  <Ionicons name="checkmark-circle" size={12} color="#006242" />
                  <Text className="text-[10px] font-bold text-[#006242]">
                    Verified
                  </Text>
                </View>
              </View>
              <View
                className="h-12 px-3.5 rounded-xl bg-white border border-[#E2E8F0] flex-row items-center"
                style={styles.inputShadow}
              >
                <Ionicons name="mail-outline" size={19} color="#434655" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  editable={!isSaving}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="name@example.com"
                  placeholderTextColor="#737686"
                  className="flex-1 ml-2.5 text-base text-[#131B2E] font-normal h-full"
                />
                <Ionicons name="checkmark-circle" size={20} color="#007D55" />
              </View>
              <Text className="text-xs text-[#737686] px-1 mt-1">
                Confirmation digests and digital receipts are delivered here.
              </Text>
            </View>

            {/* Field 3: Phone Number */}
            <View className="mb-3.5">
              <View className="flex-row items-center justify-between mb-1.5 px-0.5">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Phone Number
                </Text>
                <View className="flex-row items-center gap-1 bg-[#DDE1FF]/60 px-2 py-0.5 rounded-full">
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={11}
                    color="#3755C3"
                  />
                  <Text className="text-[10px] font-bold text-[#3755C3]">
                    SMS Alerts
                  </Text>
                </View>
              </View>
              <View
                className={`h-12 px-3.5 rounded-xl flex-row items-center border ${
                  phoneError
                    ? "bg-[#FFDAD6]/30 border-[#BA1A1A]"
                    : "bg-white border-[#E2E8F0]"
                }`}
                style={styles.inputShadow}
              >
                <Ionicons
                  name="call-outline"
                  size={19}
                  color={phoneError ? "#BA1A1A" : "#434655"}
                />
                <TextInput
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (phoneError) {
                      setPhoneError(false);
                      setShowErrorBanner(false);
                    }
                  }}
                  editable={!isSaving}
                  keyboardType="phone-pad"
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="#737686"
                  className={`flex-1 ml-2.5 text-base font-normal h-full ${
                    phoneError ? "text-[#BA1A1A]" : "text-[#131B2E]"
                  }`}
                />
                {phoneError ? (
                  <Ionicons name="alert-circle" size={20} color="#BA1A1A" />
                ) : (
                  <Ionicons name="checkmark" size={20} color="#007D55" />
                )}
              </View>
              {phoneError ? (
                <View className="flex-row items-center gap-1 px-1 mt-1">
                  <Ionicons name="alert-circle" size={13} color="#BA1A1A" />
                  <Text className="text-xs text-[#BA1A1A] font-medium">
                    Please enter a valid phone number.
                  </Text>
                </View>
              ) : (
                <Text className="text-xs text-[#737686] px-1 mt-1">
                  Used exclusively for urgent queue callbacks and step-up alerts.
                </Text>
              )}
            </View>

            {/* Field 4: Preferred Notification Method */}
            <View className="mb-4 pt-1">
              <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mb-2 px-0.5">
                Preferred Notification Method
              </Text>
              <View className="flex-row gap-2 bg-[#EAEDFF] p-1.5 rounded-xl border border-[#DAE2FD]">
                {/* Option 1: Push + SMS */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectPreference("push_sms")}
                  className={`flex-1 flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-all ${
                    notificationPref === "push_sms"
                      ? "bg-white"
                      : "bg-transparent"
                  }`}
                  style={
                    notificationPref === "push_sms"
                      ? styles.selectedOptionShadow
                      : undefined
                  }
                >
                  <Ionicons
                    name={
                      notificationPref === "push_sms"
                        ? "notifications"
                        : "notifications-outline"
                    }
                    size={20}
                    color={
                      notificationPref === "push_sms" ? "#004AC6" : "#434655"
                    }
                  />
                  <Text
                    className={`text-xs mt-1 text-center font-semibold leading-tight ${
                      notificationPref === "push_sms"
                        ? "text-[#004AC6]"
                        : "text-[#434655]"
                    }`}
                  >
                    Push + SMS
                  </Text>
                </TouchableOpacity>

                {/* Option 2: Push Only */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectPreference("push_only")}
                  className={`flex-1 flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-all ${
                    notificationPref === "push_only"
                      ? "bg-white"
                      : "bg-transparent"
                  }`}
                  style={
                    notificationPref === "push_only"
                      ? styles.selectedOptionShadow
                      : undefined
                  }
                >
                  <Ionicons
                    name={
                      notificationPref === "push_only"
                        ? "notifications"
                        : "notifications-outline"
                    }
                    size={20}
                    color={
                      notificationPref === "push_only" ? "#004AC6" : "#434655"
                    }
                  />
                  <Text
                    className={`text-xs mt-1 text-center font-semibold leading-tight ${
                      notificationPref === "push_only"
                        ? "text-[#004AC6]"
                        : "text-[#434655]"
                    }`}
                  >
                    Push Only
                  </Text>
                </TouchableOpacity>

                {/* Option 3: SMS Only */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectPreference("sms_only")}
                  className={`flex-1 flex-col items-center justify-center py-2.5 px-2 rounded-lg transition-all ${
                    notificationPref === "sms_only"
                      ? "bg-white"
                      : "bg-transparent"
                  }`}
                  style={
                    notificationPref === "sms_only"
                      ? styles.selectedOptionShadow
                      : undefined
                  }
                >
                  <Ionicons
                    name={
                      notificationPref === "sms_only"
                        ? "chatbubble-ellipses"
                        : "chatbubble-ellipses-outline"
                    }
                    size={20}
                    color={
                      notificationPref === "sms_only" ? "#004AC6" : "#434655"
                    }
                  />
                  <Text
                    className={`text-xs mt-1 text-center font-semibold leading-tight ${
                      notificationPref === "sms_only"
                        ? "text-[#004AC6]"
                        : "text-[#434655]"
                    }`}
                  >
                    SMS Only
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center gap-1.5 px-1 mt-2">
                <Ionicons name="flash" size={15} color="#007D55" />
                <Text className="text-xs text-[#434655]">
                  Push + SMS ensures you never miss a counter recall outdoors.
                </Text>
              </View>
            </View>

            {/* Action Buttons Block */}
            <View className="pt-2 flex-col gap-2.5">
              {/* Primary Save Button */}
              <TouchableOpacity
                accessibilityLabel="Save Changes"
                activeOpacity={0.8}
                disabled={isSaving}
                onPress={handleSave}
                className={`w-full h-12 rounded-xl flex-row items-center justify-center gap-2 ${
                  isSaving ? "bg-[#004AC6]/70" : "bg-[#004AC6] active:bg-[#003EA8]"
                }`}
                style={styles.saveButtonShadow}
              >
                {isSaving ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="text-sm font-bold text-white">
                      Saving changes...
                    </Text>
                  </>
                ) : (
                  <Text className="text-sm font-bold text-white">
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>

              {/* Secondary Cancel Button */}
              <TouchableOpacity
                accessibilityLabel="Cancel"
                activeOpacity={0.8}
                disabled={isSaving}
                onPress={handleCancel}
                className="w-full h-12 rounded-xl bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
              >
                <Text className="text-sm font-semibold text-[#131B2E]">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

            {/* Privacy Security Note */}
            <View className="flex-row items-start gap-2.5 p-3.5 mt-2 rounded-xl bg-[#F2F3FF] border border-[#E2E8F0]/70">
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#004AC6"
                style={{ marginTop: 1 }}
              />
              <Text className="text-xs text-[#434655] leading-relaxed flex-1">
                Your contact information is encrypted and only shared with
                service counters where you have an active ticket in progress.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  activeStateShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraBadgeShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedOptionShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
});
