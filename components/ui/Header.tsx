import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  className = "",
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View
      className={`flex-row items-center justify-between px-5 py-3 bg-white border-b border-border ${className}`}
    >
      <View className="flex-row items-center gap-3 flex-1">
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-9 h-9 rounded-full bg-slate-50 items-center justify-center border border-border"
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="text-[17px] font-bold text-ink-title tracking-tight"
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              numberOfLines={1}
              className="text-xs text-ink-muted font-normal"
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && <View className="ml-3">{rightAction}</View>}
    </View>
  );
};
