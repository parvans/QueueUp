import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { JoinQueueDrawer } from "@/components/queue/JoinQueueDrawer";

type ClinicSimulationState = "normal" | "full" | "paused" | "closed" | "joined";

interface FacilityDetails {
  id: string;
  name: string;
  category: string;
  distance: string;
  address: string;
  rating: number;
  reviews: number;
  heroImage: string;
  phone: string;
  operatingHours: string;
  serviceClosingNotice: string;
  countersStatus: string;
  leadDoctor: string;
  leadCounter: string;
  doctors: { name: string; dept: string }[];
  amenities: { icon: keyof typeof Ionicons.glyphMap; name: string }[];
  defaultMetrics: {
    inLine: number;
    estWaitMins: number;
    serving: string;
    next: string;
    capacityCurrent: number;
    capacityMax: number;
  };
}

const FACILITIES_DATA: Record<string, FacilityDetails> = {
  "city-care-clinic": {
    id: "city-care-clinic",
    name: "City Care Clinic",
    category: "Medical Clinic",
    distance: "1.2 km away",
    address: "742 Evergreen Terrace, Suite 300",
    rating: 4.7,
    reviews: 124,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWfRvAbfUBnxj1QsFtXt3zv_ahF787-y0ENV-4KVizPuo-JJt2Eiuuetnv9vmV0qF17-VPcoKeJNFD3r1pFy8J2bU7h3aJR_-4cwAQRKVgTd7a0qWZab1PYefV_CBvoWmiYGAQr1-y-gixfQFruSrsJE5fAiDzxEX3UHByuNhGQT7pcC4suRng6LPqGEGWxwD1jfhy0AECMS4HBWfBLZvSIDpVUq8kmefIjfub9gueaAb6EiHVW4H-Nw",
    phone: "(555) 019-2834",
    operatingHours: "Today: 8:00 AM – 6:00 PM",
    serviceClosingNotice: "Closing in 4 hrs",
    countersStatus: "3 of 4 Counters Open",
    leadDoctor: "Dr. Martinez",
    leadCounter: "Counter 2",
    doctors: [
      { name: "Dr. Martinez", dept: "General OPD" },
      { name: "Dr. Sarah Chen", dept: "Pediatrics" },
    ],
    amenities: [
      { icon: "wifi-outline", name: "Free Wi-Fi" },
      { icon: "car-outline", name: "On-site Parking" },
      { icon: "body-outline", name: "Accessible Ramp" },
    ],
    defaultMetrics: {
      inLine: 18,
      estWaitMins: 25,
      serving: "#42",
      next: "#43",
      capacityCurrent: 18,
      capacityMax: 30,
    },
  },
  "st-jude-hospital": {
    id: "st-jude-hospital",
    name: "St. Jude Hospital - OPD",
    category: "Hospital Intake",
    distance: "2.8 km away",
    address: "1200 Mercy Boulevard, Floor 1",
    rating: 4.6,
    reviews: 310,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5BYGNIi9tvBfdPj5MZ7X45_zFuvbKnBXo3mDMMAC5FQQYCv5zLqaMrD9LhSm4ghaSaOlyYo6Dp1T8eTO9mzDuSmWH0WnRP55iPIfhv07SMRFrVKr7DuBhkIdwlk_CPOaOBoEJLuZJva2xsYfiwP7fYrmAmRTR5uyKlIPPha-BbRzRL3eNzv5SHbNsLyPBVPXhyxwdeBWBufVhu3KKY0LG0FCxrVCP2fZKeogkS3KfkR3euDNw-PipYQ",
    phone: "(555) 044-8921",
    operatingHours: "Today: 24/7 Emergency & OPD till 9:00 PM",
    serviceClosingNotice: "Closing in 7 hrs",
    countersStatus: "5 of 6 Counters Open",
    leadDoctor: "Dr. David Vance",
    leadCounter: "Counter 1",
    doctors: [
      { name: "Dr. David Vance", dept: "Cardiology OPD" },
      { name: "Dr. Emily Taylor", dept: "Internal Medicine" },
    ],
    amenities: [
      { icon: "wifi-outline", name: "Free Wi-Fi" },
      { icon: "car-outline", name: "Underground Parking" },
      { icon: "cafe-outline", name: "Cafeteria" },
    ],
    defaultMetrics: {
      inLine: 41,
      estWaitMins: 50,
      serving: "#88",
      next: "#89",
      capacityCurrent: 41,
      capacityMax: 50,
    },
  },
  "express-medical": {
    id: "express-medical",
    name: "Express Medical & Pediatric",
    category: "Urgent & Pediatric",
    distance: "3.5 km away",
    address: "450 Health Parkway, Suite B",
    rating: 4.9,
    reviews: 88,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVGvLBRi7CSaO7_yetHOhDWaJdFv2nRFH2xeN31rM26NNT-_br75F1d8lxPE4dfKaL3KSoPsVmYJ6dDEW8zWg-7zZl-1VFk_E71jGemmBtL7JYngs-4lrmwD-D42YJ37FClLiTpt-kmrrc1m8Ljnrwyv309Y3MKW_9-0oDv1BkcHYOTGESRU8hj9h_h3Q_fKDpmGIqBCNmzTAitqSHGzOQhi5GSioi5tOSIQvgKB2-gwVnXA0kN_Bn1Q",
    phone: "(555) 077-4412",
    operatingHours: "Today: 9:00 AM – 5:00 PM",
    serviceClosingNotice: "Closing in 3 hrs",
    countersStatus: "2 of 2 Fast Counters Open",
    leadDoctor: "Dr. Rachel Green",
    leadCounter: "Fast Desk 1",
    doctors: [
      { name: "Dr. Rachel Green", dept: "Pediatric Triage" },
      { name: "Dr. Alan Brooks", dept: "Express Care" },
    ],
    amenities: [
      { icon: "wifi-outline", name: "High-speed Wi-Fi" },
      { icon: "football-outline", name: "Kids Play Zone" },
      { icon: "car-outline", name: "Validated Parking" },
    ],
    defaultMetrics: {
      inLine: 7,
      estWaitMins: 12,
      serving: "#19",
      next: "#20",
      capacityCurrent: 7,
      capacityMax: 20,
    },
  },
};

export default function QueueDetailsScreen() {
  const params = useLocalSearchParams();
  const queueId = (params.id as string) || "city-care-clinic";
  const facility = FACILITIES_DATA[queueId] || {
    ...FACILITIES_DATA["city-care-clinic"],
    id: queueId,
    name: queueId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  };

  const insets = useSafeAreaInsets();
  const [clinicState, setClinicState] = useState<ClinicSimulationState>("normal");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isJoinDrawerVisible, setIsJoinDrawerVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<keyof typeof Ionicons.glyphMap>("checkmark-circle");

  // Beacon pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(-60)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
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
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const showToast = (message: string, icon: keyof typeof Ionicons.glyphMap = "checkmark-circle") => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Haptics fallback
    }
    setToastMessage(message);
    setToastIcon(icon);

    Animated.parallel([
      Animated.timing(toastAnim, {
        toValue: 20,
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
            toValue: -60,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => setToastMessage(null));
      }, 2200);
    });
  };

  const handleStateChange = (state: ClinicSimulationState) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Haptics fallback
    }
    setClinicState(state);
  };

  const handlePrimaryAction = () => {
    if (clinicState === "joined") {
      router.push("/ticket/A-047" as any);
    } else if (clinicState === "normal") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      } catch {
        // Haptics fallback
      }
      setIsJoinDrawerVisible(true);
    }
  };

  const toggleFavorite = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Haptics fallback
    }
    setIsFavorite(!isFavorite);
    showToast(
      !isFavorite
        ? `Added ${facility.name} to Favorites`
        : `Removed ${facility.name} from Favorites`,
      !isFavorite ? "heart" : "heart-outline"
    );
  };

  // State configurations
  const stateConfigs = {
    normal: {
      showBanner: false,
      bannerBg: "",
      bannerIcon: "information-circle" as const,
      bannerIconColor: "#2563EB",
      bannerTitle: "",
      bannerDesc: "",
      buttonText: "Join Virtual Queue",
      buttonDisabled: false,
      buttonIcon: "person-add" as const,
      btnStyle: "bg-primary text-white",
      metricPeople: `${facility.defaultMetrics.inLine}`,
      metricWait: `~${facility.defaultMetrics.estWaitMins}`,
      metricServing: facility.defaultMetrics.serving,
      metricNext: facility.defaultMetrics.next,
      capacityPct: "60%",
      capacityText: `${facility.defaultMetrics.capacityCurrent} / ${facility.defaultMetrics.capacityMax} active slots`,
    },
    full: {
      showBanner: true,
      bannerBg: "bg-amber-50 border border-amber-200",
      bannerIcon: "warning" as const,
      bannerIconColor: "#D97706",
      bannerTitle: "Queue is currently full",
      bannerDesc: "Maximum simultaneous capacity reached. Check back in 15 min or view nearby urgent care.",
      buttonText: "Queue Full",
      buttonDisabled: true,
      buttonIcon: "ban" as const,
      btnStyle: "bg-[#EAEDFF] text-[#434655] opacity-60",
      metricPeople: `${facility.defaultMetrics.capacityMax}`,
      metricWait: "~55",
      metricServing: facility.defaultMetrics.serving,
      metricNext: "On Hold",
      capacityPct: "100%",
      capacityText: `${facility.defaultMetrics.capacityMax} / ${facility.defaultMetrics.capacityMax} slots (At Capacity)`,
    },
    paused: {
      showBanner: true,
      bannerBg: "bg-[#EAEDFF] border border-[#E2E7FF]",
      bannerIcon: "pause-circle" as const,
      bannerIconColor: "#1E40AF",
      bannerTitle: "Queue Temporarily Paused",
      bannerDesc: "Staff are completing doctor handoff rounds. Estimating intake resumption within 10 minutes.",
      buttonText: "Intake Paused",
      buttonDisabled: true,
      buttonIcon: "hourglass" as const,
      btnStyle: "bg-[#EAEDFF] text-[#434655] opacity-60",
      metricPeople: `${facility.defaultMetrics.inLine}`,
      metricWait: "Paused",
      metricServing: facility.defaultMetrics.serving,
      metricNext: facility.defaultMetrics.next,
      capacityPct: "60%",
      capacityText: "Rounds in progress",
    },
    closed: {
      showBanner: true,
      bannerBg: "bg-red-50 border border-red-200",
      bannerIcon: "calendar" as const,
      bannerIconColor: "#BA1A1A",
      bannerTitle: "Queue Closed for Today",
      bannerDesc: "Daily patient allocations filled. Registration opens tomorrow promptly at 8:00 AM.",
      buttonText: "Clinic Closed",
      buttonDisabled: true,
      buttonIcon: "lock-closed" as const,
      btnStyle: "bg-[#EAEDFF] text-[#434655] opacity-60",
      metricPeople: "0",
      metricWait: "--",
      metricServing: "Ended",
      metricNext: "--",
      capacityPct: "0%",
      capacityText: "Closed for intake",
    },
    joined: {
      showBanner: true,
      bannerBg: "bg-emerald-50 border border-emerald-200",
      bannerIcon: "shield-checkmark" as const,
      bannerIconColor: "#007D55",
      bannerTitle: "You are currently in line (#A-047)",
      bannerDesc: "Estimated call in ~14 mins. Keep app notifications enabled for counter announcements.",
      bannerAction: "View Ticket",
      buttonText: "View Active Ticket (#A-047)",
      buttonDisabled: false,
      buttonIcon: "ticket" as const,
      btnStyle: "bg-emerald-600 text-white items-start pl-6",
      metricPeople: `${facility.defaultMetrics.inLine}`,
      metricWait: "~14",
      metricServing: facility.defaultMetrics.serving,
      metricNext: facility.defaultMetrics.next,
      capacityPct: "60%",
      capacityText: "Your position: 3rd in line",
    },
  }[clinicState];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Floating Animated Toast */}
      {toastMessage && (
        <Animated.View
          style={{
            transform: [{ translateY: toastAnim }],
            opacity: toastOpacity,
          }}
          className="absolute top-14 left-4 right-4 z-50 self-center"
        >
          <View className="bg-[#131B2E] px-4 py-3 rounded-2xl shadow-xl flex-row items-center gap-3 border border-white/10">
            <Ionicons name={toastIcon} size={22} color="#6FFBBE" />
            <Text className="text-[13px] font-medium text-white flex-1">
              {toastMessage}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Screen Navigation Header */}
      <View className="h-14 px-4 bg-white/85 border-b border-[#E2E8F0] flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 min-w-0 flex-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-slate-100"
          >
            <Ionicons name="chevron-back" size={24} color="#131B2E" />
          </TouchableOpacity>

          <View className="w-7 h-7 rounded-lg bg-[#FAF8FF] border border-[#E2E8F0] p-1 items-center justify-center shrink-0">
            <Image
              source={require("../../assets/images/queueup-logo.png")}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          <Text
            numberOfLines={1}
            className="text-[18px] font-bold text-[#131B2E] tracking-tight ml-1 flex-1"
          >
            Queue Details
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 shrink-0">
          <TouchableOpacity
            onPress={toggleFavorite}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-slate-100"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#EF4444" : "#434655"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Share Queue",
                `Invite others to view ${facility.name} on QueueUp.`
              )
            }
            className="w-10 h-10 rounded-full items-center justify-center active:bg-slate-100"
          >
            <Ionicons name="share-outline" size={22} color="#434655" />
          </TouchableOpacity>

          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center ml-0.5 shadow-2xs">
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Scrollable Screen Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1"
      >
        {/* Dynamic Notification Banner */}
        {stateConfigs.showBanner && (
          <View className="px-4 pt-3">
            <View
              className={`p-3.5 rounded-2xl flex-row items-start gap-2.5 shadow-2xs ${stateConfigs.bannerBg}`}
            >
              <Ionicons
                name={stateConfigs.bannerIcon}
                size={20}
                color={stateConfigs.bannerIconColor}
                style={{ marginTop: 1 }}
              />
              <View className="flex-1">
                <Text className="text-[13px] font-bold text-[#131B2E]">
                  {stateConfigs.bannerTitle}
                </Text>
                <Text className="text-[12px] text-[#434655] mt-0.5 leading-snug">
                  {stateConfigs.bannerDesc}
                </Text>
              </View>
              {clinicState === "joined" && (
                <TouchableOpacity
                  onPress={() => router.push("/ticket/A-047" as any)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 self-center"
                >
                  <Text className="text-[11px] font-bold text-white">
                    View Ticket
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Business Hero Canvas */}
        <View className="px-4 pt-3">
          <View className="relative w-full h-48 rounded-2xl overflow-hidden shadow-sm bg-[#EAEDFF]">
            <Image
              source={{ uri: facility.heroImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Gradient Overlay */}
            <View className="absolute inset-0 bg-black/30" />

            {/* Live Operational Status Pill */}
            <View className="absolute top-3 left-3 flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 shadow-2xs">
              <Animated.View
                style={{ opacity: pulseAnim }}
                className="w-2 h-2 rounded-full bg-emerald-500"
              />
              <Text className="text-[12px] font-bold text-emerald-800 tracking-wide">
                {clinicState === "closed"
                  ? "Closed for Today"
                  : clinicState === "paused"
                  ? "Intake Paused"
                  : clinicState === "full"
                  ? "Queue Full"
                  : "Open • Accepting Queue"}
              </Text>
            </View>

            {/* Bottom Floating Badges */}
            <View className="absolute bottom-3 left-3 right-3 flex-row justify-between items-center">
              <View className="flex-row items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full shadow-2xs">
                <Ionicons name="checkmark-circle" size={15} color="#007D55" />
                <Text className="text-[10px] font-bold text-[#131B2E] uppercase tracking-wider">
                  Verified Provider
                </Text>
              </View>

              <View className="flex-row items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full shadow-2xs">
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text className="text-[12px] font-bold text-[#131B2E]">
                  {facility.rating}
                </Text>
                <Text className="text-[11px] text-[#434655]">
                  ({facility.reviews})
                </Text>
              </View>
            </View>
          </View>

          {/* Clinic Headline & Metadata */}
          <View className="mt-3.5 gap-1">
            <View className="flex-row items-center justify-between gap-2">
              <Text
                numberOfLines={1}
                className="text-[22px] font-bold text-[#131B2E] tracking-tight flex-1"
              >
                {facility.name}
              </Text>
              <View className="px-3 py-1 bg-[#DBE1FF] rounded-full">
                <Text className="text-[11px] font-bold text-[#00174B] uppercase tracking-wide">
                  {facility.category}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-1.5 text-[13px]">
              <Ionicons name="navigate" size={14} color="#2563EB" />
              <Text className="text-[13px] font-bold text-primary">
                {facility.distance}
              </Text>
              <Text className="text-[#94A3B8]">•</Text>
              <Text numberOfLines={1} className="text-[13px] text-[#434655] flex-1">
                {facility.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive State Switcher / Simulation Sandbox */}
        <View className="px-4 mt-4">
          <View className="bg-[#F2F3FF] p-2 rounded-2xl border border-[#E2E7FF]">
            <View className="flex-row items-center justify-between mb-1.5 px-1">
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Simulate Clinic State
              </Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="options-outline" size={12} color="#2563EB" />
                <Text className="text-[10px] font-bold text-primary uppercase">
                  Interactive
                </Text>
              </View>
            </View>

            <View className="flex-row gap-1 bg-[#DAE2FD] p-1 rounded-xl">
              {(["normal", "full", "paused", "closed", "joined"] as const).map(
                (st) => {
                  const isSel = clinicState === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      onPress={() => handleStateChange(st)}
                      className={`flex-1 py-1.5 rounded-lg items-center justify-center transition-all ${
                        isSel ? "bg-white shadow-xs" : ""
                      }`}
                    >
                      <Text
                        className={`text-[10px] uppercase font-bold ${
                          isSel ? "text-primary" : "text-[#434655]"
                        }`}
                      >
                        {st}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </View>
        </View>

        {/* Signature Digital Telemetry Canvas Card */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-[#E2E7FF] overflow-hidden">
            {/* Top Accent Gradient Bar */}
            <View className="h-1.5 w-full bg-[#2563EB]" />

            <View className="p-4 gap-4">
              {/* Telemetry Header */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Animated.View
                    style={{ opacity: pulseAnim }}
                    className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                  />
                  <Text className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Live Pulse Telemetry
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="sync" size={13} color="#434655" />
                  <Text className="text-[11px] text-[#434655]">
                    Synced just now
                  </Text>
                </View>
              </View>

              {/* 2x2 Spotlight Grid */}
              <View className="flex-row gap-2.5">
                {/* Metric 1: In Line */}
                <View className="flex-1 bg-[#F2F3FF] p-3 rounded-xl justify-between">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      In Line
                    </Text>
                    <Ionicons name="people" size={16} color="#2563EB" />
                  </View>
                  <View className="flex-row items-baseline mt-2">
                    <Text className="text-[28px] font-bold text-[#131B2E] leading-none">
                      {stateConfigs.metricPeople}
                    </Text>
                    <Text className="text-[11px] text-[#434655] ml-1">
                      patients
                    </Text>
                  </View>
                </View>

                {/* Metric 2: Est Wait */}
                <View className="flex-1 bg-[#F2F3FF] p-3 rounded-xl justify-between">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Est. Wait
                    </Text>
                    <Ionicons name="time" size={16} color="#1E40AF" />
                  </View>
                  <View className="flex-row items-baseline mt-2">
                    <Text className="text-[28px] font-bold text-primary leading-none">
                      {stateConfigs.metricWait}
                    </Text>
                    <Text className="text-[11px] text-[#434655] ml-1">mins</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2.5">
                {/* Metric 3: Now Serving */}
                <View className="flex-1 bg-[#EAEDFF] p-3 rounded-xl justify-between">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Now Serving
                    </Text>
                    <Ionicons name="person-circle-outline" size={15} color="#007D55" />
                  </View>
                  <View className="flex-row items-baseline gap-1 mt-2">
                    <Text className="text-[20px] font-extrabold text-[#131B2E]">
                      {stateConfigs.metricServing}
                    </Text>
                    <Text className="text-[11px] font-bold text-emerald-800">
                      Counter 2
                    </Text>
                  </View>
                </View>

                {/* Metric 4: Next Ticket */}
                <View className="flex-1 bg-[#EAEDFF] p-3 rounded-xl justify-between">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Next Ticket
                    </Text>
                    <Ionicons name="ticket" size={15} color="#2563EB" />
                  </View>
                  <View className="flex-row items-baseline gap-1 mt-2">
                    <Text className="text-[20px] font-extrabold text-primary">
                      {stateConfigs.metricNext}
                    </Text>
                    <Text className="text-[11px] text-[#434655]">
                      Yours if joined
                    </Text>
                  </View>
                </View>
              </View>

              {/* Capacity Flow Bar */}
              <View className="gap-1.5 pt-1">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="speedometer-outline" size={14} color="#434655" />
                    <Text className="text-[12px] font-medium text-[#434655]">
                      Capacity Utilization
                    </Text>
                  </View>
                  <Text className="text-[12px] font-bold text-[#131B2E]">
                    {stateConfigs.capacityText}
                  </Text>
                </View>

                <View className="w-full h-2 bg-[#DAE2FD] rounded-full overflow-hidden">
                  <View
                    style={{ width: stateConfigs.capacityPct as any }}
                    className="h-full bg-primary rounded-full"
                  />
                </View>

                <View className="flex-row items-center justify-between text-[11px]">
                  <Text className="text-[11px] text-[#434655]">
                    Fluid throughput
                  </Text>
                  <Text className="text-[11px] font-bold text-emerald-700">
                    Optimal Pace
                  </Text>
                </View>
              </View>
            </View>

            {/* Dashed Perforation divider with Physical Notch Inserts */}
            <View className="relative flex-row items-center justify-between w-full my-1">
              {/* Left Notch */}
              <View className="w-4 h-6 bg-[#CBD5E1] rounded-r-full -ml-1" />
              {/* Dashed line */}
              <View className="flex-1 border-b-2 border-dashed border-[#CBD5E1] mx-2" />
              {/* Right Notch */}
              <View className="w-4 h-6 bg-[#CBD5E1] rounded-l-full -mr-1" />
            </View>

            {/* Telemetry Sub-row Information */}
            <View className="px-4 py-3 gap-2 bg-white">
              <View className="flex-row items-center justify-between text-[13px]">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="timer-outline" size={16} color="#2563EB" />
                  <Text className="text-[13px] text-[#434655]">
                    Avg. Consultation Time
                  </Text>
                </View>
                <Text className="text-[13px] font-bold text-[#131B2E]">
                  ~4 min / person
                </Text>
              </View>

              <View className="flex-row items-center justify-between text-[13px]">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="person-circle-outline" size={16} color="#2563EB" />
                  <Text className="text-[13px] text-[#434655]">
                    Active Desk Leader
                  </Text>
                </View>
                <Text className="text-[13px] font-bold text-[#131B2E]">
                  {facility.leadCounter} ({facility.leadDoctor})
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Facility Operations Section */}
        <View className="px-4 mt-5 gap-2.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-[#131B2E]">
              Facility Operations
            </Text>
            <View className="px-2.5 py-0.5 rounded-full bg-emerald-100">
              <Text className="text-[11px] font-bold text-emerald-800">
                {facility.countersStatus}
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 border border-[#E2E7FF] shadow-2xs gap-3.5">
            {/* Service Window */}
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center shrink-0">
                <Ionicons name="time-outline" size={18} color="#2563EB" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[13px] font-bold text-[#131B2E]">
                    Service Window
                  </Text>
                  <View className="px-2 py-0.5 rounded-full bg-[#DBE1FF]">
                    <Text className="text-[10px] font-bold text-primary uppercase">
                      {facility.serviceClosingNotice}
                    </Text>
                  </View>
                </View>
                <Text className="text-[13px] text-[#434655] mt-0.5">
                  {facility.operatingHours}
                </Text>
              </View>
            </View>

            {/* Doctors on Duty */}
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center shrink-0">
                <Ionicons name="medkit-outline" size={18} color="#1E40AF" />
              </View>
              <View className="flex-1">
                <Text className="text-[13px] font-bold text-[#131B2E]">
                  Doctors on Duty
                </Text>
                <View className="mt-1 gap-1">
                  {facility.doctors.map((doc) => (
                    <View
                      key={doc.name}
                      className="flex-row items-center justify-between"
                    >
                      <Text className="text-[13px] font-semibold text-[#131B2E]">
                        {doc.name}
                      </Text>
                      <Text className="text-[12px] text-[#434655]">
                        {doc.dept}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Amenities Chips */}
            <View className="flex-row items-center gap-2 flex-wrap pt-1 border-t border-[#F1F5F9]">
              {facility.amenities.map((am) => (
                <View
                  key={am.name}
                  className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F2F3FF]"
                >
                  <Ionicons name={am.icon} size={14} color="#434655" />
                  <Text className="text-[11px] font-medium text-[#434655]">
                    {am.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Location & Arrival Section */}
        <View className="px-4 mt-5 gap-2.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-[#131B2E]">
              Location & Arrival
            </Text>
            <TouchableOpacity
              onPress={() =>
                showToast(`Opening maps for ${facility.address}`, "map")
              }
            >
              <Text className="text-[13px] font-semibold text-primary">
                Open in Maps
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map Preview Container */}
          <View className="relative w-full h-36 rounded-2xl overflow-hidden shadow-2xs border border-[#E2E7FF] bg-[#EAEDFF] justify-center items-center">
            {/* Grid pattern / map background simulation */}
            <View className="absolute inset-0 bg-[#E2E8F0]/70" />

            {/* Animated Pin Marker in Center */}
            <View className="items-center justify-center">
              <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center">
                <View className="w-7 h-7 rounded-full bg-primary items-center justify-center shadow-md">
                  <Ionicons name="medkit" size={16} color="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Parking Caption Pill at bottom */}
            <View className="absolute bottom-2 left-2 right-2 bg-white/95 rounded-xl px-3 py-1.5 flex-row items-center justify-between shadow-2xs">
              <Text
                numberOfLines={1}
                className="text-[12px] font-semibold text-[#131B2E] flex-1 mr-2"
              >
                Parking available behind Building B
              </Text>
              <Text className="text-[11px] font-bold text-emerald-700">
                Free 2h
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Quick-Action Bar */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-[#E2E7FF] px-4 pt-3 shadow-lg"
      >
        <View className="flex-row items-center gap-2.5">
          {/* Call Clinic Action */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              showToast(`Dialing Reception: ${facility.phone}`, "call")
            }
            className="w-12 h-12 rounded-xl bg-[#F2F3FF] items-center justify-center shadow-2xs active:bg-[#EAEDFF]"
          >
            <Ionicons name="call" size={20} color="#434655" />
          </TouchableOpacity>

          {/* Directions Action */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              showToast(
                `Calculating transit to ${facility.name}...`,
                "navigate"
              )
            }
            className="h-12 px-3.5 rounded-xl bg-[#F2F3FF] flex-row items-center gap-1.5 shadow-2xs active:bg-[#EAEDFF]"
          >
            <Ionicons name="navigate" size={17} color="#2563EB" />
            <Text className="text-[13px] font-bold text-[#131B2E]">
              Directions
            </Text>
          </TouchableOpacity>

          {/* Primary Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={stateConfigs.buttonDisabled}
            onPress={handlePrimaryAction}
            className={`flex-1 h-12 rounded-xl flex-row items-center justify-center gap-1 shadow-xs active:scale-[0.98] ${stateConfigs.btnStyle}`}
          >
            <Ionicons
              name={stateConfigs.buttonIcon}
              size={18}
              color={stateConfigs.buttonDisabled ? "#64748B" : "#FFFFFF"}
            />
            <Text
              className={`text-[14px] font-bold ${
                stateConfigs.buttonDisabled ? "text-[#64748B]" : "text-white"
              }`}
            >
              {stateConfigs.buttonText}
            </Text>
            {/* {!stateConfigs.buttonDisabled && (
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            )} */}
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen 7: Join Queue Confirmation Bottom Drawer */}
      <JoinQueueDrawer
        visible={isJoinDrawerVisible}
        onClose={() => setIsJoinDrawerVisible(false)}
        facility={facility}
      />
    </SafeAreaView>
  );
}
