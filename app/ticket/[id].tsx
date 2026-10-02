import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface TicketDetails {
  facilityId: string;
  ticketNumber: string;
  facilityName: string;
  category: string;
  department: string;
  doctor: string;
  counter: string;
  consultRoom: string;
  passcode: string;
  inLine: number;
  estWaitMinutes: number;
  joinedAt: string;
  estTurnTime: string;
  distance: string;
  phone: string;
  address: string;
}

const TICKETS_DATABASE: Record<string, TicketDetails> = {
  // City Care Clinic
  "a-047": {
    facilityId: "city-care-clinic",
    ticketNumber: "A-047",
    facilityName: "City Care Clinic",
    category: "Medical & Triage",
    department: "General OPD",
    doctor: "Dr. Martinez",
    counter: "Counter 2",
    consultRoom: "OPD #4",
    passcode: "9284-A047",
    inLine: 18,
    estWaitMinutes: 25,
    joinedAt: "10:42 AM",
    estTurnTime: "11:15 AM",
    distance: "1.2 km",
    phone: "(555) 019-2834",
    address: "742 Evergreen Terrace, Suite 300",
  },
  "city-care-clinic": {
    facilityId: "city-care-clinic",
    ticketNumber: "A-047",
    facilityName: "City Care Clinic",
    category: "Medical & Triage",
    department: "General OPD",
    doctor: "Dr. Martinez",
    counter: "Counter 2",
    consultRoom: "OPD #4",
    passcode: "9284-A047",
    inLine: 18,
    estWaitMinutes: 25,
    joinedAt: "10:42 AM",
    estTurnTime: "11:15 AM",
    distance: "1.2 km",
    phone: "(555) 019-2834",
    address: "742 Evergreen Terrace, Suite 300",
  },

  // St. Jude Hospital
  "b-108": {
    facilityId: "st-jude-hospital",
    ticketNumber: "B-108",
    facilityName: "St. Jude Hospital - OPD",
    category: "Hospital Intake",
    department: "Cardiology OPD",
    doctor: "Dr. David Vance",
    counter: "Counter 1",
    consultRoom: "Cardio #2",
    passcode: "5821-B108",
    inLine: 41,
    estWaitMinutes: 50,
    joinedAt: "11:50 AM",
    estTurnTime: "12:40 PM",
    distance: "2.8 km",
    phone: "(555) 044-8921",
    address: "1200 Mercy Boulevard, Floor 1",
  },
  "st-jude-hospital": {
    facilityId: "st-jude-hospital",
    ticketNumber: "B-108",
    facilityName: "St. Jude Hospital - OPD",
    category: "Hospital Intake",
    department: "Cardiology OPD",
    doctor: "Dr. David Vance",
    counter: "Counter 1",
    consultRoom: "Cardio #2",
    passcode: "5821-B108",
    inLine: 41,
    estWaitMinutes: 50,
    joinedAt: "11:50 AM",
    estTurnTime: "12:40 PM",
    distance: "2.8 km",
    phone: "(555) 044-8921",
    address: "1200 Mercy Boulevard, Floor 1",
  },

  // Express Medical & Pediatric
  "e-019": {
    facilityId: "express-medical",
    ticketNumber: "E-019",
    facilityName: "Express Medical & Pediatric",
    category: "Urgent & Pediatric",
    department: "Pediatric Triage",
    doctor: "Dr. Rachel Green",
    counter: "Fast Desk 1",
    consultRoom: "Pediatric #1",
    passcode: "3194-E019",
    inLine: 7,
    estWaitMinutes: 12,
    joinedAt: "10:23 AM",
    estTurnTime: "10:35 AM",
    distance: "3.5 km",
    phone: "(555) 077-4412",
    address: "450 Health Parkway, Suite B",
  },
  "express-medical": {
    facilityId: "express-medical",
    ticketNumber: "E-019",
    facilityName: "Express Medical & Pediatric",
    category: "Urgent & Pediatric",
    department: "Pediatric Triage",
    doctor: "Dr. Rachel Green",
    counter: "Fast Desk 1",
    consultRoom: "Pediatric #1",
    passcode: "3194-E019",
    inLine: 7,
    estWaitMinutes: 12,
    joinedAt: "10:23 AM",
    estTurnTime: "10:35 AM",
    distance: "3.5 km",
    phone: "(555) 077-4412",
    address: "450 Health Parkway, Suite B",
  },
};

export default function DigitalTicketScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();

  const lookupKey = typeof id === "string" ? id.toLowerCase().trim() : "a-047";
  const ticket: TicketDetails =
    TICKETS_DATABASE[lookupKey] || {
      facilityId: "city-care-clinic",
      ticketNumber: typeof id === "string" && id.length > 0 ? id.toUpperCase() : "A-047",
      facilityName: "City Care Clinic",
      category: "Medical & Triage",
      department: "General OPD",
      doctor: "Dr. Martinez",
      counter: "Counter 2",
      consultRoom: "OPD #4",
      passcode: "9284-A047",
      inLine: 18,
      estWaitMinutes: 25,
      joinedAt: "10:42 AM",
      estTurnTime: "11:15 AM",
      distance: "1.2 km",
      phone: "(555) 019-2834",
      address: "742 Evergreen Terrace, Suite 300",
    };

  // State
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Pulse animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const radarAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
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

  useEffect(() => {
    const radarLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(radarAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(radarAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    radarLoop.start();
    return () => radarLoop.stop();
  }, [radarAnim]);

  const handleFavoritePress = () => {
    try {
      Haptics.selectionAsync().catch(() => { });
    } catch {
      // Fallback
    }
    setIsFavorite(!isFavorite);
  };

  const handleSharePress = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
      await Share.share({
        title: `QueueUp Digital Ticket #${ticket.ticketNumber}`,
        message: `My active queue pass for ${ticket.facilityName}: Ticket #${ticket.ticketNumber}, ${ticket.inLine} people ahead. Tracked live on QueueUp.`
      });
    } catch {
      // Fallback
    }
  };

  const handleWalletPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    } catch {
      // Fallback
    }
    Alert.alert(
      "Apple Wallet Pass",
      `Ticket #${ticket.ticketNumber} for ${ticket.facilityName} has been saved to your digital wallet.`
    );
  };

  const handleSaveOfflinePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    } catch {
      // Fallback
    }
    Alert.alert(
      "Offline Pass Saved",
      `Ticket #${ticket.ticketNumber} and QR barcode have been cached locally. You can present this at ${ticket.counter} even without internet.`
    );
  };

  const handleNavigatePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    } catch {
      // Fallback
    }
    Alert.alert(
      "Directions",
      `Navigating to ${ticket.facilityName} (${ticket.address}) — ${ticket.distance} away.`
    );
  };

  const handleCallPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    } catch {
      // Fallback
    }
    Alert.alert(
      "Call Clinic",
      `Dialing ${ticket.facilityName} reception at ${ticket.phone}...`
    );
  };

  const handleTrackRadar = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
    } catch {
      // Fallback
    }
    // Navigate to Screen 10: Live Queue Tracking
    router.push(`/live-queue/${ticket.facilityId}` as any);
  };

  const handleConfirmCancelQueue = () => {
    setShowCancelModal(false);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => { });
    } catch {
      // Fallback
    }
    Alert.alert(
      "Pass Cancelled",
      `Your spot #${ticket.ticketNumber} at ${ticket.facilityName} has been released.`,
      [
        {
          text: "OK",
          onPress: () => router.replace("/(customer)/home"),
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Top Application Header matching Stitch Shell */}
      <View className="h-14 px-4 bg-white/85 border-b border-[#E2E8F0] flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 min-w-0 flex-1 mr-2">
          <TouchableOpacity
            accessibilityLabel="Go back"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(customer)/home");
              }
            }}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="arrow-back" size={20} color="#131B2E" />
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/queueup-logo.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />

          <Text
            numberOfLines={1}
            className="text-[17px] font-bold text-[#131B2E] tracking-tight ml-1 flex-1"
          >
            Digital Ticket
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 shrink-0">
          <TouchableOpacity
            accessibilityLabel="Favorite queue"
            onPress={handleFavoritePress}
            className="w-9 h-9 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#EF4444" : "#434655"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Share queue"
            onPress={handleSharePress}
            className="w-9 h-9 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="share-outline" size={20} color="#434655" />
          </TouchableOpacity>

          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center ml-0.5 shadow-2xs">
            <Ionicons name="person" size={15} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Main Scrollable Ticket Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 28) + 12,
          paddingTop: 12,
        }}
        className="flex-1"
      >
        <View className="px-4 gap-3.5">
          {/* Live Pulse Alert Strip */}
          <View className="w-full bg-[#E2E7FF] rounded-full px-4 py-2 flex-row items-center justify-between shadow-2xs">
            <View className="flex-row items-center gap-2">
              <View className="relative w-2.5 h-2.5 items-center justify-center">
                <Animated.View
                  style={{ transform: [{ scale: pulseAnim }], opacity: 0.75 }}
                  className="absolute w-full h-full rounded-full bg-[#4EDEA3]"
                />
                <View className="w-2.5 h-2.5 rounded-full bg-[#006242]" />
              </View>
              <Text className="text-[10px] font-bold text-[#006242] tracking-wider uppercase">
                Live Synchronized
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="sync" size={13} color="#006242" />
              <Text className="text-[12px] text-[#434655] font-medium">
                Updated just now
              </Text>
            </View>
          </View>

          {/* The Digital Queue Ticket Container */}
          <Card
            variant="elevated"
            className="p-0 rounded-3xl bg-white shadow-xl overflow-hidden border border-[#E2E7FF]/80 flex-col"
          >
            {/* Top Clinic Header & Department */}
            <View className="p-4 pb-3 bg-[#DBE1FF]/20 flex-row items-start justify-between border-b border-[#E2E7FF]/40">
              <View className="flex-row items-center gap-3 min-w-0 flex-1 mr-2">
                <View className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 items-center justify-center p-2 shadow-2xs shrink-0">
                  <Image
                    source={require("@/assets/images/queueup-logo.png")}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center gap-1">
                    <Text
                      numberOfLines={1}
                      className="text-[16px] font-bold text-[#131B2E]"
                    >
                      {ticket.facilityName}
                    </Text>
                    <Ionicons name="checkmark-circle" size={16} color="#004AC6" />
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-[12px] text-[#434655] mt-0.5"
                  >
                    {ticket.department} • {ticket.doctor}
                  </Text>
                </View>
              </View>

              <View className="bg-[#EAEDFF] rounded-full px-3 py-1 flex-row items-center gap-1 shadow-2xs shrink-0">
                <Ionicons name="location" size={13} color="#004AC6" />
                <Text className="text-[10px] font-bold text-[#004AC6] uppercase">
                  {ticket.counter}
                </Text>
              </View>
            </View>

            {/* Center Hero Ticket Telemetry */}
            <View className="px-4 py-4 items-center justify-center text-center">
              <Text className="text-[11px] font-semibold text-[#434655] uppercase tracking-widest mb-1">
                Active Queue Number
              </Text>

              {/* Glowing Ticket Number */}
              <View className="relative items-center justify-center my-2 p-2">
                <View className="absolute -inset-2 bg-blue-100/60 rounded-full" />
                <Text className="relative text-[48px] font-black text-[#004AC6] tracking-tight leading-none">
                  {ticket.ticketNumber}
                </Text>
              </View>

              {/* Real-Time Status Pill */}
              <View className="flex-row items-center gap-1.5 bg-[#007D55]/15 px-3 py-1 rounded-full mt-2">
                <View className="relative w-2 h-2 items-center justify-center">
                  <Animated.View
                    style={{ transform: [{ scale: pulseAnim }], opacity: 0.75 }}
                    className="absolute w-full h-full rounded-full bg-[#006242]"
                  />
                  <View className="w-2 h-2 rounded-full bg-[#006242]" />
                </View>
                <Text className="text-[10px] font-bold text-[#006242] uppercase tracking-wider">
                  Active • On Schedule
                </Text>
              </View>
            </View>

            {/* Key Metrics Grid */}
            <View className="px-4 py-2">
              <View className="flex-row gap-3 bg-[#F2F3FF] p-3.5 rounded-2xl">
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase">
                    People Ahead
                  </Text>
                  <View className="flex-row items-baseline gap-1 mt-0.5">
                    <Text className="text-[20px] font-bold text-[#131B2E]">
                      {ticket.inLine}
                    </Text>
                    <Text className="text-[12px] text-[#434655]">
                      patients
                    </Text>
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase">
                    Estimated Wait
                  </Text>
                  <View className="flex-row items-baseline gap-1 mt-0.5">
                    <Text className="text-[20px] font-bold text-[#004AC6]">
                      ~{ticket.estWaitMinutes}
                    </Text>
                    <Text className="text-[12px] text-[#434655]">
                      minutes
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Ticket Perforation / Notch Separation */}
            <View className="relative flex-row items-center justify-between w-full my-1">
              <View className="w-5 h-8 bg-[#CBD5E1] rounded-r-full -ml-5" />
              <View className="flex-1 border-b-2 border-dashed border-[#CBD5E1] mx-2" />
              <View className="w-5 h-8 bg-[#CBD5E1] rounded-l-full -mr-5" />
            </View>

            {/* Timeline Schedule Sub-Metrics */}
            <View className="px-4 py-3 flex-row items-center justify-between text-center bg-white">
              <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase mb-0.5">
                  Joined
                </Text>
                <Text className="text-[14px] font-semibold text-[#131B2E]">
                  {ticket.joinedAt}
                </Text>
              </View>

              <View className="w-[1px] h-7 bg-[#E2E7FF]" />

              <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase mb-0.5">
                  Estimated Turn
                </Text>
                <Text className="text-[14px] font-semibold text-[#131B2E]">
                  {ticket.estTurnTime}
                </Text>
              </View>

              {/* <View className="w-[1px] h-7 bg-[#E2E7FF]" /> */}

              {/* <View className="flex-1 items-center">
                <Text className="text-[10px] font-bold text-[#434655] uppercase mb-0.5">
                  Consult Room
                </Text>
                <Text className="text-[14px] font-bold text-[#004AC6]">
                  {ticket.consultRoom}
                </Text>
              </View> */}
            </View>
            
          </Card>

          {/* Dynamic Progress Step Meter Card */}
          <Card
            variant="elevated"
            className="p-4 rounded-2xl bg-white shadow-sm border border-[#E2E7FF] gap-3"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-[15px] font-bold text-[#131B2E]">
                Queue Progression
              </Text>
              <View className="bg-[#EAEDFF] px-2.5 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-primary uppercase">
                  Step 2 of 4
                </Text>
              </View>
            </View>

            {/* Stepper Pipeline */}
            <View className="relative pt-2 pb-1">
              {/* Pipeline Track */}
              <View className="absolute top-5 left-4 right-4 h-1 bg-[#E2E7FF] rounded-full -translate-y-1/2">
                <View className="h-full bg-primary rounded-full w-[42%]" />
              </View>

              <View className="relative flex-row justify-between items-center text-center">
                {/* Step 1: Joined */}
                <View className="items-center w-16">
                  <View className="w-7 h-7 rounded-full bg-primary items-center justify-center shadow-xs z-10">
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                  <Text className="text-[12px] font-semibold text-[#131B2E] mt-1.5">
                    Joined
                  </Text>
                  <Text className="text-[10px] text-[#434655] mt-0.5">
                    {ticket.joinedAt}
                  </Text>
                </View>

                {/* Step 2: In Line (Active) */}
                <View className="items-center w-16">
                  <Animated.View
                    style={{ transform: [{ scale: radarAnim }] }}
                    className="w-7 h-7 rounded-full bg-[#2563EB] items-center justify-center shadow-md z-10 ring-4 ring-primary/20"
                  >
                    <Ionicons name="people" size={13} color="#FFFFFF" />
                  </Animated.View>
                  <Text className="text-[12px] font-bold text-primary mt-1.5">
                    In Line
                  </Text>
                  <Text className="text-[10px] font-semibold text-primary mt-0.5">
                    {ticket.inLine} Ahead
                  </Text>
                </View>

                {/* Step 3: Near Turn */}
                <View className="items-center w-16">
                  <View className="w-7 h-7 rounded-full bg-[#EAEDFF] items-center justify-center z-10">
                    <Ionicons name="notifications-outline" size={13} color="#434655" />
                  </View>
                  <Text className="text-[12px] font-medium text-[#434655] mt-1.5">
                    Near Turn
                  </Text>
                  <Text className="text-[10px] text-[#434655] mt-0.5">
                    ~5 Ahead
                  </Text>
                </View>

                {/* Step 4: Called */}
                <View className="items-center w-16">
                  <View className="w-7 h-7 rounded-full bg-[#EAEDFF] items-center justify-center z-10">
                    <Ionicons name="megaphone-outline" size={13} color="#434655" />
                  </View>
                  <Text className="text-[12px] font-medium text-[#434655] mt-1.5">
                    Called
                  </Text>
                  <Text className="text-[10px] text-[#434655] mt-0.5">
                    {ticket.counter}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Wallet & Offline Preservation Integrations */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleWalletPress}
              className="flex-1 bg-white p-3 rounded-2xl shadow-2xs border border-[#E2E7FF] flex-row items-center justify-center gap-2 active:bg-[#F2F3FF]"
            >
              <Ionicons name="wallet-outline" size={18} color="#131B2E" />
              <Text className="text-[13px] font-bold text-[#131B2E]">
                Add to Wallet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveOfflinePress}
              className="flex-1 bg-white p-3 rounded-2xl shadow-2xs border border-[#E2E7FF] flex-row items-center justify-center gap-2 active:bg-[#F2F3FF]"
            >
              <Ionicons name="download-outline" size={18} color="#004AC6" />
              <Text className="text-[13px] font-bold text-[#131B2E]">
                Save Offline Pass
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions Grid */}
          <View className="gap-2.5 pt-1">
            {/* Primary Live Tracker Action */}
            <Button
              title="Track Live Queue Radar"
              variant="primary"
              size="lg"
              leftIcon={<Ionicons name="radio" size={18} color="#FFFFFF" />}
              onPress={handleTrackRadar}
              className="w-full rounded-xl bg-primary shadow-md"
            />

            {/* Secondary Location and Clinic Contact */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleNavigatePress}
                className="flex-1 h-12 bg-white rounded-xl shadow-2xs border border-[#E2E7FF] flex-row items-center justify-center gap-2 active:bg-[#F2F3FF] px-2"
              >
                <Ionicons name="navigate-outline" size={18} color="#004AC6" />
                <Text
                  numberOfLines={1}
                  className="text-[13px] font-semibold text-[#131B2E]"
                >
                  Navigate ({ticket.distance})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCallPress}
                className="flex-1 h-12 bg-white rounded-xl shadow-2xs border border-[#E2E7FF] flex-row items-center justify-center gap-2 active:bg-[#F2F3FF] px-2"
              >
                <Ionicons name="call-outline" size={18} color="#006242" />
                <Text className="text-[13px] font-semibold text-[#131B2E]">
                  Call Clinic
                </Text>
              </TouchableOpacity>
            </View>

            {/* Safety / Leave Queue Action with Interactive Trigger */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowCancelModal(true)}
              className="w-full py-3 bg-red-50 text-red-600 rounded-xl border border-red-200/60 flex-row items-center justify-center gap-2 active:bg-red-100 mt-1"
            >
              <Ionicons name="log-out-outline" size={18} color="#BA1A1A" />
              <Text className="text-[13px] font-bold text-[#BA1A1A]">
                Leave Queue / Cancel Pass
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Leave Queue Safety Confirmation Modal */}
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
              You are currently <Text className="font-bold text-[#131B2E]">#{ticket.inLine}</Text> in line. If you leave, your spot <Text className="font-bold text-primary">{ticket.ticketNumber}</Text> will be released immediately.
            </Text>

            <View className="w-full gap-2.5">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirmCancelQueue}
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
