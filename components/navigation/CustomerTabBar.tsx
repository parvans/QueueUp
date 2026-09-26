import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface TabConfig {
  name: string;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  home: {
    name: "home",
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  search: {
    name: "search",
    label: "Search",
    activeIcon: "search",
    inactiveIcon: "search-outline",
  },
  "my-queues": {
    name: "my-queues",
    label: "My Queues",
    activeIcon: "ticket",
    inactiveIcon: "ticket-outline",
    badge: 1,
  },
  history: {
    name: "history",
    label: "History",
    activeIcon: "time",
    inactiveIcon: "time-outline",
  },
  profile: {
    name: "profile",
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
};

export const CustomerTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
      className="bg-[#FAF8FF]/95 border-t border-[#E2E8F0]"
    >
      <View className="h-16 px-2 flex-row items-center justify-around w-full max-w-[430px] mx-auto">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIGS[route.name] || {
            name: route.name,
            label: options.title || route.name,
            activeIcon: "ellipse",
            inactiveIcon: "ellipse-outline",
          };

          const onPress = () => {
            try {
              Haptics.selectionAsync();
            } catch {
              // Ignore haptics failure
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const iconName = isFocused ? config.activeIcon : config.inactiveIcon;
          const activeColor = "#2563EB";
          const inactiveColor = "#434655";

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || config.label}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              className={`flex-col items-center justify-center min-w-[58px] h-12 rounded-xl px-1.5 transition-all ${
                isFocused ? "bg-[#DBE1FF]/50" : ""
              }`}
            >
              <View className="relative leading-none">
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? activeColor : inactiveColor}
                />
                {config.badge !== undefined && config.badge > 0 && (
                  <View className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 bg-primary rounded-full items-center justify-center border border-[#FAF8FF]">
                    <Text className="text-[9px] font-bold text-white leading-none">
                      {config.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                className={`text-[11px] leading-tight mt-0.5 ${
                  isFocused
                    ? "font-bold text-primary"
                    : "font-medium text-[#434655]"
                }`}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
});
