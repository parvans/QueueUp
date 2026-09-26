import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SplashScreen() {
  const progressAnim = useRef(new Animated.Value(0.15)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [loadingText, setLoadingText] = useState("Connecting to Queue Network...");

  useEffect(() => {
    // Pulse animation for network online dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setLoadingText("Ready!");
        const timer = setTimeout(() => {
          navigateToNext();
        }, 300);
        return () => clearTimeout(timer);
      }
    });
  }, [progressAnim, pulseAnim]);

  const navigateToNext = () => {
    router.replace("/auth" as any);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8FF]">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FF" />

      {/* Screen container */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={navigateToNext}
        className="flex-1 px-6 justify-between items-center w-full"
      >
        {/* Top Spacer / Subtle Network Badge */}
        <View className="pt-4 items-center justify-center w-full">
          <View className="flex-row items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs">
            <Animated.View
              style={{ opacity: pulseAnim }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            <Text className="text-[11px] font-medium tracking-tight text-[#6E6E73]">
              Civic & Medical Network Online
            </Text>
          </View>
        </View>

        {/* Center Content: Cupertino Lockup */}
        <View className="items-center justify-center text-center my-auto w-full py-4">
          {/* Frosted Squircle Icon Container */}
          <View className="relative mb-6">
            {/* Ambient Back Glow */}
            <View className="absolute -inset-2.5 rounded-[36px] bg-blue-500/15" />

            {/* Frosted Glass Surface Card holding Logo */}
            <View className="w-28 h-28 rounded-[28px] bg-white border border-white items-center justify-center shadow-lg shadow-blue-500/10">
              <View className="w-24 h-24 rounded-[22px] overflow-hidden items-center justify-center">
                <Image
                  source={require("../assets/images/queueup-logo.png")}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Verified Mini Indicator Pill */}
            <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-slate-100 shadow-sm">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                <Ionicons name="flash" size={13} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* App Title */}
          <Text className="text-[36px] leading-[42px] font-extrabold tracking-tight text-[#1D1D1F] mb-1.5">
            QueueUp
          </Text>

          {/* Subtitle */}
          <Text className="text-[17px] leading-relaxed font-normal text-[#86868B] mb-7">
            Skip the wait. Join virtually.
          </Text>

          {/* Value Pill Badges (3 Sleek iOS Frosted Pills) */}
          <View className="flex-row flex-wrap items-center justify-center gap-2 max-w-[320px]">
            <View className="bg-white/90 border border-slate-200/60 shadow-xs px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
              <Text className="text-xs">⚡</Text>
              <Text className="text-xs font-semibold text-[#1D1D1F]">
                Instant Passes
              </Text>
            </View>

            <View className="bg-white/90 border border-slate-200/60 shadow-xs px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
              <Text className="text-xs">🛰️</Text>
              <Text className="text-xs font-semibold text-[#1D1D1F]">
                Live Radar
              </Text>
            </View>

            <View className="bg-white/90 border border-slate-200/60 shadow-xs px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
              <Text className="text-xs">🔒</Text>
              <Text className="text-xs font-semibold text-[#1D1D1F]">
                End-to-End Encrypted
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Section: Apple-style Subtle Progress & Status */}
        <View className="w-full items-center gap-4 pb-4">
          <View className="w-full max-w-[240px] items-center gap-2.5">
            {/* Progress Track */}
            <View className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
              <Animated.View
                style={{ width: progressWidth }}
                className="h-full bg-primary rounded-full"
              />
            </View>

            {/* Status Caption with indicator */}
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#2563EB" />
              <Text className="text-[12px] font-medium text-[#86868B] tracking-tight">
                {loadingText}
              </Text>
            </View>
          </View>

          {/* Human Interface Home Indicator Pill */}
          <View className="w-36 h-[4.5px] bg-[#1D1D1F]/20 rounded-full mt-2" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
