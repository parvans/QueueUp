import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from "react-native";
import * as Haptics from "expo-haptics";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = "",
  textClassName = "",
  onPress,
  ...props
}) => {
  const handlePress = (e: any) => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore if haptics is not available
    }
    if (onPress) onPress(e);
  };

  // Base container styles
  const baseContainer = "flex-row items-center justify-center rounded-xl";

  // Size styles
  const sizeStyles = {
    sm: "py-2 px-3.5 min-h-[38px] rounded-lg",
    md: "py-3 px-5 min-h-[50px] rounded-xl",
    lg: "py-3.5 px-6 min-h-[56px] rounded-2xl",
  }[size];

  // Variant styles
  const variantContainerStyles = {
    primary: "bg-primary active:bg-secondary",
    secondary: "bg-surface-container-low border border-border active:bg-surface-container",
    outline: "bg-white border border-border-strong active:bg-slate-50",
    destructive: "bg-red-50 border border-red-200 active:bg-red-100",
    ghost: "bg-transparent active:bg-slate-100",
  }[variant];

  // Text styles
  const sizeTextStyles = {
    sm: "text-xs font-semibold",
    md: "text-sm font-semibold",
    lg: "text-base font-bold",
  }[size];

  const variantTextStyles = {
    primary: "text-white",
    secondary: "text-ink-title",
    outline: "text-ink-title",
    destructive: "text-red-600",
    ghost: "text-primary",
  }[variant];

  const disabledStyle = disabled ? "opacity-50" : "";
  const widthStyle = fullWidth ? "w-full" : "self-start";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={handlePress}
      className={`${baseContainer} ${sizeStyles} ${variantContainerStyles} ${widthStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#ffffff" : "#2563EB"}
        />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {leftIcon && <View>{leftIcon}</View>}
          <Text
            className={`${sizeTextStyles} ${variantTextStyles} text-center ${textClassName}`}
          >
            {title}
          </Text>
          {rightIcon && <View>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};
