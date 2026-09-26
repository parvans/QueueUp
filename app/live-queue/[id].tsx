import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LiveQueuePlaceholder() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8FF]">
      <View className="px-5 py-3 flex-row items-center gap-3 border-b border-border bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#131B2E]">Live Queue Tracking</Text>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <Ionicons name="speedometer-outline" size={48} color="#2563EB" />
        <Text className="text-xl font-bold text-[#131B2E] mt-3">Live Queue: {id}</Text>
        <Text className="text-sm text-[#434655] text-center mt-1">
          Full screen to be implemented in Screen 10.
        </Text>
      </View>
    </SafeAreaView>
  );
}
