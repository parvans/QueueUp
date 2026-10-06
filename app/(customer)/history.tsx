import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Share,
  Modal,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

type ViewMode = "normal" | "empty";
type FilterCategory = "all" | "medical" | "hospital" | "pediatric" | "completed" | "cancelled";

export interface HistoryRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  department: string;
  category: "medical" | "hospital" | "pediatric" | "urgent";
  ticketNumber: string;
  date: string;
  year: number;
  status: "Completed" | "Cancelled";
  waitedTime: string;
  serviceTime?: string;
  calledTime?: string;
  savedTime: string;
  rating?: number;
  doctor?: string;
  stationOrCounter?: string;
  joinedTime: string;
  completedTime?: string;
  receiptNumber?: string;
  cancelledReason?: string;
  cancelledTime?: string;
}

const HISTORY_MOCK_DATA: HistoryRecord[] = [
  {
    id: "hist-1",
    facilityId: "city-care-clinic",
    facilityName: "City Care Clinic",
    department: "Medical • General OPD",
    category: "medical",
    ticketNumber: "A-047",
    date: "Sep 24, 2026",
    year: 2026,
    status: "Completed",
    waitedTime: "26 min",
    serviceTime: "6 min",
    savedTime: "~39 min",
    rating: 5.0,
    doctor: "Dr. Martinez",
    stationOrCounter: "Desk 04",
    joinedTime: "10:42 AM",
    calledTime: "11:02 AM",
    completedTime: "11:08 AM",
    receiptNumber: "REC-773910",
  },
  {
    id: "hist-2",
    facilityId: "st-jude-hospital",
    facilityName: "St. Jude Hospital - Specialist OPD",
    department: "Hospital • Cardiology OPD",
    category: "hospital",
    ticketNumber: "B-108",
    date: "Sep 20, 2026",
    year: 2026,
    status: "Completed",
    waitedTime: "42 min",
    calledTime: "2:15 PM",
    savedTime: "~35 min",
    rating: 4.8,
    doctor: "Dr. David Vance",
    stationOrCounter: "Room 402 • Counter 1",
    joinedTime: "1:30 PM",
    completedTime: "2:27 PM",
    receiptNumber: "REC-910244",
  },
  {
    id: "hist-3",
    facilityId: "express-medical",
    facilityName: "Express Medical & Pediatric",
    department: "Pediatric Triage • Clinic Desk",
    category: "pediatric",
    ticketNumber: "E-019",
    date: "Aug 14, 2026",
    year: 2026,
    status: "Completed",
    waitedTime: "18 min",
    stationOrCounter: "Window 06",
    savedTime: "~25 min",
    rating: 5.0,
    doctor: "Dr. Rachel Green",
    joinedTime: "10:23 AM",
    calledTime: "10:35 AM",
    completedTime: "10:44 AM",
    receiptNumber: "REC-883921",
  },
  {
    id: "hist-4",
    facilityId: "metro-health-urgent",
    facilityName: "Metro Health Urgent Care",
    department: "Medical • Urgent Triage",
    category: "urgent",
    ticketNumber: "M-008",
    date: "Jul 03, 2026",
    year: 2026,
    status: "Cancelled",
    waitedTime: "4 min",
    cancelledReason: "Cancelled by user after 4 min waiting",
    cancelledTime: "10:14 AM",
    savedTime: "0 min",
    joinedTime: "10:10 AM",
  },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  // State Management
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const [isOfflineVisible, setIsOfflineVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("all");
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<HistoryRecord | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(5);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return HISTORY_MOCK_DATA.filter((item) => {
      // 1. Text Search matching facility name, department, ticket number, date, or doctor
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        item.facilityName.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query) ||
        item.ticketNumber.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        (item.doctor && item.doctor.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. Category Filter
      if (selectedFilter === "all") return true;
      if (selectedFilter === "completed") return item.status === "Completed";
      if (selectedFilter === "cancelled") return item.status === "Cancelled";
      if (selectedFilter === "medical") return item.category === "medical" || item.category === "urgent";
      if (selectedFilter === "hospital") return item.category === "hospital";
      if (selectedFilter === "pediatric") return item.category === "pediatric";

      return true;
    });
  }, [searchQuery, selectedFilter]);

  // Handlers
  const handleSwitchView = (mode: ViewMode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    setViewMode(mode);
  };

  const handleToggleOffline = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } catch {}
    setIsOfflineVisible(!isOfflineVisible);
  };

  const handleOpenDetailSheet = (record?: HistoryRecord) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    const target = record || HISTORY_MOCK_DATA[0];
    setSelectedDetailRecord(target);
    setUserRating(target.rating || 5);
    setIsDetailSheetOpen(true);
  };

  const handleCloseDetailSheet = () => {
    setIsDetailSheetOpen(false);
  };

  const handleDownloadSlip = async (record: HistoryRecord) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      await Share.share({
        title: `QueueUp Slip — ${record.ticketNumber}`,
        message: `QueueUp Verified Ticket Slip\n\nFacility: ${record.facilityName}\nDepartment: ${record.department}\nTicket: ${record.ticketNumber}\nDate: ${record.date}\nStatus: ${record.status}\nTotal Wait: ${record.waitedTime}\nReceipt: ${record.receiptNumber || "#REC-VERIFIED"}`,
      });
    } catch {
      Alert.alert(
        "Digital Slip Downloaded",
        `Slip for ticket ${record.ticketNumber} at ${record.facilityName} has been saved to your offline records.`
      );
    }
  };

  const handleRejoinQueue = (facilityId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    setIsDetailSheetOpen(false);
    router.push(`/queue-details/${facilityId}` as any);
  };

  const handleNavigateToCompletedSummary = (facilityId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
    setIsDetailSheetOpen(false);
    router.push(`/queue-completed/${facilityId}` as any);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      {/* 1. Header matching Stitch Screen 15 */}
      <View className="h-16 px-4 bg-white/80 border-b border-[#E2E8F0] flex-row items-center justify-between z-30">
        <View className="flex-row items-center gap-2.5 min-w-0 flex-1 mr-2">
          <Image
            source={require("@/assets/images/queueup-logo.png")}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />

          <View className="flex-col min-w-0 flex-1">
            <View className="flex-row items-center gap-1.5 leading-none">
              <Text className="text-base font-bold text-[#004AC6] tracking-tight">QueueUp</Text>
              <Text className="text-xs text-[#737686] font-semibold">•</Text>
              <Text numberOfLines={1} className="text-base font-semibold text-[#131B2E] truncate">
                History
              </Text>
            </View>
            <Text className="text-[10px] font-bold text-[#737686] uppercase tracking-wider mt-0.5">
              Past Queues & Activity
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5 shrink-0">
          <TouchableOpacity
            accessibilityLabel="Notifications"
            activeOpacity={0.7}
            onPress={() => router.push("/notifications" as any)}
            className="w-9 h-9 rounded-full bg-[#F2F3FF] items-center justify-center active:bg-[#EAEDFF]"
          >
            <Ionicons name="notifications-outline" size={19} color="#434655" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Profile"
            activeOpacity={0.8}
            onPress={() => router.push("/(customer)/profile" as any)}
            className="w-9 h-9 rounded-full bg-[#004AC6] items-center justify-center shadow-sm"
          >
            <Ionicons name="person" size={17} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
        }}
        className="flex-1"
      >
        <View className="flex-col gap-3.5 w-full">
          {/* 2. Top Fidelity Switcher Toolbar */}
          <View className="w-full bg-[#E2E7FF]/60 p-1 rounded-xl flex-row items-center justify-between gap-1 shadow-sm">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSwitchView("normal")}
              className="flex-1 py-1.5 px-2 rounded-lg flex-row items-center justify-center"
              style={viewMode === "normal" ? styles.activeTabPill : undefined}
            >
              <Text
                className={`text-xs font-semibold ${
                  viewMode === "normal" ? "text-[#004AC6]" : "text-[#434655]"
                }`}
              >
                Standard View
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleOpenDetailSheet(HISTORY_MOCK_DATA[0])}
              className="flex-1 py-1.5 px-2 rounded-lg flex-row items-center justify-center"
            >
              <Text className="text-xs font-medium text-[#434655]">Detail Sheet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSwitchView("empty")}
              className="flex-1 py-1.5 px-2 rounded-lg flex-row items-center justify-center"
              style={viewMode === "empty" ? styles.activeTabPill : undefined}
            >
              <Text
                className={`text-xs font-semibold ${
                  viewMode === "empty" ? "text-[#004AC6]" : "text-[#434655]"
                }`}
              >
                Empty State
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleOffline}
              className="py-1.5 px-2.5 rounded-lg flex-row items-center gap-1"
            >
              <Ionicons
                name={isOfflineVisible ? "cloud-offline" : "cloud-offline-outline"}
                size={14}
                color={isOfflineVisible ? "#004AC6" : "#434655"}
              />
              <Text
                className={`text-xs ${
                  isOfflineVisible ? "font-bold text-[#004AC6]" : "font-medium text-[#434655]"
                }`}
              >
                Offline
              </Text>
            </TouchableOpacity>
          </View>

          {/* 3. Offline Mode Banner (collapsible) */}
          {isOfflineVisible && (
            <View
              className="w-full bg-[#283044] p-3.5 rounded-xl flex-row items-center justify-between gap-2.5"
              style={styles.bannerShadow}
            >
              <View className="flex-row items-center gap-2.5 min-w-0 flex-1">
                <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center shrink-0">
                  <Ionicons name="cloud-offline" size={17} color="#B8C4FF" />
                </View>
                <View className="flex-col min-w-0 flex-1">
                  <Text className="text-xs font-bold text-[#EEF0FF] leading-tight">
                    Offline Mode
                  </Text>
                  <Text numberOfLines={1} className="text-[11px] text-[#E2E7FF] mt-0.5">
                    Your last queue information is still available.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsOfflineVisible(false)}
                className="w-7 h-7 rounded-full items-center justify-center bg-white/10"
              >
                <Ionicons name="close" size={16} color="#EEF0FF" />
              </TouchableOpacity>
            </View>
          )}

          {/* 4. QueueUp Impact Hero Banner */}
          <View
            className="w-full bg-[#004AC6] p-4 rounded-2xl relative overflow-hidden flex-row items-center justify-between"
            style={styles.cardShadow}
          >
            <View className="flex-col z-10 flex-1 pr-3">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                QueueUp Impact
              </Text>
              <View className="flex-row items-baseline gap-1 mt-0.5">
                <Text className="text-2xl font-extrabold text-white tracking-tight leading-none">
                  1h 48m
                </Text>
                <Text className="text-xs text-white/80 font-medium">saved in total</Text>
              </View>
              <Text className="text-xs text-white/90 font-medium mt-1">
                4 visits completed via virtual queue
              </Text>
            </View>

            <View className="w-13 h-13 rounded-full bg-white/15 items-center justify-center shrink-0 z-10 p-3">
              <Ionicons name="time" size={26} color="#FFFFFF" />
            </View>

            {/* Subtle decorative circles */}
            <View className="absolute -right-4 -bottom-6 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
            <View className="absolute -left-6 -top-6 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />
          </View>

          {/* 5. Search Bar & Horizontal Filter Chips */}
          <View className="flex-col gap-2.5 w-full">
            {/* Search Input */}
            <View className="relative w-full">
              <View className="absolute left-3.5 top-3.5 z-10">
                <Ionicons name="search" size={18} color="#737686" />
              </View>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search past queues, tickets, places..."
                placeholderTextColor="#737686"
                className="w-full pl-10 pr-9 py-2.5 bg-white text-[#131B2E] rounded-xl text-sm border border-[#E2E8F0]"
                style={styles.cardShadowSm}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSearchQuery("")}
                  className="absolute right-3 top-3 z-10"
                >
                  <Ionicons name="close-circle" size={18} color="#737686" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Chips Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 py-0.5">
              <View className="flex-row items-center gap-2">
                {/* Date Dropdown Filter */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    Alert.alert(
                      "Date Range Filter",
                      "Showing all queue activity for 2026. Custom calendar date pickers available."
                    )
                  }
                  className="flex-row items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#004AC6]"
                  style={styles.buttonShadow}
                >
                  <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
                  <Text className="text-xs font-semibold text-white">All 2026</Text>
                  <Ionicons name="chevron-down" size={13} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Filter: All */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedFilter("all")}
                  className={`py-1.5 px-3.5 rounded-full border border-[#E2E8F0] ${
                    selectedFilter === "all" ? "bg-[#DBE1FF] border-[#004AC6]" : "bg-white"
                  }`}
                  style={styles.cardShadowSm}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      selectedFilter === "all" ? "text-[#004AC6]" : "text-[#434655]"
                    }`}
                  >
                    All ({HISTORY_MOCK_DATA.length})
                  </Text>
                </TouchableOpacity>

                {/* Filter: Medical */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedFilter(selectedFilter === "medical" ? "all" : "medical")}
                  className={`py-1.5 px-3.5 rounded-full border border-[#E2E8F0] ${
                    selectedFilter === "medical" ? "bg-[#DBE1FF] border-[#004AC6]" : "bg-white"
                  }`}
                  style={styles.cardShadowSm}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      selectedFilter === "medical" ? "text-[#004AC6]" : "text-[#434655]"
                    }`}
                  >
                    Medical (2)
                  </Text>
                </TouchableOpacity>

                {/* Filter: Hospital */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setSelectedFilter(selectedFilter === "hospital" ? "all" : "hospital")
                  }
                  className={`py-1.5 px-3.5 rounded-full border border-[#E2E8F0] ${
                    selectedFilter === "hospital" ? "bg-[#DBE1FF] border-[#004AC6]" : "bg-white"
                  }`}
                  style={styles.cardShadowSm}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      selectedFilter === "hospital" ? "text-[#004AC6]" : "text-[#434655]"
                    }`}
                  >
                    Hospital (1)
                  </Text>
                </TouchableOpacity>

                {/* Filter: Pediatric */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setSelectedFilter(selectedFilter === "pediatric" ? "all" : "pediatric")
                  }
                  className={`py-1.5 px-3.5 rounded-full border border-[#E2E8F0] ${
                    selectedFilter === "pediatric" ? "bg-[#DBE1FF] border-[#004AC6]" : "bg-white"
                  }`}
                  style={styles.cardShadowSm}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      selectedFilter === "pediatric" ? "text-[#004AC6]" : "text-[#434655]"
                    }`}
                  >
                    Pediatric (1)
                  </Text>
                </TouchableOpacity>

                {/* Filter: Completed */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setSelectedFilter(selectedFilter === "completed" ? "all" : "completed")
                  }
                  className={`py-1.5 px-3.5 rounded-full border border-[#E2E8F0] ${
                    selectedFilter === "completed" ? "bg-[#DBE1FF] border-[#004AC6]" : "bg-white"
                  }`}
                  style={styles.cardShadowSm}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      selectedFilter === "completed" ? "text-[#004AC6]" : "text-[#434655]"
                    }`}
                  >
                    Completed (3)
                  </Text>
                </TouchableOpacity>

                {/* Filter: Cancelled */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setSelectedFilter(selectedFilter === "cancelled" ? "all" : "cancelled")
                  }
                  className={`py-1.5 px-3.5 rounded-full border border-[#E2E8F0] ${
                    selectedFilter === "cancelled" ? "bg-[#DBE1FF] border-[#004AC6]" : "bg-white"
                  }`}
                  style={styles.cardShadowSm}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      selectedFilter === "cancelled" ? "text-[#004AC6]" : "text-[#434655]"
                    }`}
                  >
                    Cancelled (1)
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* 6. Main Content Area */}
          {viewMode === "empty" || filteredRecords.length === 0 ? (
            /* EMPTY STATE VIEW */
            <View
              className="flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-2xl border border-[#E2E8F0] gap-4 mt-2"
              style={styles.cardShadow}
            >
              <View className="w-20 h-20 rounded-full bg-[#EAEDFF] items-center justify-center relative">
                <Ionicons name="hourglass-outline" size={38} color="#004AC6" />
                <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#007D55] items-center justify-center shadow-sm">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              </View>

              <View className="flex-col gap-1 items-center max-w-xs">
                <Text className="text-lg font-bold text-[#131B2E]">No queue history yet</Text>
                <Text className="text-xs text-[#434655] text-center leading-relaxed">
                  When you finish or leave appointments and services, their telemetry and digital
                  slips appear here.
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/(customer)/search" as any)}
                className="h-12 px-6 rounded-full bg-[#004AC6] flex-row items-center justify-center gap-2 mt-1"
                style={styles.buttonShadow}
              >
                <Ionicons name="search" size={18} color="#FFFFFF" />
                <Text className="text-sm font-bold text-white">Find a Queue Near You</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* STANDARD VIEW: History Cards List */
            <View className="flex-col gap-3.5 w-full">
              {filteredRecords.map((item) => {
                const isCompleted = item.status === "Completed";

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.92}
                    onPress={() => handleOpenDetailSheet(item)}
                    className="w-full bg-white rounded-2xl p-4 border border-[#E2E8F0] flex-col gap-3"
                    style={styles.cardShadow}
                  >
                    {/* Upper Row: Icon, Titles, Status Badge & Ticket */}
                    <View className="flex-row items-start justify-between gap-2.5">
                      <View className="flex-row items-start gap-3 flex-1 min-w-0">
                        {/* Service Icon */}
                        <View
                          className={`w-11 h-11 rounded-xl items-center justify-center shrink-0 ${
                            item.category === "medical"
                              ? "bg-[#007D55]/15"
                              : item.category === "hospital"
                              ? "bg-[#DBE1FF]"
                              : item.category === "pediatric"
                              ? "bg-[#EAEDFF]"
                              : "bg-[#FFDAD6]"
                          }`}
                        >
                          <Ionicons
                            name={
                              item.category === "medical"
                                ? "medkit"
                                : item.category === "hospital"
                                ? "pulse"
                                : item.category === "pediatric"
                                ? "people"
                                : "close-circle"
                            }
                            size={22}
                            color={
                              item.category === "medical"
                                ? "#007D55"
                                : item.category === "hospital"
                                ? "#004AC6"
                                : item.category === "pediatric"
                                ? "#3755C3"
                                : "#BA1A1A"
                            }
                          />
                        </View>

                        {/* Title & Department Meta */}
                        <View className="flex-col flex-1 min-w-0">
                          <Text className="text-[10px] font-bold uppercase text-[#737686] tracking-wider">
                            {item.department}
                          </Text>
                          <Text
                            numberOfLines={1}
                            className="text-base font-bold text-[#131B2E] mt-0.5 truncate"
                          >
                            {item.facilityName}
                          </Text>
                          <Text className="text-xs text-[#737686] mt-0.5">{item.date}</Text>
                        </View>
                      </View>

                      {/* Right Status Badge & Ticket Number */}
                      <View className="flex-col items-end gap-1 shrink-0">
                        <View
                          className={`flex-row items-center gap-1.5 px-2.5 py-0.5 rounded-full ${
                            isCompleted ? "bg-[#007D55]/10" : "bg-[#FFDAD6]"
                          }`}
                        >
                          <View
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCompleted ? "bg-[#007D55]" : "bg-[#BA1A1A]"
                            }`}
                          />
                          <Text
                            className={`text-[11px] font-bold ${
                              isCompleted ? "text-[#007D55]" : "text-[#BA1A1A]"
                            }`}
                          >
                            {item.status}
                          </Text>
                        </View>
                        <Text
                          className={`text-lg font-extrabold ${
                            isCompleted ? "text-[#004AC6]" : "text-[#737686]"
                          }`}
                        >
                          #{item.ticketNumber}
                        </Text>
                      </View>
                    </View>

                    {/* Middle Telemetry Box */}
                    {isCompleted ? (
                      <View className="flex-row items-center justify-between bg-[#F2F3FF] p-2.5 rounded-xl text-center">
                        <View className="flex-1 items-center">
                          <Text className="text-[10px] font-bold text-[#737686] uppercase">
                            Waited
                          </Text>
                          <Text className="text-xs font-bold text-[#131B2E] mt-0.5">
                            {item.waitedTime}
                          </Text>
                        </View>
                        <View className="w-px h-6 bg-[#DAE2FD]" />
                        <View className="flex-1 items-center">
                          <Text className="text-[10px] font-bold text-[#737686] uppercase">
                            {item.serviceTime
                              ? "Service"
                              : item.calledTime
                              ? "Called"
                              : item.stationOrCounter
                              ? "Counter"
                              : "Duration"}
                          </Text>
                          <Text className="text-xs font-bold text-[#131B2E] mt-0.5">
                            {item.serviceTime ||
                              item.calledTime ||
                              item.stationOrCounter ||
                              "Verified"}
                          </Text>
                        </View>
                        <View className="w-px h-6 bg-[#DAE2FD]" />
                        <View className="flex-1 items-center">
                          <Text className="text-[10px] font-bold text-[#007D55] uppercase">
                            Saved
                          </Text>
                          <Text className="text-xs font-bold text-[#007D55] mt-0.5">
                            {item.savedTime}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      /* Cancelled Notice Box */
                      <View className="bg-[#F2F3FF] p-2.5 rounded-xl flex-row items-center justify-between">
                        <Text className="text-xs text-[#434655] font-medium flex-1 mr-2">
                          {item.cancelledReason}
                        </Text>
                        <Text className="text-xs text-[#737686] font-semibold">
                          {item.cancelledTime}
                        </Text>
                      </View>
                    )}

                    {/* Bottom Action / Meta Row */}
                    <View className="flex-row items-center justify-between pt-1">
                      {item.id === "hist-1" ? (
                        <>
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="star" size={15} color="#007D55" />
                            <Text className="text-xs font-bold text-[#007D55]">5.0 Rated</Text>
                          </View>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleNavigateToCompletedSummary(item.facilityId)}
                            className="flex-row items-center gap-1"
                          >
                            <Text className="text-xs font-bold text-[#004AC6]">
                              View Ticket Summary
                            </Text>
                            <Ionicons name="chevron-forward" size={14} color="#004AC6" />
                          </TouchableOpacity>
                        </>
                      ) : item.id === "hist-2" ? (
                        <>
                          <Text className="text-xs text-[#737686]">
                            Room 402 • {item.doctor}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleRejoinQueue(item.facilityId)}
                            className="flex-row items-center gap-1"
                          >
                            <Text className="text-xs font-bold text-[#004AC6]">Re-join Queue</Text>
                            <Ionicons name="sync" size={14} color="#004AC6" />
                          </TouchableOpacity>
                        </>
                      ) : item.id === "hist-3" ? (
                        <>
                          <Text className="text-xs text-[#737686]">
                            {item.receiptNumber}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleDownloadSlip(item)}
                            className="flex-row items-center gap-1"
                          >
                            <Text className="text-xs font-bold text-[#004AC6]">Download Slip</Text>
                            <Ionicons name="receipt-outline" size={14} color="#004AC6" />
                          </TouchableOpacity>
                        </>
                      ) : (
                        /* Cancelled item action */
                        <View className="w-full flex-row items-center justify-end">
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleRejoinQueue(item.facilityId)}
                            className="flex-row items-center gap-1"
                          >
                            <Text className="text-xs font-bold text-[#004AC6]">Re-queue Here</Text>
                            <Ionicons name="arrow-forward" size={14} color="#004AC6" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 7. Stitch Screen 15 Verified Queue Record Detail Bottom Sheet */}
      <Modal
        visible={isDetailSheetOpen}
        animationType="slide"
        transparent
        onRequestClose={handleCloseDetailSheet}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseDetailSheet}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-lg mx-auto bg-white rounded-t-3xl overflow-hidden"
            style={styles.sheetShadow}
          >
            {/* Sheet Handle */}
            <View className="w-full items-center pt-3 pb-2">
              <View className="w-12 h-1.5 bg-[#CBD5E1] rounded-full" />
            </View>

            {/* Sheet Header */}
            <View className="px-5 pb-3 flex-row items-center justify-between border-b border-[#F2F3FF]">
              <View className="flex-row items-center gap-2.5">
                <View className="w-10 h-10 rounded-full bg-[#EAEDFF] items-center justify-center">
                  <Ionicons name="ticket-outline" size={20} color="#004AC6" />
                </View>
                <View className="flex-col">
                  <Text className="text-base font-bold text-[#131B2E]">Queue Record</Text>
                  <Text className="text-xs text-[#737686]">Verified Virtual Ticket Slip</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCloseDetailSheet}
                className="w-8 h-8 rounded-full bg-[#F2F3FF] items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#434655" />
              </TouchableOpacity>
            </View>

            {selectedDetailRecord && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
              >
                <View className="flex-col gap-3.5">
                  {/* Inner Ticket Card */}
                  <View className="w-full bg-[#F2F3FF] rounded-2xl p-4 flex-col gap-3.5 border border-[#DAE2FD]">
                    {/* Business Name & Tag */}
                    <View className="flex-row items-start justify-between">
                      <View className="flex-col flex-1 mr-2">
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-[#737686]">
                          Healthcare Facility
                        </Text>
                        <Text className="text-lg font-bold text-[#131B2E] mt-0.5">
                          {selectedDetailRecord.facilityName}
                        </Text>
                        <Text className="text-xs text-[#434655] mt-0.5">
                          {selectedDetailRecord.department} • {selectedDetailRecord.stationOrCounter || "Counter 1"}
                        </Text>
                      </View>

                      <View className="flex-col items-end">
                        <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-[#007D55]/15">
                          <View className="w-1.5 h-1.5 rounded-full bg-[#007D55]" />
                          <Text className="text-[10px] font-bold text-[#007D55]">
                            {selectedDetailRecord.status.toUpperCase()}
                          </Text>
                        </View>
                        <Text className="text-xs text-[#737686] mt-1.5">
                          {selectedDetailRecord.date}
                        </Text>
                      </View>
                    </View>

                    {/* Big Ticket Number Banner */}
                    <View
                      className="py-4 bg-white rounded-xl flex-col items-center justify-center text-center border border-[#E2E8F0]"
                      style={styles.cardShadowSm}
                    >
                      <Text className="text-[10px] font-bold uppercase text-[#737686]">
                        Ticket Number
                      </Text>
                      <Text className="text-4xl font-extrabold text-[#004AC6] leading-tight my-1 tracking-tight">
                        {selectedDetailRecord.ticketNumber}
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <Ionicons name="checkmark-circle" size={16} color="#007D55" />
                        <Text className="text-xs font-semibold text-[#007D55]">
                          Turn Served Successfully
                        </Text>
                      </View>
                    </View>

                    {/* 3-Column Time Telemetry */}
                    <View className="flex-row gap-2 text-center">
                      <View
                        className="flex-1 bg-white p-2 rounded-xl items-center border border-[#E2E8F0]"
                        style={styles.cardShadowSm}
                      >
                        <Text className="text-[10px] font-bold text-[#737686] uppercase">Joined</Text>
                        <Text className="text-sm font-bold text-[#131B2E] mt-0.5">
                          {selectedDetailRecord.joinedTime}
                        </Text>
                      </View>
                      <View
                        className="flex-1 bg-white p-2 rounded-xl items-center border border-[#E2E8F0]"
                        style={styles.cardShadowSm}
                      >
                        <Text className="text-[10px] font-bold text-[#737686] uppercase">Called</Text>
                        <Text className="text-sm font-bold text-[#131B2E] mt-0.5">
                          {selectedDetailRecord.calledTime || "11:02 AM"}
                        </Text>
                      </View>
                      <View
                        className="flex-1 bg-white p-2 rounded-xl items-center border border-[#E2E8F0]"
                        style={styles.cardShadowSm}
                      >
                        <Text className="text-[10px] font-bold text-[#737686] uppercase">Finished</Text>
                        <Text className="text-sm font-bold text-[#131B2E] mt-0.5">
                          {selectedDetailRecord.completedTime || "11:08 AM"}
                        </Text>
                      </View>
                    </View>

                    {/* Efficiency Highlight Box */}
                    <View className="p-3 bg-[#007D55]/10 rounded-xl flex-row items-center justify-between border border-[#007D55]/20">
                      <View className="flex-row items-center gap-2 flex-1 mr-2">
                        <Ionicons name="hourglass-outline" size={20} color="#007D55" />
                        <View className="flex-col flex-1">
                          <Text className="text-xs font-medium text-[#131B2E]">
                            Total Wait: <Text className="font-bold">{selectedDetailRecord.waitedTime}</Text>
                          </Text>
                          <Text className="text-[10px] font-semibold text-[#007D55] mt-0.5">
                            {selectedDetailRecord.savedTime} saved vs walk-in wait
                          </Text>
                        </View>
                      </View>
                      <View className="px-2 py-0.5 rounded-full bg-[#007D55]">
                        <Text className="text-[10px] font-bold text-white">High Efficiency</Text>
                      </View>
                    </View>

                    {/* Star Rating Section */}
                    <View
                      className="flex-row items-center justify-between bg-white p-3 rounded-xl border border-[#E2E8F0]"
                      style={styles.cardShadowSm}
                    >
                      <View className="flex-col">
                        <Text className="text-[10px] font-bold uppercase text-[#737686]">
                          Your Rating
                        </Text>
                        <View className="flex-row items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                              key={star}
                              activeOpacity={0.7}
                              onPress={() => {
                                try {
                                  Haptics.selectionAsync().catch(() => {});
                                } catch {}
                                setUserRating(star);
                              }}
                            >
                              <Ionicons
                                name={star <= userRating ? "star" : "star-outline"}
                                size={18}
                                color="#007D55"
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleNavigateToCompletedSummary(selectedDetailRecord.facilityId)}
                        className="px-3 py-1.5 rounded-lg bg-[#EAEDFF]"
                      >
                        <Text className="text-xs font-bold text-[#004AC6]">Edit Review</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Sheet Action CTAs */}
                  <View className="flex-col gap-2.5 mt-1">
                    {/* Primary Button: Rate / Edit Experience */}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handleNavigateToCompletedSummary(selectedDetailRecord.facilityId)}
                      className="w-full h-12 rounded-xl bg-[#004AC6] flex-row items-center justify-center gap-2"
                      style={styles.buttonShadow}
                    >
                      <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                      <Text className="text-sm font-bold text-white">Rate / Edit Experience</Text>
                    </TouchableOpacity>

                    {/* Secondary 2-Col Buttons */}
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleDownloadSlip(selectedDetailRecord)}
                        className="flex-1 h-11 rounded-xl bg-[#E2E7FF]/70 border border-[#CBD5E1] flex-row items-center justify-center gap-1.5 active:bg-[#DAE2FD]"
                      >
                        <Ionicons name="download-outline" size={17} color="#131B2E" />
                        <Text className="text-xs font-bold text-[#131B2E]">Download Slip</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleRejoinQueue(selectedDetailRecord.facilityId)}
                        className="flex-1 h-11 rounded-xl bg-[#DBE1FF] border border-[#004AC6]/30 flex-row items-center justify-center gap-1.5 active:bg-[#B4C5FF]"
                      >
                        <Ionicons name="refresh" size={17} color="#004AC6" />
                        <Text className="text-xs font-bold text-[#004AC6]">Re-join Queue</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeTabPill: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardShadow: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardShadowSm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  buttonShadow: {
    shadowColor: "#004AC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  sheetShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
});
