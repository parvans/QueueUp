import React from "react";
import { View, Text } from "react-native";

export type BadgeVariant =
  | "active"
  | "waiting"
  | "delayed"
  | "neutral"
  | "primary"
  | "counter";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  showDot?: boolean;
  pulseDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "active",
  showDot = false,
  pulseDot = false,
  size = "md",
  className = "",
}) => {
  const variantStyles = {
    active: {
      bg: "bg-emerald-50 border border-emerald-200/60",
      text: "text-emerald-800",
      dot: "bg-emerald-500",
    },
    waiting: {
      bg: "bg-amber-50 border border-amber-200/60",
      text: "text-amber-800",
      dot: "bg-amber-500",
    },
    delayed: {
      bg: "bg-rose-50 border border-rose-200/60",
      text: "text-rose-800",
      dot: "bg-rose-500",
    },
    neutral: {
      bg: "bg-slate-100 border border-slate-200",
      text: "text-slate-700",
      dot: "bg-slate-400",
    },
    primary: {
      bg: "bg-blue-50 border border-blue-200/60",
      text: "text-blue-700",
      dot: "bg-blue-600",
    },
    counter: {
      bg: "bg-primary text-white",
      text: "text-white font-bold",
      dot: "bg-white",
    },
  }[variant];

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  }[size];

  return (
    <View
      className={`inline-flex flex-row items-center gap-1.5 rounded-full ${variantStyles.bg} ${sizeStyles} ${className}`}
    >
      {showDot && (
        <View
          className={`w-1.5 h-1.5 rounded-full ${variantStyles.dot} ${
            pulseDot ? "opacity-90" : ""
          }`}
        />
      )}
      <Text className={`font-semibold tracking-tight ${variantStyles.text}`}>
        {label}
      </Text>
    </View>
  );
};
