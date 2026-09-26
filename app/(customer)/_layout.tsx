import React from "react";
import { Tabs } from "expo-router";
import { CustomerTabBar } from "@/components/navigation/CustomerTabBar";

export default function CustomerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomerTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="my-queues"
        options={{
          title: "My Queues",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
