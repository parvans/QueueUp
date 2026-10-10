import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  StyleSheet,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function BusinessDashboardScreen() {
  const insets = useSafeAreaInsets();

  // Dynamic Dashboard States
  const [servingTicket, setServingTicket] = useState<string>("A-035");
  const [waitingCount, setWaitingCount] = useState<number>(24);
  const [completedCount, setCompletedCount] = useState<number>(67);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(258); // 04:18
  const [isStaffModalVisible, setIsStaffModalVisible] = useState<boolean>(false);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastSubtext, setToastSubtext] = useState<string>("CHIMED");
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pulse Animation for live telemetry
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

  // Elapsed timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const showToast = (message: string, sub: string = "CHIMED") => {
    setToastMessage(message);
    setToastSubtext(sub);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    toastTimeoutRef.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, 2800);
  };

  // Call Next Action
  const handleCallNext = (ticket: string = "A-036") => {
    try {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    } catch {}

    setServingTicket(ticket);
    setWaitingCount((prev) => Math.max(prev - 1, 0));
    setCompletedCount((prev) => prev + 1);
    setElapsedSeconds(0);
    showToast(`Calling Ticket ${ticket} to Counter 2`, "CHIMED");
  };

  // Quick Action: Add Assistant Counter
  const handleAddCounter = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {}
    showToast("Counter 4 assigned to Pediatric Consultation", "UPDATED");
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Sticky Top Header matching Stitch */}
      <View className="px-4 pt-2.5 pb-2.5 bg-[#FAF8FF]/95 border-b border-[#EAEDFF] z-40">
        <View className="flex-row items-center justify-between">
          {/* Clinic Brand & Identity */}
          <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
            <Image
              source={require("@/assets/images/queueup-logo.png")}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
            <View className="flex-col min-w-0">
              <View className="flex-row items-center gap-1.5">
                <Text
                  numberOfLines={1}
                  className="text-base font-bold text-[#131B2E] truncate leading-tight"
                >
                  City Care Clinic
                </Text>
                <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50">
                  <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-1.5 h-1.5 rounded-full bg-[#007D55]"
                  />
                  <Text className="text-[10px] font-bold text-[#007D55]">
                    Open
                  </Text>
                </View>
              </View>
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider mt-0.5">
                DASHBOARD
              </Text>
            </View>
          </View>

          {/* Right Action Icons: Notifications & Staff Profile */}
          <View className="flex-row items-center gap-1.5 flex-shrink-0">
            <TouchableOpacity
              accessibilityLabel="Notifications"
              activeOpacity={0.7}
              onPress={() => router.push("/notifications" as any)}
              className="relative w-9 h-9 rounded-full items-center justify-center active:bg-[#EAEDFF]"
            >
              <Ionicons name="notifications-outline" size={20} color="#434655" />
              <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BA1A1A] border border-white" />
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityLabel="Staff Profile"
              activeOpacity={0.8}
              onPress={() => setIsStaffModalVisible(true)}
              className="w-8 h-8 rounded-full bg-[#004AC6] items-center justify-center ml-0.5 active:bg-[#003EA8]"
              style={styles.avatarShadow}
            >
              <Ionicons name="person" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Syncing Telemetry Bar nested under Clinic Info */}
        <View className="flex-row items-center justify-between px-2.5 py-1 rounded-lg bg-[#EAEDFF]/70 border border-[#E2E7FF]/80 mt-2">
          <View className="flex-row items-center gap-1.5 min-w-0">
            <Animated.View
              style={{ opacity: pulseAnim }}
              className="w-2 h-2 rounded-full bg-[#007D55]"
            />
            <Text
              numberOfLines={1}
              className="text-[10px] font-bold text-[#434655] tracking-wider uppercase truncate"
            >
              LIVE SYNCING WITH CUSTOMER APPS
            </Text>
          </View>
          <Text className="text-[10px] text-[#737686] font-medium flex-shrink-0 pl-2">
            Refreshed 4s ago
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom, 16) + 84,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Connected Segmented Executive Overview Card Container (2x2 Segmented Layout) */}
        <View
          className="bg-white rounded-2xl border border-[#EAEDFF] overflow-hidden mb-4"
          style={styles.cardShadow}
        >
          <View className="flex-row divide-x divide-[#EAEDFF]">
            {/* Segment 1: WAITING */}
            <View className="flex-1 p-3.5 flex-col justify-between">
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-bold text-[#434655] tracking-wider uppercase">
                  WAITING
                </Text>
                <View className="flex-row items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#6FFBBE]/35">
                  <Ionicons name="trending-down" size={11} color="#005236" />
                  <Text className="text-[10px] font-bold text-[#005236]">
                    -8%
                  </Text>
                </View>
              </View>
              <View className="my-1.5">
                <Text className="text-[32px] font-extrabold text-[#004AC6] leading-tight">
                  {waitingCount}
                </Text>
                <Text className="text-xs text-[#434655]">Customers in line</Text>
              </View>
              <View className="w-full bg-[#EAEDFF] rounded-full h-1 mt-1 overflow-hidden">
                <View className="bg-[#004AC6] h-full rounded-full w-[68%]" />
              </View>
            </View>

            {/* Segment 2: SERVING NOW */}
            <View className="flex-1 p-3.5 flex-col justify-between">
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-bold text-[#434655] tracking-wider uppercase">
                  SERVING NOW
                </Text>
                <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50">
                  <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-1.5 h-1.5 rounded-full bg-[#007D55]"
                  />
                  <Text className="text-[10px] font-bold text-[#007D55]">
                    Live
                  </Text>
                </View>
              </View>
              <View className="my-1.5">
                <Text className="text-[32px] font-extrabold text-[#007D55] leading-tight">
                  {servingTicket}
                </Text>
                <Text numberOfLines={1} className="text-xs text-[#434655]">
                  Counter 2 • Dr. Roberto
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mt-1">
                <Ionicons name="timer-outline" size={13} color="#007D55" />
                <Text className="text-[11px] text-[#007D55] font-semibold">
                  {formatElapsed(elapsedSeconds)} elapsed
                </Text>
              </View>
            </View>
          </View>

          {/* Divider Horizontal */}
          <View className="h-px w-full bg-[#EAEDFF]" />

          <View className="flex-row divide-x divide-[#EAEDFF]">
            {/* Segment 3: AVG WAIT */}
            <View className="flex-1 p-3.5 flex-col justify-between">
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-bold text-[#434655] tracking-wider uppercase">
                  AVG WAIT
                </Text>
                <Ionicons name="time-outline" size={15} color="#004AC6" />
              </View>
              <View className="my-1.5">
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-[32px] font-extrabold text-[#131B2E] leading-tight">
                    18
                  </Text>
                  <Text className="text-sm font-normal text-[#434655]">min</Text>
                </View>
                <Text className="text-xs text-[#434655]">Est. customer delay</Text>
              </View>
              <Text className="text-[11px] text-[#434655] font-medium mt-1">
                <Text className="text-[#007D55] font-bold">Good</Text> • Target &lt; 25m
              </Text>
            </View>

            {/* Segment 4: COMPLETED */}
            <View className="flex-1 p-3.5 flex-col justify-between">
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-bold text-[#434655] tracking-wider uppercase">
                  COMPLETED
                </Text>
                <Ionicons name="checkmark-circle" size={15} color="#007D55" />
              </View>
              <View className="my-1.5">
                <Text className="text-[32px] font-extrabold text-[#131B2E] leading-tight">
                  {completedCount}
                </Text>
                <Text className="text-xs text-[#434655]">Visits served today</Text>
              </View>
              <Text className="text-[11px] text-[#434655] font-medium mt-1">
                <Text className="text-[#004AC6] font-bold">+14</Text> since noon
              </Text>
            </View>
          </View>
        </View>

        {/* Integrated Management & Quick Actions Control Bar */}
        <View
          className="bg-[#F2F3FF] p-2.5 rounded-2xl border border-[#EAEDFF] mb-4"
          style={styles.cardShadow}
        >
          <View className="flex-row items-center justify-between px-1 mb-2">
            <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
              QUICK ACTIONS
            </Text>
            <Text className="text-xs font-semibold text-[#004AC6]">
              Shortcuts
            </Text>
          </View>

          <View className="flex-row gap-2">
            {/* Call Next Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCallNext("A-036")}
              className="flex-1 h-11 px-3 rounded-xl bg-[#007D55] flex-row items-center justify-center gap-1.5 active:bg-[#006242]"
              style={styles.actionButtonShadow}
            >
              <Ionicons name="volume-high" size={17} color="#FFFFFF" />
              <Text
                numberOfLines={1}
                className="text-xs font-bold text-white leading-none truncate"
              >
                Call Next (A-036)
              </Text>
            </TouchableOpacity>

            {/* + New Queue Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(business)/create-queue" as any)}
              className="flex-1 h-11 px-3 rounded-xl bg-[#004AC6] flex-row items-center justify-center gap-1.5 active:bg-[#003EA8]"
              style={styles.primaryButtonShadow}
            >
              <Ionicons name="add-circle" size={17} color="#FFFFFF" />
              <Text
                numberOfLines={1}
                className="text-xs font-bold text-white leading-none truncate"
              >
                New Queue
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Queues Section (Dense Executive Tabular Architecture) */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2 px-0.5">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-[#131B2E]">
                Active Queues
              </Text>
              <View className="bg-[#DAE2FD] px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-[#131B2E]">
                  2 Online
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(business)/create-queue" as any)}
              className="flex-row items-center gap-1 py-1 px-1.5 rounded-lg active:bg-[#EAEDFF]"
            >
              <Ionicons name="add" size={16} color="#004AC6" />
              <Text className="text-xs font-bold text-[#004AC6]">
                Create Queue
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Queue Card 1: General Consultation */}
          <View
            className="bg-white rounded-2xl border border-[#EAEDFF] p-3.5 mb-3"
            style={styles.cardShadow}
          >
            {/* Top Row: Department Info + Status Tag */}
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1 min-w-0">
                <View className="flex-row items-center gap-2">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-bold text-[#131B2E] truncate"
                  >
                    General Consultation
                  </Text>
                  <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50">
                    <View className="w-1.5 h-1.5 rounded-full bg-[#007D55]" />
                    <Text className="text-[10px] font-bold text-[#007D55]">
                      Accepting
                    </Text>
                  </View>
                </View>
                <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider mt-0.5">
                  PRIMARY CARE • FLOOR 1
                </Text>
              </View>

              <TouchableOpacity
                accessibilityLabel="Queue settings"
                activeOpacity={0.7}
                onPress={() => router.push("/(business)/edit-queue" as any)}
                className="w-8 h-8 rounded-lg items-center justify-center text-[#434655] active:bg-[#EAEDFF]"
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#434655" />
              </TouchableOpacity>
            </View>

            {/* Serving Ticket Callout Strip */}
            <View className="bg-[#F2F3FF] px-3 py-2 rounded-xl flex-row items-center justify-between my-2.5">
              <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
                <View className="w-8 h-8 rounded-lg bg-[#004AC6]/10 items-center justify-center flex-shrink-0">
                  <Ionicons name="card-outline" size={17} color="#004AC6" />
                </View>
                <View className="flex-col min-w-0 flex-1">
                  <Text className="text-[9px] font-bold text-[#434655] uppercase tracking-wider">
                    SERVING TICKET
                  </Text>
                  <View className="flex-row items-baseline gap-1.5 truncate">
                    <Text className="text-base font-bold text-[#004AC6]">
                      {servingTicket}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="text-xs text-[#434655] truncate"
                    >
                      Counter 2 • Dr. Roberto
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-1 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                <Animated.View
                  style={{ opacity: pulseAnim }}
                  className="w-1.5 h-1.5 rounded-full bg-[#007D55]"
                />
                <Text className="text-[10px] font-bold text-[#007D55]">
                  In Service
                </Text>
              </View>
            </View>

            {/* Tabular Metrics Bar */}
            <View className="flex-row divide-x divide-[#EAEDFF] bg-[#EAEDFF]/40 rounded-xl py-2 mb-2.5">
              <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase">
                  Waiting
                </Text>
                <Text className="text-sm font-bold text-[#131B2E]">24</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase">
                  Est. Wait
                </Text>
                <Text className="text-sm font-bold text-[#131B2E]">18 m</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase">
                  Counters
                </Text>
                <Text className="text-sm font-bold text-[#131B2E]">2 Active</Text>
              </View>
            </View>

            {/* Card Action Row */}
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(business)/queue-management" as any)}
                className="flex-1 h-10 px-3 rounded-xl bg-[#004AC6] flex-row items-center justify-center gap-1.5 active:bg-[#003EA8]"
                style={styles.primaryButtonShadow}
              >
                <Text className="text-xs font-bold text-white">
                  Manage Queue
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Call Next in General Consultation"
                activeOpacity={0.8}
                onPress={() => handleCallNext("A-036")}
                className="w-10 h-10 rounded-xl bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
              >
                <Ionicons name="volume-high" size={17} color="#004AC6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Queue Card 2: Pediatric Consultation */}
          <View
            className="bg-white rounded-2xl border border-[#EAEDFF] p-3.5"
            style={styles.cardShadow}
          >
            {/* Top Row: Department Info + Status Tag */}
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1 min-w-0">
                <View className="flex-row items-center gap-2">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-bold text-[#131B2E] truncate"
                  >
                    Pediatric Consultation
                  </Text>
                  <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50">
                    <View className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <Text className="text-[10px] font-bold text-amber-800">
                      Busy
                    </Text>
                  </View>
                </View>
                <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider mt-0.5">
                  SPECIALTY WING • FLOOR 2
                </Text>
              </View>

              <TouchableOpacity
                accessibilityLabel="Queue settings"
                activeOpacity={0.7}
                onPress={() => router.push("/(business)/edit-queue" as any)}
                className="w-8 h-8 rounded-lg items-center justify-center text-[#434655] active:bg-[#EAEDFF]"
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#434655" />
              </TouchableOpacity>
            </View>

            {/* Serving Ticket Callout Strip */}
            <View className="bg-[#F2F3FF] px-3 py-2 rounded-xl flex-row items-center justify-between my-2.5">
              <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
                <View className="w-8 h-8 rounded-lg bg-amber-100 items-center justify-center flex-shrink-0">
                  <Ionicons name="happy-outline" size={17} color="#B45309" />
                </View>
                <View className="flex-col min-w-0 flex-1">
                  <Text className="text-[9px] font-bold text-[#434655] uppercase tracking-wider">
                    SERVING TICKET
                  </Text>
                  <View className="flex-row items-baseline gap-1.5 truncate">
                    <Text className="text-base font-bold text-[#131B2E]">
                      P-018
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="text-xs text-[#434655] truncate"
                    >
                      Desk 3 • Dr. Evelyn
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-amber-100/80 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-amber-800">
                  Delayed +6m
                </Text>
              </View>
            </View>

            {/* Tabular Metrics Bar */}
            <View className="flex-row divide-x divide-[#EAEDFF] bg-[#EAEDFF]/40 rounded-xl py-2 mb-2.5">
              <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase">
                  Waiting
                </Text>
                <Text className="text-sm font-bold text-[#131B2E]">12</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase">
                  Est. Wait
                </Text>
                <Text className="text-sm font-bold text-amber-800">25 m</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase">
                  Counters
                </Text>
                <Text className="text-sm font-bold text-[#131B2E]">1 Active</Text>
              </View>
            </View>

            {/* Card Action Row */}
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(business)/queue-management" as any)}
                className="flex-1 h-10 px-3 rounded-xl bg-[#EAEDFF] flex-row items-center justify-center gap-1.5 active:bg-[#DAE2FD]"
              >
                <Text className="text-xs font-bold text-[#131B2E]">
                  Manage Queue
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#131B2E" />
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Add assistance counter"
                activeOpacity={0.8}
                onPress={handleAddCounter}
                className="w-10 h-10 rounded-xl bg-[#F2F3FF] items-center justify-center active:bg-[#EAEDFF]"
              >
                <Ionicons name="person-add-outline" size={17} color="#004AC6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Compact Notification Feed / Recent Activity */}
        <View className="mb-2">
          <View className="flex-row items-center justify-between mb-2 px-0.5">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-base font-bold text-[#131B2E]">
                Recent Activity
              </Text>
              <View className="w-2 h-2 rounded-full bg-[#007D55]" />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => showToast("Opening full audit event log...", "AUDIT")}
              className="py-1 px-1.5 rounded-lg active:bg-[#EAEDFF]"
            >
              <Text className="text-xs font-semibold text-[#004AC6]">
                View All Log
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className="bg-white rounded-2xl border border-[#EAEDFF] divide-y divide-[#EAEDFF]/60 overflow-hidden"
            style={styles.cardShadow}
          >
            {/* Event 1 */}
            <View className="px-3.5 py-2.5 flex-row items-center gap-3">
              <View className="w-7 h-7 rounded-full bg-[#004AC6]/10 items-center justify-center flex-shrink-0">
                <Ionicons name="person-add-outline" size={14} color="#004AC6" />
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex-row items-center justify-between gap-1">
                  <Text numberOfLines={1} className="text-xs text-[#131B2E] truncate flex-1">
                    <Text className="font-bold text-[#004AC6]">A-036</Text> joined General Consultation
                  </Text>
                  <Text className="text-[10px] text-[#737686] flex-shrink-0">
                    2m ago
                  </Text>
                </View>
                <Text className="text-[11px] text-[#737686] truncate">
                  Walk-in QR self check-in kiosk
                </Text>
              </View>
            </View>

            {/* Event 2 */}
            <View className="px-3.5 py-2.5 flex-row items-center gap-3">
              <View className="w-7 h-7 rounded-full bg-emerald-50 items-center justify-center flex-shrink-0">
                <Ionicons name="checkmark-done" size={14} color="#007D55" />
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex-row items-center justify-between gap-1">
                  <Text numberOfLines={1} className="text-xs text-[#131B2E] truncate flex-1">
                    <Text className="font-bold text-[#007D55]">A-035</Text> completed at Counter 2
                  </Text>
                  <Text className="text-[10px] text-[#737686] flex-shrink-0">
                    4m ago
                  </Text>
                </View>
                <Text className="text-[11px] text-[#737686] truncate">
                  Session duration: 9 mins
                </Text>
              </View>
            </View>

            {/* Event 3 */}
            <View className="px-3.5 py-2.5 flex-row items-center gap-3">
              <View className="w-7 h-7 rounded-full bg-rose-50 items-center justify-center flex-shrink-0">
                <Ionicons name="close-circle-outline" size={14} color="#BA1A1A" />
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex-row items-center justify-between gap-1">
                  <Text numberOfLines={1} className="text-xs text-[#131B2E] truncate flex-1">
                    <Text className="font-bold text-[#131B2E]">A-034</Text> was marked skipped
                  </Text>
                  <Text className="text-[10px] text-[#737686] flex-shrink-0">
                    7m ago
                  </Text>
                </View>
                <Text className="text-[11px] text-[#737686] truncate">
                  No-show after 3 audio announcements
                </Text>
              </View>
            </View>

            {/* Event 4 */}
            <View className="px-3.5 py-2.5 flex-row items-center gap-3">
              <View className="w-7 h-7 rounded-full bg-amber-50 items-center justify-center flex-shrink-0">
                <Ionicons name="pause-circle-outline" size={14} color="#B45309" />
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex-row items-center justify-between gap-1">
                  <Text numberOfLines={1} className="text-xs text-[#131B2E] truncate flex-1">
                    Pediatric Consultation paused
                  </Text>
                  <Text className="text-[10px] text-[#737686] flex-shrink-0">
                    12m ago
                  </Text>
                </View>
                <Text className="text-[11px] text-[#737686] truncate">
                  Sanitization protocol at Counter 3
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Toast matching Stitch */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.actionToast,
          {
            opacity: toastAnim,
            bottom: Math.max(insets.bottom, 12) + 70,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
          <Ionicons name="megaphone" size={18} color="#6FFBBE" />
          <Text
            numberOfLines={1}
            className="text-xs font-semibold text-[#EEF0FF] truncate"
          >
            {toastMessage}
          </Text>
        </View>
        <Text className="text-[10px] font-bold text-[#B4C5FF] uppercase tracking-wider flex-shrink-0">
          {toastSubtext}
        </Text>
      </Animated.View>

      {/* Fixed Bottom Staff Shell Navigation Bar matching Stitch */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 10) }}
        className="bg-[#FAF8FF]/95 border-t border-[#EAEDFF] absolute bottom-0 left-0 right-0 z-30"
      >
        <View className="h-16 px-2 flex-row items-center justify-around max-w-md mx-auto w-full">
          {/* Tab 1: Dashboard (Active) */}
          <TouchableOpacity
            accessibilityLabel="Dashboard tab"
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-1"
          >
            <Ionicons name="grid" size={22} color="#004AC6" />
            <Text className="text-[11px] font-bold text-[#004AC6] mt-0.5">
              Dashboard
            </Text>
          </TouchableOpacity>

          {/* Tab 2: Queues */}
          <TouchableOpacity
            accessibilityLabel="Queues tab"
            activeOpacity={0.7}
            onPress={() => router.push("/(business)/queue-management" as any)}
            className="flex-1 items-center justify-center py-1"
          >
            <Ionicons name="list-outline" size={22} color="#434655" />
            <Text className="text-[11px] font-medium text-[#434655] mt-0.5">
              Queues
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Customers */}
          <TouchableOpacity
            accessibilityLabel="Customers tab"
            activeOpacity={0.7}
            onPress={() => showToast("Opening Customer Roster...", "ROSTER")}
            className="flex-1 items-center justify-center py-1"
          >
            <Ionicons name="people-outline" size={22} color="#434655" />
            <Text className="text-[11px] font-medium text-[#434655] mt-0.5">
              Customers
            </Text>
          </TouchableOpacity>

          {/* Tab 4: Analytics */}
          <TouchableOpacity
            accessibilityLabel="Analytics tab"
            activeOpacity={0.7}
            onPress={() => showToast("Opening Clinic Telemetry...", "STATS")}
            className="flex-1 items-center justify-center py-1"
          >
            <Ionicons name="bar-chart-outline" size={22} color="#434655" />
            <Text className="text-[11px] font-medium text-[#434655] mt-0.5">
              Analytics
            </Text>
          </TouchableOpacity>

          {/* Tab 5: Settings */}
          <TouchableOpacity
            accessibilityLabel="Settings tab"
            activeOpacity={0.7}
            onPress={() => router.push("/(business)/edit-queue" as any)}
            className="flex-1 items-center justify-center py-1"
          >
            <Ionicons name="settings-outline" size={22} color="#434655" />
            <Text className="text-[11px] font-medium text-[#434655] mt-0.5">
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Staff Profile & Role Switch Modal */}
      <Modal
        visible={isStaffModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsStaffModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsStaffModalVisible(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-t-3xl p-5 border-t border-[#EAEDFF]"
            style={{ paddingBottom: Math.max(insets.bottom, 20) + 12 }}
          >
            <View className="w-12 h-1.5 rounded-full bg-[#DAE2FD] self-center mb-4" />

            <View className="flex-row items-center gap-3.5 mb-4">
              <View className="w-12 h-12 rounded-full bg-[#004AC6] items-center justify-center">
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-[#131B2E]">
                  Dr. Martinez
                </Text>
                <Text className="text-xs text-[#737686]">
                  Clinic Administrator • Lead Physician
                </Text>
                <Text className="text-xs font-semibold text-[#004AC6] mt-0.5">
                  City Care Clinic
                </Text>
              </View>
            </View>

            <View className="space-y-2 pt-2">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsStaffModalVisible(false);
                  router.replace("/(customer)/home" as any);
                }}
                className="w-full h-12 rounded-xl bg-[#EAEDFF] flex-row items-center justify-center gap-2 active:bg-[#DAE2FD] mb-2"
              >
                <Ionicons name="swap-horizontal" size={18} color="#004AC6" />
                <Text className="text-sm font-bold text-[#004AC6]">
                  Switch to Customer App
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsStaffModalVisible(false);
                  router.replace("/auth" as any);
                }}
                className="w-full h-12 rounded-xl bg-[#FFDAD6]/50 flex-row items-center justify-center gap-2 active:bg-[#FFDAD6]"
              >
                <Ionicons name="log-out-outline" size={18} color="#BA1A1A" />
                <Text className="text-sm font-bold text-[#BA1A1A]">
                  Sign Out to Login
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  avatarShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonShadow: {
    shadowColor: "#007D55",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  actionToast: {
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
