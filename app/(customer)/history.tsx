import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FAF8FF]">
      <View className="flex-1 p-6 items-center justify-center">
        <View className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200/60 items-center justify-center mb-4">
          <Ionicons name="time" size={28} color="#2563EB" />
        </View>
        <Text className="text-2xl font-bold text-[#131B2E] mb-1">
          Queue History
        </Text>
        <Text className="text-sm text-[#434655] text-center max-w-xs">
          View your completed visits, saved check-ins, and digital receipts.
        </Text>
      </View>
    </SafeAreaView>
  );
}
