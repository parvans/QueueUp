import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Modal,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const SERVICE_TYPE_OPTIONS = [
  "Doctor Consultation",
  "Rapid Triage",
  "Pathology & Lab Intake",
  "Patient Billing & Discharge",
  "General Consultation",
  "Pharmacy",
];

const PRESET_TIME_OPTIONS = [
  { label: "1m", minutes: 1 },
  { label: "5 min", minutes: 5 },
  { label: "10m", minutes: 10 },
  { label: "15m", minutes: 15 },
  { label: "20m", minutes: 20 },
  { label: "30m", minutes: 30 },
];

export default function EditQueueScreen() {
  const insets = useSafeAreaInsets();

  // Initial reference values
  const INITIAL_NAME = "General Consultation";
  const INITIAL_SERVICE_TYPE = "Doctor Consultation";
  const INITIAL_CAPACITY = 50;
  const INITIAL_SERVICE_MINUTES = 5;
  const INITIAL_COUNTERS = 2;
  const ACTIVE_WAITING_COUNT = 24;

  // Section 1: Basic Information
  const [queueName, setQueueName] = useState(INITIAL_NAME);
  const [serviceType, setServiceType] = useState(INITIAL_SERVICE_TYPE);
  const [isServiceTypeModalVisible, setIsServiceTypeModalVisible] =
    useState(false);
  const [nameError, setNameError] = useState("");

  // Section 2: Queue Capacity
  const [capacity, setCapacity] = useState(INITIAL_CAPACITY);

  // Section 3: Service Time
  const [serviceMinutes, setServiceMinutes] = useState(INITIAL_SERVICE_MINUTES);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState("8");
  const [isCustomTimeModalVisible, setIsCustomTimeModalVisible] =
    useState(false);

  // Section 4: Service Counters
  const [counters, setCounters] = useState(INITIAL_COUNTERS);

  // Section 5: Operating Hours
  const [monFriHours, setMonFriHours] = useState("09:00 AM – 05:00 PM");
  const [satHours, setSatHours] = useState("09:00 AM – 01:00 PM");
  const sunHours = "Closed";
  const [isEditHoursModalVisible, setIsEditHoursModalVisible] = useState(false);
  const [tempMonFri, setTempMonFri] = useState(monFriHours);
  const [tempSat, setTempSat] = useState(satHours);

  // Section 6: Virtual Queue
  const [remoteJoinEnabled, setRemoteJoinEnabled] = useState(true);

  // Section 7: Customer Notifications
  const [notifyPositionUpdates, setNotifyPositionUpdates] = useState(true);
  const [notifyAlmostTurn, setNotifyAlmostTurn] = useState(true);
  const [notifyYourTurnReady, setNotifyYourTurnReady] = useState(true);

  // Section 8: Queue Rules & Automation
  const [ruleAllowLeave, setRuleAllowLeave] = useState(true);
  const [ruleAutoCloseAtCapacity, setRuleAutoCloseAtCapacity] = useState(true);
  const [ruleAllowImmediateRejoin, setRuleAllowImmediateRejoin] =
    useState(false);
  const [ruleDailyAutoReset, setRuleDailyAutoReset] = useState(true);

  // Queue Lifecycle State (Danger Zone)
  const [queueStatus, setQueueStatus] = useState<"Open" | "Paused" | "Closed">(
    "Open"
  );
  const [isCloseQueueModalVisible, setIsCloseQueueModalVisible] =
    useState(false);
  const [isDeleteQueueModalVisible, setIsDeleteQueueModalVisible] =
    useState(false);
  const [isDiscardModalVisible, setIsDiscardModalVisible] = useState(false);

  // Save / Action States
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Pulse animation for live status dot
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Check if form is dirty
  const isDirty =
    queueName !== INITIAL_NAME ||
    serviceType !== INITIAL_SERVICE_TYPE ||
    capacity !== INITIAL_CAPACITY ||
    serviceMinutes !== INITIAL_SERVICE_MINUTES ||
    counters !== INITIAL_COUNTERS ||
    monFriHours !== "09:00 AM – 05:00 PM" ||
    satHours !== "09:00 AM – 01:00 PM" ||
    !remoteJoinEnabled ||
    !notifyPositionUpdates ||
    !notifyAlmostTurn ||
    !notifyYourTurnReady ||
    !ruleAllowLeave ||
    !ruleAutoCloseAtCapacity ||
    ruleAllowImmediateRejoin ||
    !ruleDailyAutoReset ||
    queueStatus !== "Open";

  // Stepper handlers
  const handleAdjustCapacity = (delta: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCapacity((prev) => {
      const next = prev + delta;
      // Active queue has 24 guests; capacity cannot be set lower than this value
      return Math.max(ACTIVE_WAITING_COUNT, Math.min(200, next));
    });
  };

  const handleAdjustCounters = (delta: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCounters((prev) => Math.max(1, Math.min(12, prev + delta)));
  };

  // Service time chip handler
  const handleSelectTimeChip = (mins: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setServiceMinutes(mins);
    setIsCustomTime(false);
  };

  const handleSaveCustomTime = () => {
    const parsed = parseInt(customMinutesInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 120) {
      setServiceMinutes(parsed);
      setIsCustomTime(true);
      setIsCustomTimeModalVisible(false);
    } else {
      setServiceMinutes(8);
      setIsCustomTime(true);
      setIsCustomTimeModalVisible(false);
    }
  };

  // Telemetry values matching Stitch calculations
  const capacityPercent = Math.round((ACTIVE_WAITING_COUNT / capacity) * 100);
  const estWaitTimeMinutes = Math.max(
    4,
    Math.round(
      ((ACTIVE_WAITING_COUNT * serviceMinutes) / Math.max(1, counters)) * 0.3
    )
  );

  // Save changes handler
  const handleSaveChanges = () => {
    if (!queueName.trim()) {
      setNameError("Queue name is required");
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      return;
    }

    setNameError("");
    setIsSaving(true);

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    // Simulated saving delay matching Stitch script
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(business)/dashboard");
        }
      }, 1200);
    }, 600);
  };

  // Back / Cancel handler
  const handleCancelPress = () => {
    if (isDirty) {
      setIsDiscardModalVisible(true);
    } else {
      navigateBack();
    }
  };

  const navigateBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(business)/dashboard");
    }
  };

  // Danger Zone handlers
  const handleTogglePause = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setQueueStatus((prev) => (prev === "Paused" ? "Open" : "Paused"));
  };

  const handleConfirmCloseQueue = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
    setQueueStatus("Closed");
    setIsCloseQueueModalVisible(false);
  };

  const handleConfirmDeleteQueue = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
    setIsDeleteQueueModalVisible(false);
    router.replace("/(business)/dashboard");
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Fixed Header matching Stitch */}
        <View className="h-16 px-4 bg-[#FAF8FF]/95 border-b border-[#EAEDFF] flex-row items-center justify-between z-10">
          <View className="flex-row items-center gap-3 min-w-0 flex-1">
            <TouchableOpacity
              accessibilityLabel="Go back"
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={handleCancelPress}
              className="w-11 h-11 rounded-full items-center justify-center bg-[#F2F3FF] active:scale-95"
            >
              <MaterialIcons name="arrow-back" size={24} color="#131B2E" />
            </TouchableOpacity>
            <View className="flex-col min-w-0 flex-1">
              <Text
                numberOfLines={1}
                className="text-lg font-bold text-[#131B2E] tracking-tight"
              >
                Edit Queue Settings
              </Text>
              <Text
                numberOfLines={1}
                className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mt-0.5"
              >
                Staff Management
              </Text>
            </View>
          </View>
          <View className="flex-row items-center flex-shrink-0 ml-2">
            <View className="w-8 h-8 rounded-full bg-[#004AC6] items-center justify-center">
              <MaterialIcons name="person" size={18} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 110,
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Title & Queue State Badge */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-col">
              <Text className="text-2xl font-bold text-[#131B2E] tracking-tight">
                Edit Queue
              </Text>
              <Text className="text-sm text-[#434655] mt-0.5">
                Update your queue settings.
              </Text>
            </View>

            {/* Status Pill matching Stitch */}
            <View
              className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xs ${
                queueStatus === "Open"
                  ? "bg-[#E2E7FF]"
                  : queueStatus === "Paused"
                  ? "bg-[#FFFBEB]"
                  : "bg-[#FFDAD6]"
              }`}
            >
              <Animated.View
                style={{
                  opacity: queueStatus === "Open" ? pulseAnim : 1,
                }}
                className={`w-2 h-2 rounded-full ${
                  queueStatus === "Open"
                    ? "bg-[#007D55]"
                    : queueStatus === "Paused"
                    ? "bg-[#F59E0B]"
                    : "bg-[#BA1A1A]"
                }`}
              />
              <Text
                className={`text-xs font-semibold ${
                  queueStatus === "Open"
                    ? "text-[#131B2E]"
                    : queueStatus === "Paused"
                    ? "text-[#92400E]"
                    : "text-[#BA1A1A]"
                }`}
              >
                {queueStatus === "Open"
                  ? `Open (${ACTIVE_WAITING_COUNT} in line)`
                  : queueStatus === "Paused"
                  ? `Paused (${ACTIVE_WAITING_COUNT} in line)`
                  : "Closed (0 in line)"}
              </Text>
            </View>
          </View>

          {/* Active Waiting Warning Banner */}
          <View className="p-4 rounded-xl bg-[#FFDAD6]/40 flex-row items-start gap-3 shadow-xs mb-4 border border-[#BA1A1A]/15">
            <View className="w-8 h-8 rounded-full bg-[#BA1A1A]/10 items-center justify-center flex-shrink-0">
              <MaterialIcons name="warning" size={20} color="#BA1A1A" />
            </View>
            <View className="flex-col flex-1 min-w-0">
              <Text className="text-sm font-bold text-[#93000A]">
                Customers are currently waiting
              </Text>
              <Text className="text-xs text-[#93000A] mt-1 leading-relaxed">
                24 customers are waiting. Changes to capacity, average service
                time, or active counters will immediately recalculate waiting
                times across active customer passes.
              </Text>
            </View>
          </View>

          {/* Section 1: Basic Information */}
          <View
            style={styles.cardShadow}
            className="p-4 rounded-xl bg-white shadow-xs mb-4 border border-slate-100 gap-3.5"
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="info" size={20} color="#004AC6" />
              <Text className="text-base font-bold text-[#131B2E]">
                Basic Information
              </Text>
            </View>

            {/* Queue Name */}
            <View>
              <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mb-1.5">
                QUEUE NAME
              </Text>
              <View
                className={`h-12 px-3.5 rounded-xl bg-[#F2F3FF] flex-row items-center justify-between border ${
                  nameError
                    ? "border-red-500 bg-red-50/20"
                    : "border-transparent focus:border-[#004AC6]"
                }`}
              >
                <TextInput
                  value={queueName}
                  onChangeText={(val) => {
                    setQueueName(val);
                    if (nameError) setNameError("");
                  }}
                  placeholder="e.g. General Consultation"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-base text-[#131B2E] font-medium p-0"
                />
                <MaterialIcons name="edit" size={18} color="#434655" />
              </View>
              {nameError ? (
                <Text className="text-xs text-red-500 mt-1 ml-1">
                  {nameError}
                </Text>
              ) : null}
            </View>

            {/* Service Type */}
            <View>
              <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mb-1.5">
                SERVICE TYPE
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsServiceTypeModalVisible(true)}
                className="h-12 px-3.5 rounded-xl bg-[#F2F3FF] flex-row items-center justify-between"
              >
                <Text className="text-base text-[#131B2E] font-medium">
                  {serviceType}
                </Text>
                <MaterialIcons name="expand-more" size={22} color="#434655" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 2: Queue Capacity */}
          <View
            style={styles.cardShadow}
            className="p-4 rounded-xl bg-white shadow-xs mb-4 border border-slate-100 gap-2.5"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="groups" size={20} color="#004AC6" />
                <Text className="text-base font-bold text-[#131B2E]">
                  Queue Capacity
                </Text>
              </View>
              <View className="bg-[#EAEDFF] px-2 py-0.5 rounded">
                <Text className="text-xs font-semibold text-[#007D55]">
                  {capacityPercent}% Full
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between p-3 rounded-xl bg-[#F2F3FF]">
              <View className="flex-col">
                <Text className="text-xs font-bold text-[#131B2E]">
                  Maximum Queue Capacity
                </Text>
                <Text className="text-xs text-[#737686] mt-0.5">
                  Prevents intake once hit
                </Text>
              </View>
              <View className="flex-row items-center gap-2 bg-white px-1.5 py-1 rounded-full shadow-xs">
                <TouchableOpacity
                  accessibilityLabel="Decrease capacity"
                  activeOpacity={0.7}
                  onPress={() => handleAdjustCapacity(-5)}
                  className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center active:scale-95"
                >
                  <MaterialIcons name="remove" size={18} color="#131B2E" />
                </TouchableOpacity>
                <Text className="text-base font-bold text-[#131B2E] min-w-[36px] text-center tabular-nums">
                  {capacity}
                </Text>
                <TouchableOpacity
                  accessibilityLabel="Increase capacity"
                  activeOpacity={0.7}
                  onPress={() => handleAdjustCapacity(5)}
                  className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center active:scale-95"
                >
                  <MaterialIcons name="add" size={18} color="#131B2E" />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-xs text-[#737686] italic mt-0.5">
              Active queue has 24 guests. Capacity cannot be set lower than this
              value.
            </Text>
          </View>

          {/* Section 3: Service Time */}
          <View
            style={styles.cardShadow}
            className="p-4 rounded-xl bg-white shadow-xs mb-4 border border-slate-100 gap-2"
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="timer" size={20} color="#004AC6" />
              <Text className="text-base font-bold text-[#131B2E]">
                Average Service Time
              </Text>
            </View>
            <Text className="text-xs text-[#737686]">
              Used to estimate real-time customer wait duration.
            </Text>

            <View className="flex-row flex-wrap gap-2 pt-1.5">
              {PRESET_TIME_OPTIONS.map((opt) => {
                const isSelected =
                  !isCustomTime && serviceMinutes === opt.minutes;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    activeOpacity={0.7}
                    onPress={() => handleSelectTimeChip(opt.minutes)}
                    className={`px-3.5 py-1.5 rounded-full ${
                      isSelected
                        ? "bg-[#004AC6] shadow-xs"
                        : "bg-[#F2F3FF] active:bg-[#EAEDFF]"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? "text-white" : "text-[#131B2E]"
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Custom Chip */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsCustomTimeModalVisible(true)}
                className={`px-3.5 py-1.5 rounded-full ${
                  isCustomTime
                    ? "bg-[#004AC6] shadow-xs"
                    : "bg-[#F2F3FF] active:bg-[#EAEDFF]"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isCustomTime ? "text-white" : "text-[#131B2E]"
                  }`}
                >
                  {isCustomTime ? `Custom (${serviceMinutes}m)` : "Custom"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 4: Service Counters */}
          <View
            style={styles.cardShadow}
            className="p-4 rounded-xl bg-white shadow-xs mb-4 border border-slate-100 gap-2.5"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="countertops" size={20} color="#004AC6" />
                <Text className="text-base font-bold text-[#131B2E]">
                  Service Counters
                </Text>
              </View>
              <Text className="text-[11px] font-bold text-[#007D55] uppercase">
                {counters} Desks Live
              </Text>
            </View>

            <View className="flex-row items-center justify-between p-3 rounded-xl bg-[#F2F3FF]">
              <View className="flex-col">
                <Text className="text-xs font-bold text-[#131B2E]">
                  Active Desks
                </Text>
                <Text className="text-xs text-[#737686] mt-0.5">
                  {counters === 1
                    ? "Desk 1 currently serving"
                    : counters === 2
                    ? "Desk 1 & Desk 2 currently serving"
                    : `Desk 1 – Desk ${counters} currently serving`}
                </Text>
              </View>
              <View className="flex-row items-center gap-2 bg-white px-1.5 py-1 rounded-full shadow-xs">
                <TouchableOpacity
                  accessibilityLabel="Decrease counters"
                  activeOpacity={0.7}
                  onPress={() => handleAdjustCounters(-1)}
                  className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center active:scale-95"
                >
                  <MaterialIcons name="remove" size={18} color="#131B2E" />
                </TouchableOpacity>
                <Text className="text-base font-bold text-[#131B2E] min-w-[28px] text-center tabular-nums">
                  {counters}
                </Text>
                <TouchableOpacity
                  accessibilityLabel="Increase counters"
                  activeOpacity={0.7}
                  onPress={() => handleAdjustCounters(1)}
                  className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center active:scale-95"
                >
                  <MaterialIcons name="add" size={18} color="#131B2E" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Section 5: Operating Hours */}
          <View
            style={styles.cardShadow}
            className="p-4 rounded-xl bg-white shadow-xs mb-4 border border-slate-100 gap-2.5"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="schedule" size={20} color="#004AC6" />
                <Text className="text-base font-bold text-[#131B2E]">
                  Operating Hours
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setTempMonFri(monFriHours);
                  setTempSat(satHours);
                  setIsEditHoursModalVisible(true);
                }}
              >
                <Text className="text-xs font-bold text-[#004AC6]">
                  Edit Hours
                </Text>
              </TouchableOpacity>
            </View>

            <View className="gap-2 pt-1">
              <View className="flex-row items-center justify-between p-2.5 rounded-lg bg-[#F2F3FF]">
                <Text className="text-xs font-semibold text-[#131B2E]">
                  Mon – Fri
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <View className="w-2 h-2 rounded-full bg-[#007D55]" />
                  <Text className="text-xs text-[#131B2E]">{monFriHours}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between p-2.5 rounded-lg bg-[#F2F3FF]">
                <Text className="text-xs font-semibold text-[#131B2E]">
                  Saturday
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <View className="w-2 h-2 rounded-full bg-[#007D55]" />
                  <Text className="text-xs text-[#131B2E]">{satHours}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between p-2.5 rounded-lg bg-[#F2F3FF] opacity-75">
                <Text className="text-xs font-semibold text-[#737686]">
                  Sunday
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <View className="w-2 h-2 rounded-full bg-[#C3C6D7]" />
                  <Text className="text-xs text-[#737686]">{sunHours}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section 6: Virtual Queue */}
          <View
            style={styles.cardShadow}
            className="p-4 rounded-xl bg-white shadow-xs mb-4 border border-slate-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-10 h-10 rounded-full bg-[#004AC6]/10 items-center justify-center flex-shrink-0">
                <MaterialIcons name="cell-tower" size={20} color="#004AC6" />
              </View>
              <View className="flex-col flex-1">
                <Text className="text-sm font-bold text-[#131B2E]">
                  Allow Remote Join
                </Text>
                <Text className="text-xs text-[#737686] mt-0.5">
                  Customers can check in via web/app
                </Text>
              </View>
            </View>
            <Switch
              value={remoteJoinEnabled}
              onValueChange={(val) => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } catch {}
                setRemoteJoinEnabled(val);
              }}
              trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Section 7: Customer Notifications */}
          <View
            style={styles.cardShadow}
            className="p-4 rounded-xl bg-white shadow-xs mb-4 border border-slate-100 gap-3"
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="notifications-active"
                size={20}
                color="#004AC6"
              />
              <Text className="text-base font-bold text-[#131B2E]">
                Customer Notifications
              </Text>
            </View>

            <View className="gap-2.5">
              <View className="flex-row items-center justify-between py-1">
                <View className="flex-col flex-1 pr-2">
                  <Text className="text-xs font-bold text-[#131B2E]">
                    Queue Position Updates
                  </Text>
                  <Text className="text-[11px] text-[#737686] mt-0.5">
                    Alert customers when moving up 5 spots
                  </Text>
                </View>
                <Switch
                  value={notifyPositionUpdates}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setNotifyPositionUpdates(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="flex-row items-center justify-between py-1">
                <View className="flex-col flex-1 pr-2">
                  <Text className="text-xs font-bold text-[#131B2E]">
                    Almost Your Turn
                  </Text>
                  <Text className="text-[11px] text-[#737686] mt-0.5">
                    Urgent ping when 2 slots away
                  </Text>
                </View>
                <Switch
                  value={notifyAlmostTurn}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setNotifyAlmostTurn(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="flex-row items-center justify-between py-1">
                <View className="flex-col flex-1 pr-2">
                  <Text className="text-xs font-bold text-[#131B2E]">
                    Your Turn Ready
                  </Text>
                  <Text className="text-[11px] text-[#737686] mt-0.5">
                    Summons customer to specific desk
                  </Text>
                </View>
                <Switch
                  value={notifyYourTurnReady}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setNotifyYourTurnReady(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Section 8: Queue Rules & Automation */}
          <View
            style={styles.cardShadow}
            className="p-4 rounded-xl bg-white shadow-xs mb-4 border border-slate-100 gap-3"
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="rule" size={20} color="#004AC6" />
              <Text className="text-base font-bold text-[#131B2E]">
                Queue Rules & Automation
              </Text>
            </View>

            <View className="gap-2.5">
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs font-bold text-[#131B2E] flex-1 pr-2">
                  Allow Customers to Leave Queue
                </Text>
                <Switch
                  value={ruleAllowLeave}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setRuleAllowLeave(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs font-bold text-[#131B2E] flex-1 pr-2">
                  Auto-close Queue at Capacity
                </Text>
                <Switch
                  value={ruleAutoCloseAtCapacity}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setRuleAutoCloseAtCapacity(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs font-bold text-[#131B2E] flex-1 pr-2">
                  Allow Immediate Rejoining
                </Text>
                <Switch
                  value={ruleAllowImmediateRejoin}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setRuleAllowImmediateRejoin(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs font-bold text-[#131B2E] flex-1 pr-2">
                  Daily Auto-reset at Midnight
                </Text>
                <Switch
                  value={ruleDailyAutoReset}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setRuleDailyAutoReset(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Section 9: Customer Preview (Signature Digital Metaphor) */}
          <View className="gap-2 mb-4">
            <View className="flex-row items-center justify-between px-1">
              <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                Live Customer App Preview
              </Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="visibility" size={14} color="#004AC6" />
                <Text className="text-xs text-[#004AC6] font-semibold">
                  Previewing
                </Text>
              </View>
            </View>

            <View className="p-4 rounded-xl bg-[#F2F3FF] border border-[#EAEDFF] shadow-xs gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <Animated.View
                    style={{
                      opacity: queueStatus === "Open" ? pulseAnim : 1,
                    }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      queueStatus === "Open" ? "bg-[#007D55]" : "bg-[#BA1A1A]"
                    }`}
                  />
                  <Text
                    className={`text-xs font-bold ${
                      queueStatus === "Open" ? "text-[#007D55]" : "text-[#BA1A1A]"
                    }`}
                  >
                    {queueStatus === "Open"
                      ? "Accepting Queue"
                      : "Queue Paused / Closed"}
                  </Text>
                </View>
                <Text className="text-[11px] text-[#434655]">
                  Open until 5:00 PM
                </Text>
              </View>

              <View>
                <Text
                  numberOfLines={1}
                  className="text-lg font-bold text-[#131B2E]"
                >
                  {queueName.trim() || "General Consultation"}
                </Text>
                <Text className="text-xs text-[#434655] mt-0.5">
                  City Care Clinic • Floor 2
                </Text>
              </View>

              <View className="flex-row gap-2.5 pt-1">
                <View className="flex-1 p-2.5 rounded-lg bg-white/90 shadow-xs">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                    CURRENT WAIT
                  </Text>
                  <Text className="text-lg font-bold text-[#004AC6] mt-0.5">
                    ~{estWaitTimeMinutes} min
                  </Text>
                </View>

                <View className="flex-1 p-2.5 rounded-lg bg-white/90 shadow-xs">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                    IN LINE NOW
                  </Text>
                  <Text className="text-lg font-bold text-[#131B2E] mt-0.5">
                    {ACTIVE_WAITING_COUNT} people
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section 10: Danger Zone */}
          <View className="p-4 rounded-xl bg-[#FFDAD6]/25 border border-[#BA1A1A]/20 shadow-xs gap-3.5 mb-2">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="gpp-maybe" size={22} color="#BA1A1A" />
              <Text className="text-base font-bold text-[#131B2E]">
                Danger Zone
              </Text>
            </View>

            <View className="gap-2.5">
              {/* Pause/Resume Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleTogglePause}
                className="w-full h-12 rounded-xl bg-white shadow-xs flex-row items-center justify-center gap-2"
              >
                <MaterialIcons
                  name={queueStatus === "Paused" ? "play-circle" : "pause-circle"}
                  size={18}
                  color="#131B2E"
                />
                <Text className="text-xs font-bold text-[#131B2E]">
                  {queueStatus === "Paused"
                    ? "Resume Queue Intake"
                    : "Pause Queue Intake"}
                </Text>
              </TouchableOpacity>

              {/* Close Queue Card */}
              <View className="p-3 rounded-lg bg-white/70 gap-2 border border-[#BA1A1A]/10">
                <View>
                  <Text className="text-xs font-bold text-[#BA1A1A]">
                    Close Queue Now
                  </Text>
                  <Text className="text-xs text-[#434655] mt-0.5 leading-4">
                    Closing this queue will prevent new customers from joining
                    and immediately notify waiting customers.
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsCloseQueueModalVisible(true)}
                  className="w-full h-11 rounded-lg bg-[#BA1A1A] items-center justify-center shadow-xs active:scale-[0.98]"
                >
                  <Text className="text-xs font-bold text-white">
                    Close Queue
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Permanently Delete Queue */}
              <View className="pt-1 items-center">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsDeleteQueueModalVisible(true)}
                  className="flex-row items-center gap-1 py-1"
                >
                  <MaterialIcons name="delete" size={16} color="#BA1A1A" />
                  <Text className="text-xs font-bold text-[#BA1A1A] underline">
                    Permanently Delete Queue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Section 11: Sticky Bottom Action Bar */}
        <View
          style={[
            styles.bottomBarShadow,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
          className="absolute bottom-0 inset-x-0 bg-[#FAF8FF]/95 border-t border-[#EAEDFF] px-4 pt-3 flex-row items-center gap-3"
        >
          <TouchableOpacity
            accessibilityLabel="Cancel"
            accessibilityRole="button"
            activeOpacity={0.7}
            disabled={isSaving}
            onPress={handleCancelPress}
            className="h-12 px-6 rounded-xl bg-[#E2E7FF] items-center justify-center active:scale-95"
          >
            <Text className="text-sm font-bold text-[#131B2E]">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Save Changes"
            accessibilityRole="button"
            activeOpacity={0.8}
            disabled={isSaving}
            onPress={handleSaveChanges}
            style={styles.primaryButtonShadow}
            className={`flex-1 h-12 rounded-xl flex-row items-center justify-center gap-2 active:scale-[0.98] ${
              isSaved ? "bg-[#007D55]" : "bg-[#004AC6]"
            }`}
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="text-sm font-bold text-white">Saving...</Text>
              </>
            ) : isSaved ? (
              <>
                <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                <Text className="text-sm font-bold text-white">Saved!</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="save" size={20} color="#FFFFFF" />
                <Text className="text-sm font-bold text-white">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Modal: Service Type Selector */}
        <Modal
          visible={isServiceTypeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsServiceTypeModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsServiceTypeModalVisible(false)}
            className="flex-1 bg-black/40 justify-end"
          >
            <TouchableOpacity
              activeOpacity={1}
              className="bg-white rounded-t-3xl p-5 pb-8 max-h-[80%]"
            >
              <View className="w-12 h-1 bg-[#CBD5E1] rounded-full self-center mb-4" />
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-bold text-[#131B2E]">
                  Select Service Type
                </Text>
                <TouchableOpacity
                  onPress={() => setIsServiceTypeModalVisible(false)}
                  className="p-1"
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
                {SERVICE_TYPE_OPTIONS.map((type) => {
                  const isSelected = serviceType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      activeOpacity={0.7}
                      onPress={() => {
                        try {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        } catch {}
                        setServiceType(type);
                        setIsServiceTypeModalVisible(false);
                      }}
                      className={`flex-row items-center justify-between py-3.5 px-3 rounded-xl mb-1 ${
                        isSelected ? "bg-[#F2F3FF]" : "active:bg-slate-50"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected
                            ? "font-bold text-[#004AC6]"
                            : "font-medium text-[#131B2E]"
                        }`}
                      >
                        {type}
                      </Text>
                      {isSelected && (
                        <MaterialIcons name="check" size={20} color="#004AC6" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal: Custom Time Selector */}
        <Modal
          visible={isCustomTimeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsCustomTimeModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsCustomTimeModalVisible(false)}
            className="flex-1 bg-black/40 items-center justify-center p-6"
          >
            <TouchableOpacity
              activeOpacity={1}
              className="w-full bg-white rounded-2xl p-5 shadow-xl max-w-sm"
            >
              <Text className="text-base font-bold text-[#131B2E] mb-1">
                Custom Average Duration
              </Text>
              <Text className="text-xs text-[#737686] mb-4">
                Enter estimated average minutes per customer (1 - 120 mins).
              </Text>

              <View className="h-12 bg-[#F2F3FF] rounded-xl px-4 border border-[#EAEDFF] justify-center mb-4">
                <TextInput
                  value={customMinutesInput}
                  onChangeText={setCustomMinutesInput}
                  placeholder="Minutes"
                  keyboardType="number-pad"
                  autoFocus
                  className="text-base text-[#131B2E] font-bold p-0"
                />
              </View>

              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsCustomTimeModalVisible(false)}
                  className="flex-1 h-11 rounded-xl bg-[#F2F3FF] items-center justify-center"
                >
                  <Text className="text-xs font-bold text-[#434655]">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSaveCustomTime}
                  className="flex-1 h-11 rounded-xl bg-[#004AC6] items-center justify-center shadow-xs"
                >
                  <Text className="text-xs font-bold text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal: Edit Operating Hours */}
        <Modal
          visible={isEditHoursModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditHoursModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsEditHoursModalVisible(false)}
            className="flex-1 bg-black/40 items-center justify-center p-6"
          >
            <TouchableOpacity
              activeOpacity={1}
              className="w-full bg-white rounded-2xl p-5 shadow-xl max-w-sm gap-3"
            >
              <Text className="text-base font-bold text-[#131B2E]">
                Edit Operating Hours
              </Text>

              <View>
                <Text className="text-xs font-bold text-[#434655] mb-1">
                  Monday – Friday Hours
                </Text>
                <View className="h-11 bg-[#F2F3FF] rounded-xl px-3.5 border border-[#EAEDFF] justify-center">
                  <TextInput
                    value={tempMonFri}
                    onChangeText={setTempMonFri}
                    placeholder="e.g. 09:00 AM – 05:00 PM"
                    className="text-sm text-[#131B2E] font-medium p-0"
                  />
                </View>
              </View>

              <View>
                <Text className="text-xs font-bold text-[#434655] mb-1">
                  Saturday Hours
                </Text>
                <View className="h-11 bg-[#F2F3FF] rounded-xl px-3.5 border border-[#EAEDFF] justify-center">
                  <TextInput
                    value={tempSat}
                    onChangeText={setTempSat}
                    placeholder="e.g. 09:00 AM – 01:00 PM"
                    className="text-sm text-[#131B2E] font-medium p-0"
                  />
                </View>
              </View>

              <View className="flex-row items-center gap-2 pt-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsEditHoursModalVisible(false)}
                  className="flex-1 h-11 rounded-xl bg-[#F2F3FF] items-center justify-center"
                >
                  <Text className="text-xs font-bold text-[#434655]">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (tempMonFri.trim()) setMonFriHours(tempMonFri.trim());
                    if (tempSat.trim()) setSatHours(tempSat.trim());
                    setIsEditHoursModalVisible(false);
                  }}
                  className="flex-1 h-11 rounded-xl bg-[#004AC6] items-center justify-center shadow-xs"
                >
                  <Text className="text-xs font-bold text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal: Close Queue Confirmation */}
        <Modal
          visible={isCloseQueueModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsCloseQueueModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsCloseQueueModalVisible(false)}
            className="flex-1 bg-black/40 items-center justify-center p-6"
          >
            <TouchableOpacity
              activeOpacity={1}
              className="w-full bg-white rounded-2xl p-5 shadow-xl max-w-sm gap-3"
            >
              <View className="w-10 h-10 rounded-full bg-[#FFDAD6] items-center justify-center">
                <MaterialIcons name="warning" size={24} color="#BA1A1A" />
              </View>
              <Text className="text-base font-bold text-[#131B2E]">
                Close Queue Session?
              </Text>
              <Text className="text-xs text-[#434655] leading-relaxed">
                Closing will stop accepting new patients immediately. All 24
                currently waiting patients will be notified.
              </Text>
              <View className="flex-row items-center gap-2 pt-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsCloseQueueModalVisible(false)}
                  className="flex-1 h-11 rounded-xl bg-[#F2F3FF] items-center justify-center"
                >
                  <Text className="text-xs font-bold text-[#434655]">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleConfirmCloseQueue}
                  className="flex-1 h-11 rounded-xl bg-[#BA1A1A] items-center justify-center shadow-xs"
                >
                  <Text className="text-xs font-bold text-white">
                    Confirm Close
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal: Delete Queue Confirmation */}
        <Modal
          visible={isDeleteQueueModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDeleteQueueModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsDeleteQueueModalVisible(false)}
            className="flex-1 bg-black/40 items-center justify-center p-6"
          >
            <TouchableOpacity
              activeOpacity={1}
              className="w-full bg-white rounded-2xl p-5 shadow-xl max-w-sm gap-3"
            >
              <View className="w-10 h-10 rounded-full bg-[#FFDAD6] items-center justify-center">
                <MaterialIcons name="delete-forever" size={24} color="#BA1A1A" />
              </View>
              <Text className="text-base font-bold text-[#131B2E]">
                Delete Queue Permanently?
              </Text>
              <Text className="text-xs text-[#434655] leading-relaxed">
                This action cannot be undone. All active slots, historical logs,
                and queue counters for this department will be permanently
                removed.
              </Text>
              <View className="flex-row items-center gap-2 pt-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsDeleteQueueModalVisible(false)}
                  className="flex-1 h-11 rounded-xl bg-[#F2F3FF] items-center justify-center"
                >
                  <Text className="text-xs font-bold text-[#434655]">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleConfirmDeleteQueue}
                  className="flex-1 h-11 rounded-xl bg-[#BA1A1A] items-center justify-center shadow-xs"
                >
                  <Text className="text-xs font-bold text-white">
                    Delete Queue
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal: Discard Changes Confirmation */}
        <Modal
          visible={isDiscardModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDiscardModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsDiscardModalVisible(false)}
            className="flex-1 bg-black/40 items-center justify-center p-6"
          >
            <TouchableOpacity
              activeOpacity={1}
              className="w-full bg-white rounded-2xl p-5 shadow-xl max-w-sm gap-3"
            >
              <Text className="text-base font-bold text-[#131B2E]">
                Discard Changes?
              </Text>
              <Text className="text-xs text-[#434655] leading-relaxed">
                You have modified settings. Are you sure you want to discard your
                changes and leave?
              </Text>
              <View className="flex-row items-center gap-2 pt-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsDiscardModalVisible(false)}
                  className="flex-1 h-11 rounded-xl bg-[#F2F3FF] items-center justify-center"
                >
                  <Text className="text-xs font-bold text-[#434655]">
                    Keep Editing
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsDiscardModalVisible(false);
                    navigateBack();
                  }}
                  className="flex-1 h-11 rounded-xl bg-[#BA1A1A] items-center justify-center shadow-xs"
                >
                  <Text className="text-xs font-bold text-white">Discard</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  primaryButtonShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
  },
  bottomBarShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
});
