import React from "react";
import { View, ViewProps } from "react-native";
import { Shadows } from "@/constants/theme";

export interface CardProps extends ViewProps {
  variant?: "flat" | "elevated" | "outline" | "highlight";
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "flat",
  className = "",
  style,
  children,
  ...props
}) => {
  const variantStyles = {
    flat: "bg-white border border-border rounded-2xl",
    elevated: "bg-white border border-slate-100 rounded-2xl",
    outline: "bg-transparent border border-border-strong rounded-2xl",
    highlight: "bg-blue-50/60 border border-blue-200/80 rounded-2xl",
  }[variant];

  const shadowStyle = variant === "elevated" ? Shadows.card : null;

  return (
    <View
      className={`${variantStyles} p-4 ${className}`}
      style={[shadowStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
};
