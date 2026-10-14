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
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface PatientTicket {
  id: string;
  ticketNumber: string;
  name: string;
  waitTime: string;
  channel: "Virtual" | "Kiosk Walk-in";
  status: "Ready" | "In Range" | "Lobby" | "En Route";
  avatarUrl?: string;
  initials?: string;
  notes: string;
  mobilePass: string;
}

const INITIAL_WAITING_LIST: PatientTicket[] = [
  {
    id: "p-1",
    ticketNumber: "A-036",
    name: "John Doe",
    waitTime: "12 min",
    channel: "Virtual",
    status: "Ready",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_m_0ehsR9u81ABW4US-GYk5TC0E9dkgtSGA32Os4A3ZSE685dPEkXNksiK-vwax5dFRuThW0MgiTdroRaV-wrjzJSd0z_-pr9Nb-AX9_qs3oRXKQUgAp3WW56I-zK3X8PHwwHvHSlwjAJWtQuu4E_hOcBsN-gZVZT5VuMAsQQ2PnKqoO4WAHLlLAbMhf6oe_xbX4s2Y0Poc09nZBaJSvtzzU7rtvVYQi48oRHUQGUfvSS6sb2i78ixg",
    notes: "Requested bilingual documentation assistance if available.",
    mobilePass: "#4928",
  },
  {
    id: "p-2",
    ticketNumber: "A-037",
    name: "Sarah Jenkins",
    waitTime: "9 min",
    channel: "Virtual",
    status: "In Range",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3UXBKg_PY5z-aHyj9hiuKZDlBhID6-NB7tMByLrhUrri1z6epV8H9rY2LTuIHd7EELoRYykgOJF2oshHEUmfUiUhBmrc1kjm-DmbJU2btgsCvHHRh2Fe4gGGM2dQQGtJjPMuGZjgxWk4hGX6c3AFkSsxzZDBEhOtY82-9ZGoFeCWrLJL1VFvkpP7Jflh3p_VIN3x4gZAth_G05brAPdIn_6yJDgXOAdvTT4VDQeOk-d0J9zXIq9j5vg",
    notes: "Follow-up blood test result review.",
    mobilePass: "#5102",
  },
  {
    id: "p-3",
    ticketNumber: "A-038",
    name: "Alex Rivera",
    waitTime: "7 min",
    channel: "Kiosk Walk-in",
    status: "Lobby",
    initials: "AR",
    notes: "Annual workplace wellness physical exam.",
    mobilePass: "#5184",
  },
  {
    id: "p-4",
    ticketNumber: "A-039",
    name: "David Kim",
    waitTime: "4 min",
    channel: "Virtual",
    status: "En Route",
    initials: "DK",
    notes: "Prescription renewal authorization.",
    mobilePass: "#5240",
  },
];

export default function QueueManagementScreen() {
  const insets = useSafeAreaInsets();

  // Active Station Queue State
  const [activeDepartment, setActiveDepartment] = useState<
    "General Consultation" | "Pediatric Consultation"
  >("General Consultation");
  const [queueMode, setQueueMode] = useState<"Accepting" | "Paused" | "Closed">(
    "Accepting"
  );
  const [waitingCount, setWaitingCount] = useState<number>(24);
  const [estWaitTime, setEstWaitTime] = useState<number>(18);

  // Active Serving Patient
  const [servingPatient, setServingPatient] = useState<{
    ticketNumber: string;
    name: string;
    department: string;
    priority: boolean;
    avatarUrl: string;
    startTime: string;
  }>({
    ticketNumber: "A-035",
    name: "Michael Chang",
    department: "General Consultation • First Visit",
    priority: true,
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEw4YnGisf_5R3B3uAPXFXP02eMxNJxnAIADq9ED6Z6dvhv360T8y4g0t3XXW3KLsI6P3Z4I51EqOZJ-cSCPGdvLqjb05A2GzmytKB4zG_pqZh_aUvbpKq5jXKdLp2ijM8b-czQzOM65XXbVe4TgIevHmeFB7kRIYNWf_25DT71zQc3JK8q7Klha9M8sVevHiMBYdT7Yj2n0SDVwby-aYVTxonokA_KwMbNJUbFPmZdEbaa8F1cTbiiQ",
    startTime: "10:42 AM",
  });

  // Waiting Patients List
  const [waitingList, setWaitingList] =
    useState<PatientTicket[]>(INITIAL_WAITING_LIST);

  // Selected Patient Modal
  const [selectedPatient, setSelectedPatient] = useState<PatientTicket | null>(
    null
  );
  const [isOverflowMenuVisible, setIsOverflowMenuVisible] =
    useState<boolean>(false);

  // Live Session Timer (seconds elapsed in consultation)
  const [sessionSeconds, setSessionSeconds] = useState<number>(384); // 06:24

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Pulse & Soundwave Telemetry Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(8)).current;
  const waveAnim2 = useRef(new Animated.Value(14)).current;
  const waveAnim3 = useRef(new Animated.Value(6)).current;
  const waveAnim4 = useRef(new Animated.Value(12)).current;

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

    // Soundwave subtle oscillation
    const makeWave = (anim: Animated.Value, minH: number, maxH: number, dur: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: maxH,
            duration: dur,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: minH,
            duration: dur,
            useNativeDriver: false,
          }),
        ])
      );

    const l1 = makeWave(waveAnim1, 4, 12, 450);
    const l2 = makeWave(waveAnim2, 6, 16, 600);
    const l3 = makeWave(waveAnim3, 4, 10, 500);
    const l4 = makeWave(waveAnim4, 5, 14, 550);

    l1.start();
    l2.start();
    l3.start();
    l4.start();

    return () => {
      pulseLoop.stop();
      l1.stop();
      l2.stop();
      l3.stop();
      l4.stop();
    };
  }, [pulseAnim, waveAnim1, waveAnim2, waveAnim3, waveAnim4]);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string>(
    "Queue synchronized with customer passes"
  );
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
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

  // Next Candidate Ticket
  const nextTicket = waitingList[0]?.ticketNumber || "--";
  const nextPatientName = waitingList[0]?.name || "Next Customer";

  // ACTION: Call Next Ticket
  const handleCallNext = () => {
    if (waitingList.length === 0) {
      showToast("No further patients waiting in this queue.");
      return;
    }

    try {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    } catch {}

    const nextPatient = waitingList[0];
    const remaining = waitingList.slice(1);

    setServingPatient({
      ticketNumber: nextPatient.ticketNumber,
      name: nextPatient.name,
      department: `${activeDepartment} • Follow-up`,
      priority: nextPatient.status === "Ready",
      avatarUrl:
        nextPatient.avatarUrl ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBEw4YnGisf_5R3B3uAPXFXP02eMxNJxnAIADq9ED6Z6dvhv360T8y4g0t3XXW3KLsI6P3Z4I51EqOZJ-cSCPGdvLqjb05A2GzmytKB4zG_pqZh_aUvbpKq5jXKdLp2ijM8b-czQzOM65XXbVe4TgIevHmeFB7kRIYNWf_25DT71zQc3JK8q7Klha9M8sVevHiMBYdT7Yj2n0SDVwby-aYVTxonokA_KwMbNJUbFPmZdEbaa8F1cTbiiQ",
      startTime: "Just Now",
    });

    setWaitingList(remaining);
    setWaitingCount((prev) => Math.max(prev - 1, 0));
    setSessionSeconds(0);
    showToast(
      `Notified ${nextPatient.name} (${nextPatient.ticketNumber}) to proceed to Counter 2`
    );
  };

  // ACTION: Complete Serving Session
  const handleCompleteServing = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {}

    showToast(
      `Completed Ticket ${servingPatient.ticketNumber}. Station ready for next customer.`
    );
  };

  // ACTION: Skip / No Show
  const handleSkipTicket = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } catch {}

    Alert.alert(
      "Mark as No-Show?",
      `Ticket ${servingPatient.ticketNumber} (${servingPatient.name}) will be re-queued in standby.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Skip",
          style: "destructive",
          onPress: () => {
            showToast(
              `Marked Ticket ${servingPatient.ticketNumber} as No-Show. Re-queued in standby.`
            );
          },
        },
      ]
    );
  };

  // ACTION: Toggle Queue Pause
  const handleTogglePause = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}

    const newMode = queueMode === "Paused" ? "Accepting" : "Paused";
    setQueueMode(newMode);
    showToast(
      newMode === "Paused"
        ? "Queue intake paused for new check-ins."
        : "Queue intake resumed. Accepting patients."
    );
  };

  // ACTION: Close Queue
  const handleCloseQueue = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } catch {}

    Alert.alert(
      "Close Queue Intake?",
      `Are you sure you want to stop new check-ins and close ${activeDepartment}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Close Queue",
          style: "destructive",
          onPress: () => {
            setQueueMode("Closed");
            showToast("Queue closed to new entrants.");
          },
        },
      ]
    );
  };

  // ACTION: Call Specific Ticket from Row / Modal
  const handleCallSpecific = (ticket: PatientTicket) => {
    try {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    } catch {}

    setSelectedPatient(null);
    setServingPatient({
      ticketNumber: ticket.ticketNumber,
      name: ticket.name,
      department: `${activeDepartment} • Direct Call`,
      priority: true,
      avatarUrl:
        ticket.avatarUrl ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBEw4YnGisf_5R3B3uAPXFXP02eMxNJxnAIADq9ED6Z6dvhv360T8y4g0t3XXW3KLsI6P3Z4I51EqOZJ-cSCPGdvLqjb05A2GzmytKB4zG_pqZh_aUvbpKq5jXKdLp2ijM8b-czQzOM65XXbVe4TgIevHmeFB7kRIYNWf_25DT71zQc3JK8q7Klha9M8sVevHiMBYdT7Yj2n0SDVwby-aYVTxonokA_KwMbNJUbFPmZdEbaa8F1cTbiiQ",
      startTime: "Just Now",
    });
    setWaitingList((prev) => prev.filter((p) => p.id !== ticket.id));
    setWaitingCount((prev) => Math.max(prev - 1, 0));
    setSessionSeconds(0);
    showToast(`Called ticket ${ticket.ticketNumber} to Counter 2`);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Sticky Header matching Stitch Screen 21 */}
      <View className="h-16 px-4 bg-[#FAF8FF]/95 border-b border-[#EAEDFF] flex-row items-center justify-between z-30">
        <View className="flex-row items-center gap-1.5 flex-1 min-w-0">
          <TouchableOpacity
            accessibilityLabel="Go back"
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(business)/dashboard" as any);
              }
            }}
            className="w-10 h-10 -ml-1 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="arrow-back" size={22} color="#131B2E" />
          </TouchableOpacity>
          <Image
            source={require("@/assets/images/queueup-logo.png")}
            style={{ width: 26, height: 26 }}
            resizeMode="contain"
          />
          <Text
            numberOfLines={1}
            className="text-base font-bold text-[#131B2E] truncate ml-1"
          >
            Queue Manager
          </Text>
        </View>

        {/* Right Staff Avatar */}
        <TouchableOpacity
          accessibilityLabel="Staff Profile"
          activeOpacity={0.8}
          onPress={() => router.push("/(business)/dashboard" as any)}
          className="w-8 h-8 rounded-full bg-[#004AC6] items-center justify-center"
          style={styles.avatarShadow}
        >
          <Ionicons name="person" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 84,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Sync Banner */}
        <View className="px-4 pt-2.5 pb-1">
          <View className="flex-row items-center justify-between bg-[#F2F3FF] px-3.5 py-1.5 rounded-full border border-[#E2E8F0]">
            <View className="flex-row items-center gap-2 min-w-0 flex-1 mr-2">
              <Animated.View
                style={{ opacity: pulseAnim }}
                className="w-2 h-2 rounded-full bg-[#007D55]"
              />
              <Text
                numberOfLines={1}
                className="text-[10px] font-bold text-[#434655] uppercase tracking-wider truncate"
              >
                Live sync active with customer passes
              </Text>
            </View>
            <Text className="text-[10px] font-bold text-[#007D55] uppercase tracking-wider">
              120ms
            </Text>
          </View>
        </View>

        {/* Sub-Header & Queue Mode Status Bar */}
        <View className="px-4 py-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View
              className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full ${
                queueMode === "Accepting"
                  ? "bg-emerald-50"
                  : queueMode === "Paused"
                  ? "bg-amber-50"
                  : "bg-rose-50"
              }`}
            >
              <Animated.View
                style={{ opacity: pulseAnim }}
                className={`w-2 h-2 rounded-full ${
                  queueMode === "Accepting"
                    ? "bg-[#007D55]"
                    : queueMode === "Paused"
                    ? "bg-amber-600"
                    : "bg-[#BA1A1A]"
                }`}
              />
              <Text
                className={`text-xs font-bold ${
                  queueMode === "Accepting"
                    ? "text-[#007D55]"
                    : queueMode === "Paused"
                    ? "text-amber-800"
                    : "text-[#BA1A1A]"
                }`}
              >
                {queueMode === "Accepting"
                  ? "Accepting Customers"
                  : queueMode === "Paused"
                  ? "Intake Paused"
                  : "Queue Closed"}
              </Text>
            </View>
            <Text className="text-xs text-[#434655] font-medium">Counter 2</Text>
          </View>

          {/* Quick Overflow Control Trigger */}
          <TouchableOpacity
            accessibilityLabel="Queue Controls Menu"
            activeOpacity={0.8}
            onPress={() => setIsOverflowMenuVisible(true)}
            className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#131B2E" />
          </TouchableOpacity>
        </View>

        {/* Department Switcher Pills */}
        <View className="px-4 pb-2">
          <View className="flex-row gap-2 bg-[#EAEDFF]/70 p-1 rounded-xl">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                try {
                  Haptics.selectionAsync().catch(() => {});
                } catch {}
                setActiveDepartment("General Consultation");
                setWaitingCount(24);
                setEstWaitTime(18);
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg items-center justify-center ${
                activeDepartment === "General Consultation"
                  ? "bg-white shadow-xs"
                  : "bg-transparent"
              }`}
            >
              <Text
                numberOfLines={1}
                className={`text-xs font-bold ${
                  activeDepartment === "General Consultation"
                    ? "text-[#004AC6]"
                    : "text-[#434655]"
                }`}
              >
                General Consultation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                try {
                  Haptics.selectionAsync().catch(() => {});
                } catch {}
                setActiveDepartment("Pediatric Consultation");
                setWaitingCount(12);
                setEstWaitTime(25);
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg items-center justify-center ${
                activeDepartment === "Pediatric Consultation"
                  ? "bg-white shadow-xs"
                  : "bg-transparent"
              }`}
            >
              <Text
                numberOfLines={1}
                className={`text-xs font-bold ${
                  activeDepartment === "Pediatric Consultation"
                    ? "text-[#004AC6]"
                    : "text-[#434655]"
                }`}
              >
                Pediatric Clinic
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Queue Telemetry Bar (4-Column Grid Card) */}
        <View className="px-4 mb-3.5">
          <View
            className="bg-white rounded-2xl p-3.5 border border-[#EAEDFF] flex-row divide-x divide-[#EAEDFF]"
            style={styles.cardShadow}
          >
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Waiting
              </Text>
              <Text className="text-xl font-extrabold text-[#131B2E] mt-0.5">
                {waitingCount}
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Serving
              </Text>
              <Text className="text-xl font-extrabold text-[#004AC6] mt-0.5">
                {servingPatient.ticketNumber}
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Next
              </Text>
              <Text className="text-xl font-extrabold text-[#3755C3] mt-0.5">
                {nextTicket}
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Est. Wait
              </Text>
              <View className="flex-row items-baseline mt-0.5">
                <Text className="text-xl font-extrabold text-[#007D55]">
                  {estWaitTime}
                </Text>
                <Text className="text-xs text-[#007D55] font-semibold">m</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Enormous Prominent Primary Action (Dominant Thumb-Action Hero Card) */}
        <View className="px-4 mb-4">
          <View
            className="relative overflow-hidden rounded-2xl bg-[#2563EB] p-4 text-white"
            style={styles.heroActionShadow}
          >
            {/* Ambient Background Glow Accents */}
            <View className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
            <View className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-blue-400/20 blur-xl" />

            <View className="relative z-10 flex-col items-center text-center">
              <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 mb-3">
                <Ionicons name="megaphone" size={14} color="#FFFFFF" />
                <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Station Alert Ready
                </Text>
              </View>

              <TouchableOpacity
                accessibilityLabel={`Call Next ${nextTicket}`}
                activeOpacity={0.85}
                onPress={handleCallNext}
                className="w-full py-3.5 px-4 rounded-xl bg-white flex-row items-center justify-center gap-2 active:bg-slate-100 shadow-md"
              >
                <Ionicons name="volume-high" size={24} color="#2563EB" />
                <Text className="text-base font-extrabold text-[#2563EB]">
                  {`CALL NEXT (${nextTicket})`}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center justify-center gap-1.5 mt-2.5">
                <Ionicons name="radio-outline" size={13} color="#DBE1FF" />
                <Text
                  numberOfLines={1}
                  className="text-xs text-[#EEEFFF] font-medium truncate"
                >
                  {`Will send audio chime & SMS prompt to ${nextPatientName}`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Currently Serving Card (Elevated Focus Area) */}
        <View className="px-4 mb-4">
          <View
            className="bg-white rounded-2xl p-4 border border-[#EAEDFF] flex-col gap-3"
            style={styles.cardShadow}
          >
            {/* Card Header */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Animated.View
                  style={{ opacity: pulseAnim }}
                  className="w-2.5 h-2.5 rounded-full bg-[#004AC6]"
                />
                <Text className="text-sm font-bold text-[#131B2E]">
                  Currently Serving • Counter 2
                </Text>
              </View>

              {/* Live Wave Telemetry Animation */}
              <View className="flex-row items-end gap-1 h-4 px-2 py-0.5 bg-[#EAEDFF] rounded-full">
                <Animated.View
                  style={{ height: waveAnim1 }}
                  className="w-1 bg-[#004AC6] rounded-full"
                />
                <Animated.View
                  style={{ height: waveAnim2 }}
                  className="w-1 bg-[#004AC6] rounded-full"
                />
                <Animated.View
                  style={{ height: waveAnim3 }}
                  className="w-1 bg-[#004AC6] rounded-full"
                />
                <Animated.View
                  style={{ height: waveAnim4 }}
                  className="w-1 bg-[#004AC6] rounded-full"
                />
              </View>
            </View>

            {/* Ticket & Customer Bio Split */}
            <View className="bg-[#F2F3FF] p-3 rounded-xl flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 min-w-0 flex-1 mr-2">
                <View className="w-12 h-12 rounded-xl overflow-hidden bg-[#EAEDFF] flex-shrink-0">
                  <Image
                    source={{ uri: servingPatient.avatarUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-col min-w-0 flex-1">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-base font-extrabold text-[#004AC6]">
                      {servingPatient.ticketNumber}
                    </Text>
                    {servingPatient.priority && (
                      <View className="bg-[#004AC6]/10 px-1.5 py-0.5 rounded">
                        <Text className="text-[9px] font-bold text-[#004AC6]">
                          Priority
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-xs font-semibold text-[#131B2E] truncate"
                  >
                    {servingPatient.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-[11px] text-[#737686] truncate"
                  >
                    {servingPatient.department}
                  </Text>
                </View>
              </View>

              <View className="items-end flex-shrink-0 pl-1">
                <Text className="text-[9px] font-bold text-[#737686] uppercase tracking-wider">
                  Elapsed
                </Text>
                <Text className="text-sm font-bold text-[#007D55]">
                  {formatTimer(sessionSeconds)}
                </Text>
                <Text className="text-[10px] text-[#737686]">
                  {`Since ${servingPatient.startTime}`}
                </Text>
              </View>
            </View>

            {/* Station Dual Actions */}
            <View className="flex-row gap-2 pt-0.5">
              <TouchableOpacity
                accessibilityLabel="Skip / No Show"
                activeOpacity={0.8}
                onPress={handleSkipTicket}
                className="flex-1 h-11 rounded-xl bg-[#EAEDFF] flex-row items-center justify-center gap-1.5 active:bg-[#DAE2FD]"
              >
                <Ionicons name="play-forward-outline" size={17} color="#131B2E" />
                <Text className="text-xs font-bold text-[#131B2E]">
                  Skip / No Show
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Complete Service"
                activeOpacity={0.8}
                onPress={handleCompleteServing}
                className="flex-1 h-11 rounded-xl bg-[#007D55] flex-row items-center justify-center gap-1.5 active:bg-[#006242]"
                style={styles.completeButtonShadow}
              >
                <Ionicons name="checkmark-circle" size={17} color="#FFFFFF" />
                <Text className="text-xs font-bold text-white">Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Waiting Queue Section Header */}
        <View className="px-4 mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-bold text-[#131B2E]">
              Waiting Queue
            </Text>
            <View className="bg-[#EAEDFF] px-2 py-0.5 rounded-full">
              <Text className="text-[11px] font-bold text-[#434655]">
                {waitingList.length}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1">
            <TouchableOpacity
              accessibilityLabel="Search tickets"
              activeOpacity={0.7}
              onPress={() => showToast("Search filter enabled")}
              className="w-8 h-8 rounded-full items-center justify-center text-[#737686] active:bg-[#EAEDFF]"
            >
              <Ionicons name="search-outline" size={18} color="#737686" />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel="Sort tickets"
              activeOpacity={0.7}
              onPress={() => {
                setWaitingList((prev) => [...prev].reverse());
                showToast("Queue sort order inverted");
              }}
              className="w-8 h-8 rounded-full items-center justify-center text-[#737686] active:bg-[#EAEDFF]"
            >
              <Ionicons name="swap-vertical-outline" size={18} color="#737686" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Interactive Live Ordered Queue List */}
        <View className="px-4 space-y-2 mb-4">
          {waitingList.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => setSelectedPatient(item)}
              className="bg-white rounded-2xl p-3 border border-[#EAEDFF] flex-row items-center justify-between active:bg-[#FAF8FF] mb-2"
              style={styles.cardShadow}
            >
              <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
                {/* Position Index Badge */}
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center flex-shrink-0 ${
                    index === 0
                      ? "bg-[#DDE1FF] text-[#001453]"
                      : "bg-[#EAEDFF] text-[#434655]"
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      index === 0 ? "text-[#001453]" : "text-[#434655]"
                    }`}
                  >
                    {`#${index + 1}`}
                  </Text>
                </View>

                {/* Avatar / Initials */}
                {item.avatarUrl ? (
                  <View className="w-10 h-10 rounded-full overflow-hidden bg-[#EAEDFF] flex-shrink-0">
                    <Image
                      source={{ uri: item.avatarUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View className="w-10 h-10 rounded-full bg-[#DAE2FD] items-center justify-center flex-shrink-0">
                    <Text className="text-xs font-bold text-[#004AC6]">
                      {item.initials}
                    </Text>
                  </View>
                )}

                {/* Patient Information */}
                <View className="flex-col min-w-0 flex-1">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-sm font-bold text-[#131B2E]">
                      {item.ticketNumber}
                    </Text>
                    <View
                      className={`px-1.5 py-0.5 rounded-full ${
                        item.status === "Ready"
                          ? "bg-emerald-50"
                          : "bg-[#EAEDFF]"
                      }`}
                    >
                      <Text
                        className={`text-[9px] font-bold ${
                          item.status === "Ready"
                            ? "text-[#007D55]"
                            : "text-[#434655]"
                        }`}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-xs font-semibold text-[#131B2E] truncate"
                  >
                    {item.name}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Ionicons
                      name={
                        item.channel === "Virtual"
                          ? "phone-portrait-outline"
                          : "desktop-outline"
                      }
                      size={11}
                      color="#737686"
                    />
                    <Text className="text-[11px] text-[#737686]">
                      {`${item.channel} • ${item.waitTime} waiting`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Action: Call Pill on #1, Chevron on Others */}
              {index === 0 ? (
                <TouchableOpacity
                  accessibilityLabel={`Call ${item.ticketNumber}`}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleCallSpecific(item);
                  }}
                  className="h-8 px-3 rounded-full bg-[#004AC6] flex-row items-center gap-1 active:bg-[#003EA8]"
                >
                  <Ionicons name="call" size={13} color="#FFFFFF" />
                  <Text className="text-xs font-bold text-white">Call</Text>
                </TouchableOpacity>
              ) : (
                <Ionicons name="chevron-forward" size={18} color="#737686" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Queue Station Administration Control Footer Card */}
        <View className="px-4 mb-4">
          <View
            className="bg-[#F2F3FF] rounded-2xl p-3.5 border border-[#EAEDFF]"
            style={styles.cardShadow}
          >
            <View className="flex-row items-center justify-between mb-2.5">
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Queue Controls
              </Text>
              <Text className="text-xs text-[#737686] font-medium">
                Session #482
              </Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                accessibilityLabel="Pause or Resume Queue"
                activeOpacity={0.8}
                onPress={handleTogglePause}
                className="flex-1 h-11 rounded-xl bg-white border border-[#EAEDFF] flex-row items-center justify-center gap-1 active:bg-[#FAF8FF]"
              >
                <Ionicons
                  name={queueMode === "Paused" ? "play" : "pause"}
                  size={16}
                  color="#131B2E"
                />
                <Text className="text-xs font-bold text-[#131B2E]">
                  {queueMode === "Paused" ? "Resume" : "Pause"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Queue Settings"
                activeOpacity={0.8}
                onPress={() => router.push("/(business)/edit-queue" as any)}
                className="flex-1 h-11 rounded-xl bg-white border border-[#EAEDFF] flex-row items-center justify-center gap-1 active:bg-[#FAF8FF]"
              >
                <Ionicons name="options-outline" size={16} color="#131B2E" />
                <Text className="text-xs font-bold text-[#131B2E]">Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Close Queue"
                activeOpacity={0.8}
                onPress={handleCloseQueue}
                className="flex-1 h-11 rounded-xl bg-[#FFDAD6] border border-[#BA1A1A]/20 flex-row items-center justify-center gap-1 active:bg-[#FFDAD6]/70"
              >
                <Ionicons name="power" size={16} color="#93000A" />
                <Text className="text-xs font-bold text-[#93000A]">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Realtime Station Toast (Bottom floating banner) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.liveToast,
          {
            opacity: toastAnim,
            bottom: Math.max(insets.bottom, 12) + 68,
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
        <View className="flex-row items-center gap-2 flex-1 min-w-0">
          <Ionicons name="sync" size={17} color="#6FFBBE" />
          <Text
            numberOfLines={1}
            className="text-xs font-semibold text-white truncate"
          >
            {toastMessage}
          </Text>
        </View>
        <Text className="text-[10px] font-bold text-white/70 uppercase tracking-wider flex-shrink-0">
          JUST NOW
        </Text>
      </Animated.View>

      {/* Bottom Staff Shell Navigation Bar matching Screen 20 */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 10) }}
        className="bg-[#FAF8FF]/95 border-t border-[#EAEDFF] absolute bottom-0 left-0 right-0 z-20"
      >
        <View className="h-16 px-2 flex-row items-center justify-around max-w-md mx-auto w-full">
          {/* Tab 1: Dashboard */}
          <TouchableOpacity
            accessibilityLabel="Dashboard tab"
            activeOpacity={0.7}
            onPress={() => router.push("/(business)/dashboard" as any)}
            className="flex-1 items-center justify-center py-1"
          >
            <Ionicons name="grid-outline" size={22} color="#434655" />
            <Text className="text-[11px] font-medium text-[#434655] mt-0.5">
              Dashboard
            </Text>
          </TouchableOpacity>

          {/* Tab 2: Queues (Active) */}
          <TouchableOpacity
            accessibilityLabel="Queues tab"
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-1"
          >
            <Ionicons name="list" size={22} color="#004AC6" />
            <Text className="text-[11px] font-bold text-[#004AC6] mt-0.5">
              Queues
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Customers */}
          <TouchableOpacity
            accessibilityLabel="Customers tab"
            activeOpacity={0.7}
            onPress={() => showToast("Opening Customer Roster...")}
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
            onPress={() => showToast("Opening Clinic Telemetry...")}
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

      {/* Customer Detail Drawer Modal */}
      <Modal
        visible={Boolean(selectedPatient)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPatient(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSelectedPatient(null)}
          className="flex-1 bg-black/40 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-t-3xl p-5 border-t border-[#EAEDFF]"
            style={{ paddingBottom: Math.max(insets.bottom, 20) + 12 }}
          >
            <View className="w-12 h-1.5 rounded-full bg-[#DAE2FD] self-center mb-4" />

            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl font-black text-[#004AC6]">
                  {selectedPatient?.ticketNumber}
                </Text>
                <View className="bg-[#EAEDFF] px-2.5 py-0.5 rounded-full">
                  <Text className="text-[10px] font-bold text-[#434655]">
                    {selectedPatient?.channel}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                accessibilityLabel="Close details"
                activeOpacity={0.7}
                onPress={() => setSelectedPatient(null)}
                className="w-8 h-8 rounded-full bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
              >
                <Ionicons name="close" size={18} color="#131B2E" />
              </TouchableOpacity>
            </View>

            {/* Customer Identity */}
            <View className="mb-3">
              <Text className="text-lg font-bold text-[#131B2E]">
                {selectedPatient?.name}
              </Text>
              <Text className="text-xs text-[#737686] mt-0.5">
                {`Waited ${selectedPatient?.waitTime} • Verified Mobile Pass ${selectedPatient?.mobilePass}`}
              </Text>
            </View>

            {/* Notes Box */}
            <View className="bg-[#F2F3FF] p-3.5 rounded-xl flex-col gap-1 mb-4 border border-[#EAEDFF]">
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Customer Notes
              </Text>
              <Text className="text-xs text-[#131B2E] leading-relaxed">
                {selectedPatient?.notes}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                accessibilityLabel="Call Directly"
                activeOpacity={0.8}
                onPress={() => {
                  if (selectedPatient) {
                    handleCallSpecific(selectedPatient);
                  }
                }}
                className="flex-1 h-12 rounded-xl bg-[#004AC6] flex-row items-center justify-center gap-2 active:bg-[#003EA8]"
                style={styles.primaryButtonShadow}
              >
                <Ionicons name="volume-high" size={18} color="#FFFFFF" />
                <Text className="text-sm font-bold text-white">
                  Call Directly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Dismiss Modal"
                activeOpacity={0.8}
                onPress={() => setSelectedPatient(null)}
                className="flex-1 h-12 rounded-xl bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
              >
                <Text className="text-sm font-bold text-[#131B2E]">Dismiss</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Quick Overflow Dropdown Modal */}
      <Modal
        visible={isOverflowMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOverflowMenuVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsOverflowMenuVisible(false)}
          className="flex-1 bg-black/30 justify-center px-6"
        >
          <View className="bg-white rounded-2xl p-2.5 shadow-2xl border border-[#EAEDFF] max-w-sm w-full mx-auto">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsOverflowMenuVisible(false);
                handleTogglePause();
              }}
              className="flex-row items-center gap-3 px-3.5 py-3 rounded-xl active:bg-[#F2F3FF]"
            >
              <Ionicons
                name={queueMode === "Paused" ? "play-circle-outline" : "pause-circle-outline"}
                size={20}
                color="#434655"
              />
              <Text className="text-sm font-semibold text-[#131B2E]">
                {queueMode === "Paused" ? "Resume Inflow" : "Pause Inflow"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsOverflowMenuVisible(false);
                router.push("/(business)/edit-queue" as any);
              }}
              className="flex-row items-center gap-3 px-3.5 py-3 rounded-xl active:bg-[#F2F3FF]"
            >
              <Ionicons name="settings-outline" size={20} color="#434655" />
              <Text className="text-sm font-semibold text-[#131B2E]">
                Counter Routing & Settings
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-[#EAEDFF] my-1" />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsOverflowMenuVisible(false);
                handleCloseQueue();
              }}
              className="flex-row items-center gap-3 px-3.5 py-3 rounded-xl active:bg-[#FFDAD6]/50"
            >
              <Ionicons name="ban" size={20} color="#BA1A1A" />
              <Text className="text-sm font-bold text-[#BA1A1A]">
                Close Queue Session
              </Text>
            </TouchableOpacity>
          </View>
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
  heroActionShadow: {
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  completeButtonShadow: {
    shadowColor: "#007D55",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
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
