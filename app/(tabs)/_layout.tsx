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
      <Circle
        cx={11}
        cy={11}
        r={6}
        stroke={color}
        strokeWidth={0.8}
        fill="none"
        opacity={0.4}
      />
    </Svg>
  );
}

function ExpandCircleIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle cx={11} cy={11} r={2.5} fill={color} />
      <Circle
        cx={11}
        cy={11}
        r={5.5}
        stroke={color}
        strokeWidth={1}
        fill="none"
        opacity={0.7}
      />
      <Circle
        cx={11}
        cy={11}
        r={9}
        stroke={color}
        strokeWidth={0.7}
        fill="none"
        opacity={0.35}
      />
    </Svg>
  );
}

function PersonStarsIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle
        cx={11}
        cy={7}
        r={3}
        stroke={color}
        strokeWidth={1.2}
        fill="none"
      />
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

function ExploreIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle
        cx={11}
        cy={11}
        r={8}
        stroke={color}
        strokeWidth={1.2}
        fill="none"
        opacity={0.9}
      />
      <Path d="M13.8 8.2 12.2 12.2 8.2 13.8 9.8 9.8 13.8 8.2Z" fill={color} />
      <Circle cx={17.5} cy={4.5} r={1} fill={color} opacity={0.65} />
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
        tabBarInactiveTintColor: colors.mutedForeground + "88",
        tabBarActiveBackgroundColor: colors.glow,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_600SemiBold",
          lineHeight: 14,
          letterSpacing: 0.3,
          marginTop: 0,
        },
        tabBarIconStyle: { marginTop: 0 },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.glass,
          borderTopWidth: 1,
          borderTopColor: colors.luminousBorder + "88",
          elevation: 0,
          height: 58,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarItemStyle: {
          borderRadius: 0,
          marginHorizontal: 0,
          marginVertical: 0,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={72}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.glass },
              ]}
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
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <ExploreIcon color={color} />,
        }}
      />
      {/* Reached from the home screen rather than the tab bar */}
      <Tabs.Screen name="deeptime" options={{ href: null }} />
    </Tabs>
  );
}
