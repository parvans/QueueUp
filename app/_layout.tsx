import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import "../global.css";

// Disable Reanimated strict mode and ignore transition warnings
LogBox.ignoreLogs([
  "[Reanimated] Reading from `value` during component render",
]);

try {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
} catch {
  // Ignore if unavailable
}

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F8FAFC" },
      }}
    />
  );
}

