import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Medical");
  const [searchQuery, setSearchQuery] = useState("");

  // Pulsing animation for the active beacon
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  const handleToggleState = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    setIsEmptyState(!isEmptyState);
  };

  const categories = [
    { id: "Medical", name: "Medical", icon: "medkit" as const },
    { id: "Hospitals", name: "Hospitals", icon: "business" as const },
    { id: "Dining", name: "Dining", icon: "restaurant" as const },
    { id: "Government", name: "Government", icon: "earth" as const },
    { id: "Banks", name: "Banks", icon: "card" as const },
    { id: "Services", name: "Services", icon: "construct" as const },
    { id: "Other", name: "Other", icon: "grid" as const },
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Top Header & Greeting Row */}
        <View className="px-4 pt-2 pb-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            {/* User Avatar with Online Dot */}
            <View className="relative">
              <View className="w-11 h-11 rounded-full bg-[#DBE1FF] items-center justify-center shadow-2xs">
                <Text className="text-[15px] font-bold text-[#00174B]">PK</Text>
              </View>
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-[#007D55] rounded-full border-2 border-[#FAF8FF]" />
            </View>

            {/* Greeting */}
            <View>
              <Text className="text-[12px] text-[#434655] font-normal leading-tight">
                Good morning,
              </Text>
              <Text className="text-[16px] font-bold text-[#131B2E] leading-tight mt-0.5">
                Parvan
              </Text>
            </View>
          </View>

          {/* Location & Notifications */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row items-center gap-1 py-1.5 px-3 rounded-full bg-[#EAEDFF]"
            >
              <Ionicons name="location-sharp" size={14} color="#2563EB" />
              <Text
                numberOfLines={1}
                className="text-[12px] font-semibold text-[#434655] max-w-[115px]"
              >
                Downtown, Seattle
              </Text>
              <Ionicons name="chevron-down" size={12} color="#434655" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/notifications")}
              className="relative w-10 h-10 rounded-full bg-[#EAEDFF] items-center justify-center"
            >
              <Ionicons name="notifications" size={19} color="#131B2E" />
              <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#BA1A1A] border border-[#FAF8FF]" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo State Toggle (Preview Empty State / Show Active Queue) */}
        <View className="px-4 py-1.5 flex-row justify-end">
          <TouchableOpacity
            onPress={handleToggleState}
            activeOpacity={0.7}
            className="flex-row items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#F2F3FF]"
          >
            <Ionicons name="swap-horizontal" size={14} color="#434655" />
            <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
              {isEmptyState ? "Show Active Queue" : "Preview Empty State"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Queue Card or Empty State Card */}
        <View className="px-4 mb-4">
          {!isEmptyState ? (
            /* Active Queue Card */
            <View className="relative overflow-hidden rounded-2xl bg-white border border-[#E2E7FF] p-4 shadow-sm">
              {/* Soft Ambient Glow */}
              <View className="absolute -right-8 -top-8 w-32 h-32 bg-blue-100/40 rounded-full" />

              {/* Status Header */}
              <View className="flex-row items-center justify-between pb-2">
                <View className="flex-row items-center gap-2">
                  <View className="relative flex-row items-center justify-center">
                    <Animated.View
                      style={{ opacity: pulseAnim }}
                      className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                    />
                  </View>
                  <Text className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Your Active Queue
                  </Text>
                </View>
                <View className="px-2.5 py-0.5 rounded-full bg-[#EAEDFF]">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase">
                    Live Status
                  </Text>
                </View>
              </View>

              {/* Facility Information & Ticket */}
              <View className="mt-1 flex-row items-start justify-between">
                <View className="flex-1 mr-2">
                  <Text className="text-[18px] font-bold text-[#131B2E] tracking-tight">
                    City Care Clinic
                  </Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Ionicons name="medkit-outline" size={13} color="#434655" />
                    <Text className="text-[12px] text-[#434655]">
                      General OPD • Dr. Martinez
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-[10px] font-bold text-[#434655] uppercase">
                    Ticket
                  </Text>
                  <Text className="text-[18px] font-extrabold text-primary">
                    #A-047
                  </Text>
                </View>
              </View>

              {/* 3 Telemetry Metrics */}
              <View className="my-3 flex-row gap-2 bg-[#F2F3FF] rounded-xl p-2.5">
                <View className="flex-1 items-center justify-center p-1">
                  <View className="flex-row items-center gap-1 mb-0.5">
                    <Ionicons name="people-outline" size={14} color="#434655" />
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Ahead
                    </Text>
                  </View>
                  <Text className="text-[16px] font-bold text-[#131B2E]">12</Text>
                  <Text className="text-[10px] text-[#434655]">patients</Text>
                </View>

                {/* Highlighted Center Card */}
                <View className="flex-1 items-center justify-center p-1 bg-white rounded-lg shadow-2xs">
                  <View className="flex-row items-center gap-1 mb-0.5">
                    <Ionicons name="time-outline" size={14} color="#1E40AF" />
                    <Text className="text-[10px] font-bold text-[#1E40AF] uppercase">
                      Est. Wait
                    </Text>
                  </View>
                  <Text className="text-[16px] font-extrabold text-[#1E40AF]">
                    ~18m
                  </Text>
                  <Text className="text-[10px] font-medium text-[#1E40AF]">
                    on schedule
                  </Text>
                </View>

                <View className="flex-1 items-center justify-center p-1">
                  <View className="flex-row items-center gap-1 mb-0.5">
                    <Ionicons name="navigate-outline" size={14} color="#434655" />
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Position
                    </Text>
                  </View>
                  <Text className="text-[16px] font-bold text-[#131B2E]">#13</Text>
                  <Text className="text-[10px] text-[#434655]">in line</Text>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row items-center gap-2 pt-0.5">
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/live-queue/A-047")}
                  className="flex-1 h-11 bg-primary rounded-xl flex-row items-center justify-center gap-1.5 shadow-xs active:bg-blue-700"
                >
                  <Text className="text-[14px] font-semibold text-white">
                    Track Queue
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/ticket/A-047")}
                  className="w-11 h-11 bg-[#EAEDFF] rounded-xl items-center justify-center"
                >
                  <Ionicons name="qr-code" size={18} color="#131B2E" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Empty Queue State Card */
            <View className="rounded-2xl bg-white border border-[#E2E7FF] p-5 items-center text-center shadow-sm">
              <View className="w-14 h-14 rounded-full bg-[#F2F3FF] items-center justify-center mb-3">
                <Ionicons name="ticket-outline" size={26} color="#2563EB" />
              </View>
              <Text className="text-[18px] font-bold text-[#131B2E] mb-1">
                {"You don't have an active queue"}
              </Text>
              <Text className="text-[13px] text-[#434655] text-center mb-4 max-w-xs leading-relaxed">
                Explore top-rated services nearby and book your spot early with zero wait time.
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/(customer)/search")}
                className="w-full h-11 bg-primary rounded-xl flex-row items-center justify-center gap-1.5 shadow-xs"
              >
                <Text className="text-[14px] font-semibold text-white">
                  Find a Queue
                </Text>
                <Ionicons name="search" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Search Bar */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center h-12 bg-white rounded-xl px-3.5 border border-[#E2E7FF] shadow-xs">
            <Ionicons
              name="search"
              size={18}
              color="#434655"
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search clinics, hospitals, services..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-[14px] text-[#131B2E] p-0"
            />
            <TouchableOpacity
              onPress={() => router.push("/(customer)/search")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-1"
            >
              <Ionicons name="options-outline" size={18} color="#434655" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Promo Hero Banner ("Skip the waiting room") */}
        <View className="px-4 mb-5">
          <View className="relative overflow-hidden rounded-2xl bg-[#2563EB] p-5 shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 max-w-[210px]">
                <View className="self-start flex-row items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full mb-2">
                  <Ionicons name="flash" size={11} color="#FFFFFF" />
                  <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Instant Entry
                  </Text>
                </View>

                <Text className="text-[20px] font-extrabold text-white leading-tight">
                  Skip the waiting room.
                </Text>
                <Text className="text-[12.5px] text-white/90 mt-1 leading-snug">
                  {"Join a queue from anywhere. Get notified right when it's your turn."}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/(customer)/search")}
                  className="mt-3.5 self-start h-9 px-4 rounded-xl bg-white flex-row items-center gap-1.5 shadow-2xs"
                >
                  <Text className="text-[12px] font-bold text-primary">
                    Find a Queue
                  </Text>
                  <Ionicons name="play-forward" size={13} color="#2563EB" />
                </TouchableOpacity>
              </View>

              {/* Emblem Logo */}
              <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center p-2.5">
                <Image
                  source={require("../../assets/images/queueup-logo.png")}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View className="mb-5">
          <View className="px-4 mb-2 flex-row items-center justify-between">
            <Text className="text-[16px] font-bold text-[#131B2E]">Categories</Text>
            <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
              Browse
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    try {
                      Haptics.selectionAsync();
                    } catch {
                      // Haptics fallback
                    }
                    setActiveCategory(cat.id);
                  }}
                  className={`items-center justify-center min-w-[76px] py-2.5 px-2 rounded-2xl transition-all ${
                    isActive
                      ? "bg-primary shadow-xs"
                      : "bg-white border border-[#E2E7FF]"
                  }`}
                >
                  <View
                    className={`w-9 h-9 rounded-xl items-center justify-center mb-1 ${
                      isActive ? "bg-white/20" : "bg-[#EAEDFF]"
                    }`}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={18}
                      color={isActive ? "#FFFFFF" : "#2563EB"}
                    />
                  </View>
                  <Text
                    className={`text-[12px] font-semibold ${
                      isActive ? "text-white" : "text-[#131B2E]"
                    }`}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Nearby Queues Section */}
        <View className="px-4 mb-5">
          <View className="flex-row items-center justify-between mb-2.5">
            <View>
              <Text className="text-[18px] font-bold text-[#131B2E]">
                Nearby Queues
              </Text>
              <Text className="text-[12px] text-[#434655]">
                Real-time occupancy around Downtown
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(customer)/search")}
              className="flex-row items-center"
            >
              <Text className="text-[13px] font-semibold text-primary">
                See all (18)
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* Queue Cards */}
          <View className="gap-3">
            {/* Card 1: City Care Clinic */}
            <View className="rounded-2xl bg-white border border-[#E2E7FF] p-4 shadow-2xs">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-2">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <View className="px-2 py-0.5 rounded-full bg-[#DBE1FF]">
                      <Text className="text-[10px] font-bold text-[#00174B] uppercase">
                        Medical
                      </Text>
                    </View>
                    <Text className="text-[12px] text-[#434655]">• 1.2 km away</Text>
                  </View>
                  <Text className="text-[16px] font-bold text-[#131B2E]">
                    City Care Clinic
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-[#F2F3FF]">
                  <View className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <Text className="text-[10px] font-bold text-emerald-800 uppercase">
                    Accepting
                  </Text>
                </View>
              </View>

              {/* Stats Row */}
              <View className="my-2.5 flex-row items-center justify-between py-2 px-3 rounded-xl bg-[#F2F3FF]">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="people-outline" size={15} color="#434655" />
                  <Text className="text-[12px] font-medium text-[#131B2E]">
                    23 people waiting
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="hourglass-outline" size={14} color="#1E40AF" />
                  <Text className="text-[12px] font-bold text-[#1E40AF]">
                    ~35 min wait
                  </Text>
                </View>
              </View>

              {/* Card Footer */}
              <View className="flex-row items-center justify-between pt-0.5">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text className="text-[12px] text-[#434655]">
                    Fast Pass supported
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/queue-details/city-care-clinic")}
                  className="h-9 px-4 rounded-xl bg-primary flex-row items-center gap-1 shadow-2xs"
                >
                  <Text className="text-[12px] font-semibold text-white">
                    View Queue
                  </Text>
                  <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Card 2: Metro Health Urgent Care */}
            <View className="rounded-2xl bg-white border border-[#E2E7FF] p-4 shadow-2xs">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-2">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <View className="px-2 py-0.5 rounded-full bg-[#DBE1FF]">
                      <Text className="text-[10px] font-bold text-[#00174B] uppercase">
                        Medical
                      </Text>
                    </View>
                    <Text className="text-[12px] text-[#434655]">• 2.4 km away</Text>
                  </View>
                  <Text className="text-[16px] font-bold text-[#131B2E]">
                    Metro Health Urgent Care
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-[#F2F3FF]">
                  <View className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <Text className="text-[10px] font-bold text-emerald-800 uppercase">
                    Accepting
                  </Text>
                </View>
              </View>

              <View className="my-2.5 flex-row items-center justify-between py-2 px-3 rounded-xl bg-[#F2F3FF]">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="people-outline" size={15} color="#434655" />
                  <Text className="text-[12px] font-medium text-[#131B2E]">
                    14 people waiting
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="hourglass-outline" size={14} color="#1E40AF" />
                  <Text className="text-[12px] font-bold text-[#1E40AF]">
                    ~20 min wait
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-0.5">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="location-outline" size={15} color="#434655" />
                  <Text className="text-[12px] text-[#434655]">
                    4th Ave Medical Tower
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/queue-details/metro-health")}
                  className="h-9 px-4 rounded-xl bg-[#EAEDFF] flex-row items-center gap-1"
                >
                  <Text className="text-[12px] font-semibold text-[#131B2E]">
                    View Queue
                  </Text>
                  <Ionicons name="arrow-forward" size={13} color="#131B2E" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Card 3: Central DMV Licensing */}
            <View className="rounded-2xl bg-white border border-[#E2E7FF] p-4 shadow-2xs">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-2">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <View className="px-2 py-0.5 rounded-full bg-[#DDE1FF]">
                      <Text className="text-[10px] font-bold text-[#001453] uppercase">
                        Government
                      </Text>
                    </View>
                    <Text className="text-[12px] text-[#434655]">• 3.1 km away</Text>
                  </View>
                  <Text className="text-[16px] font-bold text-[#131B2E]">
                    Central DMV Licensing
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-[#F2F3FF]">
                  <View className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <Text className="text-[10px] font-bold text-emerald-800 uppercase">
                    Open
                  </Text>
                </View>
              </View>

              <View className="my-2.5 flex-row items-center justify-between py-2 px-3 rounded-xl bg-[#F2F3FF]">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="people-outline" size={15} color="#434655" />
                  <Text className="text-[12px] font-medium text-[#131B2E]">
                    48 people waiting
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="hourglass-outline" size={14} color="#BA1A1A" />
                  <Text className="text-[12px] font-bold text-[#BA1A1A]">
                    ~65 min wait
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-0.5">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="flash-outline" size={15} color="#1E40AF" />
                  <Text className="text-[12px] font-semibold text-[#1E40AF]">
                    Fast Pass Available
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/queue-details/central-dmv")}
                  className="h-9 px-4 rounded-xl bg-[#EAEDFF] flex-row items-center gap-1"
                >
                  <Text className="text-[12px] font-semibold text-[#131B2E]">
                    View Queue
                  </Text>
                  <Ionicons name="arrow-forward" size={13} color="#131B2E" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Popular Queues Horizontal Cards */}
        <View className="mb-5">
          <View className="px-4 mb-2 flex-row items-center justify-between">
            <View>
              <Text className="text-[18px] font-bold text-[#131B2E]">
                Popular Queues
              </Text>
              <Text className="text-[12px] text-[#434655]">
                Frequently joined today
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(customer)/search")}
            >
              <Text className="text-[13px] font-semibold text-primary">View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {/* Item 1 */}
            <View className="w-[230px] rounded-2xl bg-white border border-[#E2E7FF] p-3.5 shadow-2xs justify-between">
              <View>
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="px-2 py-0.5 rounded-md bg-[#EAEDFF]">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Dining
                    </Text>
                  </View>
                  <Text className="text-[11px] text-[#434655]">0.9 km</Text>
                </View>
                <Text
                  numberOfLines={1}
                  className="text-[15px] font-bold text-[#131B2E]"
                >
                  The Rustic Table
                </Text>
                <Text className="text-[12px] text-[#434655] mt-0.5">
                  8 parties ahead
                </Text>
              </View>
              <View className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex-row items-center justify-between">
                <Text className="text-[12px] font-bold text-[#1E40AF]">
                  18 min wait
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/queue-details/rustic-table")}
                  className="h-8 px-3 rounded-lg bg-primary items-center justify-center"
                >
                  <Text className="text-[12px] font-semibold text-white">Join</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Item 2 */}
            <View className="w-[230px] rounded-2xl bg-white border border-[#E2E7FF] p-3.5 shadow-2xs justify-between">
              <View>
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="px-2 py-0.5 rounded-md bg-[#EAEDFF]">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Banking
                    </Text>
                  </View>
                  <Text className="text-[11px] text-[#434655]">1.5 km</Text>
                </View>
                <Text
                  numberOfLines={1}
                  className="text-[15px] font-bold text-[#131B2E]"
                >
                  First National Bank
                </Text>
                <Text className="text-[12px] text-[#434655] mt-0.5">
                  5 people waiting
                </Text>
              </View>
              <View className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex-row items-center justify-between">
                <Text className="text-[12px] font-bold text-[#1E40AF]">
                  12 min wait
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/queue-details/first-national-bank")}
                  className="h-8 px-3 rounded-lg bg-[#EAEDFF] items-center justify-center"
                >
                  <Text className="text-[12px] font-semibold text-[#131B2E]">Join</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Item 3 */}
            <View className="w-[230px] rounded-2xl bg-white border border-[#E2E7FF] p-3.5 shadow-2xs justify-between">
              <View>
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="px-2 py-0.5 rounded-md bg-[#EAEDFF]">
                    <Text className="text-[10px] font-bold text-[#434655] uppercase">
                      Laboratory
                    </Text>
                  </View>
                  <Text className="text-[11px] text-[#434655]">2.0 km</Text>
                </View>
                <Text
                  numberOfLines={1}
                  className="text-[15px] font-bold text-[#131B2E]"
                >
                  Pacific Diagnostic Lab
                </Text>
                <Text className="text-[12px] text-[#434655] mt-0.5">
                  11 people waiting
                </Text>
              </View>
              <View className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex-row items-center justify-between">
                <Text className="text-[12px] font-bold text-[#1E40AF]">
                  25 min wait
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/queue-details/pacific-lab")}
                  className="h-8 px-3 rounded-lg bg-[#EAEDFF] items-center justify-center"
                >
                  <Text className="text-[12px] font-semibold text-[#131B2E]">Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Footer Status Telemetry */}
        <View className="px-4 items-center">
          <View className="flex-row items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-[#F2F3FF]">
            <Ionicons name="checkmark-circle" size={15} color="#10B981" />
            <Text className="text-[11px] text-[#434655] font-medium">
              Syncing real-time line position • Updated just now
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
