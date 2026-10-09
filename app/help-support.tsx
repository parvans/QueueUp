import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  extraType?: "feature" | "note" | "transfer" | "pulse" | "arrival";
  extraText?: string;
  tags: string[];
}

const FAQS_DATA: FAQItem[] = [
  {
    id: "how-it-works",
    question: "How does QueueUp work?",
    answer:
      "QueueUp connects directly to venue queue systems. You join remotely from your phone, receive a live digital ticket, and get notified in real time when it's your turn.",
    extraType: "feature",
    extraText: "Zero physical standing required",
    tags: ["queue", "basics", "works", "system", "join"],
  },
  {
    id: "join-queue",
    question: "How do I join a queue?",
    answer:
      'Search for your clinic, hospital, or service location, view current wait times, and tap "Join Virtual Queue".',
    extraType: "note",
    extraText:
      "You will immediately receive an encrypted 4-digit verification code and pass.",
    tags: ["join", "enter", "clinic", "hospital", "ticket", "queue"],
  },
  {
    id: "leave-cancel",
    question: "Can I leave or cancel a queue?",
    answer:
      'Yes, you can tap "Leave Queue" from your live tracking screen anytime without penalty.',
    extraType: "transfer",
    extraText: "Your spot will simply transfer gracefully to the next citizen in line.",
    tags: ["leave", "cancel", "queue", "exit", "penalty"],
  },
  {
    id: "wait-accuracy",
    question: "How accurate is the estimated wait time?",
    answer:
      "Estimates calculate in real time based on active service counter speed, average consultation duration, and live patient throughput.",
    extraType: "pulse",
    extraText: "Adaptive algorithmic telemetry",
    tags: ["wait", "times", "accurate", "estimate", "time", "precision"],
  },
  {
    id: "turn-ready",
    question: "What happens when it's my turn?",
    answer:
      "You receive a high-priority push notification and SMS buzzer directing you to your assigned counter with your digital barcode ready.",
    extraType: "arrival",
    extraText: "5:00 min grace period",
    tags: [
      "turn",
      "notifications",
      "call",
      "buzzer",
      "counter",
      "ready",
      "alert",
      "notify",
    ],
  },
];

export default function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Accordion State: Set of expanded FAQ IDs
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(new Set());

  // Interactive Global State Showcase
  const [showOfflineBanner, setShowOfflineBanner] = useState<boolean>(false);
  const [showConnectionError, setShowConnectionError] = useState<boolean>(false);
  const [isRetryingConnection, setIsRetryingConnection] = useState<boolean>(false);

  // Toast Pill System
  const [toastMessage, setToastMessage] = useState<string>("");
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pulse Animation for Telemetry indicators
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

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    toastTimeoutRef.current = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, 2800);
  };

  // Filtered FAQs based on query
  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return FAQS_DATA;

    return FAQS_DATA.filter((faq) => {
      const questionMatch = faq.question.toLowerCase().includes(query);
      const answerMatch = faq.answer.toLowerCase().includes(query);
      const tagMatch = faq.tags.some((tag) => tag.toLowerCase().includes(query));
      return questionMatch || answerMatch || tagMatch;
    });
  }, [searchQuery]);

  // Accordion Toggle Handlers
  const toggleFaq = (id: string) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}

    setExpandedFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isAllExpanded =
    filteredFaqs.length > 0 &&
    filteredFaqs.every((faq) => expandedFaqIds.has(faq.id));

  const toggleAllFaqs = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}

    if (isAllExpanded) {
      setExpandedFaqIds(new Set());
    } else {
      setExpandedFaqIds(new Set(filteredFaqs.map((faq) => faq.id)));
    }
  };

  // Quick Topic Selector
  const handleQuickTopic = (keyword: string) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    setSearchQuery(keyword);
    // Expand the matching FAQs automatically for convenience
    const matching = FAQS_DATA.filter(
      (f) =>
        f.question.toLowerCase().includes(keyword) ||
        f.tags.includes(keyword)
    ).map((f) => f.id);
    setExpandedFaqIds(new Set(matching));
  };

  // Search Clear
  const handleClearSearch = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    setSearchQuery("");
  };

  // Simulate Connection Retry
  const handleSimulateRetry = () => {
    setIsRetryingConnection(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {}

    setTimeout(() => {
      setIsRetryingConnection(false);
      setShowConnectionError(false);
      showToast("Connection restored! Server synced.");
      try {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        ).catch(() => {});
      } catch {}
    }, 1200);
  };

  // Header options menu
  const handleMoreOptions = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {}
    Alert.alert("Support Options", "Choose an assistance channel", [
      {
        text: "Emergency Clinic Hotline",
        onPress: () => showToast("Connecting to 24/7 clinic triage hotline..."),
      },
      {
        text: "System Status Page",
        onPress: () => showToast("All clinic queue nodes operational."),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Header matching Stitch */}
      <View className="h-16 px-4 bg-[#FAF8FF]/95 border-b border-[#E2E8F0] flex-row items-center justify-between z-50">
        <View className="flex-row items-center gap-2 flex-1 min-w-0">
          <TouchableOpacity
            accessibilityLabel="Go back"
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="w-10 h-10 -ml-1 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="arrow-back" size={22} color="#131B2E" />
          </TouchableOpacity>
          <View className="flex-col min-w-0">
            <Text className="text-[11px] font-bold text-[#004AC6] uppercase tracking-wider leading-none">
              QueueUp
            </Text>
            <Text
              numberOfLines={1}
              className="text-base font-semibold text-[#131B2E] truncate leading-tight mt-0.5"
            >
              Help & Support
            </Text>
          </View>
        </View>

        {/* Right Action Icons */}
        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            accessibilityLabel="Focus search"
            activeOpacity={0.7}
            onPress={() => searchInputRef.current?.focus()}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="search-outline" size={20} color="#434655" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Mark all as read"
            activeOpacity={0.7}
            onPress={() => {
              try {
                Haptics.selectionAsync().catch(() => {});
              } catch {}
              showToast("All guide notifications marked as read.");
            }}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="checkmark-done-outline" size={20} color="#434655" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="More options"
            activeOpacity={0.7}
            onPress={handleMoreOptions}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#434655" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 24) + 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Search Help Bar Section */}
        <View className="px-4 pt-4 pb-2">
          <View
            className="relative flex-row items-center w-full bg-white rounded-xl border border-[#E2E8F0] px-3.5 h-12"
            style={styles.cardShadow}
          >
            <Ionicons name="search-outline" size={20} color="#737686" />
            <TextInput
              ref={searchInputRef}
              accessibilityLabel="Search guides and FAQs"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search guides, questions, or issues..."
              placeholderTextColor="#737686"
              className="flex-1 ml-2.5 text-sm text-[#131B2E] font-normal h-full"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                accessibilityLabel="Clear query"
                onPress={handleClearSearch}
                className="w-7 h-7 rounded-full items-center justify-center active:bg-[#EAEDFF]"
              >
                <Ionicons name="close-circle" size={18} color="#737686" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Warm Concierge / Greeting Banner */}
        <View className="px-4 py-2">
          <View
            className="relative overflow-hidden bg-[#EAEDFF] rounded-2xl p-4 border border-[#DAE2FD]"
            style={styles.cardShadow}
          >
            <View className="flex-row items-start gap-3.5 relative z-10">
              <View
                className="w-12 h-12 rounded-full bg-[#004AC6] items-center justify-center shadow-sm flex-shrink-0"
                style={styles.avatarShadow}
              >
                <Ionicons name="headset" size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6]">
                  Always In Line With You
                </Text>
                <Text className="text-lg font-bold text-[#131B2E] mt-0.5 leading-snug">
                  Need immediate guidance?
                </Text>
                <Text className="text-xs text-[#434655] mt-1 leading-relaxed">
                  Explore our instant solutions or ping our concierge team anytime.
                </Text>
              </View>
            </View>
            {/* Ambient Background Glow Disc */}
            <View className="absolute -right-4 -bottom-6 w-28 h-28 bg-[#E2E7FF]/60 rounded-full pointer-events-none" />
          </View>
        </View>

        {/* Quick Help Category Cards (Grid of 3) */}
        <View className="px-4 pt-3 pb-2">
          <View className="flex-row items-center justify-between mb-2 px-0.5">
            <Text className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
              Quick Topics
            </Text>
            <Text className="text-xs font-semibold text-[#004AC6]">
              3 topics
            </Text>
          </View>

          <View className="flex-row gap-2.5">
            {/* Card 1: Queue Basics */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleQuickTopic("queue")}
              className="flex-1 items-center bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-sm active:scale-95"
              style={styles.cardShadow}
            >
              <View className="w-11 h-11 rounded-full bg-[#DBE1FF] items-center justify-center mb-1.5">
                <Ionicons name="ticket" size={22} color="#00174B" />
              </View>
              <Text
                numberOfLines={1}
                className="text-xs font-bold text-[#131B2E] text-center w-full"
              >
                Queue Basics
              </Text>
              <Text
                numberOfLines={1}
                className="text-[11px] text-[#434655] text-center mt-0.5"
              >
                Digital passes
              </Text>
            </TouchableOpacity>

            {/* Card 2: Wait Times */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleQuickTopic("wait")}
              className="flex-1 items-center bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-sm active:scale-95"
              style={styles.cardShadow}
            >
              <View className="w-11 h-11 rounded-full bg-[#E2E7FF] items-center justify-center mb-1.5">
                <Ionicons name="time" size={22} color="#3755C3" />
              </View>
              <Text
                numberOfLines={1}
                className="text-xs font-bold text-[#131B2E] text-center w-full"
              >
                Wait Times
              </Text>
              <Text
                numberOfLines={1}
                className="text-[11px] text-[#434655] text-center mt-0.5"
              >
                Calculations
              </Text>
            </TouchableOpacity>

            {/* Card 3: Notifications */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleQuickTopic("notify")}
              className="flex-1 items-center bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-sm active:scale-95"
              style={styles.cardShadow}
            >
              <View className="w-11 h-11 rounded-full bg-[#6FFBBE] items-center justify-center mb-1.5">
                <Ionicons name="notifications" size={22} color="#005236" />
              </View>
              <Text
                numberOfLines={1}
                className="text-xs font-bold text-[#131B2E] text-center w-full"
              >
                Notifications
              </Text>
              <Text
                numberOfLines={1}
                className="text-[11px] text-[#434655] text-center mt-0.5"
              >
                SMS & alerts
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Accordion Section */}
        <View className="px-4 pt-3">
          <View className="flex-row items-center justify-between mb-2.5 px-0.5">
            <Text className="text-base font-bold text-[#131B2E]">
              Frequently Asked Questions
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleAllFaqs}
              className="py-1 px-1.5 rounded-lg active:bg-[#EAEDFF]"
            >
              <Text className="text-xs font-semibold text-[#004AC6]">
                {isAllExpanded ? "Collapse all" : "Expand all"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Accordion Stack */}
          {filteredFaqs.length > 0 ? (
            <View className="space-y-2.5">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqIds.has(faq.id);
                return (
                  <View
                    key={faq.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden mb-2.5"
                    style={styles.cardShadow}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => toggleFaq(faq.id)}
                      className="p-3.5 flex-row items-center justify-between gap-2.5 active:bg-[#FAF8FF]"
                    >
                      <Text className="text-sm font-semibold text-[#131B2E] flex-1 pr-1 leading-snug">
                        {faq.question}
                      </Text>
                      <View
                        className={`w-7 h-7 rounded-full items-center justify-center flex-shrink-0 ${
                          isExpanded
                            ? "bg-[#004AC6]"
                            : "bg-[#EAEDFF]"
                        }`}
                      >
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={16}
                          color={isExpanded ? "#FFFFFF" : "#434655"}
                        />
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View className="px-3.5 pb-3.5 pt-0.5">
                        <View className="bg-[#F2F3FF] p-3 rounded-xl mb-2">
                          <Text className="text-xs text-[#434655] leading-relaxed">
                            {faq.answer}
                          </Text>
                        </View>

                        {/* Extra contextual badges matching Stitch */}
                        {faq.extraType === "feature" && (
                          <View className="flex-row items-center gap-1.5 mt-1">
                            <Ionicons
                              name="finger-print-outline"
                              size={15}
                              color="#004AC6"
                            />
                            <Text className="text-xs font-semibold text-[#004AC6]">
                              {faq.extraText}
                            </Text>
                          </View>
                        )}

                        {faq.extraType === "note" && (
                          <Text className="text-xs text-[#737686] mt-0.5">
                            {faq.extraText}
                          </Text>
                        )}

                        {faq.extraType === "transfer" && (
                          <View className="flex-row items-center gap-1.5 mt-1">
                            <Ionicons
                              name="checkmark-circle"
                              size={15}
                              color="#007D55"
                            />
                            <Text className="text-xs text-[#434655]">
                              {faq.extraText}
                            </Text>
                          </View>
                        )}

                        {faq.extraType === "pulse" && (
                          <View className="flex-row items-center gap-2 mt-1">
                            <Animated.View
                              style={{ opacity: pulseAnim }}
                              className="w-2.5 h-2.5 rounded-full bg-[#007D55]"
                            />
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#007D55]">
                              {faq.extraText}
                            </Text>
                          </View>
                        )}

                        {faq.extraType === "arrival" && (
                          <View className="flex-row items-center justify-between bg-[#EAEDFF] px-2.5 py-1.5 rounded-lg mt-1">
                            <Text className="text-xs text-[#434655]">
                              Arrival window:
                            </Text>
                            <Text className="text-xs font-bold text-[#004AC6]">
                              {faq.extraText}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            /* Empty Search State */
            <View
              className="items-center justify-center py-8 px-4 text-center bg-white rounded-2xl border border-[#E2E8F0] my-2"
              style={styles.cardShadow}
            >
              <View className="w-14 h-14 rounded-full bg-[#E2E7FF] items-center justify-center mb-3">
                <Ionicons name="search-outline" size={26} color="#737686" />
              </View>
              <Text className="text-base font-bold text-[#131B2E]">
                No matching guides found
              </Text>
              <Text className="text-xs text-[#434655] text-center max-w-[280px] mt-1 mb-4 leading-relaxed">
                Try searching different keywords or speak with our live concierge staff below.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleClearSearch}
                className="bg-[#E2E7FF] px-4 py-2 rounded-full active:bg-[#DAE2FD]"
              >
                <Text className="text-xs font-semibold text-[#004AC6]">
                  View all questions
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Direct Support Actions Section */}
        <View className="px-4 pt-5 pb-2">
          <View className="mb-2 px-0.5">
            <Text className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">
              Still need assistance?
            </Text>
          </View>

          <View className="space-y-3">
            {/* Card: Contact Support */}
            <View
              className="bg-white rounded-2xl p-4 border border-[#E2E8F0] mb-3"
              style={styles.cardShadow}
            >
              <View className="flex-row items-start gap-3.5">
                <View
                  className="w-11 h-11 rounded-xl bg-[#2563EB] text-white items-center justify-center flex-shrink-0"
                  style={styles.actionIconShadow}
                >
                  <Ionicons name="chatbubbles" size={22} color="#FFFFFF" />
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-bold text-[#131B2E]">
                      Contact Support
                    </Text>
                    <View className="bg-[#6FFBBE] px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] font-bold text-[#002113]">
                        {"<5 min wait"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-[#434655] mt-1 leading-snug">
                    24/7 Live Chat or email support with response in &lt;5 minutes.
                  </Text>
                  <View className="mt-3">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        try {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        } catch {}
                        showToast("Connecting to QueueUp Concierge...");
                      }}
                      className="h-11 px-5 rounded-full bg-[#2563EB] flex-row items-center justify-center gap-2 active:bg-[#004AC6] self-start"
                      style={styles.primaryButtonShadow}
                    >
                      <Ionicons name="chatbubble-ellipses" size={17} color="#FFFFFF" />
                      <Text className="text-xs font-bold text-white">
                        Start Live Chat
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Card: Report a Problem */}
            <View
              className="bg-white rounded-2xl p-4 border border-[#E2E8F0]"
              style={styles.cardShadow}
            >
              <View className="flex-row items-start gap-3.5">
                <View className="w-11 h-11 rounded-xl bg-[#E2E7FF] items-center justify-center flex-shrink-0">
                  <Ionicons name="warning-outline" size={22} color="#434655" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-sm font-bold text-[#131B2E]">
                    Report a Problem
                  </Text>
                  <Text className="text-xs text-[#434655] mt-1 leading-snug">
                    Report inaccurate wait times, missed counter calls, or technical errors.
                  </Text>
                  <View className="mt-3">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        try {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        } catch {}
                        showToast("Opening issue reporter form...");
                      }}
                      className="h-11 px-5 rounded-full bg-[#F2F3FF] flex-row items-center justify-center gap-2 active:bg-[#EAEDFF] border border-[#E2E8F0] self-start"
                    >
                      <Ionicons name="flag-outline" size={16} color="#131B2E" />
                      <Text className="text-xs font-bold text-[#131B2E]">
                        Report an Issue
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Global States Previewer Section (Network Telemetry Preview) */}
        <View className="px-4 pt-4 pb-2">
          <View
            className="bg-[#EAEDFF] rounded-2xl p-4 border border-[#DAE2FD]"
            style={styles.cardShadow}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="cellular-outline" size={16} color="#737686" />
                <Text className="text-[10px] font-bold uppercase tracking-wider text-[#737686]">
                  Network Telemetry Preview
                </Text>
              </View>
              <Text className="text-xs text-[#737686]">
                Interactive UI states
              </Text>
            </View>

            <Text className="text-xs text-[#434655] leading-relaxed mb-3">
              QueueUp preserves your priority even under weak coverage. Toggle simulated offline conditions below:
            </Text>

            <View className="flex-row gap-2.5 mb-3">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  try {
                    Haptics.selectionAsync().catch(() => {});
                  } catch {}
                  setShowOfflineBanner((prev) => !prev);
                }}
                className={`flex-1 h-10 px-2.5 rounded-xl border flex-row items-center justify-center gap-1.5 ${
                  showOfflineBanner
                    ? "bg-[#283044] border-[#283044]"
                    : "bg-white border-[#DAE2FD]"
                }`}
                style={styles.cardShadowSm}
              >
                <Ionicons
                  name="cloud-offline-outline"
                  size={15}
                  color={showOfflineBanner ? "#FFFFFF" : "#BA1A1A"}
                />
                <Text
                  className={`text-xs font-semibold ${
                    showOfflineBanner ? "text-white" : "text-[#131B2E]"
                  }`}
                >
                  Offline Banner
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  try {
                    Haptics.selectionAsync().catch(() => {});
                  } catch {}
                  setShowConnectionError((prev) => !prev);
                }}
                className={`flex-1 h-10 px-2.5 rounded-xl border flex-row items-center justify-center gap-1.5 ${
                  showConnectionError
                    ? "bg-[#BA1A1A] border-[#BA1A1A]"
                    : "bg-white border-[#DAE2FD]"
                }`}
                style={styles.cardShadowSm}
              >
                <Ionicons
                  name="sync-outline"
                  size={15}
                  color={showConnectionError ? "#FFFFFF" : "#93000A"}
                />
                <Text
                  className={`text-xs font-semibold ${
                    showConnectionError ? "text-white" : "text-[#131B2E]"
                  }`}
                >
                  Error Card
                </Text>
              </TouchableOpacity>
            </View>

            {/* Offline Banner Mockup */}
            {showOfflineBanner && (
              <View
                className="mb-3 rounded-2xl bg-[#283044] p-3.5 border border-[#3E475E]"
                style={styles.bannerShadow}
              >
                <View className="flex-row items-start gap-2.5">
                  <Ionicons
                    name="cloud-offline-outline"
                    size={20}
                    color="#B4C5FF"
                    style={{ marginTop: 1 }}
                  />
                  <View className="flex-1 min-w-0">
                    <Text className="text-sm font-bold text-white">
                      {"You're offline"}
                    </Text>
                    <Text className="text-xs text-[#DAE2FD] mt-0.5 leading-snug">
                      {"Your last queue information is still available. We'll update it when you're back online."}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-2">
                      <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-2 h-2 rounded-full bg-[#B8C4FF]"
                      />
                      <Text className="text-[11px] text-[#DAE2FD] font-medium">
                        Cached locally • Spot secured
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    accessibilityLabel="Dismiss banner"
                    onPress={() => setShowOfflineBanner(false)}
                    className="p-1 -mr-1 rounded-full active:bg-white/10"
                  >
                    <Ionicons name="close" size={17} color="#DAE2FD" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Connection Error Card Mockup */}
            {showConnectionError && (
              <View
                className="rounded-2xl bg-[#FFDAD6] p-3.5 border border-[#BA1A1A]/30"
                style={styles.bannerShadow}
              >
                <View className="flex-row items-start gap-2.5">
                  <View className="w-8 h-8 rounded-full bg-white items-center justify-center flex-shrink-0">
                    <Ionicons name="sync-outline" size={17} color="#BA1A1A" />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="text-sm font-bold text-[#93000A]">
                      Connection interrupted
                    </Text>
                    <Text className="text-xs text-[#93000A]/90 mt-0.5 leading-snug">
                      Something went wrong. Please check your connection and try again.
                    </Text>
                    <View className="mt-3 flex-row items-center gap-2.5">
                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={isRetryingConnection}
                        onPress={handleSimulateRetry}
                        className="h-9 px-3.5 rounded-full bg-[#BA1A1A] flex-row items-center gap-1.5 active:bg-[#93000A]"
                      >
                        {isRetryingConnection ? (
                          <>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            <Text className="text-xs font-bold text-white">
                              Connecting...
                            </Text>
                          </>
                        ) : (
                          <>
                            <Ionicons name="refresh" size={14} color="#FFFFFF" />
                            <Text className="text-xs font-bold text-white">
                              Try Again
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowConnectionError(false)}
                        className="px-2 py-1"
                      >
                        <Text className="text-xs font-semibold text-[#93000A]">
                          Dismiss
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Toast Notification Pill */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toastContainer,
          { opacity: toastOpacity, bottom: Math.max(insets.bottom, 20) + 12 },
        ]}
      >
        <Ionicons name="checkmark-circle" size={17} color="#6FFBBE" />
        <Text className="text-xs font-semibold text-white">{toastMessage}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardShadowSm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconShadow: {
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonShadow: {
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  toastContainer: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#283044",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
});
