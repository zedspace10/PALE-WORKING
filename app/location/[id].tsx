import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { StarField } from "@/components/StarField";
import { LOCATIONS } from "@/constants/cosmicData";

export default function LocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const location = LOCATIONS.find((l) => l.id === id);

  if (!location) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.mutedForeground }}>
          Location not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={80} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero gradient header */}
        <LinearGradient
          colors={location.gradientColors}
          style={[
            styles.hero,
            { paddingTop: topPad + 56, paddingBottom: 40 },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[styles.heroLabel, { color: colors.mutedForeground }]}
          >
            {location.subtitle.toUpperCase()}
          </Text>
          <Text style={[styles.heroName, { color: colors.foreground }]}>
            {location.name}
          </Text>
          <Text style={[styles.heroDistance, { color: colors.primary }]}>
            {location.distance}
          </Text>
          <Text style={[styles.heroRaw, { color: colors.mutedForeground }]}>
            {location.distanceRaw} from Earth
          </Text>
        </LinearGradient>

        {/* Detail cards */}
        <View style={styles.details}>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.cardLabel, { color: colors.mutedForeground }]}
            >
              REFLECTION
            </Text>
            <Text style={[styles.reflection, { color: colors.foreground }]}>
              {location.reflection}
            </Text>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.cardLabel, { color: colors.mutedForeground }]}
            >
              SCALE
            </Text>
            <Text style={[styles.scaleText, { color: colors.foreground }]}>
              {location.scale}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[
          styles.backBtn,
          {
            top: topPad + 12,
            backgroundColor: colors.background + "CC",
          },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name="arrow-left" size={20} color={colors.foreground} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  hero: {
    paddingHorizontal: 28,
    gap: 8,
  },
  heroLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  heroName: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
    lineHeight: 40,
  },
  heroDistance: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  heroRaw: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
  details: {
    padding: 20,
    gap: 14,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.5,
  },
  reflection: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 27,
    fontStyle: "italic",
  },
  scaleText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    lineHeight: 24,
  },
  backBtn: {
    position: "absolute",
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
