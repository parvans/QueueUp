import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

type QueueTab = "active" | "upcoming" | "history";

interface HistoryItem {
  id: string;
  facilityId: string;
  facilityName: string;
  department: string;
  ticketNumber: string;
  date: string;
  doctor: string;
  status: string;
  waitTime: string;
}

const HISTORY_MOCK_DATA: HistoryItem[] = [
  {
    id: "hist-1",
    facilityId: "city-care-clinic",
    facilityName: "City Care Clinic",
    department: "General OPD",
    ticketNumber: "A-047",
    date: "Dec 14, 2024",
    doctor: "Dr. Martinez",
    status: "Completed",
    waitTime: "26 min",
  },
  {
    id: "hist-2",
    facilityId: "express-medical",
    facilityName: "Express Medical & Pediatric",
    department: "Pediatric Triage",
    ticketNumber: "E-019",
    date: "Nov 28, 2024",
    doctor: "Dr. Rachel Green",
    status: "Completed",
    waitTime: "12 min",
  },
  {
    id: "hist-3",
    facilityId: "st-jude-hospital",
    facilityName: "St. Jude Hospital - OPD",
    department: "Cardiology OPD",
    ticketNumber: "B-108",
    date: "Nov 12, 2024",
    doctor: "Dr. David Vance",
    status: "Completed",
    waitTime: "45 min",
  },
  {
    id: "hist-4",
    facilityId: "city-care-clinic",
    facilityName: "City Care Clinic",
    department: "Dental Clinic",
    ticketNumber: "D-005",
    date: "Oct 20, 2024",
    doctor: "Dr. Emily Wong",
    status: "Completed",
    waitTime: "18 min",
  },
];

export default function MyQueuesScreen() {
  const insets = useSafeAreaInsets();

  // Navigation & Interactive states
  const [activeTab, setActiveTab] = useState<QueueTab>("active");
  const [isEmptyStatePreview, setIsEmptyStatePreview] = useState(false);
  const [isPushAccordionOpen, setIsPushAccordionOpen] = useState(true);
  const [isReminderSet, setIsReminderSet] = useState(false);

  // Animations (React Native Animated API, useNativeDriver: true)
  const beaconPingAnim = useRef(new Animated.Value(0)).current;
  const statusDotAnim = useRef(new Animated.Value(1)).current;
  const state4PingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Live Active beacon ping
    const beaconLoop = Animated.loop(
      Animated.timing(beaconPingAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    // 2. Status dot breathing
    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(statusDotAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(statusDotAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    // 3. State 4 ping
    const state4Loop = Animated.loop(
      Animated.timing(state4PingAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    );

    beaconLoop.start();
    dotLoop.start();
    state4Loop.start();

    return () => {
      beaconLoop.stop();
      dotLoop.stop();
      state4Loop.stop();
    };
  }, [beaconPingAnim, statusDotAnim, state4PingAnim]);

  // Handlers
  const handleTabSwitch = (tab: QueueTab) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    setActiveTab(tab);
  };

  const handleToggleEmptyState = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Ignore
    }
    setIsEmptyStatePreview(!isEmptyStatePreview);
  };

  const handleToggleReminder = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Ignore
    }
    const next = !isReminderSet;
    setIsReminderSet(next);
    Alert.alert(
      next ? "Reminder Scheduled" : "Reminder Removed",
      next
        ? "We will notify you at 2:00 PM when check-in opens for St. Jude Hospital Ticket B-108."
        : "Check-in reminder has been cancelled."
    );
  };

  const handleTrackQueue = (facilityId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    router.push(`/live-queue/${facilityId}` as any);
  };

  const handleViewTicket = (ticketNumber: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    router.push(`/ticket/${ticketNumber}` as any);
  };

  // Interpolated animation values
  const beaconScale = beaconPingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });
  const beaconOpacity = beaconPingAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.75, 0.25, 0],
  });

  const state4Scale = state4PingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.4],
  });
  const state4Opacity = state4PingAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.8, 0.2, 0],
  });

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* 1. Header matching Stitch Screen 14 */}
      <View className="h-16 px-4 bg-white/80 border-b border-[#E2E8F0] flex-row items-center justify-between z-30">
        <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
          <Image
            source={require("@/assets/images/queueup-logo.png")}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />

          <View className="flex-col min-w-0 flex-1">
            <Text className="text-[10px] font-bold text-[#004AC6] uppercase tracking-wider leading-none">
              QueueUp
            </Text>
            <Text
              numberOfLines={1}
              className="text-[17px] font-bold text-[#131B2E] truncate leading-tight mt-0.5"
            >
              My Queues
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1 shrink-0">
          <TouchableOpacity
            accessibilityLabel="Notifications"
            onPress={() => router.push("/notifications" as any)}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="notifications-outline" size={20} color="#434655" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Profile"
            onPress={() => router.push("/(customer)/profile" as any)}
            className="w-8 h-8 rounded-full bg-[#004AC6] items-center justify-center ml-1"
          >
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: insets.bottom + 24,
        }}
        className="flex-1"
      >
        {/* 2. Real-Time Telemetry & Empty State Toggle Sub-bar */}
        <View className="flex-col gap-2 mb-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="dynamic-feed" size={17} color="#004AC6" />
              <Text className="text-[10px] font-bold uppercase tracking-wider text-[#737686]">
                Real-Time Telemetry
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleEmptyState}
              className="px-3 py-1 rounded-full bg-[#E2E7FF] flex-row items-center gap-1 active:bg-[#DAE2FD]"
            >
              <Ionicons
                name={isEmptyStatePreview ? "refresh" : "eye-outline"}
                size={14}
                color="#004AC6"
              />
              <Text className="text-xs font-semibold text-[#004AC6]">
                {isEmptyStatePreview ? "Preview Active Queue" : "Preview Empty State"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Segmented Navigation Pills */}
          <View className="flex-row p-1 rounded-xl bg-[#EAEDFF]">
            {/* Tab: Active */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTabSwitch("active")}
              className={`flex-1 py-2 rounded-lg flex-row items-center justify-center gap-1.5 ${
                activeTab === "active" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === "active" ? "text-[#004AC6]" : "text-[#434655]"
                }`}
              >
                Active
              </Text>
              <View
                className={`px-1.5 py-0.5 rounded-full ${
                  activeTab === "active" ? "bg-[#004AC6]" : "bg-[#DAE2FD]"
                }`}
              >
                <Text
                  className={`text-[9px] font-bold leading-none ${
                    activeTab === "active" ? "text-white" : "text-[#434655]"
                  }`}
                >
                  1
                </Text>
              </View>
            </TouchableOpacity>

            {/* Tab: Upcoming */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTabSwitch("upcoming")}
              className={`flex-1 py-2 rounded-lg flex-row items-center justify-center gap-1.5 ${
                activeTab === "upcoming" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === "upcoming" ? "text-[#004AC6]" : "text-[#434655]"
                }`}
              >
                Upcoming
              </Text>
              <View
                className={`px-1.5 py-0.5 rounded-full ${
                  activeTab === "upcoming" ? "bg-[#004AC6]" : "bg-[#DAE2FD]"
                }`}
              >
                <Text
                  className={`text-[9px] font-bold leading-none ${
                    activeTab === "upcoming" ? "text-white" : "text-[#434655]"
                  }`}
                >
                  1
                </Text>
              </View>
            </TouchableOpacity>

            {/* Tab: History */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTabSwitch("history")}
              className={`flex-1 py-2 rounded-lg flex-row items-center justify-center gap-1.5 ${
                activeTab === "history" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === "history" ? "text-[#004AC6]" : "text-[#434655]"
                }`}
              >
                History
              </Text>
              <View
                className={`px-1.5 py-0.5 rounded-full ${
                  activeTab === "history" ? "bg-[#004AC6]" : "bg-[#DAE2FD]"
                }`}
              >
                <Text
                  className={`text-[9px] font-bold leading-none ${
                    activeTab === "history" ? "text-white" : "text-[#434655]"
                  }`}
                >
                  4
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Empty State Container */}
        {isEmptyStatePreview ? (
          <View className="flex-col items-center justify-center text-center p-8 my-4 rounded-2xl bg-white shadow-md border border-[#E2E8F0]">
            <View className="w-20 h-20 rounded-full bg-[#F2F3FF] items-center justify-center mb-4 relative">
              <Ionicons name="ticket-outline" size={40} color="#737686" />
              <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#DBE1FF] items-center justify-center">
                <Ionicons name="checkmark" size={17} color="#004AC6" />
              </View>
            </View>

            <Text className="text-[11px] font-bold uppercase text-[#004AC6] tracking-wider mb-1">
              Queue Freedom
            </Text>
            <Text className="text-xl font-bold text-[#131B2E] mb-1.5">No active queues</Text>
            <Text className="text-sm text-[#434655] text-center leading-relaxed max-w-xs mb-5">
              Join a clinic, desk, or venue line and we&apos;ll keep track of your place in real time
              while you roam freely.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/(customer)/search" as any)}
              className="w-full max-w-xs h-12 rounded-xl bg-[#004AC6] flex-row items-center justify-center gap-2 shadow-md active:bg-[#3755C3]"
            >
              <Ionicons name="search" size={18} color="#FFFFFF" />
              <Text className="text-sm font-bold text-white">Find a Queue Nearby</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Main Content Based on Selected Tab */
          <View className="flex-col gap-4">
            {/* ===================== TAB: ACTIVE ===================== */}
            {activeTab === "active" && (
              <>
                {/* SECTION 1: Active Queue Card (Signature Physical Metaphor) */}
                <View className="flex-col">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-1.5">
                      <View className="relative w-2.5 h-2.5 items-center justify-center">
                        <Animated.View
                          style={{
                            position: "absolute",
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "#007D55",
                            transform: [{ scale: beaconScale }],
                            opacity: beaconOpacity,
                          }}
                        />
                        <View className="w-2 h-2 rounded-full bg-[#007D55]" />
                      </View>
                      <Text className="text-[11px] font-bold uppercase text-[#434655] tracking-wider">
                        Live Active Ticket
                      </Text>
                    </View>
                    <Text className="text-xs text-[#737686]">Syncing live • 3s ago</Text>
                  </View>

                  {/* Physical Ticket Canvas */}
                  <View className="relative rounded-2xl bg-white shadow-lg overflow-hidden border border-[#E2E8F0]">
                    {/* Upper Half: Status & Telemetry */}
                    <View className="p-4 pb-3 flex-col">
                      {/* Department & Meta */}
                      <View className="flex-row items-start justify-between gap-2 mb-2">
                        <View className="flex-1 mr-2">
                          <Text className="text-[10px] font-bold uppercase text-[#004AC6] tracking-wider">
                            Medical • General Care
                          </Text>
                          <Text className="text-[17px] font-bold text-[#131B2E] mt-0.5">
                            City Care Clinic
                          </Text>
                          <Text className="text-xs text-[#434655] mt-0.5">
                            Consultation Room 3B • Dr. S. Rao
                          </Text>
                        </View>

                        {/* Live Status Chip */}
                        <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#BDFFDB] shadow-xs">
                          <Animated.View
                            style={{ opacity: statusDotAnim }}
                            className="w-2 h-2 rounded-full bg-[#006242]"
                          />
                          <Text className="text-xs font-bold text-[#007D55]">
                            In Line • Moving Steady
                          </Text>
                        </View>
                      </View>

                      {/* Ticket Number & Wait Time Display */}
                      <View className="flex-row items-baseline justify-between py-1">
                        <View>
                          <Text className="text-xs text-[#737686] font-medium">Your Ticket</Text>
                          <Text className="text-[44px] font-extrabold text-[#004AC6] tracking-tight leading-none mt-0.5">
                            A-047
                          </Text>
                        </View>

                        <View className="items-end">
                          <Text className="text-xs text-[#737686] font-medium">Est. Wait</Text>
                          <View className="flex-row items-baseline gap-1 mt-0.5">
                            <Text className="text-3xl font-extrabold text-[#131B2E] leading-none">
                              18
                            </Text>
                            <Text className="text-sm font-semibold text-[#434655]">min</Text>
                          </View>
                        </View>
                      </View>

                      {/* Progress Telemetry Gauge */}
                      <View className="mt-2 mb-1">
                        <View className="flex-row items-center justify-between text-xs mb-1.5">
                          <View className="flex-row items-center gap-1">
                            <MaterialIcons name="person" size={16} color="#007D55" />
                            <Text className="text-xs font-bold text-[#131B2E]">
                              12 people ahead
                            </Text>
                          </View>
                          <Text className="text-xs text-[#434655]">
                            Serving now: <Text className="font-bold text-[#004AC6]">#35</Text>
                          </Text>
                        </View>

                        <View className="w-full h-2.5 rounded-full bg-[#EAEDFF] overflow-hidden p-0.5">
                          <View
                            style={{ width: "65%" }}
                            className="h-full rounded-full bg-[#2563EB]"
                          />
                        </View>

                        <View className="flex-row justify-between items-center text-xs mt-1">
                          <Text className="text-[11px] text-[#737686]">Joined: 10:42 AM</Text>
                          <Text className="text-[11px] text-[#737686]">Progress: 65%</Text>
                        </View>
                      </View>
                    </View>

                    {/* Perforated Notch Divider Metaphor */}
                    <View className="relative w-full h-6 flex-row items-center justify-between bg-white overflow-hidden">
                      <View className="w-5 h-6 rounded-r-full bg-[#FAF8FF] -ml-2.5 border-r border-[#E2E8F0]" />
                      <View className="flex-1 border-b-2 border-dashed border-[#DAE2FD] mx-2" />
                      <View className="w-5 h-6 rounded-l-full bg-[#FAF8FF] -mr-2.5 border-l border-[#E2E8F0]" />
                    </View>

                    {/* Lower Section: Passcode Verification & Actions */}
                    <View className="p-4 pt-2 flex-col bg-[#F2F3FF]/50 border-t border-[#F2F3FF]">
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center gap-2.5">
                          <View className="w-9 h-9 rounded-lg bg-[#EAEDFF] items-center justify-center">
                            <Ionicons name="qr-code-outline" size={20} color="#004AC6" />
                          </View>
                          <View className="flex-col">
                            <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
                              Passcode
                            </Text>
                            <Text className="text-sm font-bold tracking-wider text-[#131B2E] font-mono">
                              #4791
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center gap-1.5">
                          <Ionicons name="radio" size={15} color="#007D55" />
                          <Text className="text-xs font-semibold text-[#007D55]">
                            Live Sync Active
                          </Text>
                        </View>
                      </View>

                      {/* Action CTA Buttons */}
                      <View className="flex-row gap-2.5">
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => handleTrackQueue("city-care-clinic")}
                          className="flex-1 h-12 rounded-xl bg-[#004AC6] flex-row items-center justify-center gap-1.5 shadow-sm active:bg-[#3755C3]"
                        >
                          <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
                          <Text className="text-sm font-bold text-white">Track Queue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleViewTicket("A-047")}
                          className="flex-1 h-12 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex-row items-center justify-center gap-1.5 active:bg-[#F2F3FF]"
                        >
                          <Ionicons name="receipt-outline" size={18} color="#131B2E" />
                          <Text className="text-sm font-semibold text-[#131B2E]">View Ticket</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {/* SECTION 2: Upcoming Reservation */}
                <View className="flex-col">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[11px] font-bold uppercase text-[#434655] tracking-wider">
                      Upcoming Reservation
                    </Text>
                    <Text className="text-xs font-bold text-[#3755C3]">Today</Text>
                  </View>

                  <View className="rounded-2xl bg-white shadow-sm border border-[#E2E8F0] p-4 flex-col">
                    <View className="flex-row items-start justify-between gap-2 mb-3">
                      <View className="flex-1 mr-2">
                        <Text className="text-[10px] font-bold uppercase text-[#3755C3] tracking-wider">
                          Specialist OPD
                        </Text>
                        <Text className="text-[16px] font-bold text-[#131B2E] mt-0.5">
                          St. Jude Hospital - OPD
                        </Text>
                        <Text className="text-xs text-[#434655] mt-0.5">
                          Cardiology Wing • Counter 04
                        </Text>
                      </View>

                      <View className="w-12 h-12 rounded-xl bg-[#DDE1FF] items-center justify-center">
                        <Text className="text-[9px] font-bold text-[#3755C3] uppercase">TICKET</Text>
                        <Text className="text-sm font-bold text-[#3755C3]">B-108</Text>
                      </View>
                    </View>

                    {/* Appointment Time & Check-in Window */}
                    <View className="p-3 rounded-xl bg-[#F2F3FF] mb-3 flex-row items-center gap-3">
                      <Ionicons name="time" size={20} color="#3755C3" />
                      <View className="flex-col flex-1">
                        <Text className="text-sm font-bold text-[#131B2E]">Today, 2:30 PM</Text>
                        <Text className="text-xs text-[#434655] mt-0.5">
                          Estimated wait upon check-in: ~15 min
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between mb-3.5">
                      <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDE1FF]">
                        <View className="w-2 h-2 rounded-full bg-[#3755C3]" />
                        <Text className="text-xs font-semibold text-[#001453]">
                          Upcoming • Check-in opens 2:00 PM
                        </Text>
                      </View>
                      <Text className="text-xs text-[#737686]">In 3 hrs 15 min</Text>
                    </View>

                    {/* Action buttons */}
                    <View className="flex-row gap-2.5">
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleViewTicket("B-108")}
                        className="flex-1 h-11 rounded-xl bg-[#EAEDFF] flex-row items-center justify-center gap-1.5 active:bg-[#DAE2FD]"
                      >
                        <Ionicons name="receipt-outline" size={17} color="#131B2E" />
                        <Text className="text-xs font-bold text-[#131B2E]">View Ticket</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleToggleReminder}
                        className={`flex-1 h-11 rounded-xl flex-row items-center justify-center gap-1.5 ${
                          isReminderSet ? "bg-[#BDFFDB]" : "bg-[#EAEDFF] active:bg-[#DAE2FD]"
                        }`}
                      >
                        <Ionicons
                          name={isReminderSet ? "notifications" : "notifications-outline"}
                          size={17}
                          color={isReminderSet ? "#007D55" : "#3755C3"}
                        />
                        <Text
                          className={`text-xs font-bold ${
                            isReminderSet ? "text-[#007D55]" : "text-[#3755C3]"
                          }`}
                        >
                          {isReminderSet ? "Reminder Set" : "Set Reminder"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* SECTION 3: Queue State System Variations (Visual Reference Strip) */}
                <View className="flex-col">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[11px] font-bold uppercase text-[#434655] tracking-wider">
                      Queue State System Variations
                    </Text>
                    <Text className="text-xs text-[#737686]">6 Core States</Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="-mx-4 px-4 py-1"
                  >
                    <View className="flex-row gap-3">
                      {/* State 1: Waiting */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() =>
                          Alert.alert("State 1: Waiting", "Steady wait, real-time telemetry active.")
                        }
                        className="w-44 p-3 rounded-xl bg-white shadow-xs border border-[#E2E8F0] flex-col justify-between"
                      >
                        <View>
                          <View className="flex-row items-center gap-1.5 mb-1.5">
                            <View className="w-2 h-2 rounded-full bg-amber-500" />
                            <Text className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                              State 1
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-[#131B2E]">Waiting</Text>
                          <Text className="text-xs text-[#434655] mt-1 leading-snug">
                            Steady wait, telemetry active.
                          </Text>
                        </View>
                        <View className="mt-3 px-2 py-1 rounded-full bg-amber-100 items-center justify-center">
                          <Text className="text-[11px] font-bold text-amber-900">
                            ● 8 People Ahead
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* State 2: Queue Moving */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() =>
                          Alert.alert(
                            "State 2: Queue Moving",
                            "Advancing by 1-2 min/turn smoothly."
                          )
                        }
                        className="w-44 p-3 rounded-xl bg-white shadow-xs border border-[#E2E8F0] flex-col justify-between"
                      >
                        <View>
                          <View className="flex-row items-center gap-1.5 mb-1.5">
                            <View className="w-2 h-2 rounded-full bg-[#004AC6]" />
                            <Text className="text-[10px] font-bold uppercase text-[#004AC6] tracking-wider">
                              State 2
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-[#131B2E]">Queue Moving</Text>
                          <Text className="text-xs text-[#434655] mt-1 leading-snug">
                            Advancing by 1-2 min/turn.
                          </Text>
                        </View>
                        <View className="mt-3 px-2 py-1 rounded-full bg-[#DDE1FF] items-center justify-center">
                          <Text className="text-[11px] font-bold text-[#00174B]">
                            ● Moving Steady
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* State 3: Almost Turn */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => router.push("/near-turn/city-care-clinic" as any)}
                        className="w-44 p-3 rounded-xl bg-white shadow-xs border border-[#E2E8F0] flex-col justify-between"
                      >
                        <View>
                          <View className="flex-row items-center gap-1.5 mb-1.5">
                            <View className="w-2 h-2 rounded-full bg-orange-500" />
                            <Text className="text-[10px] font-bold uppercase text-orange-800 tracking-wider">
                              State 3
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-[#131B2E]">Almost Turn</Text>
                          <Text className="text-xs text-[#434655] mt-1 leading-snug">
                            Please head to the waiting area.
                          </Text>
                        </View>
                        <View className="mt-3 px-2 py-1 rounded-full bg-orange-100 items-center justify-center">
                          <Text className="text-[11px] font-bold text-orange-900">
                            ● 2 Ahead (~4m)
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* State 4: Your Turn */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => router.push("/your-turn/city-care-clinic" as any)}
                        className="w-44 p-3 rounded-xl bg-white shadow-xs border border-[#E2E8F0] flex-col justify-between"
                      >
                        <View>
                          <View className="flex-row items-center gap-1.5 mb-1.5">
                            <View className="relative w-2.5 h-2.5 items-center justify-center">
                              <Animated.View
                                style={{
                                  position: "absolute",
                                  width: 8,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: "#007D55",
                                  transform: [{ scale: state4Scale }],
                                  opacity: state4Opacity,
                                }}
                              />
                              <View className="w-2 h-2 rounded-full bg-[#007D55]" />
                            </View>
                            <Text className="text-[10px] font-bold uppercase text-[#007D55] tracking-wider">
                              State 4
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-[#131B2E]">Your Turn</Text>
                          <Text className="text-xs text-[#434655] mt-1 leading-snug">
                            Proceed to desk immediately.
                          </Text>
                        </View>
                        <View className="mt-3 px-2 py-1 rounded-full bg-[#BDFFDB] items-center justify-center">
                          <Text className="text-[11px] font-bold text-[#006242]">
                            ● Now Serving!
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* State 5: Queue Paused */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() =>
                          Alert.alert(
                            "State 5: Queue Paused",
                            "Doctor round or sterilization in progress."
                          )
                        }
                        className="w-44 p-3 rounded-xl bg-white shadow-xs border border-[#E2E8F0] flex-col justify-between"
                      >
                        <View>
                          <View className="flex-row items-center gap-1.5 mb-1.5">
                            <View className="w-2 h-2 rounded-full bg-yellow-600" />
                            <Text className="text-[10px] font-bold uppercase text-yellow-800 tracking-wider">
                              State 5
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-[#131B2E]">Queue Paused</Text>
                          <Text className="text-xs text-[#434655] mt-1 leading-snug">
                            Doctor round in progress.
                          </Text>
                        </View>
                        <View className="mt-3 px-2 py-1 rounded-full bg-yellow-100 items-center justify-center">
                          <Text className="text-[11px] font-bold text-yellow-900">
                            ⏸ Paused (10m)
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* State 6: Cancelled */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() =>
                          Alert.alert("State 6: Cancelled", "Service cancelled or rescheduled.")
                        }
                        className="w-44 p-3 rounded-xl bg-white shadow-xs border border-[#E2E8F0] flex-col justify-between"
                      >
                        <View>
                          <View className="flex-row items-center gap-1.5 mb-1.5">
                            <View className="w-2 h-2 rounded-full bg-red-600" />
                            <Text className="text-[10px] font-bold uppercase text-red-800 tracking-wider">
                              State 6
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-[#131B2E]">Cancelled</Text>
                          <Text className="text-xs text-[#434655] mt-1 leading-snug">
                            Service stopped or rescheduled.
                          </Text>
                        </View>
                        <View className="mt-3 px-2 py-1 rounded-full bg-red-100 items-center justify-center">
                          <Text className="text-[11px] font-bold text-red-900">
                            ✕ Session Closed
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>

                {/* SECTION 4: Simulated Push Notification Triggers Showcase */}
                <View className="rounded-2xl bg-[#F2F3FF] p-4 border border-[#DAE2FD]/60 flex-col">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsPushAccordionOpen(!isPushAccordionOpen)}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded-full bg-[#DDE1FF] items-center justify-center">
                        <Ionicons name="notifications" size={17} color="#004AC6" />
                      </View>
                      <View className="flex-col">
                        <Text className="text-sm font-bold text-[#131B2E]">
                          Simulated Push Triggers
                        </Text>
                        <Text className="text-xs text-[#434655]">
                          Live telemetry notification sequence
                        </Text>
                      </View>
                    </View>

                    <Ionicons
                      name={isPushAccordionOpen ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#737686"
                    />
                  </TouchableOpacity>

                  {/* Trigger List */}
                  {isPushAccordionOpen && (
                    <View className="flex-col gap-2 pt-3">
                      {/* Trigger 1 */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleTrackQueue("city-care-clinic")}
                        className="p-3 rounded-xl bg-white shadow-xs flex-row items-start gap-3 border border-[#E2E8F0]/70"
                      >
                        <View className="w-7 h-7 rounded-full bg-[#EAEDFF] items-center justify-center shrink-0 mt-0.5">
                          <Ionicons name="walk" size={16} color="#004AC6" />
                        </View>
                        <View className="flex-1 min-w-0">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-xs font-bold text-[#131B2E]">
                              Queue is moving
                            </Text>
                            <Text className="text-[10px] text-[#737686]">10:52 AM</Text>
                          </View>
                          <Text numberOfLines={1} className="text-xs text-[#434655] mt-0.5">
                            You&apos;re now #5 in line at City Care Clinic.
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Trigger 2 */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push("/near-turn/city-care-clinic" as any)}
                        className="p-3 rounded-xl bg-white shadow-xs flex-row items-start gap-3 border border-[#E2E8F0]/70"
                      >
                        <View className="w-7 h-7 rounded-full bg-orange-100 items-center justify-center shrink-0 mt-0.5">
                          <Ionicons name="timer" size={16} color="#EA580C" />
                        </View>
                        <View className="flex-1 min-w-0">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-xs font-bold text-[#131B2E]">
                              Almost your turn!
                            </Text>
                            <Text className="text-[10px] text-[#737686]">11:04 AM</Text>
                          </View>
                          <Text numberOfLines={1} className="text-xs text-[#434655] mt-0.5">
                            Only 2 people are ahead of you. Head to waiting hall.
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Trigger 3 */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push("/your-turn/city-care-clinic" as any)}
                        className="p-3 rounded-xl bg-white shadow-xs flex-row items-start gap-3 border border-[#E2E8F0]/70"
                      >
                        <View className="w-7 h-7 rounded-full bg-[#BDFFDB] items-center justify-center shrink-0 mt-0.5">
                          <MaterialIcons name="campaign" size={16} color="#007D55" />
                        </View>
                        <View className="flex-1 min-w-0">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-xs font-bold text-[#131B2E]">It&apos;s your turn!</Text>
                            <Text className="text-[10px] text-[#737686]">11:12 AM</Text>
                          </View>
                          <Text numberOfLines={1} className="text-xs text-[#434655] mt-0.5">
                            Please proceed to Counter 2 • Dr. Rao is ready.
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            )}

            {/* ===================== TAB: UPCOMING ===================== */}
            {activeTab === "upcoming" && (
              <View className="flex-col gap-3">
                <Text className="text-[11px] font-bold uppercase text-[#434655] tracking-wider mb-1">
                  Scheduled Queue Reservations
                </Text>

                <View className="rounded-2xl bg-white shadow-sm border border-[#E2E8F0] p-4 flex-col">
                  <View className="flex-row items-start justify-between gap-2 mb-3">
                    <View className="flex-1 mr-2">
                      <Text className="text-[10px] font-bold uppercase text-[#3755C3] tracking-wider">
                        Specialist OPD
                      </Text>
                      <Text className="text-[17px] font-bold text-[#131B2E] mt-0.5">
                        St. Jude Hospital - OPD
                      </Text>
                      <Text className="text-xs text-[#434655] mt-0.5">
                        Cardiology Wing • Counter 04 • Dr. David Vance
                      </Text>
                    </View>

                    <View className="w-12 h-12 rounded-xl bg-[#DDE1FF] items-center justify-center">
                      <Text className="text-[9px] font-bold text-[#3755C3] uppercase">TICKET</Text>
                      <Text className="text-sm font-bold text-[#3755C3]">B-108</Text>
                    </View>
                  </View>

                  <View className="p-3 rounded-xl bg-[#F2F3FF] mb-3 flex-row items-center gap-3">
                    <Ionicons name="time" size={20} color="#3755C3" />
                    <View className="flex-col flex-1">
                      <Text className="text-sm font-bold text-[#131B2E]">Today, 2:30 PM</Text>
                      <Text className="text-xs text-[#434655] mt-0.5">
                        Estimated wait upon check-in: ~15 min
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mb-3.5">
                    <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDE1FF]">
                      <View className="w-2 h-2 rounded-full bg-[#3755C3]" />
                      <Text className="text-xs font-semibold text-[#001453]">
                        Upcoming • Check-in opens 2:00 PM
                      </Text>
                    </View>
                    <Text className="text-xs text-[#737686]">In 3 hrs 15 min</Text>
                  </View>

                  <View className="flex-row gap-2.5">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleViewTicket("B-108")}
                      className="flex-1 h-11 rounded-xl bg-[#EAEDFF] flex-row items-center justify-center gap-1.5 active:bg-[#DAE2FD]"
                    >
                      <Ionicons name="receipt-outline" size={17} color="#131B2E" />
                      <Text className="text-xs font-bold text-[#131B2E]">View Ticket</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleToggleReminder}
                      className={`flex-1 h-11 rounded-xl flex-row items-center justify-center gap-1.5 ${
                        isReminderSet ? "bg-[#BDFFDB]" : "bg-[#EAEDFF] active:bg-[#DAE2FD]"
                      }`}
                    >
                      <Ionicons
                        name={isReminderSet ? "notifications" : "notifications-outline"}
                        size={17}
                        color={isReminderSet ? "#007D55" : "#3755C3"}
                      />
                      <Text
                        className={`text-xs font-bold ${
                          isReminderSet ? "text-[#007D55]" : "text-[#3755C3]"
                        }`}
                      >
                        {isReminderSet ? "Reminder Set" : "Set Reminder"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* ===================== TAB: HISTORY ===================== */}
            {activeTab === "history" && (
              <View className="flex-col gap-3">
                <Text className="text-[11px] font-bold uppercase text-[#434655] tracking-wider mb-1">
                  Past Queue History ({HISTORY_MOCK_DATA.length})
                </Text>

                {HISTORY_MOCK_DATA.map((item) => (
                  <View
                    key={item.id}
                    className="rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0] flex-col gap-2.5"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 mr-2">
                        <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
                          {item.department}
                        </Text>
                        <Text className="text-[16px] font-bold text-[#131B2E] mt-0.5">
                          {item.facilityName}
                        </Text>
                        <Text className="text-xs text-[#434655] mt-0.5">{item.doctor}</Text>
                      </View>

                      <View className="items-end">
                        <Text className="text-lg font-extrabold text-[#004AC6]">
                          {item.ticketNumber}
                        </Text>
                        <Text className="text-[11px] text-[#737686]">{item.date}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between pt-2 border-t border-[#F2F3FF]">
                      <View className="flex-row items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#BDFFDB]">
                        <Ionicons name="checkmark-circle" size={14} color="#007D55" />
                        <Text className="text-xs font-semibold text-[#007D55]">{item.status}</Text>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => router.push(`/queue-completed/${item.facilityId}` as any)}
                        className="flex-row items-center gap-1"
                      >
                        <Text className="text-xs font-bold text-[#004AC6]">View Summary</Text>
                        <Ionicons name="chevron-forward" size={14} color="#004AC6" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
