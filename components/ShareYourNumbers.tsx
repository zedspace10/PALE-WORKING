import * as Sharing from "expo-sharing";
import React, { useMemo, useRef, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

import { formatApproximateDistance } from "@/constants/personalInsights";
import { bigKmWords } from "@/constants/youFacts";
import { useColors } from "@/hooks/useColors";

// The card is laid out at this size and saved at three times it: 1080 by 1350, the shape
// Instagram shows best.
const CARD_W = 360;
const CARD_H = 450;

interface Props {
  sunKm: number;
  galaxyKm: number;
  trips: number;
}

/** A few fixed stars, the same every time, so the card looks like PALE. */
function cardStars() {
  const stars: { x: number; y: number; r: number; o: number }[] = [];
  let seed = 7;
  const next = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 70; i++) {
    stars.push({
      x: next() * CARD_W,
      y: next() * CARD_H,
      r: 0.4 + next() ** 6 * 1.3,
      o: 0.25 + next() ** 3 * 0.6,
    });
  }
  return stars;
}

/**
 * Makes a picture of the person's numbers and opens the share sheet. Only the numbers go on
 * it, never the birthday, and nothing leaves the phone unless they choose where to send it.
 */
export function ShareYourNumbers({ sunKm, galaxyKm, trips }: Props) {
  const colors = useColors();
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const stars = useMemo(cardStars, []);

  if (Platform.OS === "web") return null;

  const share = async () => {
    if (busy || !cardRef.current) return;
    setBusy(true);
    setProblem(null);
    try {
      const uri = await captureRef(cardRef, {
        format: "png",
        width: CARD_W * 3,
        height: CARD_H * 3,
        result: "tmpfile",
      });
      if (!(await Sharing.isAvailableAsync())) {
        setProblem("Sharing is not available on this phone.");
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        UTI: "public.png",
        dialogTitle: "Share your numbers",
      });
    } catch {
      setProblem("That did not work. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={share}
        disabled={busy}
        accessibilityRole="button"
        accessibilityHint="Makes a picture of your numbers to share"
        style={styles.button}
      >
        <Feather name="share" size={16} color={colors.primary} />
        <Text style={[styles.buttonText, { color: colors.primary }]}>
          {busy ? "Making your picture" : "Share these numbers"}
        </Text>
      </TouchableOpacity>
      {problem ? (
        <Text style={[styles.problem, { color: colors.mutedForeground }]}>
          {problem}
        </Text>
      ) : null}

      {/* Drawn off screen, only to be saved as a picture. */}
      <View style={styles.offscreen} pointerEvents="none">
        <View
          ref={cardRef}
          collapsable={false}
          style={[styles.card, { backgroundColor: colors.background }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {stars.map((s, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                left: s.x,
                top: s.y,
                width: s.r * 2,
                height: s.r * 2,
                borderRadius: s.r,
                backgroundColor: "#DDE8F5",
                opacity: s.o,
              }}
            />
          ))}

          <Text style={[styles.brand, { color: colors.mutedForeground }]}>
            PALE
          </Text>

          <View style={styles.dotWrap}>
            <View
              style={[styles.dotGlow, { backgroundColor: colors.primary }]}
            />
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          </View>

          <Text style={[styles.since, { color: colors.mutedForeground }]}>
            SINCE I WAS BORN
          </Text>

          <Text style={[styles.big, { color: colors.primary }]}>
            {formatApproximateDistance(sunKm)} km
          </Text>
          <Text style={[styles.label, { color: colors.foreground }]}>
            around the Sun, with Earth
          </Text>

          <Text style={[styles.big, styles.second, { color: colors.primary }]}>
            {bigKmWords(galaxyKm)} km
          </Text>
          <Text style={[styles.label, { color: colors.foreground }]}>
            around the galaxy, with the Sun
          </Text>

          <Text style={[styles.trips, { color: colors.mutedForeground }]}>
            {trips} {trips === 1 ? "trip" : "trips"} around the Sun so far
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  buttonText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  problem: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  offscreen: { position: "absolute", left: -10_000, top: 0 },
  card: {
    width: CARD_W,
    height: CARD_H,
    paddingHorizontal: 30,
    paddingTop: 26,
    overflow: "hidden",
  },
  brand: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 4,
  },
  dotWrap: {
    marginTop: 52,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  dotGlow: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    opacity: 0.18,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  since: {
    marginTop: 28,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.4,
  },
  big: {
    marginTop: 12,
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.6,
  },
  second: { marginTop: 22 },
  label: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  trips: {
    position: "absolute",
    left: 30,
    bottom: 28,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
