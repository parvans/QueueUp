import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type QueueSimState = "live" | "near" | "paused" | "cancelled";

interface FacilityLiveQueueData {
  id: string;
  name: string;
  category: string;
  department: string;
  doctor: string;
  ticketNumber: string;
  servingNow: string;
  servingNear: string;
  counter: string;
  initialAhead: number;
  initialWait: number;
  joinedAt: string;
  estServiceTime: string;
  estNearTime: string;
  address: string;
  distance: string;
  driveTime: string;
  phone: string;
}

const LIVE_FACILITIES: Record<string, FacilityLiveQueueData> = {
  "city-care-clinic": {
    id: "city-care-clinic",
    name: "City Care Clinic",
    category: "Medical Clinic",
    department: "General OPD",
    doctor: "Dr. Martinez",
    ticketNumber: "A-047",
    servingNow: "A-035",
    servingNear: "A-045",
    counter: "Counter 2",
    initialAhead: 12,
    initialWait: 18,
    joinedAt: "10:42 AM",
    estServiceTime: "11:00 AM",
    estNearTime: "10:47 AM",
    address: "450 Medical Plaza Dr, Suite 300",
    distance: "1.2 km",
    driveTime: "4 min drive",
    phone: "(555) 019-2834",
  },
  "st-jude-hospital": {
    id: "st-jude-hospital",
    name: "St. Jude Hospital - OPD",
    category: "Hospital Intake",
    department: "Cardiology OPD",
    doctor: "Dr. David Vance",
    ticketNumber: "B-108",
    servingNow: "B-089",
    servingNear: "B-106",
    counter: "Counter 1",
    initialAhead: 19,
    initialWait: 35,
    joinedAt: "11:50 AM",
    estServiceTime: "12:35 PM",
    estNearTime: "12:28 PM",
    address: "1200 Mercy Boulevard, Floor 1",
    distance: "2.8 km",
    driveTime: "8 min drive",
    phone: "(555) 044-8921",
  },
  "express-medical": {
    id: "express-medical",
    name: "Express Medical & Pediatric",
    category: "Urgent & Pediatric",
    department: "Pediatric Triage",
    doctor: "Dr. Rachel Green",
    ticketNumber: "E-019",
    servingNow: "E-015",
    servingNear: "E-018",
    counter: "Fast Desk 1",
    initialAhead: 4,
    initialWait: 8,
    joinedAt: "10:23 AM",
    estServiceTime: "10:35 AM",
    estNearTime: "10:31 AM",
    address: "450 Health Parkway, Suite B",
    distance: "3.5 km",
    driveTime: "10 min drive",
    phone: "(555) 077-4412",
  },
};

export default function LiveQueueScreen() {
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

  const facility: FacilityLiveQueueData =
    LIVE_FACILITIES[resolvedKey] || LIVE_FACILITIES["city-care-clinic"];

  // Simulation State
  const [simState, setSimState] = useState<QueueSimState>("live");
  const [isSavedToWallet, setIsSavedToWallet] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const radarSweepAnim = useRef(new Animated.Value(0.65)).current;

  // Pulse animation for live beacon
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.35,
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

  // Bounce animation when in Near Turn state
  useEffect(() => {
    if (simState === "near") {
      const bounceLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.15,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      bounceLoop.start();
      return () => bounceLoop.stop();
    } else {
      bounceAnim.setValue(1);
    }
  }, [simState, bounceAnim]);

  // Animate progress bar on sim state change
  useEffect(() => {
    const targetValue =
      simState === "live"
        ? 0.65
        : simState === "near"
        ? 0.92
        : simState === "paused"
        ? 0.65
        : 0;

    Animated.timing(radarSweepAnim, {
      toValue: targetValue,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [simState, radarSweepAnim]);

  const handleSimStateChange = (nextState: QueueSimState) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Fallback
    }
    setSimState(nextState);
  };

  const handleWalletToggle = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Fallback
    }
    setIsSavedToWallet(true);
    Alert.alert(
      "Saved to Wallet",
      `Active Queue Pass #${facility.ticketNumber} for ${facility.name} has been added to Apple Wallet.`
    );
    setTimeout(() => {
      setIsSavedToWallet(false);
    }, 3000);
  };

  const handleDirections = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Fallback
    }
    Alert.alert(
      "Directions",
      `Opening turn-by-turn navigation to ${facility.name} (${facility.address}) — ${facility.distance} away (${facility.driveTime}).`
    );
  };

  const handleCallClinic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Fallback
    }
    Alert.alert("Calling Clinic", `Dialing ${facility.name} reception at ${facility.phone}...`);
  };

  const handleConfirmLeaveQueue = () => {
    setShowCancelModal(false);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    } catch {
      // Fallback
    }
    setSimState("cancelled");
  };

  const handleNextStepNavigation = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Fallback
    }
    // Navigate to Screen 11: Near Turn Alert
    router.push(`/near-turn/${facility.id}` as any);
  };

  // State-specific derived visual configurations
  const stateConfigs = {
    live: {
      aheadCount: `${facility.initialAhead}`,
      aheadLabel: "people ahead of you",
      aheadSubtext: "Stay relaxed, plenty of time",
      circleBg: "bg-primary-container",
      waitText: `~${facility.initialWait} min`,
      waitSubtext: "Based on clinic pacing",
      servingText: facility.servingNow,
      estTime: facility.estServiceTime,
      bannerMain: "Queue is moving normally",
      bannerSub: `Currently serving ticket ${facility.servingNow} at ${facility.counter}`,
      beaconPingColor: "bg-emerald-400",
      beaconDotColor: "bg-emerald-600",
      step3Title: `${facility.initialAhead} People Ahead (In Line)`,
      step3Badge: "IN PROGRESS",
      step3Desc: "Smart proximity updates enabled",
      ticketNumberColor: "text-primary-container",
    },
    near: {
      aheadCount: "2",
      aheadLabel: "people ahead! Almost ready",
      aheadSubtext: "Please proceed towards Waiting Area B",
      circleBg: "bg-[#708CFD]",
      waitText: "~3 min",
      waitSubtext: "High velocity intake",
      servingText: facility.servingNear,
      estTime: facility.estNearTime,
      bannerMain: "You are #3 in line • Step inside!",
      bannerSub: `${facility.counter} is finishing with patient ${facility.servingNear}`,
      beaconPingColor: "bg-blue-400",
      beaconDotColor: "bg-[#004AC6]",
      step3Title: "2 People Ahead (Approaching Turn)",
      step3Badge: "URGENT",
      step3Desc: `Proceed immediately to ${facility.counter} lobby`,
      ticketNumberColor: "text-primary",
    },
    paused: {
      aheadCount: "⏸",
      aheadLabel: "Doctor briefly paused",
      aheadSubtext: "Staff sterilization in progress (~5m)",
      circleBg: "bg-[#DAE2FD]",
      waitText: "Paused",
      waitSubtext: "Resuming shortly",
      servingText: "On Hold",
      estTime: "--:--",
      bannerMain: "Session paused for sanitization",
      bannerSub: "Estimated resumption in 5 minutes",
      beaconPingColor: "bg-transparent",
      beaconDotColor: "bg-[#737686]",
      step3Title: "Queue Paused Temporarily",
      step3Badge: "PAUSED",
      step3Desc: "Estimated resumption in 5 mins",
      ticketNumberColor: "text-[#737686]",
    },
    cancelled: {
      aheadCount: "✕",
      aheadLabel: "Pass Withdrawn",
      aheadSubtext: "You left this virtual queue",
      circleBg: "bg-red-600",
      waitText: "N/A",
      waitSubtext: "Ticket cancelled",
      servingText: "--",
      estTime: "--:--",
      bannerMain: "Queue pass has been cancelled",
      bannerSub: "Tap to re-join clinic registration queue",
      beaconPingColor: "bg-transparent",
      beaconDotColor: "bg-red-600",
      step3Title: "Ticket Cancelled",
      step3Badge: "CANCELLED",
      step3Desc: "You are no longer holding a slot",
      ticketNumberColor: "text-[#737686] line-through",
    },
  }[simState];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Top Application Header matching Stitch Shell */}
      <View className="h-16 px-4 bg-white/80 border-b border-[#E2E8F0] flex-row items-center justify-between z-30">
        <View className="flex-row items-center gap-2 min-w-0 flex-1 mr-2">
          <TouchableOpacity
            accessibilityLabel="Go back"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace(`/ticket/${facility.ticketNumber}` as any);
              }
            }}
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
            <Text className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none">
              QueueUp
            </Text>
            <Text
              numberOfLines={1}
              className="text-[16px] font-bold text-[#131B2E] truncate leading-tight mt-0.5"
            >
              Live Queue Tracking
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
            accessibilityLabel="Share options"
            onPress={() =>
              Alert.alert(
                "Queue Options",
                `Pass #${facility.ticketNumber} at ${facility.name} • Active status.`
              )
            }
            className="w-9 h-9 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#434655" />
          </TouchableOpacity>

          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center ml-0.5 shadow-2xs">
            <Ionicons name="person" size={15} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Simulator Control Strip (Sticky Micro-Header matching Stitch) */}
      <View className="px-4 py-2 bg-[#F2F3FF]/90 border-b border-[#E2E8F0]/70 z-20">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center", gap: 6 }}
        >
          <View className="flex-row items-center gap-1 mr-1">
            <Ionicons name="options-outline" size={13} color="#004AC6" />
            <Text className="text-[10px] font-bold text-[#434655] uppercase">
              Sim:
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSimStateChange("live")}
            className={`px-3 py-1 rounded-full ${
              simState === "live"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <Text
              className={`text-[11px] font-semibold ${
                simState === "live" ? "text-white font-bold" : "text-[#434655]"
              }`}
            >
              Live Tracking (12 Ahead)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSimStateChange("near")}
            className={`px-3 py-1 rounded-full ${
              simState === "near"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <Text
              className={`text-[11px] font-semibold ${
                simState === "near" ? "text-white font-bold" : "text-[#434655]"
              }`}
            >
              Near Turn (2 Ahead)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSimStateChange("paused")}
            className={`px-3 py-1 rounded-full ${
              simState === "paused"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <Text
              className={`text-[11px] font-semibold ${
                simState === "paused" ? "text-white font-bold" : "text-[#434655]"
              }`}
            >
              Paused
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSimStateChange("cancelled")}
            className={`px-3 py-1 rounded-full ${
              simState === "cancelled"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <Text
              className={`text-[11px] font-semibold ${
                simState === "cancelled" ? "text-white font-bold" : "text-[#434655]"
              }`}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Scrollable Queue Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 24) + 16,
          paddingTop: 10,
        }}
        className="flex-1"
      >
        <View className="px-4 gap-3.5">
          {/* Business Identity Chip */}
          <View className="flex-row items-center justify-between bg-[#EAEDFF] rounded-full px-4 py-2 shadow-2xs">
            <View className="flex-row items-center gap-2 min-w-0 flex-1 mr-2">
              <Ionicons name="medkit" size={17} color="#004AC6" />
              <Text
                numberOfLines={1}
                className="text-[12px] font-semibold text-[#131B2E] truncate"
              >
                {facility.name} • {facility.department} • {facility.doctor}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={17} color="#007D55" />
          </View>

          {/* Near Turn Advance Prompt Banner (When in Near Turn state) */}
          {simState === "near" && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNextStepNavigation}
              className="bg-blue-600 rounded-2xl p-3.5 shadow-md flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-2.5 flex-1 mr-2">
                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                  <Ionicons name="notifications" size={18} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-bold text-white">
                    Near Turn Alert Triggered!
                  </Text>
                  <Text className="text-[11px] text-blue-100">
                    Only 2 people ahead. Tap to view Near Turn screen.
                  </Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {/* Live Telemetry Announcement Toast */}
          <View className="flex-row items-center justify-between bg-[#E2E7FF] rounded-xl p-3.5 shadow-2xs">
            <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
              <View className="relative w-3 h-3 items-center justify-center shrink-0">
                {simState !== "paused" && simState !== "cancelled" && (
                  <Animated.View
                    style={{ transform: [{ scale: pulseAnim }], opacity: 0.75 }}
                    className={`absolute w-full h-full rounded-full ${stateConfigs.beaconPingColor}`}
                  />
                )}
                <View className={`w-3 h-3 rounded-full ${stateConfigs.beaconDotColor}`} />
              </View>
              <View className="flex-1 min-w-0">
                <Text
                  numberOfLines={1}
                  className="text-[12px] font-bold text-[#131B2E]"
                >
                  {stateConfigs.bannerMain}
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-[11px] text-[#434655] mt-0.5"
                >
                  {stateConfigs.bannerSub}
                </Text>
              </View>
            </View>
            <Ionicons name="radio" size={18} color="#434655" />
          </View>

          {/* Digital Queue Ticket (Signature Card) */}
          <Card
            variant="elevated"
            className="p-0 rounded-2xl bg-white shadow-xl overflow-hidden border border-[#E2E7FF]"
          >
            {/* Gradient Ambient Accent Bar */}
            <View className="h-2 w-full bg-[#004AC6]" />

            {/* Top Ticket Header */}
            <View className="p-4 pb-2 flex-col gap-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-widest">
                    DIGITAL QUEUE PASS
                  </Text>
                  {simState !== "cancelled" ? (
                    <View className="flex-row items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#6FFBBE]/40">
                      <View className="w-1.5 h-1.5 rounded-full bg-[#006242]" />
                      <Text className="text-[9px] font-bold text-[#00174B] uppercase tracking-wider">
                        Live Synchronized
                      </Text>
                    </View>
                  ) : (
                    <View className="px-2 py-0.5 rounded-full bg-red-100">
                      <Text className="text-[9px] font-bold text-red-700 uppercase tracking-wider">
                        Cancelled
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-[11px] text-[#737686]">
                  Updated just now
                </Text>
              </View>

              {/* Giant Ticket Display */}
              <View className="items-center justify-center py-2 text-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider mb-1">
                  Your Pass Number
                </Text>
                <Text
                  className={`text-[48px] font-black tracking-wider leading-none select-all ${stateConfigs.ticketNumberColor}`}
                >
                  {facility.ticketNumber}
                </Text>
                {simState !== "cancelled" && (
                  <View className="flex-row items-center gap-1 mt-1.5">
                    <Ionicons name="qr-code-outline" size={14} color="#3755C3" />
                    <Text className="text-[12px] font-semibold text-[#3755C3]">
                      Express Scan Active
                    </Text>
                  </View>
                )}
              </View>

              {/* Position Hero Badge */}
              <View className="items-center justify-center my-1">
                <View className="flex-row items-center gap-3.5 bg-[#F2F3FF] px-5 py-2 rounded-full shadow-2xs">
                  <Animated.View
                    style={{ transform: [{ scale: bounceAnim }] }}
                    className={`w-12 h-12 rounded-full ${stateConfigs.circleBg} items-center justify-center shadow-xs`}
                  >
                    <Text className="text-[20px] font-black text-white">
                      {stateConfigs.aheadCount}
                    </Text>
                  </Animated.View>
                  <View className="flex-col text-left">
                    <Text className="text-[14px] font-bold text-[#131B2E] leading-tight">
                      {stateConfigs.aheadLabel}
                    </Text>
                    <Text className="text-[11px] text-[#434655] mt-0.5">
                      {stateConfigs.aheadSubtext}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Secondary Telemetry Grid (2 Columns) */}
              <View className="flex-row gap-2.5 pt-2">
                <View className="flex-1 bg-[#F2F3FF] rounded-xl p-3 justify-between">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="time" size={14} color="#004AC6" />
                    <Text className="text-[9px] font-bold text-[#434655] uppercase">
                      Estimated Wait
                    </Text>
                  </View>
                  <Text className="text-[18px] font-bold text-[#131B2E] mt-1">
                    {stateConfigs.waitText}
                  </Text>
                  <Text className="text-[10px] text-[#434655]">
                    {stateConfigs.waitSubtext}
                  </Text>
                </View>

                <View className="flex-1 bg-[#F2F3FF] rounded-xl p-3 justify-between">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="business" size={14} color="#007D55" />
                    <Text className="text-[9px] font-bold text-[#434655] uppercase">
                      Currently Serving
                    </Text>
                  </View>
                  <Text className="text-[18px] font-bold text-primary mt-1">
                    {stateConfigs.servingText}
                  </Text>
                  <Text className="text-[10px] text-[#434655]">
                    Desk / {facility.counter}
                  </Text>
                </View>
              </View>

              {/* Micro Time Stamps */}
              <View className="flex-row items-center justify-between pt-1 px-1 text-[11px]">
                <Text className="text-[11px] text-[#434655]">
                  Joined at:{" "}
                  <Text className="font-bold text-[#131B2E]">
                    {facility.joinedAt}
                  </Text>
                </Text>
                <Text className="text-[11px] text-[#434655]">
                  Est. Service:{" "}
                  <Text className="font-bold text-[#131B2E]">
                    {stateConfigs.estTime}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Ticket Cutout Notches & Perforation */}
            <View className="relative flex-row items-center justify-between w-full h-6 px-0 overflow-hidden my-1">
              <View className="w-4 h-8 bg-[#FAF8FF] rounded-r-full -ml-2 shadow-inner" />
              <View className="flex-1 border-b-2 border-dashed border-[#C3C6D7]/60 mx-2" />
              <View className="w-4 h-8 bg-[#FAF8FF] rounded-l-full -mr-2 shadow-inner" />
            </View>

            {/* Live Queue Radar Tracker Section */}
            <View className="p-4 pt-1 flex-col gap-2 bg-white">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="radio" size={15} color="#004AC6" />
                  <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                    Live Queue Radar
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <View className="w-2 h-2 rounded-full bg-[#006242]" />
                  <Text className="text-[11px] font-medium text-[#006242]">
                    Steady Velocity
                  </Text>
                </View>
              </View>

              {/* Visual Progress Bar / Line Progression */}
              <View className="pt-1.5 pb-0.5">
                <View className="h-3 w-full bg-[#E2E7FF] rounded-full overflow-hidden p-0.5 justify-center">
                  <Animated.View
                    style={{
                      width: radarSweepAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    }}
                    className="h-full bg-primary rounded-full"
                  />
                </View>

                <View className="flex-row justify-between items-center mt-2 text-[11px]">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="storefront-outline" size={13} color="#007D55" />
                    <Text className="text-[11px] text-[#434655]">
                      Now:{" "}
                      <Text className="font-bold text-[#131B2E]">
                        #{stateConfigs.servingText}
                      </Text>
                    </Text>
                  </View>

                  <View className="bg-[#DBE1FF]/50 px-2 py-0.5 rounded-full">
                    <Text className="text-[9px] font-bold text-primary">
                      Line Speed: ~1.5m / person
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <Text className="text-[11px] text-[#434655]">
                      You:{" "}
                      <Text className="font-bold text-[#131B2E]">
                        #{facility.ticketNumber}
                      </Text>
                    </Text>
                    <Ionicons name="pin" size={13} color="#004AC6" />
                  </View>
                </View>
              </View>
            </View>
          </Card>

          {/* Visual Queue Timeline (Interactive Step Tracker) */}
          <Card
            variant="elevated"
            className="p-4 rounded-2xl bg-white shadow-sm border border-[#E2E7FF] gap-3"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-[15px] font-bold text-[#131B2E]">
                Progress Timeline
              </Text>
              <Text className="text-[10px] font-bold text-[#434655] uppercase">
                Phase 3 of 5
              </Text>
            </View>

            <View className="relative flex-col gap-3.5 pl-2">
              {/* Connecting vertical rule line */}
              <View className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-[#E2E7FF]" />

              {/* Step 1: Joined */}
              <View className="flex-row items-start gap-3 z-10">
                <View className="w-7 h-7 rounded-full bg-[#007D55] items-center justify-center shadow-xs shrink-0">
                  <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[13px] font-semibold text-[#131B2E]">
                      Joined Queue
                    </Text>
                    <Text className="text-[11px] text-[#434655]">
                      {facility.joinedAt}
                    </Text>
                  </View>
                  <Text className="text-[11px] text-[#434655] mt-0.5">
                    Registered via QueueUp mobile app
                  </Text>
                </View>
              </View>

              {/* Step 2: Ticket Issued */}
              <View className="flex-row items-start gap-3 z-10">
                <View className="w-7 h-7 rounded-full bg-[#007D55] items-center justify-center shadow-xs shrink-0">
                  <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[13px] font-semibold text-[#131B2E]">
                      Ticket Issued ({facility.ticketNumber})
                    </Text>
                    <Text className="text-[11px] text-[#434655]">
                      {facility.joinedAt}
                    </Text>
                  </View>
                  <Text className="text-[11px] text-[#434655] mt-0.5">
                    Assigned to {facility.doctor} • {facility.counter}
                  </Text>
                </View>
              </View>

              {/* Step 3: Active with Pulse */}
              <View className="flex-row items-start gap-3 z-10">
                <View className="relative w-7 h-7 items-center justify-center shrink-0">
                  {simState !== "paused" && simState !== "cancelled" && (
                    <Animated.View
                      style={{ transform: [{ scale: pulseAnim }], opacity: 0.75 }}
                      className="absolute w-full h-full rounded-full bg-blue-200"
                    />
                  )}
                  <View className="w-7 h-7 rounded-full bg-primary items-center justify-center shadow-xs">
                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                  </View>
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[13px] font-bold text-primary">
                      {stateConfigs.step3Title}
                    </Text>
                    <View className="px-2 py-0.5 rounded-full bg-[#EAEDFF]">
                      <Text className="text-[9px] font-bold text-primary uppercase">
                        {stateConfigs.step3Badge}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[11px] text-[#434655] mt-0.5">
                    {stateConfigs.step3Desc}
                  </Text>
                </View>
              </View>

              {/* Step 4: Upcoming (Near Turn) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleNextStepNavigation}
                className="flex-row items-start gap-3 z-10 opacity-75 active:opacity-100"
              >
                <View className="w-7 h-7 rounded-full bg-[#EAEDFF] items-center justify-center shrink-0">
                  <Ionicons name="notifications-outline" size={14} color="#434655" />
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[13px] font-medium text-[#131B2E]">
                      Your Turn ({facility.counter})
                    </Text>
                    <Text className="text-[11px] text-[#434655]">
                      Est. {facility.estServiceTime}
                    </Text>
                  </View>
                  <Text className="text-[11px] text-[#434655] mt-0.5">
                    Audible chime &amp; SMS door notification
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Step 5: Completed */}
              <View className="flex-row items-start gap-3 z-10 opacity-50">
                <View className="w-7 h-7 rounded-full bg-[#EAEDFF] items-center justify-center shrink-0">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#C3C6D7]" />
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[13px] font-medium text-[#131B2E]">
                      Completed
                    </Text>
                    <Text className="text-[11px] text-[#434655]">--:--</Text>
                  </View>
                  <Text className="text-[11px] text-[#434655] mt-0.5">
                    Care summary and digital prescription
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Proximity Alert & Directions Map Preview */}
          <Card
            variant="elevated"
            className="p-4 rounded-2xl bg-white shadow-sm border border-[#E2E7FF] gap-2.5"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Clinic Location &amp; Arrival
              </Text>
              <Text className="text-[12px] font-semibold text-primary">
                {facility.distance} away • {facility.driveTime}
              </Text>
            </View>

            {/* Map Preview Canvas */}
            <View className="w-full h-32 bg-[#E2E8F0] rounded-xl overflow-hidden relative shadow-inner justify-end">
              <View className="absolute inset-0 bg-[#D2D9F4]/40 items-center justify-center">
                <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center">
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center shadow-xs">
                    <Ionicons name="medkit" size={13} color="#FFFFFF" />
                  </View>
                </View>
              </View>

              <View className="bg-black/60 p-2.5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-1 flex-1 mr-2">
                  <Ionicons name="location" size={14} color="#FFFFFF" />
                  <Text
                    numberOfLines={1}
                    className="text-[11px] font-medium text-white truncate"
                  >
                    {facility.address}
                  </Text>
                </View>
                <View className="bg-white/20 px-2 py-0.5 rounded">
                  <Text className="text-[9px] font-bold text-white uppercase">
                    Open
                  </Text>
                </View>
              </View>
            </View>

            {/* Primary Action: Get Directions */}
            <Button
              title={`Get Directions (${facility.distance} away)`}
              variant="primary"
              size="lg"
              leftIcon={<Ionicons name="navigate" size={18} color="#FFFFFF" />}
              onPress={handleDirections}
              className="w-full rounded-xl bg-primary"
            />

            {/* Quick Action Row */}
            <View className="flex-row gap-2.5 pt-1">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleWalletToggle}
                className="flex-1 h-11 rounded-xl bg-[#F2F3FF] flex-row items-center justify-center gap-2 active:bg-[#EAEDFF]"
              >
                <Ionicons name="wallet-outline" size={17} color="#3755C3" />
                <Text className="text-[12px] font-semibold text-[#131B2E]">
                  {isSavedToWallet ? "Saved ✓" : "Add to Wallet"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCallClinic}
                className="flex-1 h-11 rounded-xl bg-[#F2F3FF] flex-row items-center justify-center gap-2 active:bg-[#EAEDFF]"
              >
                <Ionicons name="call-outline" size={17} color="#006242" />
                <Text className="text-[12px] font-semibold text-[#131B2E]">
                  Call Clinic
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Freedom Notice Banner */}
          <View className="bg-[#E2E7FF] rounded-xl p-3.5 flex-row items-center gap-3 shadow-2xs">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center shrink-0">
              <Ionicons name="cafe-outline" size={20} color="#004AC6" />
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-[14px] font-bold text-[#131B2E] leading-tight">
                Feel free to step out!
              </Text>
              <Text className="text-[11px] text-[#434655] mt-0.5 leading-snug">
                Grab a coffee or walk around. You will receive high-priority alerts when your turn approaches.
              </Text>
            </View>
          </View>

          {/* Destructive Action */}
          <View className="pt-1 pb-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowCancelModal(true)}
              className="w-full py-3 px-4 rounded-xl bg-red-50 border border-red-200/60 flex-row items-center justify-center gap-2 active:bg-red-100"
            >
              <Ionicons name="close-circle-outline" size={18} color="#BA1A1A" />
              <Text className="text-[13px] font-bold text-[#BA1A1A]">
                Leave Queue / Cancel Pass
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Safety Leave Queue Modal Prompt */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-5">
          <View className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl items-center">
            <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mb-3">
              <Ionicons name="warning" size={26} color="#BA1A1A" />
            </View>

            <Text className="text-[18px] font-bold text-[#131B2E] text-center mb-1">
              Leave Active Queue?
            </Text>

            <Text className="text-[13px] text-[#434655] text-center leading-relaxed mb-5">
              You are currently <Text className="font-bold text-[#131B2E]">#{stateConfigs.aheadCount}</Text> in line. If you leave, your spot <Text className="font-bold text-primary">{facility.ticketNumber}</Text> will be released immediately.
            </Text>

            <View className="w-full gap-2.5">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirmLeaveQueue}
                className="w-full h-12 bg-[#BA1A1A] rounded-xl items-center justify-center shadow-md active:bg-red-700"
              >
                <Text className="text-white text-[14px] font-bold">
                  Yes, Cancel My Ticket
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCancelModal(false)}
                className="w-full h-12 bg-[#EAEDFF] rounded-xl items-center justify-center active:bg-[#DAE2FD]"
              >
                <Text className="text-[#131B2E] text-[14px] font-semibold">
                  Keep My Place in Line
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
