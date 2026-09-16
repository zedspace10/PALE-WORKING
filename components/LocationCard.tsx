import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { CalmPressable } from "@/components/CalmPressable";
import { type Location } from "@/constants/cosmicData";
import { EXPLORE_ARTWORK } from "@/constants/exploreArtworkAssets";
import { calmSpace, calmSurface, calmTypography } from "@/constants/ui";
import { useColors } from "@/hooks/useColors";

interface Props {
  location: Location;
  onPress: () => void;
}

export function LocationCard({ location, onPress }: Props) {
  const colors = useColors();
  const [imageFailed, setImageFailed] = useState(false);

  const content = (
    <LinearGradient
      colors={["rgba(6,5,11,0.74)", "rgba(12,9,24,0.2)", "rgba(6,5,11,0.34)"]}
      locations={[0, 0.55, 1]}
      style={styles.overlay}
    >
      <View style={styles.copy}>
        <Text style={[styles.name, { color: colors.foreground }]}>
          {location.name}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {location.subtitle}
        </Text>
        <Text style={[styles.distance, { color: colors.primaryStrong }]}>
          {location.distance}
        </Text>
      </View>
    </LinearGradient>
  );

  return (
    <CalmPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${location.name}. ${location.subtitle}. ${location.distance}.`}
      wrapperStyle={styles.wrapper}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.cardPressed : colors.card,
          borderColor: pressed ? colors.primary + "66" : colors.border,
        },
      ]}
    >
      {!imageFailed ? (
        <Image
          source={EXPLORE_ARTWORK[location.artworkKey]}
          style={styles.artwork}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
          accessible={false}
        />
      ) : null}
      {content}
    </CalmPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: 140,
  },
  container: {
    ...calmSurface,
    minHeight: 206,
  },
  artwork: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: calmSpace.radius.medium - 1,
    height: "100%",
    width: "100%",
  },
  overlay: {
    flex: 1,
    minHeight: 204,
    padding: 16,
    justifyContent: "flex-start",
  },
  copy: {
    gap: 5,
  },
  name: {
    ...calmTypography.cardTitle,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Inter_500Medium",
  },
  distance: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.2,
    marginTop: 3,
  },
});
