import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/**
 * Screen 11 Placeholder: Near Turn Alert
 * Minimum placeholder route required for Screen 10 navigation.
 * Full screen will be implemented when instructed.
 */
export default function NearTurnPlaceholder() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      <View className="px-4 py-3 flex-row items-center gap-3 border-b border-[#E2E8F0] bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#EAEDFF] items-center justify-center active:bg-[#DAE2FD]"
        >
          <Ionicons name="arrow-back" size={20} color="#131B2E" />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-[#131B2E]">Near Turn Alert</Text>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
          <Ionicons name="notifications-outline" size={36} color="#004AC6" />
        </View>
        <Text className="text-xl font-bold text-[#131B2E] mt-1">Near Turn: {id}</Text>
        <Text className="text-sm text-[#434655] text-center mt-1">
          Full screen to be implemented in Screen 11.
        </Text>
      </View>
    </SafeAreaView>
  );
}
