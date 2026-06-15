import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { type Location } from "@/constants/cosmicData";

interface Props {
  location: Location;
  onPress: () => void;
}

export function LocationCard({ location, onPress }: Props) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={styles.wrapper}
    >
      <LinearGradient
        colors={location.gradientColors}
        style={[styles.container, { borderColor: colors.border }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.inner}>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {location.name}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {location.subtitle}
          </Text>
          <Text style={[styles.distance, { color: colors.primary }]}>
            {location.distance}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: 140,
  },
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  inner: {
    padding: 18,
    gap: 5,
    minHeight: 130,
    justifyContent: "flex-end",
  },
  name: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  distance: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
});
