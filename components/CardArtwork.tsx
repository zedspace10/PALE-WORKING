import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

type CardArtworkName = "observatory" | "shift" | "timeMachine" | "tonightsSky";

interface CardArtworkProps {
  name: CardArtworkName;
  treatment?: "left" | "center";
}

/** Rendered for PALE: Earth, a deep field, a night sky over hills, and an observatory under the Milky Way. */
const CARD_ARTWORK = {
  observatory: require("@/assets/images/home/observatory.jpg"),
  shift: require("@/assets/images/home/shift.jpg"),
  timeMachine: require("@/assets/images/home/time-machine.jpg"),
  tonightsSky: require("@/assets/images/home/tonights-sky.jpg"),
} as const;

/** A card's picture sits on the right; it fades to the background behind the words on the left. */
export function CardArtwork({ name, treatment = "left" }: CardArtworkProps) {
  const centered = treatment === "center";

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Image
        resizeMode="cover"
        source={CARD_ARTWORK[name]}
        style={[styles.image, { opacity: centered ? 0.8 : 0.92 }]}
      />
      <LinearGradient
        colors={
          centered
            ? ["rgba(5,7,12,0.3)", "rgba(5,7,12,0.55)"]
            : ["rgba(5,7,12,0.92)", "rgba(5,7,12,0.5)", "rgba(5,7,12,0.05)"]
        }
        end={{ x: centered ? 0.5 : 1, y: centered ? 1 : 0.5 }}
        locations={centered ? [0, 1] : [0, 0.55, 1]}
        start={{ x: centered ? 0.5 : 0, y: centered ? 0 : 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(5,7,12,0)", "rgba(5,7,12,0.7)"]}
        locations={[0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
});
