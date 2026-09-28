import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Share,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

type ConfirmationState = "confirm" | "joining" | "failed";

interface PatientInfo {
  id: string;
  name: string;
  phone: string;
  relation: string;
  initials: string;
}

const PATIENTS: PatientInfo[] = [
  {
    id: "p1",
    name: "Parvan K.",
    phone: "+1 555-0192",
    relation: "Self",
    initials: "PK",
  },
  {
    id: "p2",
    name: "Sarah K.",
    phone: "+1 555-0193",
    relation: "Spouse",
    initials: "SK",
  },
  {
    id: "p3",
    name: "Leo K.",
    phone: "+1 555-0194",
    relation: "Child",
    initials: "LK",
  },
];

interface FacilityData {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: string;
  status: string;
  wait: string;
  waitMins: number;
  inLine: number;
  doctors: string;
  service: string;
  serviceRange: string;
  otherService: string;
  otherRange: string;
  expectedTurn: string;
  alertTurn: string;
  maxCapacity: number;
}

const FACILITIES_DATA: Record<string, FacilityData> = {
  "city-care-clinic": {
    id: "city-care-clinic",
    name: "City Care Clinic",
    category: "Verified Healthcare Provider",
    address: "742 Evergreen Blvd, Metro District",
    distance: "0.4 mi away",
    status: "Open",
    wait: "~25 min",
    waitMins: 25,
    inLine: 18,
    doctors: "4 Active",
    service: "General OPD Consultation",
    serviceRange: "Ticket sequence A-101 to A-140",
    otherService: "Pediatrics Care",
    otherRange: "Ticket sequence P-40 to P-60",
    expectedTurn: "Around 11:15 AM",
    alertTurn: "3rd in line",
    maxCapacity: 50,
  },
  "st-jude-hospital": {
    id: "st-jude-hospital",
    name: "St. Jude Hospital - OPD",
    category: "Hospital Intake & Emergency",
    address: "1200 Mercy Boulevard, Floor 1",
    distance: "2.8 mi away",
    status: "Open",
    wait: "~50 min",
    waitMins: 50,
    inLine: 41,
    doctors: "6 Active",
    service: "Cardiology OPD Consultation",
    serviceRange: "Ticket sequence C-01 to C-50",
    otherService: "Internal Medicine",
    otherRange: "Ticket sequence M-10 to M-35",
    expectedTurn: "Around 12:40 PM",
    alertTurn: "5th in line",
    maxCapacity: 60,
  },
  "express-medical": {
    id: "express-medical",
    name: "Express Medical & Pediatric",
    category: "Urgent Care & Pediatrics",
    address: "450 Health Parkway, Suite B",
    distance: "3.5 mi away",
    status: "Open",
    wait: "~12 min",
    waitMins: 12,
    inLine: 7,
    doctors: "2 Active",
    service: "Pediatric Triage & Urgent",
    serviceRange: "Ticket sequence E-01 to E-25",
    otherService: "Express Adult Care",
    otherRange: "Ticket sequence A-01 to A-20",
    expectedTurn: "Around 10:35 AM",
    alertTurn: "2nd in line",
    maxCapacity: 25,
  },
};

export default function JoinQueueConfirmationScreen() {
  const params = useLocalSearchParams();
  const queueId = (params.id as string) || "city-care-clinic";

  const facility: FacilityData = useMemo(() => {
    return (
      FACILITIES_DATA[queueId] || {
        ...FACILITIES_DATA["city-care-clinic"],
        id: queueId,
        name: queueId
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      }
    );
  }, [queueId]);

  const insets = useSafeAreaInsets();
  const [activeState, setActiveState] = useState<ConfirmationState>("confirm");
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo>(PATIENTS[0]);
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<keyof typeof Ionicons.glyphMap>("checkmark-circle");
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // Radar / pulse animations for Joining state
  const pulseScale1 = useRef(new Animated.Value(1)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.7)).current;
  const pulseScale2 = useRef(new Animated.Value(1)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.5)).current;
  const logoBounce = useRef(new Animated.Value(1)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  // Step progression during joining
  const [joiningStep, setJoiningStep] = useState(1);

  // Setup loop animations for radar & spinner
  useEffect(() => {
    if (activeState === "joining") {
      const pulse1 = Animated.loop(
        Animated.parallel([
          Animated.timing(pulseScale1, {
            toValue: 1.8,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity1, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      const pulse2 = Animated.loop(
        Animated.sequence([
          Animated.delay(400),
          Animated.parallel([
            Animated.timing(pulseScale2, {
              toValue: 1.5,
              duration: 1500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity2, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      const bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(logoBounce, {
            toValue: 1.1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(logoBounce, {
            toValue: 0.95,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      const spinner = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      pulse1.start();
      pulse2.start();
      bounce.start();
      spinner.start();

      return () => {
        pulse1.stop();
        pulse2.stop();
        bounce.stop();
        spinner.stop();
      };
    }
  }, [activeState, logoBounce, pulseOpacity1, pulseOpacity2, pulseScale1, pulseScale2, spinValue]);

  // Handle joining progression & auto-navigation to Screen 8
  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;
    let timer3: ReturnType<typeof setTimeout>;

    if (activeState === "joining") {
      setJoiningStep(1);

      // Step 2 after 800ms
      timer1 = setTimeout(() => {
        setJoiningStep(2);
      }, 800);

      // Step 3 after 1700ms
      timer2 = setTimeout(() => {
        setJoiningStep(3);
      }, 1700);

      // Navigate to Screen 8 Booking Success after 2600ms
      timer3 = setTimeout(() => {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        } catch {
          // Fallback
        }
        setIsSubmitting(false);
        router.push(`/booking-success/${facility.id}` as any);
      }, 2600);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeState, facility.id]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const showToast = (message: string, icon: keyof typeof Ionicons.glyphMap = "checkmark-circle") => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Fallback
    }
    setToastMessage(message);
    setToastIcon(icon);

    Animated.parallel([
      Animated.timing(toastAnim, {
        toValue: 16,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastAnim, {
            toValue: -80,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      }, 2200);
    });
  };

  const handleStateChange = (state: ConfirmationState) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Fallback
    }
    setActiveState(state);
    if (state !== "joining") {
      setIsSubmitting(false);
    }
  };

  const handleConfirmJoin = () => {
    if (isSubmitting) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Fallback
    }
    setIsSubmitting(true);
    setActiveState("joining");
  };

  const toggleFavorite = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Fallback
    }
    setIsFavorite(!isFavorite);
    showToast(
      !isFavorite
        ? `Saved ${facility.name} to Favorites`
        : `Removed ${facility.name} from Favorites`,
      !isFavorite ? "heart" : "heart-outline"
    );
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      await Share.share({
        message: `QueueUp booking at ${facility.name}: Current wait is ${facility.wait} for ${facility.service}. Address: ${facility.address}`,
      });
    } catch {
      showToast("Link copied to clipboard", "link-outline");
    }
  };

  const handleCancel = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Fallback
    }
    router.back();
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Toast Alert */}
      {toastMessage && (
        <Animated.View
          style={{
            transform: [{ translateY: toastAnim }],
            opacity: toastOpacity,
          }}
          className="absolute top-24 left-4 right-4 z-50 bg-[#131B2E] rounded-xl px-4 py-3 flex-row items-center gap-3 shadow-lg"
        >
          <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center">
            <Ionicons name={toastIcon} size={18} color="#60A5FA" />
          </View>
          <Text className="text-white text-xs font-semibold flex-1">
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      {/* Top Navigation Header */}
      <View className="h-16 px-4 bg-[#FAF8FF]/95 border-b border-[#EAEDFF] flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 flex-1 min-w-0">
          <TouchableOpacity
            accessibilityLabel="Go back"
            activeOpacity={0.7}
            onPress={handleCancel}
            className="w-10 h-10 rounded-full items-center justify-center bg-[#F2F3FF] active:scale-95"
          >
            <Ionicons name="chevron-back" size={22} color="#131B2E" />
          </TouchableOpacity>
          <Image
            source={require("@/assets/images/queueup-logo.png")}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
          <Text
            numberOfLines={1}
            className="text-[17px] font-bold text-[#131B2E] flex-1 ml-1"
          >
            Booking Confirmation
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            accessibilityLabel="Favorite queue"
            activeOpacity={0.7}
            onPress={toggleFavorite}
            className="w-10 h-10 rounded-full items-center justify-center bg-[#F2F3FF]"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#EF4444" : "#434655"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Share queue"
            activeOpacity={0.7}
            onPress={handleShare}
            className="w-10 h-10 rounded-full items-center justify-center bg-[#F2F3FF]"
          >
            <Ionicons name="share-social-outline" size={20} color="#434655" />
          </TouchableOpacity>

          <View className="w-8 h-8 rounded-full bg-[#004AC6] items-center justify-center ml-1 shadow-sm">
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Demo Switcher Ribbon (Edge Case & Interactive State Explorer) */}
      <View className="px-4 py-2 bg-[#FAF8FF] border-b border-[#EAEDFF]">
        <View className="flex-row items-center bg-[#EAEDFF] p-1 rounded-xl">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleStateChange("confirm")}
            className={`flex-1 py-1.5 px-2 rounded-lg flex-row items-center justify-center gap-1.5 ${
              activeState === "confirm"
                ? "bg-[#004AC6] shadow-xs"
                : "bg-transparent"
            }`}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={15}
              color={activeState === "confirm" ? "#FFFFFF" : "#434655"}
            />
            <Text
              className={`text-[12px] font-semibold ${
                activeState === "confirm" ? "text-white" : "text-[#434655]"
              }`}
            >
              Confirm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleStateChange("joining")}
            className={`flex-1 py-1.5 px-2 rounded-lg flex-row items-center justify-center gap-1.5 ${
              activeState === "joining"
                ? "bg-[#004AC6] shadow-xs"
                : "bg-transparent"
            }`}
          >
            <Ionicons
              name="refresh"
              size={15}
              color={activeState === "joining" ? "#FFFFFF" : "#434655"}
            />
            <Text
              className={`text-[12px] font-semibold ${
                activeState === "joining" ? "text-white" : "text-[#434655]"
              }`}
            >
              Joining
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleStateChange("failed")}
            className={`flex-1 py-1.5 px-2 rounded-lg flex-row items-center justify-center gap-1.5 ${
              activeState === "failed"
                ? "bg-[#004AC6] shadow-xs"
                : "bg-transparent"
            }`}
          >
            <Ionicons
              name="alert-circle-outline"
              size={15}
              color={activeState === "failed" ? "#FFFFFF" : "#434655"}
            />
            <Text
              className={`text-[12px] font-semibold ${
                activeState === "failed" ? "text-white" : "text-[#434655]"
              }`}
            >
              Capacity Err
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Body with Contextual Backdrop and Sheet Content */}
      <View className="flex-1 relative">
        {/* Contextual App Screen Backdrop (Dimmed Background Details) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 320 }}
          className="opacity-35"
        >
          {/* Clinic Header Context Card */}
          <View className="p-4 rounded-2xl bg-white shadow-xs border border-[#EAEDFF] gap-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-row gap-3 items-center flex-1">
                <View className="w-12 h-12 rounded-xl bg-[#DBE1FF] items-center justify-center">
                  <Ionicons name="medkit" size={24} color="#004AC6" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-[#004AC6] uppercase tracking-wider">
                    {facility.category}
                  </Text>
                  <Text className="text-[17px] font-bold text-[#131B2E]">
                    {facility.name}
                  </Text>
                  <Text className="text-[11px] text-[#434655] mt-0.5">
                    {facility.address} • {facility.distance}
                  </Text>
                </View>
              </View>
              <View className="px-2.5 py-1 rounded-full bg-[#6FFBBE]/40 border border-[#6FFBBE]">
                <Text className="text-[11px] font-bold text-[#006242]">
                  {facility.status}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2 pt-1">
              <View className="flex-1 p-2.5 rounded-xl bg-[#F2F3FF] items-center">
                <Text className="text-[10px] font-bold text-[#434655]">CURRENT WAIT</Text>
                <Text className="text-[15px] font-bold text-[#131B2E] mt-0.5">
                  {facility.wait}
                </Text>
              </View>
              <View className="flex-1 p-2.5 rounded-xl bg-[#F2F3FF] items-center">
                <Text className="text-[10px] font-bold text-[#434655]">IN LINE</Text>
                <Text className="text-[15px] font-bold text-[#131B2E] mt-0.5">
                  {facility.inLine}
                </Text>
              </View>
              <View className="flex-1 p-2.5 rounded-xl bg-[#F2F3FF] items-center">
                <Text className="text-[10px] font-bold text-[#434655]">DOCTORS</Text>
                <Text className="text-[15px] font-bold text-[#131B2E] mt-0.5">
                  {facility.doctors}
                </Text>
              </View>
            </View>
          </View>

          {/* Department Selector Preview */}
          <View className="mt-3 gap-2">
            <View className="p-3.5 rounded-2xl bg-white border border-[#EAEDFF] flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-[#DDE1FF] items-center justify-center">
                  <Ionicons name="fitness-outline" size={20} color="#3755C3" />
                </View>
                <View>
                  <Text className="text-[14px] font-bold text-[#131B2E]">
                    {facility.service}
                  </Text>
                  <Text className="text-[11px] text-[#434655]">
                    {facility.serviceRange}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#737686" />
            </View>

            <View className="p-3.5 rounded-2xl bg-white/70 border border-[#EAEDFF] flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-[#EAEDFF] items-center justify-center">
                  <Ionicons name="happy-outline" size={20} color="#737686" />
                </View>
                <View>
                  <Text className="text-[14px] font-bold text-[#131B2E]">
                    {facility.otherService}
                  </Text>
                  <Text className="text-[11px] text-[#434655]">
                    {facility.otherRange}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#737686" />
            </View>
          </View>

          {/* Map Preview Placeholder */}
          <View className="mt-3 p-4 rounded-2xl bg-white border border-[#EAEDFF]">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[14px] font-bold text-[#131B2E]">
                Location & Arrival
              </Text>
              <Text className="text-[12px] font-bold text-[#004AC6]">
                Directions
              </Text>
            </View>
            <View className="w-full h-28 rounded-xl bg-[#EAEDFF] items-center justify-center">
              <Ionicons name="map-outline" size={28} color="#737686" />
              <Text className="text-[11px] text-[#434655] mt-1 font-medium">
                {facility.address}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Screen Dimming Backdrop */}
        <View className="absolute inset-0 bg-[#131B2E]/40" />

        {/* ========================================================
             STATE 1: CONFIRMATION BOTTOM SHEET (Active by default)
             ======================================================== */}
        {activeState === "confirm" && (
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] shadow-2xl px-5 pt-3 border-t border-[#EAEDFF]"
          >
            {/* Drag Handle Indicator */}
            <View className="w-12 h-1.5 rounded-full bg-[#C3C6D7] mx-auto mb-3 self-center" />

            {/* Header with Brand Icon */}
            <View className="flex-row items-start justify-between gap-3 mb-3.5">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-12 h-12 rounded-2xl bg-[#DBE1FF] items-center justify-center shadow-xs">
                  <Ionicons name="checkmark-done-circle" size={26} color="#004AC6" />
                </View>
                <View className="flex-1">
                  <Text className="text-[20px] font-extrabold text-[#131B2E] tracking-tight">
                    Join Virtual Queue?
                  </Text>
                  <Text className="text-[12px] text-[#434655] mt-0.5">
                    You are about to join the virtual line at{" "}
                    <Text className="font-bold text-[#131B2E]">
                      {facility.name}
                    </Text>
                    .
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                accessibilityLabel="Close confirmation sheet"
                activeOpacity={0.7}
                onPress={handleCancel}
                className="w-8 h-8 rounded-full bg-[#F2F3FF] items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#434655" />
              </TouchableOpacity>
            </View>

            {/* Service Summary Card */}
            <View className="rounded-2xl bg-[#F2F3FF] p-3.5 gap-3 mb-3 border border-[#EAEDFF]">
              {/* Selected Service Row */}
              <View className="flex-row items-center justify-between pb-2.5 border-b border-[#EAEDFF]">
                <View className="flex-1 pr-2">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                    SELECTED SERVICE
                  </Text>
                  <Text className="text-[15px] font-bold text-[#131B2E] mt-0.5">
                    {facility.service}
                  </Text>
                </View>
                <Image
                  source={require("@/assets/images/queueup-logo.png")}
                  style={{ width: 22, height: 22, opacity: 0.85 }}
                  resizeMode="contain"
                />
              </View>

              {/* Telemetry Stats Row */}
              <View className="flex-row gap-2.5">
                <View className="flex-1 flex-row items-center gap-2.5 p-2.5 rounded-xl bg-white shadow-2xs border border-[#EAEDFF]">
                  <View className="w-8 h-8 rounded-full bg-[#E2E7FF] items-center justify-center">
                    <Ionicons name="hourglass-outline" size={17} color="#3755C3" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      ESTIMATED WAIT
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <View className="w-2 h-2 rounded-full bg-[#3755C3]" />
                      <Text className="text-[13px] font-bold text-[#131B2E]">
                        {facility.waitMins} min
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-1 flex-row items-center gap-2.5 p-2.5 rounded-xl bg-white shadow-2xs border border-[#EAEDFF]">
                  <View className="w-8 h-8 rounded-full bg-[#DBE1FF] items-center justify-center">
                    <Ionicons name="people" size={17} color="#004AC6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      PEOPLE AHEAD
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <View className="w-2 h-2 rounded-full bg-[#004AC6]" />
                      <Text className="text-[13px] font-bold text-[#004AC6]">
                        {facility.inLine} people
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Timing & Telemetry Details */}
              <View className="gap-1.5 pt-0.5">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={16} color="#004AC6" />
                  <Text className="text-[12px] text-[#434655]">
                    Expected turn:{" "}
                    <Text className="font-bold text-[#131B2E]">
                      {facility.expectedTurn}
                    </Text>
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="notifications" size={16} color="#007D55" />
                  <Text className="text-[12px] text-[#434655]">
                    SMS & push alerts when you are{" "}
                    <Text className="font-bold text-[#131B2E]">
                      {facility.alertTurn}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Patient Identity Chip / Card */}
            <View className="flex-row items-center justify-between p-3 rounded-2xl bg-white border border-[#EAEDFF] shadow-2xs mb-3.5">
              <View className="flex-row items-center gap-3 flex-1 min-w-0 pr-2">
                <View className="w-9 h-9 rounded-full bg-[#004AC6] items-center justify-center">
                  <Text className="text-white text-[12px] font-bold">
                    {selectedPatient.initials}
                  </Text>
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                      ATTENDING PATIENT
                    </Text>
                    <View className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-[14px] font-bold text-[#131B2E] mt-0.5"
                  >
                    {selectedPatient.name}{" "}
                    <Text className="text-[12px] text-[#434655] font-normal">
                      ({selectedPatient.phone})
                    </Text>
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                accessibilityLabel="Change attending patient"
                activeOpacity={0.7}
                onPress={() => setIsPatientModalVisible(true)}
                className="px-3 py-1.5 rounded-xl bg-[#F2F3FF] active:bg-[#EAEDFF]"
              >
                <Text className="text-[12px] font-bold text-[#004AC6]">Change</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="gap-2">
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isSubmitting}
                onPress={handleConfirmJoin}
                className="w-full h-13 py-3.5 rounded-full bg-[#004AC6] flex-row items-center justify-center gap-2 shadow-md active:scale-[0.98]"
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text className="text-white text-[15px] font-bold">
                  Confirm & Join Queue
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCancel}
                className="w-full h-11 rounded-full items-center justify-center"
              >
                <Text className="text-[#434655] text-[14px] font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================
             STATE 2: JOINING / LOADING STATE OVERLAY
             ======================================================== */}
        {activeState === "joining" && (
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] shadow-2xl px-6 pt-5 pb-6 items-center text-center border-t border-[#EAEDFF]"
          >
            {/* Animated Radar / Pulse Ring Indicator */}
            <View className="w-32 h-32 items-center justify-center my-3 relative">
              {/* Outer pulse */}
              <Animated.View
                style={{
                  transform: [{ scale: pulseScale1 }],
                  opacity: pulseOpacity1,
                }}
                className="absolute w-28 h-28 rounded-full bg-blue-500/20"
              />
              {/* Middle pulse */}
              <Animated.View
                style={{
                  transform: [{ scale: pulseScale2 }],
                  opacity: pulseOpacity2,
                }}
                className="absolute w-20 h-20 rounded-full bg-blue-500/30"
              />
              {/* Central circular card housing QueueUp logo */}
              <Animated.View
                style={{ transform: [{ scale: logoBounce }] }}
                className="w-16 h-16 rounded-full bg-white shadow-lg items-center justify-center p-3 border border-[#EAEDFF]"
              >
                <Image
                  source={require("@/assets/images/queueup-logo.png")}
                  style={{ width: 34, height: 34 }}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>

            {/* Securing Spot Badge */}
            <View className="px-3.5 py-1 rounded-full bg-[#DBE1FF] mb-2">
              <Text className="text-[11px] font-bold text-[#00174B] uppercase tracking-wider">
                SECURING SPOT IN REAL TIME
              </Text>
            </View>

            <Text className="text-[22px] font-extrabold text-[#131B2E] mb-1">
              Joining queue...
            </Text>
            <Text className="text-[13px] text-[#434655] text-center max-w-xs mb-5">
              Reserving your position with{" "}
              <Text className="font-bold text-[#131B2E]">{facility.name}</Text>.
              Ticket issuance in progress.
            </Text>

            {/* Live Step Progress Tracker */}
            <View className="w-full bg-[#F2F3FF] rounded-2xl p-4 mb-4 gap-3 border border-[#EAEDFF]">
              {/* Step 1: Active Capacity */}
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center ${
                    joiningStep >= 1 ? "bg-[#007D55]" : "bg-[#EAEDFF]"
                  }`}
                >
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
                <Text
                  className={`text-[13px] ${
                    joiningStep >= 1
                      ? "text-[#131B2E] font-bold"
                      : "text-[#737686]"
                  }`}
                >
                  Verifying clinic active capacity
                </Text>
              </View>

              {/* Step 2: Next Ticket */}
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center ${
                    joiningStep >= 2
                      ? "bg-[#004AC6]"
                      : "bg-[#EAEDFF]"
                  }`}
                >
                  {joiningStep >= 2 ? (
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                      <Ionicons name="sync" size={14} color="#FFFFFF" />
                    </Animated.View>
                  ) : (
                    <Ionicons name="ellipsis-horizontal" size={14} color="#737686" />
                  )}
                </View>
                <Text
                  className={`text-[13px] ${
                    joiningStep >= 2
                      ? "text-[#004AC6] font-bold"
                      : "text-[#737686]"
                  }`}
                >
                  Assigning next available ticket number
                </Text>
              </View>

              {/* Step 3: Sync Wait Estimate */}
              <View
                className={`flex-row items-center gap-3 ${
                  joiningStep >= 3 ? "opacity-100" : "opacity-50"
                }`}
              >
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center ${
                    joiningStep >= 3 ? "bg-[#007D55]" : "bg-[#E2E7FF]"
                  }`}
                >
                  {joiningStep >= 3 ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <Ionicons name="hourglass-outline" size={13} color="#737686" />
                  )}
                </View>
                <Text
                  className={`text-[13px] ${
                    joiningStep >= 3
                      ? "text-[#131B2E] font-bold"
                      : "text-[#434655]"
                  }`}
                >
                  Syncing live wait estimate
                </Text>
              </View>
            </View>

            {/* Gentle Reassurance Prompt */}
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="lock-closed" size={15} color="#004AC6" />
              <Text className="text-[12px] font-medium text-[#434655]">
                Do not close the app or refresh the screen
              </Text>
            </View>
          </View>
        )}

        {/* ========================================================
             STATE 3: BOOKING FAILED / CAPACITY REACHED STATE
             ======================================================== */}
        {activeState === "failed" && (
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] shadow-2xl px-6 pt-5 pb-6 items-center text-center border-t border-[#EAEDFF]"
          >
            {/* Error Illustration Badge */}
            <View className="w-16 h-16 rounded-full bg-[#FFDAD6] items-center justify-center mb-3 shadow-xs">
              <Ionicons name="calendar-outline" size={30} color="#BA1A1A" />
            </View>

            {/* Capacity Exceeded Pill */}
            <View className="px-3.5 py-1 rounded-full bg-[#FFDAD6] mb-2">
              <Text className="text-[11px] font-bold text-[#93000A] uppercase tracking-wider">
                CAPACITY EXCEEDED
              </Text>
            </View>

            <Text className="text-[22px] font-extrabold text-[#131B2E] mb-1">
              Unable to join queue
            </Text>
            <Text className="text-[13px] text-[#434655] text-center max-w-xs mb-4">
              The queue reached maximum capacity just now. Please try again or join
              waitlist for next slot opening.
            </Text>

            {/* Context Alert Box */}
            <View className="w-full p-4 rounded-2xl bg-[#F2F3FF] mb-5 flex-row items-start gap-3 border border-[#EAEDFF]">
              <Ionicons
                name="information-circle"
                size={22}
                color="#3755C3"
                style={{ marginTop: 2 }}
              />
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#131B2E]">
                  Queue limit reached for this session
                </Text>
                <Text className="text-[12px] text-[#434655] mt-1 leading-4">
                  {facility.name} caps active virtual queues at{" "}
                  {facility.maxCapacity} patients to ensure high-quality care. Slots
                  re-open as patients depart.
                </Text>
              </View>
            </View>

            {/* Recovery Actions */}
            <View className="w-full gap-2.5">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleStateChange("confirm")}
                className="w-full h-12 rounded-full bg-[#004AC6] flex-row items-center justify-center gap-2 shadow-md active:scale-[0.98]"
              >
                <Ionicons name="refresh" size={18} color="#FFFFFF" />
                <Text className="text-white text-[14px] font-bold">
                  Try Joining Again
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCancel}
                className="w-full h-11 rounded-full bg-[#F2F3FF] items-center justify-center flex-row gap-2 active:bg-[#EAEDFF]"
              >
                <Ionicons name="arrow-back" size={16} color="#131B2E" />
                <Text className="text-[#131B2E] text-[14px] font-bold">
                  Back to Clinic
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Patient Selector Modal */}
      <Modal
        visible={isPatientModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPatientModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            className="bg-white rounded-t-3xl p-5"
          >
            <View className="flex-row items-center justify-between pb-3 border-b border-[#EAEDFF] mb-3">
              <Text className="text-[17px] font-bold text-[#131B2E]">
                Select Attending Patient
              </Text>
              <TouchableOpacity
                onPress={() => setIsPatientModalVisible(false)}
                className="w-8 h-8 rounded-full bg-[#F2F3FF] items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#131B2E" />
              </TouchableOpacity>
            </View>

            <View className="gap-2.5">
              {PATIENTS.map((p) => {
                const isSelected = selectedPatient.id === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    activeOpacity={0.75}
                    onPress={() => {
                      try {
                        Haptics.selectionAsync().catch(() => {});
                      } catch {
                        // Fallback
                      }
                      setSelectedPatient(p);
                      setIsPatientModalVisible(false);
                      showToast(`Patient updated to ${p.name}`);
                    }}
                    className={`p-3.5 rounded-2xl flex-row items-center justify-between border ${
                      isSelected
                        ? "bg-[#DBE1FF]/40 border-[#004AC6]"
                        : "bg-white border-[#EAEDFF]"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-[#004AC6] items-center justify-center">
                        <Text className="text-white font-bold text-xs">
                          {p.initials}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-[14px] font-bold text-[#131B2E]">
                          {p.name}{" "}
                          <Text className="text-xs text-[#434655] font-normal">
                            ({p.relation})
                          </Text>
                        </Text>
                        <Text className="text-xs text-[#434655]">{p.phone}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#004AC6"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
