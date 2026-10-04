import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface NearTurnFacilityData {
  id: string;
  name: string;
  category: string;
  department: string;
  doctor: string;
  ticketNumber: string;
  nowServingTicket: string;
  counter: string;
  location: string;
  room: string;
  rankDisplay: string;
  peopleAhead: number;
  estWait: string;
  approxMinutes: string;
  joinedTime: string;
  distanceText: string;
  walkTimeText: string;
  routeNote: string;
  barcodePasscode: string;
  mapImageUri: string;
}

const NEAR_TURN_FACILITIES: Record<string, NearTurnFacilityData> = {
  "city-care-clinic": {
    id: "city-care-clinic",
    name: "City Care Clinic",
    category: "General Care",
    department: "General OPD Consultation",
    doctor: "Dr. Martinez",
    ticketNumber: "A-047",
    nowServingTicket: "A-045",
    counter: "Counter 2",
    location: "City Care Clinic • 2nd Fl, Rm 204",
    room: "Room 204",
    rankDisplay: "#3 (2 ahead)",
    peopleAhead: 2,
    estWait: "~4 min",
    approxMinutes: "3 to 5 minutes",
    joinedTime: "10:42 AM",
    distanceText: "~300m away (3 min walk)",
    walkTimeText: "3 min walk",
    routeNote: "Fastest route via North Lobby Elevators",
    barcodePasscode: "9284-A047",
    mapImageUri:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBivlnX42D4KsIPGMlqfgny-Kd7cuZsKjGct3cdwyTNJA0vNHxt-0wDi3q_90_cSbWnfjR4yCcQudwo0ng0WftsCLXQ8lqZlqleAvxRL00wwQWit_d5bvELiUewvuJ75CbvPa_gJXZxC0W01QX3YVHg2Jrz0CuEo1jLMaqqhjQQljpaBEyJ1JyA70cV7DYUIZKAB7RaIi3RSUMD2PuG0dZ3nAzBZQ2pJYnKR0faqMLHZMR7uF3Cerx44w",
  },
  "st-jude-hospital": {
    id: "st-jude-hospital",
    name: "St. Jude Hospital - OPD",
    category: "Cardiology",
    department: "Cardiology OPD Consultation",
    doctor: "Dr. David Vance",
    ticketNumber: "B-108",
    nowServingTicket: "B-105",
    counter: "Counter 1",
    location: "St. Jude Hospital • 1st Fl, Wing B",
    room: "Wing B, Rm 102",
    rankDisplay: "#4 (3 ahead)",
    peopleAhead: 3,
    estWait: "~6 min",
    approxMinutes: "5 to 7 minutes",
    joinedTime: "11:50 AM",
    distanceText: "~450m away (5 min walk)",
    walkTimeText: "5 min walk",
    routeNote: "Fastest route via Main Hospital Concourse",
    barcodePasscode: "4821-B108",
    mapImageUri:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBivlnX42D4KsIPGMlqfgny-Kd7cuZsKjGct3cdwyTNJA0vNHxt-0wDi3q_90_cSbWnfjR4yCcQudwo0ng0WftsCLXQ8lqZlqleAvxRL00wwQWit_d5bvELiUewvuJ75CbvPa_gJXZxC0W01QX3YVHg2Jrz0CuEo1jLMaqqhjQQljpaBEyJ1JyA70cV7DYUIZKAB7RaIi3RSUMD2PuG0dZ3nAzBZQ2pJYnKR0faqMLHZMR7uF3Cerx44w",
  },
  "express-medical": {
    id: "express-medical",
    name: "Express Medical & Pediatric",
    category: "Urgent & Pediatric",
    department: "Pediatric Triage",
    doctor: "Dr. Rachel Green",
    ticketNumber: "E-019",
    nowServingTicket: "E-018",
    counter: "Fast Desk 1",
    location: "Express Medical • Suite B, Desk 1",
    room: "Suite B",
    rankDisplay: "#2 (1 ahead)",
    peopleAhead: 1,
    estWait: "~2 min",
    approxMinutes: "1 to 3 minutes",
    joinedTime: "10:23 AM",
    distanceText: "~150m away (1 min walk)",
    walkTimeText: "1 min walk",
    routeNote: "Fastest route via Front Entrance Corridor",
    barcodePasscode: "7139-E019",
    mapImageUri:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBivlnX42D4KsIPGMlqfgny-Kd7cuZsKjGct3cdwyTNJA0vNHxt-0wDi3q_90_cSbWnfjR4yCcQudwo0ng0WftsCLXQ8lqZlqleAvxRL00wwQWit_d5bvELiUewvuJ75CbvPa_gJXZxC0W01QX3YVHg2Jrz0CuEo1jLMaqqhjQQljpaBEyJ1JyA70cV7DYUIZKAB7RaIi3RSUMD2PuG0dZ3nAzBZQ2pJYnKR0faqMLHZMR7uF3Cerx44w",
  },
};

export default function NearTurnAlertScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();

  // Resolve facility ID from param or ticket mapping
  const paramKey = typeof id === "string" ? id.toLowerCase().trim() : "city-care-clinic";
  const resolvedKey =
    paramKey === "a-047"
      ? "city-care-clinic"
      : paramKey === "b-108"
      ? "st-jude-hospital"
      : paramKey === "e-019"
      ? "express-medical"
      : paramKey;

  const facility: NearTurnFacilityData =
    NEAR_TURN_FACILITIES[resolvedKey] || NEAR_TURN_FACILITIES["city-care-clinic"];

  // Interactive States
  const [isPushDismissed, setIsPushDismissed] = useState(false);
  const [isCheckedInAtLobby, setIsCheckedInAtLobby] = useState(false);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [isDelayed, setIsDelayed] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showRadarModal, setShowRadarModal] = useState(false);

  // Dynamic values depending on delay state
  const peopleAhead = isDelayed ? facility.peopleAhead + 2 : facility.peopleAhead;
  const rankDisplay = isDelayed ? `#5 (${peopleAhead} ahead)` : facility.rankDisplay;
  const estWait = isDelayed ? "~11 min" : facility.estWait;

  // Animations (using standard React Native Animated for performance & safety)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pingAnim = useRef(new Animated.Value(0)).current;
  const liveDotAnim = useRef(new Animated.Value(1)).current;
  const beaconPingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Icon pulsing animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
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

    // 2. Ripple ping wave behind hero avatar
    const pingLoop = Animated.loop(
      Animated.timing(pingAnim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      })
    );

    // 3. Live status dot gentle breathing
    const liveDotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(liveDotAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    // 4. Map radar beacon ping
    const beaconLoop = Animated.loop(
      Animated.timing(beaconPingAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    );

    pulseLoop.start();
    pingLoop.start();
    liveDotLoop.start();
    beaconLoop.start();

    return () => {
      pulseLoop.stop();
      pingLoop.stop();
      liveDotLoop.stop();
      beaconLoop.stop();
    };
  }, [pulseAnim, pingAnim, liveDotAnim, beaconPingAnim]);

  // Handlers
  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/live-queue/${facility.id}` as any);
    }
  };

  const handleLobbyCheckIn = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Ignore
    }
    setIsCheckedInAtLobby(true);
    Alert.alert(
      "Checked In at Lobby",
      `Front desk has verified your arrival for ticket ${facility.ticketNumber}. Please take a seat near ${facility.counter}.`,
      [{ text: "OK" }]
    );
  };

  const handleApplyDelay = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    } catch {
      // Ignore
    }
    setIsDelayed(true);
    setShowDelayModal(false);
    Alert.alert(
      "Extension Added",
      "We swapped your spot with the next person in line. You now hold position #5 with no penalty.",
      [{ text: "OK" }]
    );
  };

  const handleRevertDelay = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Ignore
    }
    setIsDelayed(false);
    setShowDelayModal(false);
  };

  const handleNavigateToYourTurn = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } catch {
      // Ignore
    }
    // Navigate to Screen 12: Your Turn
    router.push(`/your-turn/${facility.id}` as any);
  };

  // Interpolated animation styles
  const pingScale = pingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });
  const pingOpacity = pingAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.55, 0.25, 0],
  });

  const beaconScale = beaconPingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });
  const beaconOpacity = beaconPingAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.75, 0.3, 0],
  });

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* 1. Header Navigation Shell matching Stitch Screen 11 */}
      <View className="h-16 px-4 bg-white/80 border-b border-[#E2E8F0] flex-row items-center justify-between z-30">
        <View className="flex-row items-center gap-2 min-w-0 flex-1 mr-2">
          <TouchableOpacity
            accessibilityLabel="Go back"
            onPress={handleBack}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="arrow-back" size={22} color="#131B2E" />
          </TouchableOpacity>

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
              className="text-[16px] font-bold text-[#131B2E] truncate leading-tight mt-0.5"
            >
              QueueUp • Near Turn
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1 shrink-0">
          <TouchableOpacity
            accessibilityLabel="Notifications"
            onPress={() => router.push("/notifications" as any)}
            className="w-9 h-9 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="notifications-outline" size={20} color="#434655" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="More options"
            onPress={() =>
              Alert.alert(
                "Queue Status",
                `Pass #${facility.ticketNumber} at ${facility.name} • Approaching turn window.`
              )
            }
            className="w-9 h-9 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#434655" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Profile"
            onPress={() => router.push("/profile" as any)}
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
          paddingTop: 12,
          paddingBottom: insets.bottom + 28,
        }}
        className="flex-1"
      >
        {/* 2. Push Notification Simulation Banner */}
        {!isPushDismissed && (
          <View className="bg-white rounded-2xl p-3.5 mb-3.5 shadow-sm border border-[#E2E8F0]">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center gap-1.5">
                <View className="w-5 h-5 rounded-md bg-[#2563EB] items-center justify-center p-0.5">
                  <Image
                    source={require("@/assets/images/queueup-logo.png")}
                    style={{ width: 14, height: 14 }}
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                  QueueUp
                </Text>
                <Text className="text-[10px] text-[#737686]">•</Text>
                <Text className="text-xs text-[#737686]">Just now</Text>
              </View>

              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-[#708CFD]" />
                <TouchableOpacity
                  accessibilityLabel="Dismiss notification"
                  onPress={() => setIsPushDismissed(true)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="p-0.5"
                >
                  <Ionicons name="close" size={16} color="#737686" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-col">
              <View className="flex-row items-center gap-1">
                <Ionicons name="flash" size={15} color="#3755C3" />
                <Text className="text-sm font-bold text-[#131B2E]">
                  Almost your turn! (Ticket {facility.ticketNumber})
                </Text>
              </View>
              <Text className="text-xs text-[#434655] pl-4 mt-0.5 leading-snug">
                Only {peopleAhead} people are ahead of you at {facility.name}. Please head toward the
                waiting lobby now.
              </Text>
            </View>
          </View>
        )}

        {/* 3. Urgent Delight Hero Alert Card */}
        <View className="relative overflow-hidden rounded-2xl bg-[#E2E7FF]/75 p-6 shadow-sm flex-col items-center text-center border border-[#DAE2FD] mb-3.5">
          {/* Ambient decorative glow circles */}
          <View className="absolute -top-10 -right-10 w-32 h-32 bg-[#708CFD]/20 rounded-full" />
          <View className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#2563EB]/15 rounded-full" />

          {/* Animated Hero Icon with concentric ripples */}
          <View className="relative my-2 items-center justify-center">
            {/* Ping expanding wave */}
            <Animated.View
              style={{
                position: "absolute",
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#708CFD",
                transform: [{ scale: pingScale }],
                opacity: pingOpacity,
              }}
            />
            {/* Soft pulsing aura */}
            <Animated.View
              style={{
                position: "absolute",
                width: 82,
                height: 82,
                borderRadius: 41,
                backgroundColor: "#B8C4FF",
                opacity: 0.35,
                transform: [{ scale: pulseAnim }],
              }}
            />

            {/* Core Circular Avatar */}
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
              className="w-16 h-16 rounded-full bg-white shadow-md items-center justify-center z-10 border border-[#DAE2FD]/50"
            >
              <MaterialIcons name="directions-run" size={34} color="#004AC6" />
            </Animated.View>
          </View>

          {/* Priority Window Open Pill */}
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-white mt-3 mb-1.5 shadow-xs border border-[#DAE2FD]/60">
            <Ionicons name="timer-outline" size={14} color="#004AC6" />
            <Text className="text-[11px] font-bold text-[#004AC6] uppercase tracking-wider">
              Priority Window Open
            </Text>
          </View>

          {/* Primary Headings */}
          <Text className="text-[26px] font-bold text-[#131B2E] tracking-tight mt-1">
            You&apos;re almost up!
          </Text>
          <Text className="text-lg font-bold text-[#3755C3] mt-0.5">
            Only {peopleAhead} {peopleAhead === 1 ? "person" : "people"} ahead of you
          </Text>

          {/* Body instructions */}
          <Text className="text-[14px] text-[#434655] mt-2.5 text-center leading-relaxed max-w-[290px]">
            Please make your way to {facility.name} waiting area. Your number will be called in
            approximately <Text className="font-bold text-[#131B2E]">{facility.approxMinutes}</Text>.
          </Text>
        </View>

        {/* 4. Ticket & Telemetry Summary Card (Signature Physical Metaphor) */}
        <View className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden mb-3.5">
          {/* Top section */}
          <View className="p-4 flex-col">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5">
                <Animated.View
                  style={{ opacity: liveDotAnim }}
                  className="w-2.5 h-2.5 rounded-full bg-[#007D55]"
                />
                <Text className="text-[11px] font-bold uppercase tracking-wider text-[#007D55]">
                  Live Status • Ready for Call
                </Text>
              </View>
              <View className="px-2.5 py-0.5 rounded-full bg-[#EAEDFF]">
                <Text className="text-xs font-semibold text-[#434655]">{facility.category}</Text>
              </View>
            </View>

            {/* Ticket & Wait */}
            <View className="flex-row items-end justify-between my-2">
              <View>
                <Text className="text-[11px] font-bold uppercase text-[#737686] tracking-wider">
                  Your Pass
                </Text>
                <Text className="text-[44px] font-extrabold text-[#004AC6] tracking-tight leading-none mt-1">
                  {facility.ticketNumber}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-[11px] font-bold uppercase text-[#737686] tracking-wider">
                  Est. Wait
                </Text>
                <Text className="text-2xl font-bold text-[#3755C3] leading-none mt-1">
                  {estWait}
                </Text>
              </View>
            </View>

            {/* Telemetry Grid (Line Rank & Now Serving) */}
            <View className="flex-row gap-2.5 pt-2">
              <View className="flex-1 p-3 rounded-xl bg-[#F2F3FF] flex-col">
                <Text className="text-[10px] font-bold text-[#737686] uppercase">Line Rank</Text>
                <Text className="text-[15px] font-bold text-[#131B2E] mt-0.5">{rankDisplay}</Text>
              </View>
              <View className="flex-1 p-3 rounded-xl bg-[#F2F3FF] flex-col">
                <Text className="text-[10px] font-bold text-[#737686] uppercase">Now Serving</Text>
                <Text className="text-[15px] font-bold text-[#006242] mt-0.5">
                  {facility.nowServingTicket} ({facility.counter})
                </Text>
              </View>
            </View>
          </View>

          {/* Perforated Notch Divider Metaphor */}
          <View className="relative h-6 flex-row items-center justify-between overflow-hidden bg-white">
            <View className="w-5 h-5 rounded-full bg-[#FAF8FF] -ml-2.5 border-r border-[#E2E8F0]" />
            <View className="flex-1 border-b-2 border-dashed border-[#DAE2FD] mx-2" />
            <View className="w-5 h-5 rounded-full bg-[#FAF8FF] -mr-2.5 border-l border-[#E2E8F0]" />
          </View>

          {/* Bottom Telemetry: Location Details */}
          <View className="px-4 py-3 bg-[#F2F3FF]/70 flex-row items-center justify-between border-t border-[#F2F3FF]">
            <View className="flex-row items-center gap-2.5 flex-1 mr-2">
              <View className="w-8 h-8 rounded-full bg-[#EAEDFF] items-center justify-center">
                <Ionicons name="business" size={17} color="#004AC6" />
              </View>
              <View className="flex-col flex-1">
                <Text className="text-[10px] font-bold text-[#737686] uppercase tracking-wider">
                  Location
                </Text>
                <Text numberOfLines={1} className="text-xs font-semibold text-[#131B2E]">
                  {facility.location}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              accessibilityLabel="View Pass"
              onPress={() => setShowPassModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#DAE2FD] flex-row items-center gap-1 active:bg-[#B8C4FF]"
            >
              <Ionicons name="qr-code-outline" size={15} color="#004AC6" />
              <Text className="text-xs font-bold text-[#004AC6]">Pass</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Visual Step Tracker ("Queue Journey") */}
        <Card variant="elevated" className="mb-3.5">
          <Text className="text-[11px] font-bold uppercase tracking-wider text-[#737686] mb-3">
            Queue Journey
          </Text>

          <View className="relative pl-7 gap-4">
            {/* Connecting Vertical Rail */}
            <View className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-[#DAE2FD]" />

            {/* Step 1: Ticket Joined (Completed) */}
            <View className="relative flex-row items-center justify-between">
              <View className="absolute -left-7 w-6 h-6 rounded-full bg-[#007D55] items-center justify-center shadow-xs">
                <Ionicons name="checkmark" size={15} color="#FFFFFF" />
              </View>
              <View className="flex-col">
                <Text className="text-sm font-semibold text-[#131B2E]">Ticket Joined</Text>
                <Text className="text-xs text-[#737686]">Check-in confirmed</Text>
              </View>
              <Text className="text-xs text-[#737686] font-medium">{facility.joinedTime}</Text>
            </View>

            {/* Step 2: Virtual Waiting (Completed) */}
            <View className="relative flex-row items-center justify-between">
              <View className="absolute -left-7 w-6 h-6 rounded-full bg-[#007D55] items-center justify-center shadow-xs">
                <Ionicons name="checkmark" size={15} color="#FFFFFF" />
              </View>
              <View className="flex-col">
                <Text className="text-sm font-semibold text-[#131B2E]">Virtual Waiting</Text>
                <Text className="text-xs text-[#737686]">Advanced spots smoothly</Text>
              </View>
              <Text className="text-xs text-[#737686] font-medium">18 ahead</Text>
            </View>

            {/* Step 3: Active State (Near Turn Alert) */}
            <View className="relative flex-row items-center justify-between bg-[#E2E7FF]/70 -mr-2 p-2.5 rounded-xl border border-[#DAE2FD]">
              <View className="absolute -left-7 w-6 h-6 rounded-full bg-[#004AC6] items-center justify-center shadow-md">
                <View className="w-2 h-2 rounded-full bg-white" />
              </View>
              <View className="flex-col pl-1 flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-sm font-bold text-[#004AC6]">Near Turn Alert</Text>
                  <View className="px-1.5 py-0.5 rounded bg-[#004AC6]">
                    <Text className="text-[9px] font-bold text-white uppercase tracking-wide">
                      Active
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-[#131B2E] mt-0.5">Please head to the lobby now</Text>
              </View>
              <Text className="text-xs font-bold text-[#004AC6]">{peopleAhead} ahead</Text>
            </View>

            {/* Step 4: Next Up (Proceed to Counter) */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleNavigateToYourTurn}
              className="relative flex-row items-center justify-between opacity-80 pt-1"
            >
              <View className="absolute -left-7 w-6 h-6 rounded-full bg-[#EAEDFF] items-center justify-center border border-[#DAE2FD]">
                <View className="w-2 h-2 rounded-full bg-[#737686]" />
              </View>
              <View className="flex-col">
                <Text className="text-sm font-semibold text-[#131B2E]">
                  Proceed to {facility.counter}
                </Text>
                <Text className="text-xs text-[#737686]">Have your ID ready</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs text-[#3755C3] font-bold">Next up!</Text>
                <Ionicons name="chevron-forward" size={14} color="#3755C3" />
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 6. Arrival & Proximity Guidance */}
        <Card variant="elevated" className="mb-3.5">
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="navigate" size={18} color="#004AC6" />
            <Text className="text-sm font-bold text-[#131B2E]">Proximity Guidance</Text>
          </View>

          {/* Radar and Distance Preview Box */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowRadarModal(true)}
            className="relative w-full h-32 rounded-xl overflow-hidden bg-[#EAEDFF] items-center justify-center shadow-inner"
          >
            {/* Map visual background with overlay */}
            <Image
              source={{ uri: facility.mapImageUri }}
              className="absolute inset-0 w-full h-full opacity-75"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-[#131B2E]/25" />
            <View className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Live Radar Beacon Pill */}
            <View className="relative z-10 flex-row items-center gap-2 bg-white/95 px-3.5 py-1.5 rounded-full shadow-md border border-white">
              <View className="relative w-3.5 h-3.5 items-center justify-center">
                <Animated.View
                  style={{
                    position: "absolute",
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: "#004AC6",
                    transform: [{ scale: beaconScale }],
                    opacity: beaconOpacity,
                  }}
                />
                <View className="w-2.5 h-2.5 rounded-full bg-[#004AC6]" />
              </View>
              <Text className="text-xs font-bold text-[#131B2E]">{facility.distanceText}</Text>
            </View>

            <View className="absolute bottom-2 left-3 right-3 z-10">
              <Text className="text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                {facility.routeNote}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Checkpoint callout note */}
          <View className="p-3 rounded-xl bg-[#F2F3FF] flex-row items-start gap-2.5 mt-3">
            <Ionicons
              name="checkmark-circle"
              size={18}
              color="#007D55"
              style={{ marginTop: 1 }}
            />
            <Text className="text-xs text-[#434655] leading-normal flex-1">
              <Text className="font-bold text-[#131B2E]">Arrival checkpoint:</Text> Tap in with the
              front desk tablet or present your ticket barcode to reception upon arrival.
            </Text>
          </View>
        </Card>

        {/* 7. Action CTA Group */}
        <View className="flex-col gap-2.5 pt-1 mb-2">
          {/* Primary: Live Radar */}
          <Button
            title="View Queue & Live Radar"
            variant="primary"
            size="md"
            onPress={() => setShowRadarModal(true)}
            leftIcon={<Ionicons name="compass-outline" size={20} color="#FFFFFF" />}
            className="shadow-sm"
          />

          {/* Secondary: Already at Clinic / Checked in */}
          {isCheckedInAtLobby ? (
            <View className="w-full min-h-[50px] rounded-xl bg-emerald-50 border border-emerald-300 flex-row items-center justify-center gap-2 p-3">
              <Ionicons name="checkmark-circle" size={20} color="#007D55" />
              <Text className="text-sm font-bold text-[#007D55]">Checked In at Lobby</Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLobbyCheckIn}
              className="w-full min-h-[50px] rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex-row items-center justify-center gap-2 px-4 py-3 active:bg-[#F2F3FF]"
            >
              <Ionicons name="person-add-outline" size={19} color="#004AC6" />
              <Text className="text-sm font-semibold text-[#131B2E]">
                I&apos;m Already at the Clinic
              </Text>
            </TouchableOpacity>
          )}

          {/* Tertiary: Delay Turn Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowDelayModal(true)}
            className="w-full py-2.5 rounded-xl items-center justify-center flex-row gap-1.5 active:bg-[#EAEDFF]"
          >
            <Ionicons name="time-outline" size={18} color="#434655" />
            <Text className="text-xs font-semibold text-[#434655]">
              {isDelayed
                ? "Delay Active (+5 min extension applied)"
                : "Need 5 More Minutes (Delay turn)"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ready to Advance Callout & Direct Navigation to Screen 12 (Your Turn) */}
        <View className="mt-2 bg-[#EAEDFF]/60 rounded-xl p-3 border border-[#DAE2FD] flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1 mr-2">
            <Ionicons name="megaphone" size={18} color="#004AC6" />
            <View className="flex-col flex-1">
              <Text className="text-xs font-bold text-[#131B2E]">Turn Imminent</Text>
              <Text className="text-[11px] text-[#434655]">
                Doctor is ready to call ticket {facility.ticketNumber}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            accessibilityLabel="Proceed to Your Turn"
            onPress={handleNavigateToYourTurn}
            className="px-3 py-1.5 rounded-lg bg-[#004AC6] flex-row items-center gap-1 active:bg-[#3755C3]"
          >
            <Text className="text-xs font-bold text-white">Your Turn →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 8. Delay Confirmation Drawer Dialog (Micro-Interaction) */}
      <Modal
        visible={showDelayModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDelayModal(false)}
      >
        <View className="flex-1 justify-end bg-black/45">
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-[#E2E8F0]">
            {/* Drawer Drag Pill */}
            <View className="w-12 h-1.5 rounded-full bg-[#C3C6D7] mx-auto mb-4" />

            <View className="items-center text-center mb-4">
              <View className="w-12 h-12 rounded-full bg-[#EAEDFF] items-center justify-center mb-2">
                <Ionicons name="time" size={24} color="#3755C3" />
              </View>
              <Text className="text-xl font-bold text-[#131B2E]">Take Your Time</Text>
              <Text className="text-sm text-[#434655] text-center mt-1 leading-relaxed max-w-[320px]">
                We can swap your spot with the next person in line. You will hold position #5 (est.
                +7 minutes).
              </Text>
            </View>

            <View className="flex-col gap-2.5 mt-2">
              <Button
                title="Confirm +5 Minute Extension"
                variant="primary"
                size="md"
                onPress={handleApplyDelay}
                className="bg-[#3755C3] active:bg-[#2563EB]"
              />

              <TouchableOpacity
                onPress={handleRevertDelay}
                className="w-full min-h-[46px] rounded-xl items-center justify-center active:bg-slate-100"
              >
                <Text className="text-sm font-semibold text-[#434655]">
                  Keep My Current Spot ({rankDisplay})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 9. Scannable Ticket Pass Barcode Modal */}
      <Modal
        visible={showPassModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPassModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/60 p-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl items-center">
            <View className="w-full flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold uppercase tracking-wider text-[#737686]">
                Reception Checkpoint Pass
              </Text>
              <TouchableOpacity onPress={() => setShowPassModal(false)}>
                <Ionicons name="close" size={22} color="#131B2E" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-[#434655] mb-1">{facility.name}</Text>
            <Text className="text-4xl font-extrabold text-[#004AC6] tracking-tight mb-3">
              {facility.ticketNumber}
            </Text>

            {/* Barcode Graphic Pattern */}
            <View className="w-full bg-[#FAF8FF] p-4 rounded-xl items-center border border-[#DAE2FD] mb-3">
              <View className="w-full h-12 flex-row items-center justify-between px-2">
                {[
                  3, 2, 4, 1, 5, 2, 3, 6, 2, 4, 2, 5, 1, 4, 3, 2, 6, 3, 2, 4, 1, 5, 3, 2, 4, 2, 6,
                  2, 3, 5, 2, 4, 2,
                ].map((width, idx) => (
                  <View
                    key={idx}
                    style={{ width, height: 48, backgroundColor: "#131B2E", borderRadius: 1 }}
                  />
                ))}
              </View>
              <Text className="text-xs font-bold tracking-widest text-[#131B2E] mt-2 font-mono">
                PASSCODE: {facility.barcodePasscode}
              </Text>
            </View>

            <Text className="text-xs text-center text-[#737686] mb-4">
              Hold this screen under the kiosk scanner or present to the desk nurse at arrival.
            </Text>

            <Button
              title="Close Pass"
              variant="outline"
              size="sm"
              onPress={() => setShowPassModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* 10. Live Queue & Radar Modal */}
      <Modal
        visible={showRadarModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRadarModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl max-h-[85%]">
            <View className="w-12 h-1.5 rounded-full bg-[#C3C6D7] mx-auto mb-4" />

            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="compass" size={20} color="#004AC6" />
                <Text className="text-lg font-bold text-[#131B2E]">Live Radar & Walking Route</Text>
              </View>
              <TouchableOpacity onPress={() => setShowRadarModal(false)}>
                <Ionicons name="close" size={22} color="#131B2E" />
              </TouchableOpacity>
            </View>

            <View className="rounded-xl overflow-hidden h-48 bg-[#EAEDFF] relative mb-4 items-center justify-center">
              <Image
                source={{ uri: facility.mapImageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/20" />
              <View className="bg-white/95 px-3 py-1.5 rounded-full shadow-md flex-row items-center gap-1.5">
                <View className="w-2.5 h-2.5 rounded-full bg-[#004AC6]" />
                <Text className="text-xs font-bold text-[#131B2E]">{facility.distanceText}</Text>
              </View>
            </View>

            <View className="p-3.5 rounded-xl bg-[#F2F3FF] mb-4">
              <Text className="text-xs font-bold text-[#131B2E] uppercase mb-1">
                Route Direction:
              </Text>
              <Text className="text-xs text-[#434655] leading-relaxed">
                Take the North Lobby elevators up to the 2nd Floor, turn left at Suite 200, and enter
                Room 204.
              </Text>
            </View>

            <Button
              title="Return to Alert Screen"
              variant="primary"
              size="md"
              onPress={() => setShowRadarModal(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
