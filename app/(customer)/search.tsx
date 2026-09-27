import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface FacilityQueue {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  imageUrl: string;
  waitingCount: number;
  estWait: string;
  status: string;
  isFastTrack?: boolean;
}

const MOCK_FACILITIES: FacilityQueue[] = [
  {
    id: "city-care-clinic",
    name: "City Care Clinic",
    category: "Medical",
    categoryColor: "bg-[#DBE1FF] text-[#00174B]",
    rating: 4.8,
    reviewCount: 124,
    distance: "1.2 km away",
    address: "742 Evergreen Terrace, Suite 100",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApGoW2M6EnjkWtt1wiqCK8D7eZ2QqObIvTULl6gedwgLs2nybjPEmOC_-Vmf3TtYHuZD7h85tfKz884SXlcI2nchAUOYTpbY4RVJRHK03rQ8VWiGj-db926CDBLh_I4rN4WOKTJlOYf7I-F_dnVXkupvhDA_2HHTXAAnQKUk-xgYhr0gCXr-8Z4roT8HEpXJqFTfGuKHxG_wQVVO0EL-Bg-Nx9jj0gRBPkIR7FDUCmaHY6MkpY3Teexw",
    waitingCount: 23,
    estWait: "~35 min",
    status: "Open • Accepting Queue",
  },
  {
    id: "st-jude-hospital",
    name: "St. Jude Hospital - OPD",
    category: "Hospital",
    categoryColor: "bg-[#DDE1FF] text-[#001453]",
    rating: 4.6,
    reviewCount: 310,
    distance: "2.8 km away",
    address: "1200 Mercy Boulevard",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5BYGNIi9tvBfdPj5MZ7X45_zFuvbKnBXo3mDMMAC5FQQYCv5zLqaMrD9LhSm4ghaSaOlyYo6Dp1T8eTO9mzDuSmWH0WnRP55iPIfhv07SMRFrVKr7DuBhkIdwlk_CPOaOBoEJLuZJva2xsYfiwP7fYrmAmRTR5uyKlIPPha-BbRzRL3eNzv5SHbNsLyPBVPXhyxwdeBWBufVhu3KKY0LG0FCxrVCP2fZKeogkS3KfkR3euDNw-PipYQ",
    waitingCount: 41,
    estWait: "~50 min",
    status: "Open • Accepting Queue",
  },
  {
    id: "express-medical",
    name: "Express Medical & Pediatric",
    category: "Medical",
    categoryColor: "bg-[#DBE1FF] text-[#00174B]",
    rating: 4.9,
    reviewCount: 88,
    distance: "3.5 km away",
    address: "450 Health Parkway",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVGvLBRi7CSaO7_yetHOhDWaJdFv2nRFH2xeN31rM26NNT-_br75F1d8lxPE4dfKaL3KSoPsVmYJ6dDEW8zWg-7zZl-1VFk_E71jGemmBtL7JYngs-4lrmwD-D42YJ37FClLiTpt-kmrrc1m8Ljnrwyv309Y3MKW_9-0oDv1BkcHYOTGESRU8hj9h_h3Q_fKDpmGIqBCNmzTAitqSHGzOQhi5GSioi5tOSIQvgKB2-gwVnXA0kN_Bn1Q",
    waitingCount: 7,
    estWait: "~12 min",
    status: "Open • Fast Queue",
    isFastTrack: true,
  },
];

type SearchViewState =
  | "results"
  | "filter-sheet"
  | "recent"
  | "empty"
  | "loading";

export default function SearchScreen() {
  const [viewState, setViewState] = useState<SearchViewState>("results");
  const [searchQuery, setSearchQuery] = useState("City Care");

  // Filter criteria states
  const [selectedCategory, setSelectedCategory] = useState("Medical");
  const [selectedDistance, setSelectedDistance] = useState("Within 5 km");
  const [openNow, setOpenNow] = useState(true);
  const [acceptingDigital, setAcceptingDigital] = useState(true);
  const [maxWait, setMaxWait] = useState("Under 30 min");
  const [sortBy, setSortBy] = useState("Shortest Wait");

  // Active filter chips state
  const [activeChips, setActiveChips] = useState([
    { id: "cat", label: "Medical", icon: "medkit-outline" as const },
    { id: "dist", label: "Within 5 km", icon: "navigate-outline" as const },
  ]);

  // Animated pulse for live status beacon
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

  const switchSearchState = (newState: SearchViewState) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Haptics fallback
    }
    setViewState(newState);
  };

  const clearSearch = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    setSearchQuery("");
    setViewState("recent");
  };

  const removeChip = (id: string) => {
    setActiveChips((prev) => prev.filter((c) => c.id !== id));
  };

  // Filter facilities based on search query
  const filteredFacilities = MOCK_FACILITIES.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* Top App Header */}
      <View className="h-14 px-4 bg-white/80 border-b border-[#E2E8F0] flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5 min-w-0">
          <View className="w-8 h-8 rounded-lg bg-[#FAF8FF] border border-[#E2E8F0] p-1 items-center justify-center">
            <Image
              source={require("../../assets/images/queueup-logo.png")}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">
              QueueUp
            </Text>
            <Text className="text-[17px] font-bold text-[#131B2E] leading-tight">
              Search
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            className="w-9 h-9 rounded-full bg-[#EAEDFF] items-center justify-center"
          >
            <Ionicons name="notifications-outline" size={18} color="#131B2E" />
          </TouchableOpacity>
          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Interactive Mock State Switcher (Pill Scroller matching Stitch) */}
      <View className="w-full px-4 py-1.5 bg-[#F2F3FF]/70 border-b border-[#E2E8F0]/60">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
        >
          <TouchableOpacity
            onPress={() => switchSearchState("results")}
            className={`px-3 py-1 rounded-full flex-row items-center gap-1.5 ${
              viewState === "results"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <View
              className={`w-1.5 h-1.5 rounded-full ${
                viewState === "results" ? "bg-emerald-300" : "bg-primary"
              }`}
            />
            <Text
              className={`text-[11px] font-semibold ${
                viewState === "results" ? "text-white" : "text-[#434655]"
              }`}
            >
              Results (Active)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => switchSearchState("filter-sheet")}
            className={`px-3 py-1 rounded-full flex-row items-center gap-1 ${
              viewState === "filter-sheet"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <Ionicons
              name="options-outline"
              size={12}
              color={viewState === "filter-sheet" ? "#FFFFFF" : "#434655"}
            />
            <Text
              className={`text-[11px] font-semibold ${
                viewState === "filter-sheet" ? "text-white" : "text-[#434655]"
              }`}
            >
              Filter Sheet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => switchSearchState("recent")}
            className={`px-3 py-1 rounded-full ${
              viewState === "recent"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <Text
              className={`text-[11px] font-semibold ${
                viewState === "recent" ? "text-white" : "text-[#434655]"
              }`}
            >
              Initial / Recent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => switchSearchState("empty")}
            className={`px-3 py-1 rounded-full ${
              viewState === "empty"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <Text
              className={`text-[11px] font-semibold ${
                viewState === "empty" ? "text-white" : "text-[#434655]"
              }`}
            >
              No Results
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => switchSearchState("loading")}
            className={`px-3 py-1 rounded-full ${
              viewState === "loading"
                ? "bg-primary shadow-xs"
                : "bg-[#EAEDFF]"
            }`}
          >
            <Text
              className={`text-[11px] font-semibold ${
                viewState === "loading" ? "text-white" : "text-[#434655]"
              }`}
            >
              Loading / Error
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Search Header Controls */}
      <View className="px-4 pt-3 pb-2 flex-row items-center gap-2.5">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/(customer)/home");
            }
          }}
          className="w-10 h-10 rounded-xl bg-[#EAEDFF] items-center justify-center shrink-0"
        >
          <Ionicons name="arrow-back" size={20} color="#434655" />
        </TouchableOpacity>

        {/* Input */}
        <View className="flex-1 relative flex-row items-center h-11 bg-white rounded-xl px-3 border border-[#E2E8F0] shadow-2xs">
          <Ionicons
            name="search"
            size={18}
            color="#2563EB"
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              if (txt.trim().length === 0) {
                setViewState("recent");
              } else if (
                MOCK_FACILITIES.filter((f) =>
                  f.name.toLowerCase().includes(txt.toLowerCase().trim())
                ).length === 0
              ) {
                setViewState("empty");
              } else {
                setViewState("results");
              }
            }}
            placeholder="Search clinics, hospitals, services..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-[14px] text-[#131B2E] p-0 h-full"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              className="w-6 h-6 rounded-full bg-[#EAEDFF] items-center justify-center"
            >
              <Ionicons name="close" size={13} color="#434655" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Sheet Trigger */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => switchSearchState("filter-sheet")}
          className="relative w-11 h-11 rounded-xl bg-primary items-center justify-center shadow-xs shrink-0"
        >
          <Ionicons name="options" size={20} color="#FFFFFF" />
          <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 items-center justify-center border-2 border-white">
            <Text className="text-[10px] font-bold text-white leading-none">
              2
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content Area Driven by State */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        className="flex-1"
      >
        {/* ================= STATE 1: ACTIVE SEARCH RESULTS ================= */}
        {viewState === "results" && (
          <View className="px-4 pt-1">
            {/* Active Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingVertical: 4 }}
            >
              {activeChips.map((chip) => (
                <View
                  key={chip.id}
                  className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DBE1FF] shadow-2xs"
                >
                  <Ionicons name={chip.icon} size={13} color="#00174B" />
                  <Text className="text-[11px] font-semibold text-[#00174B]">
                    {chip.label}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeChip(chip.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="w-4 h-4 rounded-full bg-[#B4C5FF] items-center justify-center ml-0.5"
                  >
                    <Ionicons name="close" size={10} color="#00174B" />
                  </TouchableOpacity>
                </View>
              ))}

              <View className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-[#EAEDFF]">
                <Ionicons name="speedometer-outline" size={13} color="#434655" />
                <Text className="text-[11px] font-medium text-[#434655]">
                  Shortest Wait
                </Text>
              </View>

              <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAEDFF]">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="text-[11px] font-medium text-[#434655]">
                  Accepting Queue
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => switchSearchState("filter-sheet")}
                className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-[#EAEDFF]"
              >
                <Ionicons name="add" size={14} color="#2563EB" />
                <Text className="text-[11px] font-bold text-primary">
                  Filter
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Live Counter Banner */}
            <View className="flex-row items-center justify-between pt-3 pb-2">
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="checkmark-circle" size={16} color="#2563EB" />
                <Text className="text-[13px] font-bold text-[#131B2E]">
                  {filteredFacilities.length} places with virtual queues
                </Text>
              </View>
              <Text className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">
                Live sync
              </Text>
            </View>

            {/* Cards Stream */}
            <View className="gap-3 pt-1">
              {filteredFacilities.map((fac) => (
                <View
                  key={fac.id}
                  className="bg-white rounded-2xl p-4 border border-[#E2E7FF] shadow-xs gap-3"
                >
                  <View className="flex-row items-start justify-between gap-2">
                    <View className="flex-1 min-w-0 mr-1">
                      <View className="flex-row items-center gap-1.5 mb-1">
                        <View className="px-2 py-0.5 rounded-full bg-[#DBE1FF]">
                          <Text className="text-[10px] font-bold text-[#00174B] uppercase">
                            {fac.category}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-0.5">
                          <Ionicons name="star" size={13} color="#F59E0B" />
                          <Text className="text-[12px] font-bold text-[#131B2E]">
                            {fac.rating}
                          </Text>
                          <Text className="text-[11px] text-[#434655]">
                            ({fac.reviewCount})
                          </Text>
                        </View>
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-[16px] font-bold text-[#131B2E] tracking-tight leading-snug"
                      >
                        {fac.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="text-[12px] text-[#434655] mt-0.5"
                      >
                        {fac.distance} • {fac.address}
                      </Text>
                    </View>

                    {/* Thumbnail with queue status indicator */}
                    <View className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#EAEDFF]">
                      <Image
                        source={{ uri: fac.imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <View className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border border-white" />
                    </View>
                  </View>

                  {/* Telemetry Metrics Row */}
                  <View className="grid grid-cols-2 flex-row gap-2 pt-0.5">
                    <View className="flex-1 bg-[#F2F3FF] rounded-xl p-2.5 flex-row items-center gap-2">
                      <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                        <Ionicons name="people" size={16} color="#2563EB" />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text className="text-[10px] font-bold text-[#434655] uppercase leading-none">
                          In Queue
                        </Text>
                        <Text className="text-[13px] font-bold text-[#131B2E] mt-0.5">
                          {fac.waitingCount} people
                        </Text>
                      </View>
                    </View>

                    <View
                      className={`flex-1 rounded-xl p-2.5 flex-row items-center gap-2 ${
                        fac.isFastTrack
                          ? "bg-emerald-50 border border-emerald-200/60"
                          : "bg-[#F2F3FF]"
                      }`}
                    >
                      <View
                        className={`w-8 h-8 rounded-full items-center justify-center ${
                          fac.isFastTrack ? "bg-emerald-100" : "bg-white"
                        }`}
                      >
                        <Ionicons
                          name={fac.isFastTrack ? "flash" : "hourglass-outline"}
                          size={15}
                          color={fac.isFastTrack ? "#006242" : "#1E40AF"}
                        />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text
                          className={`text-[10px] font-bold uppercase leading-none ${
                            fac.isFastTrack ? "text-emerald-800" : "text-[#434655]"
                          }`}
                        >
                          {fac.isFastTrack ? "Fast Track" : "Est. Wait"}
                        </Text>
                        <Text
                          className={`text-[13px] font-bold mt-0.5 ${
                            fac.isFastTrack ? "text-emerald-800" : "text-[#1E40AF]"
                          }`}
                        >
                          {fac.estWait}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Status & CTA */}
                  <View className="flex-row items-center justify-between pt-0.5">
                    <View className="flex-row items-center gap-1.5">
                      <Animated.View
                        style={{ opacity: pulseAnim }}
                        className="w-2 h-2 rounded-full bg-emerald-500"
                      />
                      <Text className="text-[12px] font-semibold text-emerald-800">
                        {fac.status}
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => router.push(`/queue-details/${fac.id}` as any)}
                      className="px-4 py-2 rounded-xl bg-primary shadow-2xs active:bg-blue-700"
                    >
                      <Text className="text-[12px] font-semibold text-white">
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ================= STATE 2: FILTER MODAL / SHEET ================= */}
        {viewState === "filter-sheet" && (
          <View className="px-4 pt-1">
            <View className="bg-white rounded-2xl p-4 border border-[#E2E7FF] shadow-sm gap-4">
              {/* Sheet Header */}
              <View className="flex-row items-center justify-between pb-2 border-b border-[#EAEDFF]">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="options" size={20} color="#2563EB" />
                  <Text className="text-[18px] font-bold text-[#131B2E]">
                    Filter Queues
                  </Text>
                </View>
                <View className="flex-row items-center gap-2.5">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory("Medical");
                      setSelectedDistance("Within 5 km");
                      setMaxWait("Under 30 min");
                      setSortBy("Shortest Wait");
                    }}
                  >
                    <Text className="text-[12px] font-semibold text-primary">
                      Reset All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => switchSearchState("results")}
                    className="w-7 h-7 rounded-full bg-[#EAEDFF] items-center justify-center"
                  >
                    <Ionicons name="close" size={15} color="#434655" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Categories Grid */}
              <View className="gap-1.5">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Category
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { label: "Medical", icon: "medkit" as const },
                    { label: "Hospital", icon: "business" as const },
                    { label: "Dining", icon: "restaurant" as const },
                    { label: "Bank", icon: "card" as const },
                    { label: "Civic", icon: "earth" as const },
                    { label: "Service", icon: "construct" as const },
                  ].map((cat) => {
                    const isSel = selectedCategory === cat.label;
                    return (
                      <TouchableOpacity
                        key={cat.label}
                        onPress={() => setSelectedCategory(cat.label)}
                        className={`flex-row items-center justify-center gap-1.5 py-2 px-3 rounded-xl min-w-[30%] flex-1 ${
                          isSel
                            ? "bg-primary shadow-2xs"
                            : "bg-[#EAEDFF]"
                        }`}
                      >
                        <Ionicons
                          name={cat.icon}
                          size={14}
                          color={isSel ? "#FFFFFF" : "#434655"}
                        />
                        <Text
                          className={`text-[12px] font-semibold ${
                            isSel ? "text-white" : "text-[#434655]"
                          }`}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Distance Grid */}
              <View className="gap-1.5">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Distance
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    "Within 1 km",
                    "Within 5 km",
                    "Within 10 km",
                    "Any distance",
                  ].map((dist) => {
                    const isSel = selectedDistance === dist;
                    return (
                      <TouchableOpacity
                        key={dist}
                        onPress={() => setSelectedDistance(dist)}
                        className={`flex-row items-center justify-between py-2.5 px-3 rounded-xl min-w-[48%] flex-1 ${
                          isSel
                            ? "bg-[#DBE1FF] border border-primary/30"
                            : "bg-[#F2F3FF]"
                        }`}
                      >
                        <Text
                          className={`text-[12px] ${
                            isSel
                              ? "font-bold text-[#00174B]"
                              : "font-medium text-[#131B2E]"
                          }`}
                        >
                          {dist}
                        </Text>
                        <View
                          className={`w-3.5 h-3.5 rounded-full items-center justify-center ${
                            isSel ? "bg-primary" : "bg-[#CBD5E1]"
                          }`}
                        >
                          {isSel && (
                            <View className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Status Toggles */}
              <View className="gap-2">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Queue Status
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setOpenNow(!openNow)}
                  className="flex-row items-center justify-between p-3 rounded-xl bg-[#F2F3FF]"
                >
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="storefront-outline" size={18} color="#2563EB" />
                    <View>
                      <Text className="text-[13px] font-bold text-[#131B2E]">
                        Open Now
                      </Text>
                      <Text className="text-[11px] text-[#434655]">
                        Exclude currently closed branches
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`w-11 h-6 rounded-full p-0.5 justify-center ${
                      openNow ? "bg-primary items-end" : "bg-slate-300 items-start"
                    }`}
                  >
                    <View className="w-5 h-5 rounded-full bg-white shadow-2xs" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setAcceptingDigital(!acceptingDigital)}
                  className="flex-row items-center justify-between p-3 rounded-xl bg-[#F2F3FF]"
                >
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="ticket-outline" size={18} color="#007D55" />
                    <View>
                      <Text className="text-[13px] font-bold text-[#131B2E]">
                        Accepting Digital Queue
                      </Text>
                      <Text className="text-[11px] text-[#434655]">
                        Virtual tickets active and issuing
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`w-11 h-6 rounded-full p-0.5 justify-center ${
                      acceptingDigital
                        ? "bg-primary items-end"
                        : "bg-slate-300 items-start"
                    }`}
                  >
                    <View className="w-5 h-5 rounded-full bg-white shadow-2xs" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Max Waiting Time */}
              <View className="gap-1.5">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Max Waiting Time
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {[
                    "Under 15 min",
                    "Under 30 min",
                    "Under 60 min",
                    "Any wait",
                  ].map((time) => {
                    const isSel = maxWait === time;
                    return (
                      <TouchableOpacity
                        key={time}
                        onPress={() => setMaxWait(time)}
                        className={`py-2 px-3 rounded-xl ${
                          isSel ? "bg-primary shadow-xs" : "bg-[#EAEDFF]"
                        }`}
                      >
                        <Text
                          className={`text-[12px] font-semibold ${
                            isSel ? "text-white" : "text-[#434655]"
                          }`}
                        >
                          {time}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Sort By */}
              <View className="gap-1.5">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Sort By
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    "Shortest Wait",
                    "Nearest Distance",
                    "Highest Rated",
                    "Most Popular",
                  ].map((sort) => {
                    const isSel = sortBy === sort;
                    return (
                      <TouchableOpacity
                        key={sort}
                        onPress={() => setSortBy(sort)}
                        className={`py-2 px-3 rounded-xl min-w-[48%] flex-1 items-center justify-center ${
                          isSel
                            ? "bg-[#DBE1FF] border border-primary/30"
                            : "bg-[#F2F3FF]"
                        }`}
                      >
                        <Text
                          className={`text-[12px] ${
                            isSel
                              ? "font-bold text-[#00174B]"
                              : "font-medium text-[#434655]"
                          }`}
                        >
                          {sort}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => switchSearchState("results")}
                className="w-full h-12 rounded-xl bg-primary flex-row items-center justify-center gap-2 shadow-xs active:bg-blue-700 mt-1"
              >
                <Text className="text-[14px] font-bold text-white">
                  Apply Filters (14 places)
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= STATE 3: INITIAL / RECENT SEARCHES ================= */}
        {viewState === "recent" && (
          <View className="px-4 pt-1 gap-4">
            {/* Quick Category Chips */}
            <View className="gap-2">
              <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                Browse by Category
              </Text>
              <View className="flex-row gap-2">
                {[
                  {
                    name: "Clinics",
                    icon: "medkit" as const,
                    bg: "bg-[#DBE1FF]",
                    color: "#00174B",
                  },
                  {
                    name: "Banks",
                    icon: "card" as const,
                    bg: "bg-[#DDE1FF]",
                    color: "#001453",
                  },
                  {
                    name: "Dining",
                    icon: "restaurant" as const,
                    bg: "bg-emerald-100",
                    color: "#006242",
                  },
                  {
                    name: "Civic",
                    icon: "mail" as const,
                    bg: "bg-slate-200",
                    color: "#131B2E",
                  },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => {
                      setSearchQuery(item.name);
                      switchSearchState("results");
                    }}
                    className="flex-1 items-center justify-center p-2.5 rounded-xl bg-white border border-[#E2E7FF] shadow-2xs"
                  >
                    <View
                      className={`w-9 h-9 rounded-full ${item.bg} items-center justify-center mb-1`}
                    >
                      <Ionicons name={item.icon} size={18} color={item.color} />
                    </View>
                    <Text className="text-[12px] font-semibold text-[#131B2E]">
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Searches List */}
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text className="text-[12px] font-semibold text-primary">
                    Clear all
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-white rounded-2xl border border-[#E2E7FF] shadow-2xs overflow-hidden divide-y divide-[#EAEDFF]">
                {[
                  {
                    title: "Cardiology consultation",
                    meta: "Near Downtown • Yesterday",
                  },
                  {
                    title: "Passport Renewal Agency",
                    meta: "District Civic Hub • 3 days ago",
                  },
                  {
                    title: "Metro Blood Testing Lab",
                    meta: "West Avenue • 1 week ago",
                  },
                ].map((rec) => (
                  <TouchableOpacity
                    key={rec.title}
                    onPress={() => {
                      setSearchQuery(rec.title);
                      switchSearchState("results");
                    }}
                    className="flex-row items-center justify-between p-3.5 active:bg-[#F2F3FF]"
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="time-outline" size={18} color="#434655" />
                      <View>
                        <Text className="text-[14px] font-medium text-[#131B2E]">
                          {rec.title}
                        </Text>
                        <Text className="text-[11px] text-[#434655] mt-0.5">
                          {rec.meta}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="arrow-up-outline" size={16} color="#434655" style={{ transform: [{ rotate: "45deg" }] }} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Suggested Discovery Spot */}
            <TouchableOpacity
              activeOpacity={0.85}
              className="bg-white rounded-2xl p-4 border border-[#E2E7FF] shadow-2xs flex-row items-center gap-3"
            >
              <View className="w-12 h-12 rounded-xl bg-emerald-100 items-center justify-center">
                <Ionicons name="map-outline" size={24} color="#007D55" />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-[14px] font-bold text-[#131B2E]">
                  Explore Map Directory
                </Text>
                <Text className="text-[12px] text-[#434655]">
                  See real-time wait hotspots in your city
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STATE 4: NO RESULTS VIEW ================= */}
        {viewState === "empty" && (
          <View className="px-6 pt-10 items-center text-center">
            <View className="w-24 h-24 rounded-full bg-[#EAEDFF] items-center justify-center mb-4 relative">
              <Ionicons name="search-outline" size={44} color="#737686" />
              <View className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 border border-white" />
            </View>
            <Text className="text-[20px] font-bold text-[#131B2E]">
              No queues found
            </Text>
            <Text className="text-[13px] text-[#434655] text-center max-w-[260px] mt-1.5 mb-6 leading-relaxed">
              {"We couldn't find active queues matching"} &quot;{searchQuery || "your search"}&quot; {"with the selected filters."}
            </Text>

            <View className="w-full max-w-[280px] gap-2.5">
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  switchSearchState("results");
                }}
                className="w-full h-11 rounded-xl bg-primary flex-row items-center justify-center gap-1.5 shadow-xs"
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text className="text-[13px] font-semibold text-white">
                  Clear Filters
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => switchSearchState("recent")}
                className="w-full h-11 rounded-xl bg-[#EAEDFF] items-center justify-center"
              >
                <Text className="text-[13px] font-semibold text-[#131B2E]">
                  Try Another Search
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= STATE 5: LOADING / SKELETON STATE ================= */}
        {viewState === "loading" && (
          <View className="px-4 pt-1 gap-3.5">
            {/* Error Notification Banner */}
            <View className="bg-red-50 border border-red-200 p-3.5 rounded-2xl flex-row items-start gap-2.5 shadow-2xs">
              <Ionicons name="cloud-offline" size={20} color="#BA1A1A" style={{ marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-[13px] font-bold text-[#BA1A1A]">
                  Network timeout
                </Text>
                <Text className="text-[11px] text-red-700 mt-0.5">
                  Unable to sync real-time queue data. Check connection.
                </Text>
                <View className="flex-row items-center gap-2 mt-2">
                  <TouchableOpacity
                    onPress={() => switchSearchState("results")}
                    className="px-3 py-1 rounded-lg bg-white border border-red-200"
                  >
                    <Text className="text-[11px] font-bold text-[#BA1A1A]">
                      Retry Now
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => switchSearchState("results")}>
                    <Text className="text-[11px] font-medium text-red-700 underline">
                      Work Offline
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Skeleton Loading Cards */}
            <View className="gap-3">
              {[1, 2].map((k) => (
                <View
                  key={k}
                  className="bg-white rounded-2xl p-4 border border-[#E2E7FF] shadow-2xs gap-3"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 gap-2">
                      <View className="h-3 w-16 bg-[#EAEDFF] rounded-full" />
                      <View className="h-5 w-40 bg-[#EAEDFF] rounded-md" />
                      <View className="h-3 w-32 bg-[#F2F3FF] rounded-md" />
                    </View>
                    <View className="w-16 h-16 rounded-xl bg-[#EAEDFF]" />
                  </View>
                  <View className="flex-row gap-2">
                    <View className="flex-1 h-12 bg-[#F2F3FF] rounded-xl" />
                    <View className="flex-1 h-12 bg-[#F2F3FF] rounded-xl" />
                  </View>
                  <View className="flex-row items-center justify-between pt-1">
                    <View className="h-3 w-28 bg-[#EAEDFF] rounded-full" />
                    <View className="h-8 w-24 bg-[#EAEDFF] rounded-xl" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
