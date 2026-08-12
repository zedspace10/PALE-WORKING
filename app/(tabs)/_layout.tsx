import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { useColors } from "@/hooks/useColors";

// Cosmic tab icons
function DotIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle cx={11} cy={11} r={3} fill={color} />
      <Circle cx={11} cy={11} r={6} stroke={color} strokeWidth={0.8} fill="none" opacity={0.4} />
    </Svg>
  );
}

function ExpandCircleIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle cx={11} cy={11} r={2.5} fill={color} />
      <Circle cx={11} cy={11} r={5.5} stroke={color} strokeWidth={1} fill="none" opacity={0.7} />
      <Circle cx={11} cy={11} r={9} stroke={color} strokeWidth={0.7} fill="none" opacity={0.35} />
    </Svg>
  );
}

function StarIcon({ color }: { color: string }) {
  // Simple 4-point star / sparkle
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Path
        d="M11 2 L12.2 9.8 L20 11 L12.2 12.2 L11 20 L9.8 12.2 L2 11 L9.8 9.8 Z"
        fill={color}
        opacity={0.9}
      />
    </Svg>
  );
}

function PersonStarsIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle cx={11} cy={7} r={3} stroke={color} strokeWidth={1.2} fill="none" />
      <Path
        d="M4 19 C4 14.6 7.1 11 11 11 C14.9 11 18 14.6 18 19"
        stroke={color}
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={17} cy={4} r={1} fill={color} opacity={0.6} />
      <Circle cx={19} cy={7} r={0.8} fill={color} opacity={0.45} />
      <Circle cx={15} cy={2} r={0.7} fill={color} opacity={0.4} />
    </Svg>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Path
        d="M15 11 A6 6 0 1 1 9 5 A4.5 4.5 0 0 0 15 11 Z"
        fill={color}
        opacity={0.9}
      />
    </Svg>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#4A4A5A",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_400Regular",
          letterSpacing: 0.3,
          marginTop: -2,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : "#000000",
          borderTopWidth: 1,
          borderTopColor: "#1A1A2A",
          elevation: 0,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={55}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: "#000000" }]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <DotIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="shift"
        options={{
          title: "Shift",
          tabBarIcon: ({ color }) => <ExpandCircleIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="star"
        options={{
          title: "Star",
          tabBarIcon: ({ color }) => <StarIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: "You",
          tabBarIcon: ({ color }) => <PersonStarsIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color }) => <MoonIcon color={color} />,
        }}
      />
      {/* Hidden tabs — still accessible as routes */}
      <Tabs.Screen name="mirror" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="deeptime" options={{ href: null }} />
      <Tabs.Screen name="library" options={{ href: null }} />
    </Tabs>
  );
}
