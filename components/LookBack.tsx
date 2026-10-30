import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Mask,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import { StarField } from "@/components/StarField";
import type { Location, LookBackScene } from "@/constants/cosmicData";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  place: Location;
  visible: boolean;
  onClose: () => void;
}

const LABEL = "rgba(245,250,255,0.6)";

// A fixed scatter of faint stars, the same every time, for scenes that need a crowded sky.
function scatter(count: number, seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => ({
    x: rand() * 360,
    y: rand() * 360,
    r: 0.4 + rand() * 0.9,
    o: 0.25 + rand() * 0.55,
  }));
}
const CROWD = scatter(420, 7);
const FEW = scatter(70, 3);

/** Home, drawn as it would look from each place. Not to scale; the words carry the facts. */
function Scene({ scene }: { scene: LookBackScene }) {
  switch (scene) {
    case "earth-large":
      return (
        <G>
          <Defs>
            <RadialGradient id="earth" cx="40%" cy="38%" r="65%">
              <Stop offset="0" stopColor="#7DBDF5" />
              <Stop offset="0.55" stopColor="#2A66AC" />
              <Stop offset="1" stopColor="#0B2649" />
            </RadialGradient>
            <RadialGradient id="cloud" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
            <LinearGradient id="night" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0.35" stopColor="#05070C" stopOpacity={0} />
              <Stop offset="0.62" stopColor="#05070C" stopOpacity={0.55} />
              <Stop offset="0.85" stopColor="#05070C" stopOpacity={0.9} />
            </LinearGradient>
          </Defs>
          <Circle cx={180} cy={180} r={118} fill="#8DEBFF" opacity={0.06} />
          <Circle cx={180} cy={180} r={110} fill="url(#earth)" />
          <Ellipse cx={150} cy={140} rx={44} ry={16} fill="url(#cloud)" />
          <Ellipse cx={196} cy={196} rx={52} ry={14} fill="url(#cloud)" />
          <Ellipse cx={150} cy={230} rx={34} ry={12} fill="url(#cloud)" />
          <Ellipse cx={120} cy={186} rx={22} ry={30} fill="url(#cloud)" />
          <Circle cx={180} cy={180} r={110} fill="url(#night)" />
        </G>
      );
    case "blue-star":
      return (
        <G>
          <Circle cx={190} cy={150} r={14} fill="#8DC8FF" opacity={0.18} />
          <Circle cx={190} cy={150} r={3.2} fill="#D7ECFF" />
          <SvgText
            fontFamily="Inter_500Medium"
            x={202}
            y={146}
            fill={LABEL}
            fontSize={12}
          >
            Earth
          </SvgText>
          <Circle cx={204} cy={160} r={1.1} fill="#E8E2D4" opacity={0.8} />
          <SvgText
            fontFamily="Inter_500Medium"
            x={210}
            y={172}
            fill={LABEL}
            fontSize={10}
          >
            the Moon
          </SvgText>
          <Rect
            x={0}
            y={300}
            width={360}
            height={60}
            fill="#3A1A10"
            opacity={0.75}
          />
        </G>
      );
    case "dot-near-sun":
      return (
        <G>
          <Defs>
            <RadialGradient id="glare" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#FFF6E0" stopOpacity={1} />
              <Stop offset="0.25" stopColor="#FFE2A8" stopOpacity={0.55} />
              <Stop offset="1" stopColor="#FFE2A8" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={262} cy={116} r={96} fill="url(#glare)" />
          <Circle cx={176} cy={176} r={1.4} fill="#CFE6FF" />
          <SvgText
            fontFamily="Inter_500Medium"
            x={186}
            y={180}
            fill={LABEL}
            fontSize={12}
          >
            Earth
          </SvgText>
          <SvgText
            fontFamily="Inter_500Medium"
            x={238}
            y={238}
            fill={LABEL}
            fontSize={11}
          >
            the Sun
          </SvgText>
        </G>
      );
    case "pixel-in-sunlight":
      return (
        <G>
          <Defs>
            <LinearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFE9C2" stopOpacity={0} />
              <Stop offset="0.5" stopColor="#FFE9C2" stopOpacity={0.22} />
              <Stop offset="1" stopColor="#FFE9C2" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <G rotation={-58} origin="180, 180">
            <Rect x={150} y={-120} width={60} height={600} fill="url(#ray)" />
          </G>
          <Circle cx={183} cy={170} r={0.9} fill="#DCEBFF" />
          <Circle
            cx={183}
            cy={170}
            r={9}
            fill="none"
            stroke={LABEL}
            strokeWidth={0.6}
          />
          <SvgText
            fontFamily="Inter_500Medium"
            x={196}
            y={166}
            fill={LABEL}
            fontSize={12}
          >
            Earth
          </SvgText>
        </G>
      );
    case "sun-a-star": {
      // Cassiopeia's W, with the Sun as one more star beside it.
      const w = [
        [92, 150],
        [138, 196],
        [180, 160],
        [224, 204],
        [262, 152],
      ];
      return (
        <G>
          {w.slice(1).map(([x, y], i) => (
            <Line
              key={i}
              x1={w[i][0]}
              y1={w[i][1]}
              x2={x}
              y2={y}
              stroke="#8DEBFF"
              strokeOpacity={0.22}
              strokeWidth={1}
            />
          ))}
          {w.map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={2.2} fill="#EAF2FF" />
          ))}
          <Circle cx={292} cy={232} r={10} fill="#FFE7B0" opacity={0.22} />
          <Circle cx={292} cy={232} r={3} fill="#FFF3D6" />
          <SvgText
            fontFamily="Inter_500Medium"
            x={264}
            y={258}
            fill={LABEL}
            fontSize={12}
          >
            the Sun
          </SvgText>
          <SvgText
            fontFamily="Inter_500Medium"
            x={120}
            y={120}
            fill={LABEL}
            fontSize={11}
          >
            Cassiopeia
          </SvgText>
        </G>
      );
    }
    case "sun-too-faint":
      return (
        <G>
          {FEW.map((s, i) => (
            <Circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#EAF2FF"
              opacity={s.o}
            />
          ))}
          <Circle
            cx={180}
            cy={180}
            r={26}
            fill="none"
            stroke={LABEL}
            strokeWidth={0.8}
            strokeDasharray="3 4"
          />
          <SvgText
            fontFamily="Inter_500Medium"
            x={120}
            y={226}
            fill={LABEL}
            fontSize={11}
          >
            the Sun is in here, too faint to see
          </SvgText>
        </G>
      );
    case "sun-lost":
      return (
        <G>
          <Defs>
            <RadialGradient id="core" cx="50%" cy="50%" r="60%">
              <Stop offset="0" stopColor="#FFDFA8" stopOpacity={0.5} />
              <Stop offset="1" stopColor="#FFDFA8" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={360} height={360} fill="url(#core)" />
          {CROWD.map((s, i) => (
            <Circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#FFF1D8"
              opacity={s.o}
            />
          ))}
          <Ellipse
            cx={170}
            cy={150}
            rx={170}
            ry={18}
            fill="#05070C"
            opacity={0.6}
            rotation={-12}
            origin="170, 150"
          />
          <Ellipse
            cx={200}
            cy={230}
            rx={160}
            ry={12}
            fill="#05070C"
            opacity={0.5}
            rotation={-8}
            origin="200, 230"
          />
          <Circle
            cx={238}
            cy={102}
            r={18}
            fill="none"
            stroke="#F5FAFF"
            strokeOpacity={0.7}
            strokeWidth={0.8}
            strokeDasharray="3 4"
          />
          <SvgText
            fontFamily="Inter_500Medium"
            x={170}
            y={76}
            fill="#F5FAFF"
            fillOpacity={0.75}
            fontSize={11}
          >
            the Sun, somewhere
          </SvgText>
        </G>
      );
    case "galaxy-smudge":
      return (
        <G>
          <Defs>
            <RadialGradient id="smudge" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#F4EEDD" stopOpacity={0.55} />
              <Stop offset="0.45" stopColor="#B9C4E8" stopOpacity={0.18} />
              <Stop offset="1" stopColor="#B9C4E8" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse
            cx={180}
            cy={180}
            rx={64}
            ry={20}
            fill="url(#smudge)"
            rotation={-24}
            origin="180, 180"
          />
          <SvgText
            fontFamily="Inter_500Medium"
            x={150}
            y={232}
            fill={LABEL}
            fontSize={12}
          >
            the Milky Way
          </SvgText>
        </G>
      );
    case "first-glow":
      return (
        <G>
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" r="75%">
              <Stop offset="0" stopColor="#FFB070" stopOpacity={0.55} />
              <Stop offset="0.6" stopColor="#E0703C" stopOpacity={0.4} />
              <Stop offset="1" stopColor="#7A2E1A" stopOpacity={0.35} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={360} height={360} fill="url(#glow)" />
          {CROWD.slice(0, 160).map((s, i) => (
            <Circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r * 9}
              fill="#FFD3A8"
              opacity={s.o * 0.06}
            />
          ))}
        </G>
      );
  }
}

/** Look back at Earth: home as it would look from the place you are reading about. */
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
          accessibilityLabel={`An illustration of home as seen from ${place.name}.`}
        >
          <Svg width={size} height={size} viewBox="0 0 360 360">
            <Defs>
              <RadialGradient id="fadeEdge" cx="50%" cy="50%" r="50%">
                <Stop offset="0.62" stopColor="#FFFFFF" stopOpacity={1} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
              </RadialGradient>
              <Mask id="soft" x="0" y="0" width="360" height="360">
                <Rect
                  x={0}
                  y={0}
                  width={360}
                  height={360}
                  fill="url(#fadeEdge)"
                />
              </Mask>
            </Defs>
            <G mask="url(#soft)">
              <Scene scene={place.lookBack.scene} />
            </G>
          </Svg>
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
