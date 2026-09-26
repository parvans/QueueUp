import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerClassName = "",
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderClass = error
    ? "border-red-500 bg-red-50/20"
    : isFocused
    ? "border-primary bg-white shadow-xs"
    : "border-border-strong bg-white";

  return (
    <View className={`w-full mb-3.5 ${containerClassName}`}>
      {label && (
        <Text className="text-[12px] font-medium text-ink-muted mb-1.5 ml-0.5">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center border rounded-xl px-3.5 h-[50px] transition-all ${borderClass}`}
      >
        {leftIcon && <View className="mr-2.5">{leftIcon}</View>}

        <TextInput
          className="flex-1 text-[15px] text-ink-title font-normal p-0 h-full"
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="p-1"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>
        ) : (
          rightIcon && <View className="ml-2">{rightIcon}</View>
        )}
      </View>

      {error ? (
        <Text className="text-xs text-red-500 mt-1 ml-1">{error}</Text>
      ) : helperText ? (
        <Text className="text-xs text-ink-muted mt-1 ml-1">{helperText}</Text>
      ) : null}
    </View>
  );
};
