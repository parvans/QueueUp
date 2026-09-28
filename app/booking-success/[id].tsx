import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/**
 * Screen 8 Placeholder: Booking Success
 * Minimum placeholder route required for Screen 7 navigation.
 * Full screen will be implemented when instructed.
 */
export default function BookingSuccessPlaceholder() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8FF]">
      <View className="px-5 py-3 flex-row items-center gap-3 border-b border-border bg-white">
        <TouchableOpacity
          onPress={() => router.replace("/(customer)/home")}
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
        >
          <Ionicons name="close" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#131B2E]">Booking Success</Text>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
          <Ionicons name="checkmark-circle" size={40} color="#10B981" />
        </View>
        <Text className="text-xl font-bold text-[#131B2E] text-center">
          You are in line!
        </Text>
        <Text className="text-sm text-[#434655] text-center mt-2">
          Facility: {id}
        </Text>
        <Text className="text-xs text-[#64748B] text-center mt-1">
          Screen 8 will be implemented in the next step.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(customer)/home")}
          className="mt-6 px-6 py-3 rounded-full bg-primary"
        >
          <Text className="text-white font-bold">Return Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
