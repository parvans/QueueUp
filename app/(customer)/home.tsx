import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CustomerHomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FAF8FF]">
      <View className="flex-1 p-6 items-center justify-center">
        <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
          <Ionicons name="home" size={28} color="#2563EB" />
        </View>
        <Text className="text-2xl font-bold text-[#131B2E] mb-2">
          Customer Home
        </Text>
        <Text className="text-sm text-[#434655] text-center mb-6">
          Welcome to QueueUp! You have successfully signed in as a passholder.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/auth")}
          className="px-5 py-2.5 rounded-xl bg-slate-200"
        >
          <Text className="text-sm font-semibold text-[#131B2E]">Back to Auth</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
