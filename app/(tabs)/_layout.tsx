// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

// Custom tab bar icon — we use simple shapes since we have no
// icon library yet. In Phase 3 we'll add @expo/vector-icons.
type TabIconProps = {
  focused: boolean;
  label: string;
  symbol: string;
};

function TabIcon({ focused, label, symbol }: TabIconProps) {
  return (
    <View style={tabStyles.wrapper}>
      <Text style={[tabStyles.symbol, focused && tabStyles.symbolActive]}>
        {symbol}
      </Text>
      <Text 
      numberOfLines={1} 
      adjustsFontSizeToFit
      style={[tabStyles.label, focused && tabStyles.labelActive]}
      >
        {label}
      </Text>
      {focused && <View style={tabStyles.dot} />}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.bar,
        tabBarShowLabel: false,   // we render our own label inside TabIcon
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home" symbol="⌂" />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Tickets" symbol="◈" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="History" symbol="◷" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profile" symbol="◉" />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Notifications" symbol="◈" />
          ),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 70,
    paddingBottom: 8,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingTop: 6,
  },
  symbol: {
    fontSize: 20,
    color: Colors.textHint,
  },
  symbolActive: {
    color: Colors.primary,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    color: Colors.textHint,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});