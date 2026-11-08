import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StarField } from "@/components/StarField";
import type { Location, LookBackScene } from "@/constants/cosmicData";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  place: Location;
  visible: boolean;
  onClose: () => void;
}

/**
 * Home as it would look from each place, rendered for PALE. Not to scale: the words carry the
 * facts. Each picture fades into the background at its edges.
 */
const SCENES: Record<LookBackScene, number> = {
  "earth-large": require("@/assets/images/lookback/moon.jpg"),
  "blue-star": require("@/assets/images/lookback/mars.jpg"),
  "dot-near-sun": require("@/assets/images/lookback/saturn.jpg"),
  "pixel-in-sunlight": require("@/assets/images/lookback/voyager.jpg"),
  "sun-a-star": require("@/assets/images/lookback/proxima.jpg"),
  "sun-too-faint": require("@/assets/images/lookback/orion.jpg"),
  "sun-lost": require("@/assets/images/lookback/galactic.jpg"),
  "galaxy-smudge": require("@/assets/images/lookback/andromeda.jpg"),
  "first-glow": require("@/assets/images/lookback/edge.jpg"),
};

export function LookBack({ place, visible, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const sceneIn = useRef(new Animated.Value(0)).current;
  const wordsIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    sceneIn.setValue(reduceMotion ? 1 : 0);
    wordsIn.setValue(reduceMotion ? 1 : 0);
    if (reduceMotion) return;
    Animated.sequence([
      Animated.timing(sceneIn, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      }),
      Animated.timing(wordsIn, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, reduceMotion, sceneIn, wordsIn]);

  const size = Math.min(width - 32, height * 0.48, 420);
  const topPad = Platform.OS === "web" ? 24 : insets.top + 12;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.wrap, { backgroundColor: colors.background }]}>
        <StarField count={50} containerOpacity={0.5} />
        <View style={[styles.top, { paddingTop: topPad }]}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            Looking back from {place.name.replace(/^The /, "the ")}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.scene,
            {
              width: size,
              height: size,
              opacity: sceneIn,
              transform: [
                {
                  scale: sceneIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.08, 1],
                  }),
                },
              ],
            },
          ]}
          accessible
          accessibilityRole="image"
          accessibilityLabel={`A picture of home as seen from ${place.name}.`}
        >
          <Image
            source={SCENES[place.lookBack.scene]}
            style={{ width: size, height: size }}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.words,
            { opacity: wordsIn, paddingBottom: insets.bottom + 24 },
          ]}
        >
          <Text style={[styles.line, { color: colors.foreground }]}>
            {place.lookBack.line}
          </Text>
          <Text style={[styles.note, { color: colors.mutedForeground }]}>
            Illustration, not to scale.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            style={[styles.close, { borderColor: colors.primary + "66" }]}
          >
            <Text style={[styles.closeText, { color: colors.foreground }]}>
              Back to {place.name.replace(/^The /, "the ")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center" },
  top: { alignSelf: "stretch", paddingHorizontal: 24 },
  eyebrow: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_600SemiBold" },
  scene: { marginTop: 16 },
  words: {
    flex: 1,
    alignSelf: "stretch",
    maxWidth: 560,
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    gap: 12,
  },
  line: { fontSize: 18, lineHeight: 28, fontFamily: "Inter_400Regular" },
  note: { fontSize: 12, lineHeight: 16, fontFamily: "Inter_400Regular" },
  close: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1,
    marginTop: 8,
  },
  closeText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
