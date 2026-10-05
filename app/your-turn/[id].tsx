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

interface YourTurnFacilityData {
  id: string;
  name: string;
  category: string;
  department: string;
  doctor: string;
  ticketNumber: string;
  counter: string;
  destination: string;
  floor: string;
  calledAt: string;
  station: string;
  initialSeconds: number;
  barcodePasscode: string;
  directions: string[];
}

const YOUR_TURN_FACILITIES: Record<string, YourTurnFacilityData> = {
  "city-care-clinic": {
    id: "city-care-clinic",
    name: "City Care Clinic",
    category: "General Care",
    department: "General OPD Consultation",
    doctor: "Dr. Martinez",
    ticketNumber: "A-047",
    counter: "Counter 2",
    destination: "Suite 300",
    floor: "2nd Floor • City Care Clinic",
    calledAt: "11:02 AM",
    station: "Station Desk #2",
    initialSeconds: 278, // ~04:38 from Stitch design
    barcodePasscode: "9284-A047",
    directions: [
      "Enter through the main clinic doors and take the North Lobby elevators to the 2nd Floor.",
      "Exit the elevators and turn left down Hallway B toward Suite 300.",
      "Counter 2 is situated directly beside Doctor Consultation Room 204.",
    ],
  },
  "st-jude-hospital": {
    id: "st-jude-hospital",
    name: "St. Jude Hospital - OPD",
    category: "Cardiology",
    department: "Cardiology OPD Consultation",
    doctor: "Dr. David Vance",
    ticketNumber: "B-108",
    counter: "Counter 1",
    destination: "Wing B, Rm 102",
    floor: "1st Floor • Main Hospital Wing B",
    calledAt: "12:35 PM",
    station: "Station Desk #1",
    initialSeconds: 300,
    barcodePasscode: "4821-B108",
    directions: [
      "Enter the Main Hospital Concourse past the triage check-in point.",
      "Turn right into Cardiology Wing B on the 1st Floor.",
      "Counter 1 is the primary intake desk immediately on your left.",
    ],
  },
  "express-medical": {
    id: "express-medical",
    name: "Express Medical & Pediatric",
    category: "Urgent & Pediatric",
    department: "Pediatric Triage",
    doctor: "Dr. Rachel Green",
    ticketNumber: "E-019",
    counter: "Fast Desk 1",
    destination: "Suite B",
    floor: "Ground Floor • Express Clinic",
    calledAt: "10:35 AM",
    station: "Fast Desk #1",
    initialSeconds: 240,
    barcodePasscode: "7139-E019",
    directions: [
      "Enter through the main front glass foyer.",
      "Follow the bright yellow corridor signs directly toward Suite B.",
      "Fast Desk 1 is the triage intake station on the right.",
    ],
  },
};

export default function YourTurnScreen() {
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

  const facility: YourTurnFacilityData =
    YOUR_TURN_FACILITIES[resolvedKey] || YOUR_TURN_FACILITIES["city-care-clinic"];

  // Interactive States
  const [isMuted, setIsMuted] = useState(false);
  const [hasArrivedAtCounter, setHasArrivedAtCounter] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(facility.initialSeconds);

  // Animations (built with standard React Native Animated for 60fps performance & no render warnings)
  const pingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const beaconPingAnim = useRef(new Animated.Value(0)).current;
  const readyDotAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Visual attention animations
  useEffect(() => {
    // 1. Concentric ping wave
    const pingLoop = Animated.loop(
      Animated.timing(pingAnim, {
        toValue: 1,
        duration: 1700,
        useNativeDriver: true,
      })
    );

    // 2. Gentle pulsing aura
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Dynamic island beacon ping
    const beaconPingLoop = Animated.loop(
      Animated.timing(beaconPingAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    );

    // 4. Ready service dot breathing
    const readyDotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(readyDotAnim, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(readyDotAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    // 5. Megaphone bounce
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ])
    );

    pingLoop.start();
    pulseLoop.start();
    beaconPingLoop.start();
    readyDotLoop.start();
    bounceLoop.start();

    return () => {
      pingLoop.stop();
      pulseLoop.stop();
      beaconPingLoop.stop();
      readyDotLoop.stop();
      bounceLoop.stop();
    };
  }, [pingAnim, pulseAnim, beaconPingAnim, readyDotAnim, bounceAnim]);

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
      router.replace(`/near-turn/${facility.id}` as any);
    }
  };

  const handleToggleSound = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    setIsMuted(!isMuted);
    Alert.alert(
      isMuted ? "Sound Unmuted" : "Sound Muted",
      isMuted
        ? "Turn chime notifications are now audible."
        : "Turn chime notifications are muted."
    );
  };

  const handleArrivedAtCounter = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Ignore
    }
    setHasArrivedAtCounter(true);
    Alert.alert(
      "Checked in at Counter!",
      `Welcome! You are now checked in with ${facility.doctor} at ${facility.counter}. When your consultation concludes, you can view your visit summary.`,
      [
        {
          text: "Complete Service Now",
          onPress: handleProceedToCompleted,
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]
    );
  };

  const handleProceedToCompleted = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } catch {
      // Ignore
    }
    // Navigate to Screen 13: Queue Completed & Feedback
    router.push(`/queue-completed/${facility.id}` as any);
  };

  // Interpolated animation values
  const pingScale = pingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.1],
  });
  const pingOpacity = pingAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.65, 0.25, 0],
  });

  const islandBeaconScale = beaconPingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });
  const islandBeaconOpacity = beaconPingAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.8, 0.2, 0],
  });

  // Calculate formatted countdown mm:ss
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedCountdown = `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  } remaining`;
  const countdownPercentage =
    facility.initialSeconds > 0
      ? Math.max(0, Math.min(100, (remainingSeconds / facility.initialSeconds) * 100))
      : 0;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* 1. Header Navigation Shell matching Stitch Screen 12 */}
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
              QueueUp • Your Turn
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
                "Calling Desk Details",
                `Ticket #${facility.ticketNumber} is active at ${facility.counter} with ${facility.doctor}.`
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
        {/* 2. Dynamic Island / Live Heads-Up Priority Call Banner */}
        <View className="mb-4">
          <View className="w-full bg-[#283044] rounded-full py-2.5 px-3.5 shadow-xl flex-row items-center justify-between gap-2.5">
            <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
              <View className="relative w-8 h-8 rounded-full bg-white p-1 items-center justify-center">
                <Image
                  source={require("@/assets/images/queueup-logo.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
                <Animated.View
                  style={{
                    position: "absolute",
                    top: -1,
                    right: -1,
                    width: 9,
                    height: 9,
                    borderRadius: 4.5,
                    backgroundColor: "#6FFBBE",
                    transform: [{ scale: islandBeaconScale }],
                    opacity: islandBeaconOpacity,
                  }}
                />
                <View className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#6FFBBE]" />
              </View>

              <View className="flex-col min-w-0 flex-1">
                <View className="flex-row items-center gap-1.5 leading-none">
                  <Text className="text-[10px] font-bold text-[#6FFBBE] tracking-wider uppercase">
                    QueueUp • Priority Call
                  </Text>
                  <View className="w-1.5 h-1.5 rounded-full bg-[#6FFBBE]" />
                </View>
                <Text numberOfLines={1} className="text-xs font-semibold text-[#EEF0FF] mt-0.5">
                  🎉 It&apos;s your turn! Proceed to {facility.counter}
                </Text>
              </View>
            </View>

            {/* Sound chime toggle button */}
            <TouchableOpacity
              accessibilityLabel={isMuted ? "Unmute chime sound" : "Mute chime sound"}
              onPress={handleToggleSound}
              className="w-8 h-8 rounded-full bg-[#DAE2FD]/20 items-center justify-center active:bg-[#DAE2FD]/30"
            >
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-high"}
                size={16}
                color="#EEF0FF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Hero Celebration & Calling Beacon */}
        <View className="flex-col items-center text-center my-1 relative">
          {/* Animated Pulsing Aura Behind Icon */}
          <View className="relative items-center justify-center mb-2.5">
            {/* Outer expanding ping ring */}
            <Animated.View
              style={{
                position: "absolute",
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: "#007D55",
                transform: [{ scale: pingScale }],
                opacity: pingOpacity,
              }}
            />
            {/* Mid pulsing aura */}
            <Animated.View
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#006242",
                opacity: 0.18,
                transform: [{ scale: pulseAnim }],
              }}
            />

            {/* Core Circular Calling Megaphone Badge */}
            <Animated.View
              style={{
                transform: [{ translateY: bounceAnim }],
              }}
              className="w-16 h-16 rounded-full bg-[#006242] items-center justify-center shadow-lg shadow-[#006242]/30 z-10"
            >
              <MaterialIcons name="campaign" size={32} color="#FFFFFF" />
            </Animated.View>
          </View>

          {/* Ready For Service Pill */}
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-[#BDFFDB] mb-1.5 shadow-xs">
            <Animated.View
              style={{ opacity: readyDotAnim }}
              className="w-2 h-2 rounded-full bg-[#006242]"
            />
            <Text className="text-[11px] font-bold uppercase tracking-wider text-[#007D55]">
              Ready for Service
            </Text>
          </View>

          {/* Headline */}
          <Text className="text-[26px] font-bold text-[#131B2E] tracking-tight">
            It&apos;s your turn!
          </Text>
          <Text className="text-sm text-[#434655] mt-1 text-center max-w-xs">
            Please proceed immediately to{" "}
            <Text className="text-[#004AC6] font-bold text-base">{facility.counter}</Text>
          </Text>

          {/* Calling Desk Provider Info Pill */}
          <View className="mt-2.5 flex-row items-center gap-2 bg-[#E2E7FF] px-4 py-1.5 rounded-full">
            <MaterialIcons name="medical-services" size={17} color="#004AC6" />
            <Text className="text-xs font-semibold text-[#131B2E]">
              {facility.doctor} • {facility.department}
            </Text>
          </View>
        </View>

        {/* 4. Prominent Digital Pass Card (Physical Metaphor with Cutouts) */}
        <View className="w-full mt-4 bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E2E8F0]">
          {/* Upper Pass Section */}
          <View className="p-5 flex-col">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
                  Your Ticket Number
                </Text>
                <Text className="text-[48px] font-extrabold text-[#004AC6] leading-none mt-1 tracking-tight">
                  {facility.ticketNumber}
                </Text>
              </View>

              <View className="items-end">
                <View className="px-4 py-1.5 rounded-full bg-[#004AC6] shadow-md shadow-[#004AC6]/30">
                  <Text className="text-sm font-bold text-white uppercase tracking-wider">
                    {facility.counter}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5 mt-1.5">
                  <View className="w-2 h-2 rounded-full bg-[#006242]" />
                  <Text className="text-xs font-semibold text-[#006242]">Calling Now</Text>
                </View>
              </View>
            </View>

            {/* Desk / Floor Metadata Box */}
            <View className="flex-row justify-between mt-4 p-3.5 bg-[#F2F3FF] rounded-xl border border-[#DAE2FD]/50">
              <View className="flex-col">
                <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
                  Destination
                </Text>
                <Text className="text-[15px] font-bold text-[#131B2E] mt-0.5">
                  {facility.destination}
                </Text>
                <Text className="text-xs text-[#434655] mt-0.5">{facility.floor}</Text>
              </View>

              <View className="flex-col items-end text-right">
                <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
                  Called At
                </Text>
                <Text className="text-[15px] font-bold text-[#131B2E] mt-0.5">
                  {facility.calledAt}
                </Text>
                <Text className="text-xs text-[#434655] mt-0.5">{facility.station}</Text>
              </View>
            </View>

            {/* Live Hold Countdown Progress */}
            <View className="mt-3.5 bg-[#EAEDFF] p-3 rounded-xl flex-col gap-1.5">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="timer" size={15} color="#007D55" />
                  <Text className="text-xs font-semibold text-[#131B2E]">Holding Counter Spot</Text>
                </View>
                <Text
                  className={`text-xs font-bold ${
                    remainingSeconds < 60 ? "text-red-600" : "text-[#BA1A1A]"
                  }`}
                >
                  {remainingSeconds === 0 ? "Expired - Check with Desk" : formattedCountdown}
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="w-full h-2 bg-[#DAE2FD] rounded-full overflow-hidden">
                <View
                  style={{ width: `${countdownPercentage}%` }}
                  className="h-full bg-[#006242] rounded-full"
                />
              </View>
            </View>
          </View>

          {/* Ticket Notch Divider Metaphor */}
          <View className="relative w-full h-6 bg-[#F2F3FF] flex-row items-center justify-between overflow-hidden">
            <View className="w-6 h-6 -ml-3 rounded-full bg-[#FAF8FF] border-r border-[#E2E8F0]" />
            <View className="flex-1 h-[2px] bg-[#C3C6D7]/40 mx-2" />
            <View className="w-6 h-6 -mr-3 rounded-full bg-[#FAF8FF] border-l border-[#E2E8F0]" />
          </View>

          {/* Lower Pass Section: Barcode & Scannable Telemetry */}
          <View className="p-5 bg-[#F2F3FF] flex-col items-center justify-center text-center">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-[#737686] mb-2">
              Scan at counter terminal
            </Text>

            {/* Barcode Graphic Pattern Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowPassModal(true)}
              className="w-full max-w-[260px] bg-white p-3 rounded-xl shadow-xs items-center border border-[#DAE2FD]"
            >
              <View className="w-full h-12 flex-row items-center justify-between px-1">
                {[
                  3, 2, 4, 1, 5, 2, 3, 6, 2, 4, 2, 5, 1, 4, 3, 2, 6, 3, 2, 4, 1, 5, 3, 2, 4, 2, 6,
                  2, 3, 5, 2, 4, 2,
                ].map((width, idx) => (
                  <View
                    key={idx}
                    style={{ width, height: 44, backgroundColor: "#131B2E", borderRadius: 1 }}
                  />
                ))}
              </View>
              <Text className="text-xs font-bold tracking-wider text-[#131B2E] mt-1.5 font-mono">
                PASSCODE: {facility.barcodePasscode}
              </Text>
            </TouchableOpacity>

            <Text className="text-xs text-[#434655] text-center mt-2 px-2">
              Hold screen under reader if counter agent is preparing paperwork.
            </Text>
          </View>
        </View>

        {/* 5. Action Stack matching Stitch Screen 12 */}
        <View className="flex-col gap-3 mt-5 mb-3">
          {/* Primary Wayfinding CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowDirectionsModal(true)}
            className="w-full h-14 bg-[#004AC6] rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:bg-[#3755C3]"
          >
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
            <Text className="text-sm font-bold text-white">
              Get Directions to {facility.counter}
            </Text>
          </TouchableOpacity>

          {/* Secondary Full Pass Details */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/ticket/${facility.ticketNumber}` as any)}
            className="w-full h-12 bg-[#E2E7FF] rounded-xl flex-row items-center justify-center gap-2 active:bg-[#DAE2FD]"
          >
            <Ionicons name="qr-code-outline" size={19} color="#131B2E" />
            <Text className="text-sm font-semibold text-[#131B2E]">View Full Digital Ticket</Text>
          </TouchableOpacity>

          {/* Tertiary Immediate Acknowledgment */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleArrivedAtCounter}
            className={`w-full h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-md ${
              hasArrivedAtCounter ? "bg-[#006242]" : "bg-[#007D55]"
            } active:opacity-90`}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text className="text-sm font-bold text-white">
              {hasArrivedAtCounter
                ? `Checked in with ${facility.doctor}!`
                : "I'm at the Counter"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 6. Lifecycle Transition to Screen 13 (Queue Completed & Feedback) */}
        <View className="mt-2 bg-[#BDFFDB]/40 rounded-xl p-3.5 border border-[#BDFFDB] flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5 flex-1 mr-2">
            <Ionicons name="checkmark-done-circle" size={22} color="#007D55" />
            <View className="flex-col flex-1">
              <Text className="text-xs font-bold text-[#131B2E]">Consultation Finished?</Text>
              <Text className="text-[11px] text-[#434655]">
                Conclude visit & rate your experience
              </Text>
            </View>
          </View>
          <TouchableOpacity
            accessibilityLabel="Complete Service"
            onPress={handleProceedToCompleted}
            className="px-3 py-1.5 rounded-lg bg-[#006242] flex-row items-center gap-1 active:bg-[#007D55]"
          >
            <Text className="text-xs font-bold text-white">Complete →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 7. Directions Modal (Micro-Interaction) */}
      <Modal
        visible={showDirectionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDirectionsModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl max-h-[80%]">
            <View className="w-12 h-1.5 rounded-full bg-[#C3C6D7] mx-auto mb-4" />

            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="navigate-circle" size={24} color="#004AC6" />
                <Text className="text-lg font-bold text-[#131B2E]">
                  Directions to {facility.counter}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowDirectionsModal(false)}>
                <Ionicons name="close" size={22} color="#131B2E" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-[#737686] uppercase font-bold tracking-wider mb-3">
              {facility.destination} • {facility.floor}
            </Text>

            <View className="flex-col gap-3 mb-5">
              {facility.directions.map((step, idx) => (
                <View key={idx} className="flex-row items-start gap-3 bg-[#F2F3FF] p-3 rounded-xl">
                  <View className="w-6 h-6 rounded-full bg-[#004AC6] items-center justify-center mt-0.5">
                    <Text className="text-xs font-bold text-white">{idx + 1}</Text>
                  </View>
                  <Text className="text-xs text-[#131B2E] flex-1 leading-relaxed">{step}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Close Directions"
              variant="primary"
              size="md"
              onPress={() => setShowDirectionsModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* 8. Full Scannable Barcode Passcode Modal */}
      <Modal
        visible={showPassModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPassModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/60 p-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl items-center">
            <View className="w-full flex-row items-center justify-between mb-2">
              <Text className="text-xs font-bold uppercase tracking-wider text-[#737686]">
                Counter Check-in Pass
              </Text>
              <TouchableOpacity onPress={() => setShowPassModal(false)}>
                <Ionicons name="close" size={22} color="#131B2E" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-semibold text-[#434655] mb-1">{facility.name}</Text>
            <Text className="text-4xl font-extrabold text-[#004AC6] tracking-tight mb-2">
              {facility.ticketNumber}
            </Text>
            <View className="px-3 py-1 rounded-full bg-[#E2E7FF] mb-3">
              <Text className="text-xs font-bold text-[#004AC6]">{facility.counter}</Text>
            </View>

            {/* Large Barcode Visual */}
            <View className="w-full bg-[#FAF8FF] p-4 rounded-xl items-center border border-[#DAE2FD] mb-3">
              <View className="w-full h-14 flex-row items-center justify-between px-2">
                {[
                  3, 2, 4, 1, 5, 2, 3, 6, 2, 4, 2, 5, 1, 4, 3, 2, 6, 3, 2, 4, 1, 5, 3, 2, 4, 2, 6,
                  2, 3, 5, 2, 4, 2,
                ].map((width, idx) => (
                  <View
                    key={idx}
                    style={{ width, height: 52, backgroundColor: "#131B2E", borderRadius: 1 }}
                  />
                ))}
              </View>
              <Text className="text-xs font-bold tracking-widest text-[#131B2E] mt-2 font-mono">
                PASSCODE: {facility.barcodePasscode}
              </Text>
            </View>

            <Text className="text-xs text-center text-[#737686] mb-4">
              Present this pass under the desk scanner or show it directly to {facility.doctor}.
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
    </SafeAreaView>
  );
}
