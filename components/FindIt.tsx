import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";

import { StarField } from "@/components/StarField";
import { equatorialToHorizontal } from "@/constants/astronomy";
import type { Location as Place } from "@/constants/cosmicData";
import { heightPhrase, skyPosition } from "@/constants/exploreSky";
import type { Coordinates } from "@/constants/location";
import { compassWords } from "@/constants/notes";
import { useColors } from "@/hooks/useColors";

interface Props {
  place: Place;
  where: Coordinates;
  visible: boolean;
  onClose: () => void;
}

const CARDINALS: [string, number][] = [
  ["N", 0],
  ["E", 90],
  ["S", 180],
  ["W", 270],
];

/**
 * Find it, quietly. The phone is held flat like a compass; the dial turns with it, and the
 * place's mark comes round to the top when you are facing it. Then it says how high to look, and
 * leaves the person to look. Nothing buzzes and there is nothing to win.
 */
export function FindIt({ place, where, visible, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [heading, setHeading] = useState<number | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!visible) return;
    let sub: Location.LocationSubscription | null = null;
    let live = true;
    const tick = setInterval(() => setNow(new Date()), 5000);
    (async () => {
      if (Platform.OS === "web") return;
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted" || !live) return;
        sub = await Location.watchHeadingAsync((h) => {
          const value = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
          if (Number.isFinite(value)) setHeading(value);
        });
        if (!live) sub.remove();
      } catch {
        // No compass: the written directions still work.
      }
    })();
    return () => {
      live = false;
      clearInterval(tick);
      sub?.remove();
      setHeading(null);
    };
  }, [visible]);

  const pos = skyPosition(place, now);
  const sky = pos ? equatorialToHorizontal(pos, where, now) : null;
  const name = place.name.replace(/^The /, "the ");
  const topPad = Platform.OS === "web" ? 24 : insets.top + 12;

  let diff: number | null = null;
  if (sky && heading !== null) {
    diff = ((sky.az - heading + 540) % 360) - 180;
  }
  const facing = diff !== null && Math.abs(diff) < 12;
  // The dial turns so that the way the phone points is always at the top.
  const dialTurn = heading ?? 0;

  let line: string;
  if (!sky || sky.alt < 0) {
    line = `${capital(name)} has just gone below your horizon.`;
  } else if (heading === null) {
    line = `Face ${compassWords(sky.az)}, and look ${heightPhrase(sky.alt)}.`;
  } else if (facing) {
    line = `There. Now look ${heightPhrase(sky.alt)}.`;
  } else {
    line = `Turn slowly to your ${diff! > 0 ? "right" : "left"}.`;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.wrap, { backgroundColor: colors.background }]}>
        <StarField count={50} containerOpacity={0.4} />
        <View style={[styles.top, { paddingTop: topPad }]}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            Finding {name}
          </Text>
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            {heading === null
              ? "Use the directions below. A compass on your phone can help."
              : "Hold your phone flat, like a compass, and turn slowly."}
          </Text>
        </View>

        <View style={styles.dialWrap}>
          <Svg width={280} height={300} viewBox="0 0 280 300">
            <Path d="M140 6 L150 26 L130 26 Z" fill={colors.primary} />
            <G rotation={-dialTurn} origin="140, 160">
              <Circle
                cx={140}
                cy={160}
                r={120}
                fill="none"
                stroke={facing ? colors.primary : "rgba(141,235,255,0.25)"}
                strokeWidth={facing ? 2 : 1}
              />
              {CARDINALS.map(([label, deg]) => {
                const a = ((deg - 90) * Math.PI) / 180;
                return (
                  <SvgText
                    key={label}
                    x={140 + Math.cos(a) * 100}
                    y={160 + Math.sin(a) * 100 + 5}
                    fill="rgba(245,250,255,0.55)"
                    fontSize={14}
                    fontFamily="Inter_500Medium"
                    textAnchor="middle"
                  >
                    {label}
                  </SvgText>
                );
              })}
              {sky && sky.alt >= 0 ? (
                <G>
                  <Line
                    x1={140}
                    y1={160}
                    x2={140 + Math.cos(((sky.az - 90) * Math.PI) / 180) * 120}
                    y2={160 + Math.sin(((sky.az - 90) * Math.PI) / 180) * 120}
                    stroke="rgba(243,221,176,0.35)"
                    strokeWidth={1}
                  />
                  <Circle
                    cx={140 + Math.cos(((sky.az - 90) * Math.PI) / 180) * 120}
                    cy={160 + Math.sin(((sky.az - 90) * Math.PI) / 180) * 120}
                    r={facing ? 9 : 7}
                    fill="#F3DDB0"
                  />
                </G>
              ) : null}
            </G>
            <Circle cx={140} cy={160} r={3} fill="rgba(245,250,255,0.6)" />
          </Svg>
        </View>

        <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
          <Text
            style={[styles.line, { color: colors.foreground }]}
            accessibilityLiveRegion="polite"
          >
            {line}
          </Text>
          {facing || heading === null ? (
            <Text style={[styles.quiet, { color: colors.mutedForeground }]}>
              The light reaching your eyes from there left {place.light} ago.
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            style={[styles.close, { borderColor: colors.primary + "66" }]}
          >
            <Text style={[styles.closeText, { color: colors.foreground }]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function capital(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center" },
  top: { alignSelf: "stretch", paddingHorizontal: 24, gap: 6 },
  eyebrow: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_600SemiBold" },
  hint: { fontSize: 14, lineHeight: 20, fontFamily: "Inter_400Regular" },
  dialWrap: { marginTop: 24 },
  bottom: {
    flex: 1,
    alignSelf: "stretch",
    maxWidth: 560,
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    gap: 10,
  },
  line: { fontSize: 20, lineHeight: 28, fontFamily: "Inter_600SemiBold" },
  quiet: { fontSize: 16, lineHeight: 25, fontFamily: "Inter_400Regular" },
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
