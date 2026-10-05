import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  TextInput,
  Alert,
  Share,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Card } from "@/components/ui/Card";

interface QueueCompletedFacilityData {
  id: string;
  name: string;
  department: string;
  doctor: string;
  station: string;
  ticketNumber: string;
  joinedTime: string;
  calledTime: string;
  completedTime: string;
  serviceDuration: string;
  totalWait: string;
  walkInEstimate: string;
  savedTime: string;
  waitPercentage: number;
  recordRef: string;
  date: string;
}

const COMPLETED_FACILITIES: Record<string, QueueCompletedFacilityData> = {
  "city-care-clinic": {
    id: "city-care-clinic",
    name: "City Care Clinic",
    department: "General OPD",
    doctor: "Dr. Martinez",
    station: "Station 4 • Dr. Martinez",
    ticketNumber: "A-047",
    joinedTime: "10:42 AM",
    calledTime: "11:02 AM",
    completedTime: "11:08 AM",
    serviceDuration: "6m Service",
    totalWait: "26 min",
    walkInEstimate: "65 min",
    savedTime: "Saved ~39 mins of physical waiting!",
    waitPercentage: 40,
    recordRef: "#QU-2024-8841",
    date: "Dec 14, 2024",
  },
  "st-jude-hospital": {
    id: "st-jude-hospital",
    name: "St. Jude Hospital - OPD",
    department: "Cardiology OPD",
    doctor: "Dr. David Vance",
    station: "Station 1 • Dr. David Vance",
    ticketNumber: "B-108",
    joinedTime: "11:50 AM",
    calledTime: "12:35 PM",
    completedTime: "12:47 PM",
    serviceDuration: "12m Service",
    totalWait: "45 min",
    walkInEstimate: "95 min",
    savedTime: "Saved ~50 mins of physical waiting!",
    waitPercentage: 47,
    recordRef: "#QU-2024-9102",
    date: "Dec 14, 2024",
  },
  "express-medical": {
    id: "express-medical",
    name: "Express Medical & Pediatric",
    department: "Pediatric Triage",
    doctor: "Dr. Rachel Green",
    station: "Fast Desk 1 • Dr. Rachel Green",
    ticketNumber: "E-019",
    joinedTime: "10:23 AM",
    calledTime: "10:35 AM",
    completedTime: "10:44 AM",
    serviceDuration: "9m Service",
    totalWait: "12 min",
    walkInEstimate: "40 min",
    savedTime: "Saved ~28 mins of physical waiting!",
    waitPercentage: 30,
    recordRef: "#QU-2024-7320",
    date: "Dec 14, 2024",
  },
};

export default function QueueCompletedScreen() {
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

  const facility: QueueCompletedFacilityData =
    COMPLETED_FACILITIES[resolvedKey] || COMPLETED_FACILITIES["city-care-clinic"];

  // Interactive UI States
  const [rating, setRating] = useState<number>(5);
  const [selectedChips, setSelectedChips] = useState<string[]>([
    "Fast Service",
    "Accurate Wait Time",
  ]);
  const [reviewNote, setReviewNote] = useState<string>("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  // Animations (using standard React Native Animated for reliability & zero render warnings)
  const checkRingScaleAnim = useRef(new Animated.Value(1)).current;
  const checkBadgeScaleAnim = useRef(new Animated.Value(0.85)).current;
  const serviceDotOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Gentle entrance for the checkmark badge
    Animated.spring(checkBadgeScaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // 2. Continuous pulsing aura ring behind checkmark
    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(checkRingScaleAnim, {
          toValue: 1.18,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(checkRingScaleAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Gentle breathing loop for "Service Finished" status dot
    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(serviceDotOpacityAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(serviceDotOpacityAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    ringLoop.start();
    dotLoop.start();

    return () => {
      ringLoop.stop();
      dotLoop.stop();
    };
  }, [checkRingScaleAnim, checkBadgeScaleAnim, serviceDotOpacityAnim]);

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
      router.replace("/(customer)/home" as any);
    }
  };

  const handleClose = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    router.replace("/(customer)/home" as any);
  };

  const handleShareSummary = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      await Share.share({
        title: "QueueUp Visit Summary",
        message: `Finished appointment at ${facility.name} (Ticket ${facility.ticketNumber}). ${facility.savedTime}`,
      });
    } catch {
      Alert.alert(
        "Visit Summary Shared",
        `Receipt #${facility.recordRef} for ${facility.name} copied to clipboard.`
      );
    }
  };

  const handleSelectStar = (stars: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    setRating(stars);
  };

  const handleToggleChip = (chip: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmitFeedback = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Ignore
    }
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setIsFeedbackSubmitted(true);
    }, 600);
  };

  const handleToggleFavorite = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {
      // Ignore
    }
    const next = !isFavorite;
    setIsFavorite(next);
    Alert.alert(
      next ? "Saved to Favorites" : "Removed from Favorites",
      next
        ? `${facility.name} has been added to your favorites for 1-tap re-booking.`
        : `${facility.name} has been removed from your favorites.`
    );
  };

  const handleDownloadPdf = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignore
    }
    setIsDownloadingPdf(true);
    setTimeout(() => {
      setIsDownloadingPdf(false);
      Alert.alert(
        "Pass PDF Downloaded",
        `Summary #${facility.recordRef} has been saved to your downloads folder with digital timestamps.`
      );
    }, 700);
  };

  const feedbackChipsList = [
    "Fast Service",
    "Accurate Wait Time",
    "Clear Notifications",
    "Helpful Staff",
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* 1. Standard Header Shell matching Stitch Screen 13 */}
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
              QueueUp • Completed
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
                "Appointment Record",
                `Pass #${facility.ticketNumber} • ${facility.recordRef} completed at ${facility.name}.`
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
          paddingTop: 8,
          paddingBottom: insets.bottom + 28,
        }}
        className="flex-1"
      >
        {/* 2. Interactive Top Action Sub-bar ("Visit Summary") */}
        <View className="py-2 flex-row items-center justify-between mb-2">
          <TouchableOpacity
            accessibilityLabel="Close summary"
            onPress={handleClose}
            className="w-11 h-11 rounded-full bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
          >
            <Ionicons name="close" size={20} color="#131B2E" />
          </TouchableOpacity>

          <View className="flex-col items-center">
            <Text className="text-[11px] font-bold uppercase text-[#004AC6] tracking-wider leading-none">
              Appointment Complete
            </Text>
            <Text className="text-[16px] font-bold text-[#131B2E] mt-0.5">Visit Summary</Text>
          </View>

          <TouchableOpacity
            accessibilityLabel="Share summary"
            onPress={handleShareSummary}
            className="w-11 h-11 rounded-full bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
          >
            <Ionicons name="share-outline" size={20} color="#131B2E" />
          </TouchableOpacity>
        </View>

        {/* 3. Hero Success Section with Subtle Celebration Graphics */}
        <View className="relative overflow-hidden rounded-2xl bg-[#F2F3FF] p-6 flex-col items-center text-center shadow-xs border border-[#DAE2FD]/60 mb-3.5">
          {/* Ambient blurred glow blobs */}
          <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#006242]/10" />
          <View className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-[#004AC6]/10" />

          {/* Animated Success Ring & Checkmark */}
          <View className="relative mb-3 items-center justify-center">
            {/* Pulsing Outer Ring */}
            <Animated.View
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#006242",
                opacity: 0.15,
                transform: [{ scale: checkRingScaleAnim }],
              }}
            />

            {/* Core Circular Checkmark Badge */}
            <Animated.View
              style={{
                transform: [{ scale: checkBadgeScaleAnim }],
              }}
              className="w-14 h-14 rounded-full bg-[#006242] items-center justify-center shadow-md shadow-[#006242]/30"
            >
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </Animated.View>
          </View>

          {/* Service Finished Status Pill */}
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-[#006242]/15 mb-1.5 shadow-xs">
            <Animated.View
              style={{ opacity: serviceDotOpacityAnim }}
              className="w-2 h-2 rounded-full bg-[#006242]"
            />
            <Text className="text-[11px] font-bold uppercase tracking-wider text-[#006242]">
              Service Finished
            </Text>
          </View>

          {/* Headings */}
          <Text className="text-[26px] font-bold text-[#131B2E] tracking-tight">
            Queue Completed
          </Text>
          <Text className="text-sm text-[#434655] max-w-xs mt-1 text-center">
            Thank you for using QueueUp at {facility.name}.
          </Text>
        </View>

        {/* 4. Trip & Queue Summary Card */}
        <View className="rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0] flex-col gap-3.5 mb-3.5">
          {/* Clinic & Ticket Meta Row */}
          <View className="flex-row items-start justify-between pb-1">
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <View className="w-12 h-12 rounded-xl bg-[#004AC6]/10 items-center justify-center">
                <MaterialIcons name="local-hospital" size={24} color="#004AC6" />
              </View>
              <View className="flex-col min-w-0 flex-1">
                <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
                  {facility.department}
                </Text>
                <Text numberOfLines={1} className="text-[17px] font-bold text-[#131B2E]">
                  {facility.name}
                </Text>
                <Text numberOfLines={1} className="text-xs text-[#434655] mt-0.5">
                  {facility.station}
                </Text>
              </View>
            </View>

            <View className="flex-col items-end shrink-0">
              <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
                Ticket
              </Text>
              <Text className="text-2xl font-extrabold text-[#004AC6] tracking-tight mt-0.5">
                {facility.ticketNumber}
              </Text>
            </View>
          </View>

          {/* Time Saved Highlight Callout */}
          <View className="rounded-xl bg-[#007D55]/10 p-3 flex-row items-center gap-3 border border-[#007D55]/20">
            <View className="w-9 h-9 rounded-full bg-[#006242] items-center justify-center shrink-0">
              <Ionicons name="flash" size={18} color="#FFFFFF" />
            </View>
            <View className="flex-col flex-1 min-w-0">
              <Text className="text-[10px] font-bold uppercase text-[#007D55] tracking-wider">
                Smart Queue Advantage
              </Text>
              <Text className="text-sm font-bold text-[#131B2E] mt-0.5">{facility.savedTime}</Text>
            </View>
          </View>

          {/* Timeline & Performance Metrics (Grid of 3 columns) */}
          <View className="flex-row justify-between p-3 rounded-xl bg-[#F2F3FF] text-center">
            {/* Joined */}
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold uppercase text-[#737686]">Joined</Text>
              <Text className="text-sm font-bold text-[#131B2E] mt-0.5">{facility.joinedTime}</Text>
              <Text className="text-[11px] text-[#434655] mt-0.5">Mobile Check-in</Text>
            </View>

            {/* Called */}
            <View className="flex-1 items-center border-x border-[#DAE2FD]/60 px-1">
              <Text className="text-[10px] font-bold uppercase text-[#737686]">Called</Text>
              <Text className="text-sm font-bold text-[#004AC6] mt-0.5">{facility.calledTime}</Text>
              <Text className="text-[11px] text-[#434655] mt-0.5">Turn Initiated</Text>
            </View>

            {/* Completed */}
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-bold uppercase text-[#737686]">Completed</Text>
              <Text className="text-sm font-bold text-[#131B2E] mt-0.5">
                {facility.completedTime}
              </Text>
              <Text className="text-[11px] font-bold text-[#006242] mt-0.5">
                {facility.serviceDuration}
              </Text>
            </View>
          </View>

          {/* Comparative Bar Visual */}
          <View className="flex-col gap-1.5 pt-1">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-[#004AC6]" />
                <Text className="text-xs font-semibold text-[#131B2E]">QueueUp Total Wait</Text>
              </View>
              <Text className="text-xs font-bold text-[#004AC6]">{facility.totalWait}</Text>
            </View>

            <View className="w-full h-2.5 bg-[#EAEDFF] rounded-full overflow-hidden flex-row">
              <View
                style={{ width: `${facility.waitPercentage}%` }}
                className="h-full bg-[#004AC6] rounded-full"
              />
            </View>

            <View className="flex-row justify-between items-center pt-0.5">
              <Text className="text-xs text-[#737686]">Standard Walk-in Estimate</Text>
              <Text className="text-xs font-medium text-[#737686]">
                {facility.walkInEstimate}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Rating & Experience Card ("Your Thoughts Matter") */}
        <Card variant="elevated" className="mb-3.5">
          <View className="flex-col">
            <Text className="text-[10px] font-bold uppercase text-[#004AC6] tracking-wider">
              Your Thoughts Matter
            </Text>
            <Text className="text-[17px] font-bold text-[#131B2E] mt-0.5">
              Rate Your Experience
            </Text>
            <Text className="text-xs text-[#737686] mt-0.5">
              How was your queue experience today?
            </Text>
          </View>

          {/* Interactive Star Rating */}
          <View className="flex-row items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((starVal) => (
              <TouchableOpacity
                key={starVal}
                accessibilityLabel={`${starVal} stars`}
                onPress={() => handleSelectStar(starVal)}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                className="p-1 active:scale-125"
              >
                <Ionicons
                  name={starVal <= rating ? "star" : "star-outline"}
                  size={36}
                  color={starVal <= rating ? "#004AC6" : "#C3C6D7"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Feedback Chips ("What went well?") */}
          <View className="flex-col gap-1.5 mt-1">
            <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
              What went well?
            </Text>
            <View className="flex-row flex-wrap gap-2 pt-0.5">
              {feedbackChipsList.map((chip) => {
                const isSelected = selectedChips.includes(chip);
                return (
                  <TouchableOpacity
                    key={chip}
                    activeOpacity={0.8}
                    onPress={() => handleToggleChip(chip)}
                    className={`px-3 py-1.5 rounded-full flex-row items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#004AC6] text-white"
                        : "bg-[#EAEDFF] text-[#434655] active:bg-[#DAE2FD]"
                    }`}
                  >
                    <Ionicons
                      name={isSelected ? "checkmark" : "add"}
                      size={15}
                      color={isSelected ? "#FFFFFF" : "#434655"}
                    />
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? "text-white" : "text-[#434655]"
                      }`}
                    >
                      {chip}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Note Input */}
          <View className="flex-col gap-1 mt-2.5">
            <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
              Additional Comments
            </Text>
            <TextInput
              multiline
              numberOfLines={2}
              value={reviewNote}
              onChangeText={setReviewNote}
              placeholder="Add a note or review..."
              placeholderTextColor="#737686"
              className="w-full rounded-xl bg-[#F2F3FF] p-3 text-sm text-[#131B2E] border border-[#DAE2FD]/40 min-h-[64px]"
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* Submit Feedback Button & Success State */}
          <View className="mt-2.5">
            {isFeedbackSubmitted ? (
              <View className="w-full py-3 rounded-xl bg-emerald-50 border border-emerald-300 flex-row items-center justify-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color="#007D55" />
                <Text className="text-xs font-bold text-[#007D55]">
                  Thank you! Your feedback has been recorded.
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isSubmittingFeedback}
                onPress={handleSubmitFeedback}
                className="w-full h-12 rounded-xl bg-[#3755C3] flex-row items-center justify-center gap-2 shadow-sm active:bg-[#2563EB]"
              >
                <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
                <Text className="text-sm font-semibold text-white">
                  {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* 6. Receipt & Medical Visit Record Actions */}
        <View className="rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0] flex-col gap-2.5 mb-3.5">
          <View className="flex-row items-center justify-between pb-1">
            <View className="flex-col">
              <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
                Record Reference
              </Text>
              <Text className="text-sm font-bold text-[#131B2E] tracking-wide mt-0.5">
                {facility.recordRef}
              </Text>
            </View>
            <Text className="text-xs text-[#737686]">{facility.date}</Text>
          </View>

          {/* Download PDF Action Item */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDownloadPdf}
            className="w-full flex-row items-center justify-between p-3 rounded-xl bg-[#F2F3FF] active:bg-[#EAEDFF]"
          >
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <View className="w-10 h-10 rounded-lg bg-[#EAEDFF] items-center justify-center">
                <Ionicons name="download-outline" size={20} color="#004AC6" />
              </View>
              <View className="flex-col flex-1">
                <Text className="text-sm font-semibold text-[#131B2E]">
                  {isDownloadingPdf ? "Preparing Pass PDF..." : "Download Visit Summary / Pass PDF"}
                </Text>
                <Text className="text-xs text-[#434655] mt-0.5">
                  Includes digital queue timestamp & receipt
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#737686" />
          </TouchableOpacity>

          {/* Favorite Clinic Action Item */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggleFavorite}
            className="w-full flex-row items-center justify-between p-3 rounded-xl bg-[#F2F3FF] active:bg-[#EAEDFF]"
          >
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <View className="w-10 h-10 rounded-lg bg-[#EAEDFF] items-center justify-center">
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={20}
                  color={isFavorite ? "#BA1A1A" : "#004AC6"}
                />
              </View>
              <View className="flex-col flex-1">
                <Text className="text-sm font-semibold text-[#131B2E]">
                  {isFavorite ? "Saved to Favorites" : "Save Clinic to Favorites"}
                </Text>
                <Text className="text-xs text-[#434655] mt-0.5">
                  1-tap re-booking next time you visit
                </Text>
              </View>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${
                isFavorite ? "bg-[#BDFFDB]" : "bg-white border border-[#DAE2FD]"
              }`}
            >
              <Text
                className={`text-[11px] font-bold ${
                  isFavorite ? "text-[#007D55]" : "text-[#434655]"
                }`}
              >
                {isFavorite ? "Saved" : "Save"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 7. Bottom Navigation Steps matching Stitch Screen 13 */}
        <View className="flex-col gap-2.5 pt-1 mb-2">
          {/* Primary: Back to Home */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.replace("/(customer)/home" as any)}
            className="w-full h-12 rounded-full bg-[#004AC6] flex-row items-center justify-center gap-2 shadow-md active:bg-[#3755C3]"
          >
            <Ionicons name="home" size={19} color="#FFFFFF" />
            <Text className="text-sm font-bold text-white">Back to Home</Text>
          </TouchableOpacity>

          {/* Secondary: Find Another Queue */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace("/(customer)/search" as any)}
            className="w-full h-12 rounded-full bg-[#EAEDFF] flex-row items-center justify-center gap-2 active:bg-[#DAE2FD]"
          >
            <Ionicons name="search" size={19} color="#131B2E" />
            <Text className="text-sm font-semibold text-[#131B2E]">Find Another Queue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
