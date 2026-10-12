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

const SERVICE_TYPES = [
  "Doctor Consultation",
  "General Consultation",
  "Pharmacy",
  "Laboratory",
  "Billing",
  "Customer Service",
  "Food Pickup",
  "Other",
];

const PRESET_TIME_OPTIONS = [
  { label: "1 min", minutes: 1 },
  { label: "5 min", minutes: 5 },
  { label: "10 min", minutes: 10 },
  { label: "15 min", minutes: 15 },
  { label: "20 min", minutes: 20 },
  { label: "30 min", minutes: 30 },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CreateQueueScreen() {
  const insets = useSafeAreaInsets();

  // Section 1: Basic Information
  const [queueName, setQueueName] = useState("General Consultation");
  const [serviceType, setServiceType] = useState("Doctor Consultation");
  const [isServiceTypeModalVisible, setIsServiceTypeModalVisible] = useState(false);
  const [nameError, setNameError] = useState("");

  // Section 2: Capacity
  const [capacity, setCapacity] = useState(50);

  // Section 3: Service Time
  const [serviceMinutes, setServiceMinutes] = useState(5);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState("8");
  const [isCustomTimeModalVisible, setIsCustomTimeModalVisible] = useState(false);

  // Section 4: Service Counters
  const [counters, setCounters] = useState(2);

  // Section 5: Operating Hours
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [operatingHours, setOperatingHours] = useState("09:00 AM – 05:00 PM");
  const [weekdaysScheduleEnabled, setWeekdaysScheduleEnabled] = useState(true);
  const [isEditHoursModalVisible, setIsEditHoursModalVisible] = useState(false);
  const [tempHoursInput, setTempHoursInput] = useState("09:00 AM – 05:00 PM");

  // Section 6: Virtual Queue
  const [virtualQueueEnabled, setVirtualQueueEnabled] = useState(true);

  // Section 7: Notifications
  const [notifyPositionUpdates, setNotifyPositionUpdates] = useState(true);
  const [notifyAlmostTurn, setNotifyAlmostTurn] = useState(true);
  const [notifyYourTurn, setNotifyYourTurn] = useState(true);

  // Section 8: Queue Rules
  const [ruleAllowLeave, setRuleAllowLeave] = useState(true);
  const [ruleAutoCloseOnCapacity, setRuleAutoCloseOnCapacity] = useState(true);
  const [ruleAllowRejoining, setRuleAllowRejoining] = useState(false);
  const [ruleAutoResetDaily, setRuleAutoResetDaily] = useState(true);

  // Submission & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessToastVisible, setIsSuccessToastVisible] = useState(false);

  // Animated values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Continuous subtle pulse for "Accepting Queue" badge
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

  // Adjust Capacity stepper
  const handleAdjustCapacity = (delta: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCapacity((prev) => Math.max(5, Math.min(500, prev + delta)));
  };

  // Adjust Counters stepper
  const handleAdjustCounters = (delta: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCounters((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  // Select Service Time
  const handleSelectTimeChip = (minutes: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setServiceMinutes(minutes);
    setIsCustomTime(false);
  };

  const handleOpenCustomTimeModal = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setIsCustomTimeModalVisible(true);
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

  // Estimated wait calculation matching Stitch telemetry
  const estWaitTimeMinutes = Math.round(
    (18 * serviceMinutes) / Math.max(1, counters)
  );

  // Submit Handler
  const handleCreateQueue = () => {
    if (!queueName.trim()) {
      setNameError("Queue name is required");
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      return;
    }

    setNameError("");
    setIsSubmitting(true);

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    // Animate Toast In
    setIsSuccessToastVisible(true);
    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Simulated redirection after success confirmation
    toastTimeoutRef.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsSuccessToastVisible(false);
        setIsSubmitting(false);
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(business)/dashboard");
        }
      });
    }, 1600);
  };

  const handleDismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    Animated.timing(toastAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsSuccessToastVisible(false);
      setIsSubmitting(false);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(business)/dashboard");
      }
    });
  };

  const handleCancel = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(business)/dashboard");
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Header matching Stitch specifications */}
        <View className="h-16 px-4 bg-[#FAF8FF]/95 border-b border-[#EAEDFF] flex-row items-center justify-between z-10">
          <View className="flex-row items-center gap-3 min-w-0 flex-1">
            <TouchableOpacity
              accessibilityLabel="Go back"
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={handleCancel}
              className="w-11 h-11 rounded-full items-center justify-center bg-[#F2F3FF] active:scale-95"
            >
              <MaterialIcons name="arrow-back" size={24} color="#131B2E" />
            </TouchableOpacity>
            <View className="flex-col min-w-0 flex-1">
              <Text
                numberOfLines={1}
                className="text-lg font-bold text-[#131B2E] tracking-tight"
              >
                Create Queue
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
            paddingBottom: insets.bottom + 120,
            paddingHorizontal: 16,
            paddingTop: 12,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Intro Context Banner */}
          <View className="bg-[#F2F3FF] rounded-2xl p-4 mb-4 border border-[#EAEDFF] shadow-xs">
            <View className="flex-row items-start gap-3">
              <View className="w-10 h-10 rounded-full bg-[#DBE1FF] items-center justify-center flex-shrink-0">
                <MaterialIcons name="add-to-queue" size={20} color="#004AC6" />
              </View>
              <View className="flex-col min-w-0 flex-1">
                <Text className="text-base font-bold text-[#131B2E]">
                  Set up a queue
                </Text>
                <Text className="text-sm text-[#434655] mt-0.5 leading-5">
                  Customers can join digitally or via self-check-in kiosk with
                  real-time slot tracking.
                </Text>
              </View>
            </View>
          </View>

          {/* Section 1: Basic Information */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons name="badge" size={20} color="#004AC6" />
              <Text className="text-base font-bold text-[#131B2E]">
                1. Basic Information
              </Text>
            </View>

            {/* Queue Name */}
            <View className="mb-3.5">
              <Text className="text-sm font-semibold text-[#131B2E] mb-1.5">
                Queue Name
              </Text>
              <View
                className={`h-12 bg-white rounded-xl px-3.5 border justify-center ${
                  nameError
                    ? "border-red-500 bg-red-50/20"
                    : "border-[#E2E8F0] focus:border-[#004AC6]"
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
                  className="text-base text-[#131B2E] font-medium p-0"
                />
              </View>
              {nameError ? (
                <Text className="text-xs text-red-500 mt-1 ml-1">{nameError}</Text>
              ) : (
                <View className="flex-row items-center gap-1 mt-1 ml-0.5">
                  <MaterialIcons name="info" size={14} color="#737686" />
                  <Text className="text-xs text-[#737686]">
                    Choose a name customers will easily understand.
                  </Text>
                </View>
              )}
            </View>

            {/* Service Type Dropdown */}
            <View>
              <Text className="text-sm font-semibold text-[#131B2E] mb-1.5">
                Service Type
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsServiceTypeModalVisible(true)}
                className="h-12 bg-white rounded-xl px-3.5 border border-[#E2E8F0] flex-row items-center justify-between"
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
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="groups" size={20} color="#004AC6" />
                <Text className="text-base font-bold text-[#131B2E]">
                  2. Queue Capacity
                </Text>
              </View>
              <View className="bg-[#EAEDFF] px-2.5 py-0.5 rounded-full">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Max limit
                </Text>
              </View>
            </View>

            <View className="bg-[#F2F3FF] p-3 rounded-xl flex-row items-center justify-between mb-2">
              <View className="flex-col pl-1">
                <Text className="text-sm font-semibold text-[#131B2E]">
                  Maximum Queue Capacity
                </Text>
                <Text className="text-xs text-[#737686] mt-0.5">
                  Cap per operating session
                </Text>
              </View>
              <View className="flex-row items-center gap-3 bg-white px-2 py-1.5 rounded-lg shadow-xs">
                <TouchableOpacity
                  accessibilityLabel="Decrease capacity"
                  activeOpacity={0.7}
                  onPress={() => handleAdjustCapacity(-5)}
                  className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center active:scale-90"
                >
                  <MaterialIcons name="remove" size={18} color="#131B2E" />
                </TouchableOpacity>
                <Text className="text-base font-bold text-[#131B2E] w-8 text-center tabular-nums">
                  {capacity}
                </Text>
                <TouchableOpacity
                  accessibilityLabel="Increase capacity"
                  activeOpacity={0.7}
                  onPress={() => handleAdjustCapacity(5)}
                  className="w-9 h-9 rounded-full bg-[#004AC6] items-center justify-center active:scale-90 shadow-xs"
                >
                  <MaterialIcons name="add" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center gap-1 ml-0.5">
              <MaterialIcons name="info" size={14} color="#737686" />
              <Text className="text-xs text-[#737686]">
                Maximum number of customers allowed in this queue at one time.
              </Text>
            </View>
          </View>

          {/* Section 3: Service Time */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons name="schedule" size={20} color="#004AC6" />
              <Text className="text-base font-bold text-[#131B2E]">
                3. Service Time
              </Text>
            </View>

            <Text className="text-sm font-semibold text-[#131B2E] mb-2">
              Average Service Time
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-2">
              {PRESET_TIME_OPTIONS.map((option) => {
                const isSelected =
                  !isCustomTime && serviceMinutes === option.minutes;
                return (
                  <TouchableOpacity
                    key={option.label}
                    activeOpacity={0.7}
                    onPress={() => handleSelectTimeChip(option.minutes)}
                    className={`flex-1 min-w-[21%] py-2.5 px-2 rounded-xl items-center justify-center ${
                      isSelected
                        ? "bg-[#004AC6] shadow-xs"
                        : "bg-[#F2F3FF] active:bg-[#EAEDFF]"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? "text-white" : "text-[#131B2E]"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Custom Chip */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleOpenCustomTimeModal}
                className={`w-full py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${
                  isCustomTime
                    ? "bg-[#004AC6] shadow-xs"
                    : "bg-[#F2F3FF] active:bg-[#EAEDFF]"
                }`}
              >
                <MaterialIcons
                  name="tune"
                  size={16}
                  color={isCustomTime ? "#FFFFFF" : "#131B2E"}
                />
                <Text
                  className={`text-xs font-bold ${
                    isCustomTime ? "text-white" : "text-[#131B2E]"
                  }`}
                >
                  {isCustomTime ? `Custom (${serviceMinutes} min)` : "Custom"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-1 ml-0.5">
              <MaterialIcons name="info" size={14} color="#737686" />
              <Text className="text-xs text-[#737686]">
                This is used to estimate customer waiting times.
              </Text>
            </View>
          </View>

          {/* Section 4: Service Counters */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons name="meeting-room" size={20} color="#004AC6" />
              <Text className="text-base font-bold text-[#131B2E]">
                4. Service Counters
              </Text>
            </View>

            <View className="bg-[#F2F3FF] p-3 rounded-xl flex-row items-center justify-between mb-2">
              <View className="flex-col pl-1">
                <Text className="text-sm font-semibold text-[#131B2E]">
                  Number of Counters
                </Text>
                <Text className="text-xs font-semibold text-[#004AC6] mt-0.5">
                  {counters} active counter{counters > 1 ? "s" : ""}
                </Text>
              </View>
              <View className="flex-row items-center gap-3 bg-white px-2 py-1.5 rounded-lg shadow-xs">
                <TouchableOpacity
                  accessibilityLabel="Decrease counters"
                  activeOpacity={0.7}
                  onPress={() => handleAdjustCounters(-1)}
                  className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center active:scale-90"
                >
                  <MaterialIcons name="remove" size={18} color="#131B2E" />
                </TouchableOpacity>
                <Text className="text-base font-bold text-[#131B2E] w-6 text-center tabular-nums">
                  {counters}
                </Text>
                <TouchableOpacity
                  accessibilityLabel="Increase counters"
                  activeOpacity={0.7}
                  onPress={() => handleAdjustCounters(1)}
                  className="w-9 h-9 rounded-full bg-[#004AC6] items-center justify-center active:scale-90 shadow-xs"
                >
                  <MaterialIcons name="add" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center gap-1 ml-0.5">
              <MaterialIcons name="info" size={14} color="#737686" />
              <Text className="text-xs text-[#737686]">
                More active counters can reduce estimated waiting time.
              </Text>
            </View>
          </View>

          {/* Section 5: Operating Hours */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="calendar-today" size={20} color="#004AC6" />
                <Text className="text-base font-bold text-[#131B2E]">
                  5. Operating Hours
                </Text>
              </View>
              <View className="bg-[#6FFBBE] px-2.5 py-0.5 rounded-full">
                <Text className="text-[11px] font-bold text-[#002113] uppercase tracking-wider">
                  Standard
                </Text>
              </View>
            </View>

            {/* Day Selector Row */}
            <View className="flex-row items-center justify-between mb-3">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDay === day;
                const isSunday = day === "Sun";
                return (
                  <TouchableOpacity
                    key={day}
                    activeOpacity={0.7}
                    onPress={() => {
                      try {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      } catch {}
                      setSelectedDay(day);
                    }}
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      isSelected
                        ? "bg-[#004AC6] shadow-xs"
                        : isSunday
                        ? "bg-[#D2D9F4]/70"
                        : "bg-[#EAEDFF]"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected
                          ? "text-white"
                          : isSunday
                          ? "text-[#434655]/60"
                          : "text-[#131B2E]"
                      }`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Day Schedule Detail */}
            <View className="bg-[#F2F3FF] rounded-xl p-3.5 mb-2.5">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <View
                    className={`w-2.5 h-2.5 rounded-full ${
                      selectedDay === "Sun" ? "bg-[#737686]" : "bg-[#006242]"
                    }`}
                  />
                  <Text className="text-sm font-bold text-[#131B2E]">
                    {selectedDay === "Mon"
                      ? "Monday"
                      : selectedDay === "Tue"
                      ? "Tuesday"
                      : selectedDay === "Wed"
                      ? "Wednesday"
                      : selectedDay === "Thu"
                      ? "Thursday"
                      : selectedDay === "Fri"
                      ? "Friday"
                      : selectedDay === "Sat"
                      ? "Saturday"
                      : "Sunday"}
                  </Text>
                  <Text
                    className={`text-[11px] font-bold ${
                      selectedDay === "Sun" ? "text-[#737686]" : "text-[#006242]"
                    }`}
                  >
                    {selectedDay === "Sun" ? "⚪ Closed" : "🟢 Open"}
                  </Text>
                </View>

                {selectedDay !== "Sun" && (
                  <TouchableOpacity
                    accessibilityLabel="Edit schedule"
                    activeOpacity={0.7}
                    onPress={() => {
                      setTempHoursInput(operatingHours);
                      setIsEditHoursModalVisible(true);
                    }}
                    className="w-8 h-8 rounded-full bg-white shadow-xs items-center justify-center active:scale-90"
                  >
                    <MaterialIcons name="edit" size={16} color="#434655" />
                  </TouchableOpacity>
                )}
              </View>

              {selectedDay !== "Sun" ? (
                <View className="flex-row items-center gap-2 bg-white px-3.5 py-2.5 rounded-lg shadow-xs">
                  <MaterialIcons name="alarm" size={18} color="#004AC6" />
                  <Text className="text-sm font-bold text-[#131B2E]">
                    {operatingHours}
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2 bg-white px-3.5 py-2.5 rounded-lg shadow-xs">
                  <MaterialIcons name="alarm-off" size={18} color="#737686" />
                  <Text className="text-sm font-semibold text-[#737686]">
                    Closed on Sundays
                  </Text>
                </View>
              )}
            </View>

            {/* Weekdays Summary Toggle & Sunday State */}
            <View className="gap-2">
              <View className="flex-row items-center justify-between p-3 bg-[#F2F3FF] rounded-xl">
                <View className="flex-col">
                  <Text className="text-xs font-bold text-[#131B2E]">
                    Weekdays Schedule
                  </Text>
                  <Text className="text-[11px] text-[#737686] mt-0.5">
                    Applied automatically to Mon - Fri
                  </Text>
                </View>
                <Switch
                  value={weekdaysScheduleEnabled}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setWeekdaysScheduleEnabled(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="flex-row items-center justify-between p-3 bg-[#D2D9F4]/30 rounded-xl">
                <View className="flex-row items-center gap-2">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#C3C6D7]" />
                  <Text className="text-xs font-semibold text-[#434655]">
                    Sunday
                  </Text>
                </View>
                <Text className="text-[11px] font-semibold text-[#737686]">
                  ⚪ Closed
                </Text>
              </View>
            </View>
          </View>

          {/* Section 6: Virtual Queue */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="cloud-done" size={22} color="#1E40AF" />
                <Text className="text-base font-bold text-[#131B2E]">
                  6. Virtual Queue
                </Text>
              </View>
              <View className="bg-[#DBE1FF] px-2.5 py-0.5 rounded-full">
                <Text className="text-[11px] font-bold text-[#00174B] uppercase tracking-wider">
                  Remote
                </Text>
              </View>
            </View>

            <View className="bg-[#EFF4FF] p-4 rounded-xl flex-row items-start justify-between gap-3">
              <View className="flex-col flex-1 pr-1">
                <Text className="text-sm font-bold text-[#131B2E]">
                  Allow customers to join remotely
                </Text>
                <Text className="text-xs text-[#434655] mt-1 leading-4">
                  Customers can join this queue from the QueueUp app without
                  physically waiting at the location.
                </Text>
              </View>
              <Switch
                value={virtualQueueEnabled}
                onValueChange={(val) => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {}
                  setVirtualQueueEnabled(val);
                }}
                trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Section 7: Customer Notifications */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons
                name="notifications-active"
                size={20}
                color="#004AC6"
              />
              <Text className="text-base font-bold text-[#131B2E]">
                7. Customer Notifications
              </Text>
            </View>

            <View className="gap-2.5">
              <View className="flex-row items-center justify-between p-3 bg-[#F2F3FF] rounded-xl">
                <View className="flex-col flex-1 pr-2">
                  <Text className="text-sm font-semibold text-[#131B2E]">
                    Queue Position Updates
                  </Text>
                  <Text className="text-xs text-[#737686] mt-0.5">
                    Notify customers when their position changes.
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

              <View className="flex-row items-center justify-between p-3 bg-[#F2F3FF] rounded-xl">
                <View className="flex-col flex-1 pr-2">
                  <Text className="text-sm font-semibold text-[#131B2E]">
                    Almost Your Turn
                  </Text>
                  <Text className="text-xs text-[#737686] mt-0.5">
                    Notify customers when they are close to being served.
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

              <View className="flex-row items-center justify-between p-3 bg-[#F2F3FF] rounded-xl">
                <View className="flex-col flex-1 pr-2">
                  <Text className="text-sm font-semibold text-[#131B2E]">
                    Your Turn
                  </Text>
                  <Text className="text-xs text-[#737686] mt-0.5">
                    Notify customers when it is their turn.
                  </Text>
                </View>
                <Switch
                  value={notifyYourTurn}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setNotifyYourTurn(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Section 8: Queue Rules */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons name="policy" size={20} color="#004AC6" />
              <Text className="text-base font-bold text-[#131B2E]">
                8. Queue Rules
              </Text>
            </View>

            <View className="gap-2.5">
              <View className="flex-row items-center justify-between p-3 bg-[#F2F3FF] rounded-xl">
                <Text className="text-sm font-semibold text-[#131B2E] flex-1 pr-2">
                  Allow customers to leave queue
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

              <View className="flex-row items-center justify-between p-3 bg-[#F2F3FF] rounded-xl">
                <Text className="text-sm font-semibold text-[#131B2E] flex-1 pr-2">
                  Automatically close when capacity is reached
                </Text>
                <Switch
                  value={ruleAutoCloseOnCapacity}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setRuleAutoCloseOnCapacity(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="flex-row items-center justify-between p-3 bg-[#F2F3FF] rounded-xl">
                <Text className="text-sm font-semibold text-[#131B2E] flex-1 pr-2">
                  Allow rejoining after cancellation
                </Text>
                <Switch
                  value={ruleAllowRejoining}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setRuleAllowRejoining(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View className="flex-row items-center justify-between p-3 bg-[#F2F3FF] rounded-xl">
                <Text className="text-sm font-semibold text-[#131B2E] flex-1 pr-2">
                  Automatically reset queue every day
                </Text>
                <Switch
                  value={ruleAutoResetDaily}
                  onValueChange={(val) => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setRuleAutoResetDaily(val);
                  }}
                  trackColor={{ false: "#D2D9F4", true: "#004AC6" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Section 9: Customer Preview (Real-time Live Widget) */}
          <View
            style={styles.cardShadow}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/90"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-col">
                <Text className="text-base font-bold text-[#131B2E]">
                  Customer Preview
                </Text>
                <Text className="text-xs text-[#737686] mt-0.5">
                  What customers will see in the QueueUp app
                </Text>
              </View>
              <MaterialIcons name="devices" size={24} color="#1E40AF" />
            </View>

            {/* Live Preview Card */}
            <View className="bg-[#F2F3FF] p-4 rounded-xl border border-[#EAEDFF] gap-3">
              <View className="flex-row items-start justify-between">
                <View className="flex-col min-w-0 flex-1 pr-2">
                  <Text className="text-[11px] font-bold text-[#004AC6] uppercase tracking-wider">
                    Queue Service
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-base font-bold text-[#131B2E] mt-0.5"
                  >
                    {queueName.trim() || "General Consultation"}
                  </Text>
                </View>

                {/* Animated Accepting Badge */}
                <View className="bg-[#6FFBBE] px-2.5 py-1 rounded-full flex-row items-center gap-1.5 shadow-xs">
                  <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-1.5 h-1.5 rounded-full bg-[#006242]"
                  />
                  <Text className="text-[11px] font-bold text-[#002113]">
                    Accepting Queue
                  </Text>
                </View>
              </View>

              {/* Metric Telemetry */}
              <View className="flex-row items-center gap-2 bg-white p-2 rounded-lg shadow-xs">
                <View className="flex-1 items-center justify-center p-1">
                  <Text className="text-base font-bold text-[#004AC6]">18</Text>
                  <Text className="text-[11px] text-[#737686]">people waiting</Text>
                </View>
                <View className="flex-1 items-center justify-center p-1 bg-[#F2F3FF] rounded">
                  <Text className="text-base font-bold text-[#131B2E]">
                    ~{estWaitTimeMinutes} min
                  </Text>
                  <Text className="text-[11px] text-[#737686]">est. wait</Text>
                </View>
                <View className="flex-1 items-center justify-center p-1">
                  <Text className="text-xs font-bold text-[#131B2E]">5:00 PM</Text>
                  <Text className="text-[11px] text-[#737686]">Open until</Text>
                </View>
              </View>

              {/* Disabled CTA Mock */}
              <View className="w-full h-11 bg-[#004AC6]/15 rounded-xl flex-row items-center justify-center gap-2 opacity-80">
                <MaterialIcons name="how-to-reg" size={18} color="#004AC6" />
                <Text className="text-xs font-bold text-[#004AC6]">
                  [ Join Queue ]
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Section 10: Sticky Bottom Action Area */}
        <View
          style={[
            styles.bottomBarShadow,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
          className="absolute bottom-0 inset-x-0 bg-[#FAF8FF]/95 border-t border-[#EAEDFF] px-4 pt-3 gap-2"
        >
          <TouchableOpacity
            accessibilityLabel="Create Queue"
            accessibilityRole="button"
            activeOpacity={0.8}
            disabled={isSubmitting}
            onPress={handleCreateQueue}
            style={styles.primaryButtonShadow}
            className="w-full h-12 bg-[#004AC6] rounded-xl flex-row items-center justify-center gap-2 active:scale-98"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-sm font-bold text-white">Create Queue</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Cancel"
            accessibilityRole="button"
            activeOpacity={0.7}
            disabled={isSubmitting}
            onPress={handleCancel}
            className="w-full h-10 items-center justify-center rounded-xl"
          >
            <Text className="text-sm font-semibold text-[#434655]">Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Success Toast Modal (matches Stitch design delight interaction) */}
        {isSuccessToastVisible && (
          <Animated.View
            style={[
              styles.liveToast,
              {
                bottom: insets.bottom + 92,
                opacity: toastAnim,
                transform: [
                  {
                    translateY: toastAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View className="flex-row items-center gap-3 flex-1 min-w-0">
              <View className="w-8 h-8 rounded-full bg-[#6FFBBE] items-center justify-center flex-shrink-0">
                <MaterialIcons name="check" size={18} color="#002113" />
              </View>
              <View className="flex-col flex-1 min-w-0">
                <Text
                  numberOfLines={1}
                  className="text-xs font-bold text-white tracking-wide"
                >
                  Queue Created Successfully!
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-[11px] text-[#EEF0FF]/80 mt-0.5"
                >
                  Broadcasting live across terminals
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDismissToast}
              className="p-1"
            >
              <MaterialIcons name="close" size={18} color="#EEF0FF" />
            </TouchableOpacity>
          </Animated.View>
        )}

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
                {SERVICE_TYPES.map((type) => {
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
                Custom Service Time
              </Text>
              <Text className="text-xs text-[#737686] mb-4">
                Enter estimated average minutes per consultation (1 - 120 mins).
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
              className="w-full bg-white rounded-2xl p-5 shadow-xl max-w-sm"
            >
              <Text className="text-base font-bold text-[#131B2E] mb-1">
                Edit Operating Hours
              </Text>
              <Text className="text-xs text-[#737686] mb-4">
                Set session schedule format: e.g. 09:00 AM – 05:00 PM
              </Text>

              <View className="h-12 bg-[#F2F3FF] rounded-xl px-4 border border-[#EAEDFF] justify-center mb-4">
                <TextInput
                  value={tempHoursInput}
                  onChangeText={setTempHoursInput}
                  placeholder="e.g. 09:00 AM – 05:00 PM"
                  autoFocus
                  className="text-sm text-[#131B2E] font-medium p-0"
                />
              </View>

              <View className="flex-row items-center gap-2">
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
                    if (tempHoursInput.trim()) {
                      setOperatingHours(tempHoursInput.trim());
                    }
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
  liveToast: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#283044",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
});
