import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfilePlaceholderScreen() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FAF8FF]">
      <View className="h-16 px-4 bg-white border-b border-[#E2E8F0] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#F2F3FF] items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color="#131B2E" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-[#131B2E]">Edit Profile</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 items-center justify-center p-6 text-center">
        <View className="w-16 h-16 rounded-2xl bg-[#EAEDFF] items-center justify-center mb-4">
          <Ionicons name="create-outline" size={28} color="#004AC6" />
        </View>
        <Text className="text-xl font-bold text-[#131B2E]">Edit Profile</Text>
        <Text className="text-sm text-[#737686] text-center mt-1 max-w-xs">
          Screen 17 placeholder. Implement in the next phase.
        </Text>
      </View>
    </SafeAreaView>
  );
}
