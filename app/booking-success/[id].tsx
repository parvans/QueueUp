import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Alert,
  Share,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface BookingSuccessData {
  id: string;
  name: string;
  category: string;
  categoryUpper: string;
  ticketNumber: string;
  serviceName: string;
  address: string;
  subAddress: string;
  inLine: number;
  estWait: string;
  estService: string;
  joinedAt: string;
  headOutTime: string;
  desk: string;
  distance: string;
}

const BOOKINGS_DATA: Record<string, BookingSuccessData> = {
  "city-care-clinic": {
    id: "city-care-clinic",
    name: "City Care Clinic",
    category: "Medical & Triage",
    categoryUpper: "MEDICAL & TRIAGE",
    ticketNumber: "A-047",
    serviceName: "Priority Adult General Practice",
    address: "742 Evergreen Terrace, Suite 300",
    subAddress: "North Wing, Level 2 • Counter 2",
    inLine: 18,
    estWait: "25",
    estService: "11:15 AM",
    joinedAt: "10:42 AM",
    headOutTime: "11:00 AM",
    desk: "Counter 2",
    distance: "1.2 km away",
  },
  "st-jude-hospital": {
    id: "st-jude-hospital",
    name: "St. Jude Hospital - OPD",
    category: "Hospital Intake",
    categoryUpper: "HOSPITAL INTAKE",
    ticketNumber: "B-108",
    serviceName: "Cardiology OPD Consultation",
    address: "1200 Mercy Boulevard, Floor 1",
    subAddress: "East Wing, Ground Floor • Desk 1",
    inLine: 41,
    estWait: "50",
    estService: "12:40 PM",
    joinedAt: "11:50 AM",
    headOutTime: "12:25 PM",
    desk: "Counter 1",
    distance: "2.8 km away",
  },
  "express-medical": {
    id: "express-medical",
    name: "Express Medical & Pediatric",
    category: "Urgent & Pediatric",
    categoryUpper: "URGENT & PEDIATRIC",
    ticketNumber: "E-019",
    serviceName: "Pediatric Triage & Urgent",
    address: "450 Health Parkway, Suite B",
    subAddress: "Suite B, Pediatric Wing • Fast Desk 1",
    inLine: 7,
    estWait: "12",
    estService: "10:35 AM",
    joinedAt: "10:23 AM",
    headOutTime: "10:20 AM",
    desk: "Fast Desk 1",
    distance: "3.5 km away",
  },
};

const CONFETTI_COLORS = ["#2563EB", "#10B981", "#38BDF8", "#4EDEA3", "#DBE1FF", "#F59E0B"];

export default function BookingSuccessScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();

  const facilityId = typeof id === "string" ? id : "city-care-clinic";
  const facility: BookingSuccessData =
    BOOKINGS_DATA[facilityId] || {
      id: facilityId,
      name: facilityId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      category: "Medical Clinic",
      categoryUpper: "MEDICAL CLINIC",
      ticketNumber: "A-047",
      serviceName: "General Practice Intake",
      address: "742 Evergreen Terrace, Suite 300",
      subAddress: "Reception Desk • Counter 2",
      inLine: 18,
      estWait: "25",
      estService: "11:15 AM",
      joinedAt: "10:42 AM",
      headOutTime: "11:00 AM",
      desk: "Counter 2",
      distance: "1.2 km away",
    };

  // State
  const [isFavorite, setIsFavorite] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // Pulse glow on success badge
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
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

  // Drop confetti particles on mount
  useEffect(() => {
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 1800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [confettiAnim]);

  // Haptic & Success sound trigger on entry
  useEffect(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Fallback
    }
  }, []);

  // Confetti particles definition
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, index) => ({
      id: index,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      leftPct: (index * 5.5 + (index % 3) * 2) % 94,
      size: 5 + (index % 5),
      rotation: `${(index * 47) % 360}deg`,
      endRotation: `${(index * 123 + 360) % 720}deg`,
      delay: (index % 4) * 0.1,
    }));
  }, []);

  const handleFavoritePress = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Fallback
    }
    setIsFavorite(!isFavorite);
  };

  const handleSharePress = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      await Share.share({
        title: `QueueUp: ${facility.name} Pass`,
        message: `I'm in line at ${facility.name}! Ticket #${facility.ticketNumber}. Tracking via QueueUp.`,
      });
    } catch {
      // Fallback
    }
  };

  const toggleSms = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Fallback
    }
    setSmsEnabled(!smsEnabled);
  };

  const handleTrackQueue = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Fallback
    }
    // Navigate to Screen 9: Digital Queue Ticket
    router.push(`/ticket/${facility.ticketNumber}` as any);
  };

  const handleWalletPress = (walletName: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Fallback
    }
    Alert.alert(
      `${walletName} Pass`,
      `Ticket ${facility.ticketNumber} for ${facility.name} has been added to your ${walletName}.`
    );
  };

  const handleDirectionsPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).then(()=>{
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`;
        Linking.openURL(url).catch((error)=>{
          console.error("Error opening directions:", error);
        });
      }).catch((error)=>{
        console.error("Error opening directions:", error);
      });
    } catch(err){
      console.error("Error opening directions:", err);
    }
    // Alert.alert(
    //   "Directions",
    //   `Opening turn-by-turn navigation to ${facility.name} (${facility.address}).`
    // );
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
            Booking Confirmation
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

      {/* Confetti Particle Layer */}
      <View
        pointerEvents="none"
        className="absolute top-14 left-0 right-0 h-48 overflow-hidden z-20"
      >
        {particles.map((p) => {
          const translateY = confettiAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-15, 190 + (p.id % 4) * 20],
          });
          const opacity = confettiAnim.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [1, 0.85, 0],
          });
          const rotate = confettiAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [p.rotation, p.endRotation],
          });

          return (
            <Animated.View
              key={p.id}
              style={{
                position: "absolute",
                top: 0,
                left: `${p.leftPct}%`,
                width: p.size,
                height: p.size * 1.4,
                backgroundColor: p.color,
                borderRadius: 2,
                opacity,
                transform: [{ translateY }, { rotate }],
              }}
            />
          );
        })}
      </View>

      {/* Scrollable Main Body Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 24),
          paddingTop: 8,
        }}
        className="flex-1"
      >
        <View className="px-4 gap-4">
          {/* Top Modal Dismiss Bar */}
          <View className="flex-row justify-end w-full pt-1">
            {/* <View className="flex-row items-center gap-1.5">
              <Image
                source={require("@/assets/images/queueup-logo.png")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text className="text-[11px] font-bold text-primary tracking-wider uppercase">
                Confirmed Pass
              </Text>
            </View> */}

            <TouchableOpacity
              accessibilityLabel="Close modal"
              activeOpacity={0.8}
              onPress={() => router.replace("/(customer)/home")}
              className="w-8 h-8 rounded-full bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
            >
              <Ionicons name="close" size={17} color="#434655" />
            </TouchableOpacity>
          </View>

          {/* Celebration Hero Section */}
          <View className="items-center text-center pt-1 pb-1">
            {/* Radiating Green Check Icon Metaphor */}
            <View className="relative items-center justify-center mb-3">
              {/* Outer soft radiating pulse ring */}
              <Animated.View
                style={{ transform: [{ scale: pulseAnim }], opacity: 0.4 }}
                className="absolute w-20 h-20 rounded-full bg-[#6FFBBE]"
              />
              {/* Middle glow ring */}
              <View className="absolute w-16 h-16 rounded-full bg-[#4EDEA3] opacity-50" />
              {/* Solid Success Icon Badge */}
              <View className="relative w-14 h-14 rounded-full bg-[#006242] items-center justify-center shadow-md">
                <Ionicons name="checkmark" size={30} color="#FFFFFF" />
              </View>
            </View>

            {/* Live Registration Pill */}
            <View className="flex-row items-center gap-1.5 bg-[#007D55]/15 px-3 py-1 rounded-full mb-1 mt-4">
              <View className="w-2 h-2 rounded-full bg-[#006242]" />
              <Text className="text-[10px] font-bold text-[#006242] tracking-wider uppercase">
                LIVE REGISTRATION COMPLETED
              </Text>
            </View>

            <Text className="text-[24px] font-extrabold text-[#131B2E] tracking-tight mt-1">
              You&apos;re in the queue!
            </Text>
            <Text className="text-[14px] text-[#434655] text-center max-w-[280px] mt-1 leading-snug">
              Your ticket has been issued and confirmed.
            </Text>
          </View>

          {/* Signature Digital Queue Mini-Ticket Card */}
          <Card
            variant="elevated"
            className="p-0 rounded-2xl bg-white shadow-md border border-[#E2E7FF] overflow-hidden"
          >
            {/* Top Ticket Header */}
            <View className="p-4 bg-[#F2F3FF] flex-row items-center justify-between border-b border-[#EAEDFF]">
              <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
                <View className="w-10 h-10 rounded-xl bg-[#DBE1FF] items-center justify-center shrink-0">
                  <Ionicons name="medkit" size={20} color="#004AC6" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                    {facility.categoryUpper}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-[15px] font-bold text-[#131B2E] mt-0.5 truncate"
                  >
                    {facility.name}
                  </Text>
                </View>
              </View>

              <View className="px-2.5 py-1 rounded-full bg-white shadow-2xs">
                <Text className="text-[10px] font-bold text-[#007D55] uppercase tracking-wider">
                  READY NOW
                </Text>
              </View>
            </View>

            {/* Ticket Main Hero: Big Ticket Code */}
            <View className="py-6 px-4 items-center justify-center bg-white">
              <Text className="text-[11px] font-bold text-[#434655] tracking-widest uppercase mb-1">
                Your Ticket Number
              </Text>
              <Text className="text-[46px] font-black text-[#004AC6] tracking-tight leading-none my-1">
                {facility.ticketNumber}
              </Text>
              <View className="flex-row items-center gap-1.5 mt-2">
                <Ionicons name="checkmark-circle" size={15} color="#007D55" />
                <Text className="text-[12px] font-medium text-[#434655]">
                  {facility.serviceName}
                </Text>
              </View>
            </View>

            {/* Real Notch Metaphor Division */}
            <View className="relative flex-row items-center justify-between w-full my-1">
              {/* Left Notch */}
              <View className="w-4 h-6 -ml-5 rounded-r-full bg-[#CBD5E1]" />
              {/* Dashed line */}
              <View className="flex-1 mx-2 h-[1px] border-b-2 border-dashed border-[#CBD5E1]" />
              {/* Right Notch */}
              <View className="w-4 h-6 -mr-5 rounded-l-full bg-[#CBD5E1]" />
            </View>

            {/* Immediate Telemetry Grid (4 Key Metrics) */}
            <View className="p-4 bg-white gap-2.5">
              <View className="flex-row gap-2.5">
                {/* Metric 1 */}
                <View className="flex-1 bg-[#F2F3FF] p-3 rounded-xl justify-between">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Ionicons name="people" size={15} color="#004AC6" />
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      People Ahead
                    </Text>
                  </View>
                  <View className="flex-row items-baseline mt-1">
                    <Text className="text-[18px] font-bold text-[#131B2E]">
                      {facility.inLine}
                    </Text>
                    <Text className="text-[12px] font-normal text-[#434655] ml-1">
                      waiting
                    </Text>
                  </View>
                </View>

                {/* Metric 2 */}
                <View className="flex-1 bg-[#F2F3FF] p-3 rounded-xl justify-between">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Ionicons name="time" size={15} color="#3755C3" />
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Estimated Wait
                    </Text>
                  </View>
                  <View className="flex-row items-baseline mt-1">
                    <Text className="text-[18px] font-bold text-[#131B2E]">
                      ~{facility.estWait}
                    </Text>
                    <Text className="text-[12px] font-normal text-[#434655] ml-1">
                      mins
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2.5">
                {/* Metric 3 */}
                <View className="flex-1 bg-[#F2F3FF] p-3 rounded-xl justify-between">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Ionicons name="alarm-outline" size={15} color="#007D55" />
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Est. Service
                    </Text>
                  </View>
                  <Text className="text-[15px] font-bold text-[#131B2E] mt-1">
                    {facility.estService}
                  </Text>
                </View>

                {/* Metric 4 */}
                <View className="flex-1 bg-[#F2F3FF] p-3 rounded-xl justify-between">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Ionicons name="time-outline" size={15} color="#737686" />
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Joined At
                    </Text>
                  </View>
                  <Text className="text-[15px] font-bold text-[#131B2E] mt-1">
                    {facility.joinedAt}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Visual Location Scrim Mini-Card */}
          <Card
            variant="elevated"
            className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#E2E7FF] flex-row items-center justify-between gap-3"
          >
            <View className="flex-row items-center gap-3 min-w-0 flex-1 mr-1">
              <View className="w-11 h-11 rounded-xl bg-[#DDE1FF] items-center justify-center shrink-0">
                <Ionicons name="location" size={22} color="#004AC6" />
              </View>
              <View className="flex-1 min-w-0">
                <Text
                  numberOfLines={1}
                  className="text-[14px] font-bold text-[#131B2E]"
                >
                  {facility.address}
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-[12px] text-[#434655] mt-0.5"
                >
                  {facility.subAddress}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDirectionsPress}
              className="flex-row items-center gap-1 px-3 py-2 rounded-xl bg-[#DBE1FF] active:bg-[#C8D5FF] shrink-0"
            >
              <Text className="text-[12px] font-bold text-[#004AC6]">
                Directions
              </Text>
              <Ionicons name="open-outline" size={13} color="#004AC6" />
            </TouchableOpacity>
          </Card>

          {/* Next Steps & Guidance Roadmap */}
          <Card
            variant="flat"
            className="p-4 rounded-2xl bg-[#F2F3FF] border border-[#EAEDFF] gap-3"
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[15px] font-bold text-[#131B2E]">
                What should you do next?
              </Text>
              <View className="bg-white px-2.5 py-0.5 rounded-full shadow-2xs">
                <Text className="text-[10px] font-bold text-primary uppercase">
                  3 SIMPLE STEPS
                </Text>
              </View>
            </View>

            {/* Step 1 */}
            <View className="flex-row items-start gap-3">
              <View className="w-7 h-7 rounded-full bg-[#004AC6] items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Text className="text-white text-[12px] font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#131B2E]">
                  Relax and wait anywhere
                </Text>
                <Text className="text-[12px] text-[#434655] mt-0.5 leading-snug">
                  Grab a coffee or stay home. We will automatically alert you
                  when only 5 people are ahead of you.
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View className="flex-row items-start gap-3">
              <View className="w-7 h-7 rounded-full bg-[#DAE2FD] items-center justify-center shrink-0 mt-0.5">
                <Text className="text-[#131B2E] text-[12px] font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#131B2E]">
                  Head to the clinic at ~{facility.headOutTime}
                </Text>
                <Text className="text-[12px] text-[#434655] mt-0.5 leading-snug">
                  Plan to arrive roughly 15 minutes prior to your turn to allow
                  standard security check-in.
                </Text>
              </View>
            </View>

            {/* Step 3 */}
            <View className="flex-row items-start gap-3">
              <View className="w-7 h-7 rounded-full bg-[#DAE2FD] items-center justify-center shrink-0 mt-0.5">
                <Text className="text-[#131B2E] text-[12px] font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#131B2E]">
                  Show ticket at {facility.desk}
                </Text>
                <Text className="text-[12px] text-[#434655] mt-0.5 leading-snug">
                  Simply show your digital barcode or ticket{" "}
                  {facility.ticketNumber} at the welcome kiosk screen.
                </Text>
              </View>
            </View>
          </Card>

          {/* Live Alert Preferences & Wallet Section */}
          <View className="gap-2.5">
            {/* SMS Alert Toggle Card */}
            <Card
              variant="elevated"
              className="p-3.5 rounded-2xl bg-white shadow-2xs border border-[#E2E7FF] flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3 min-w-0 flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center shrink-0">
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={18}
                    color="#004AC6"
                  />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-[14px] font-bold text-[#131B2E]">
                    SMS Instant Alerts
                  </Text>
                  <Text className="text-[12px] text-[#434655] mt-0.5">
                    +1 (555) 0192 • {smsEnabled ? "Active" : "Paused"}
                  </Text>
                </View>
              </View>

              {/* Interactive Pill Switch */}
              <TouchableOpacity
                accessibilityRole="switch"
                accessibilityState={{ checked: smsEnabled }}
                activeOpacity={0.8}
                onPress={toggleSms}
                className={`w-11 h-6 rounded-full p-0.5 justify-center ${
                  smsEnabled ? "bg-[#004AC6] items-end" : "bg-[#CBD5E1] items-start"
                }`}
              >
                <View className="w-5 h-5 rounded-full bg-white shadow-2xs" />
              </TouchableOpacity>
            </Card>

            {/* Add to Digital Wallets Grid */}
            <View className="flex-row gap-2.5">
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => handleWalletPress("Apple Wallet")}
                className="flex-1 flex-row items-center justify-center gap-2 p-3 rounded-2xl bg-white shadow-2xs border border-[#E2E7FF] active:bg-[#F2F3FF]"
              >
                <Ionicons name="wallet-outline" size={18} color="#131B2E" />
                <Text className="text-[13px] font-semibold text-[#131B2E]">
                  Apple Wallet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => handleWalletPress("Google Wallet")}
                className="flex-1 flex-row items-center justify-center gap-2 p-3 rounded-2xl bg-white shadow-2xs border border-[#E2E7FF] active:bg-[#F2F3FF]"
              >
                <Ionicons name="card-outline" size={18} color="#131B2E" />
                <Text className="text-[13px] font-semibold text-[#131B2E]">
                  Google Wallet
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Action CTAs */}
          <View className="gap-2.5 pt-1 pb-4">
            {/* Main Live Tracking CTA */}
            <Button
              title="Track My Queue"
              variant="primary"
              size="lg"
              leftIcon={<Ionicons name="radio" size={18} color="#FFFFFF" />}
              rightIcon={
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              }
              onPress={handleTrackQueue}
              className="w-full rounded-full bg-[#004AC6] shadow-md"
            />

            {/* Back to Home Secondary CTA */}
            <Button
              title="Back to Home"
              variant="ghost"
              size="md"
              onPress={() => router.replace("/(customer)/home")}
              textClassName="text-[#131B2E] font-bold"
              className="w-full rounded-full bg-[#EAEDFF]"
            />

            {/* Tertiary Link */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDirectionsPress}
              className="flex-row items-center justify-center gap-1.5 py-1"
            >
              <Ionicons name="navigate-outline" size={14} color="#434655" />
              <Text className="text-[12px] font-medium text-[#434655]">
                View Directions ({facility.distance})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
