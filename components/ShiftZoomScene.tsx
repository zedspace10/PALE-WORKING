import React, { memo, useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  RadialGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import { HomeLocationSphere } from "@/components/HomeHeroScene";
import {
  CHILD_OFFSETS,
  shiftFrame,
  shiftZoomSamples,
  SHIFT_LAYER_COUNT,
} from "@/constants/shiftZoom";

// Drawings use a 100 by 100 box. Positions of each picture's child come from CHILD_OFFSETS, so
// the drawings and the zoom always agree on where the previous picture went.
const at = (i: number) => ({
  x: 50 + CHILD_OFFSETS[i][0] * 100,
  y: 50 + CHILD_OFFSETS[i][1] * 100,
});

/** The same "random" stars and galaxies every time. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EARTH_SPHERE_FRACTION = 0.36;

const SolarSystem = memo(function SolarSystem({ size }: { size: number }) {
  const earth = at(1);
  const planets: [number, number, number, string][] = [
    // orbit radius, angle in degrees, dot radius, colour
    [7, 40, 0.5, "#B9B2A8"],
    [10, 150, 0.75, "#F3DDB0"],
    [17, 250, 0.6, "#E08A6A"],
    [25, 200, 1.6, "#E3B98C"],
    [32, 320, 1.3, "#E9D9A6"],
    [39, 110, 1.0, "#A9E7EC"],
    [45, 20, 1.0, "#7C95FF"],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.9} />
          <Stop offset="35%" stopColor="#FFC870" stopOpacity={0.35} />
          <Stop offset="100%" stopColor="#FFC870" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {[7, 10, 17, 25, 32, 39, 45].map((r) => (
        <Circle
          key={r}
          cx={50}
          cy={50}
          r={r}
          stroke="rgba(167,182,198,0.28)"
          strokeWidth={0.18}
          fill="none"
        />
      ))}
      {/* Earth's orbit, a little brighter */}
      <Circle
        cx={50}
        cy={50}
        r={13.5}
        stroke="rgba(141,235,255,0.65)"
        strokeWidth={0.28}
        fill="none"
      />
      <Circle cx={50} cy={50} r={9} fill="url(#sunGlow)" />
      <Circle cx={50} cy={50} r={2.4} fill="#FFF1C9" />
      {planets.map(([r, deg, pr, colour]) => {
        const a = (deg * Math.PI) / 180;
        const x = 50 + r * Math.cos(a);
        const y = 50 + r * Math.sin(a);
        return (
          <G key={r}>
            {r === 32 && (
              <Ellipse
                cx={x}
                cy={y}
                rx={pr * 2.1}
                ry={pr * 0.7}
                stroke={colour}
                strokeWidth={0.25}
                fill="none"
                opacity={0.8}
              />
            )}
            <Circle cx={x} cy={y} r={pr} fill={colour} />
          </G>
        );
      })}
      {/* A faint glow where Earth will sit, so the eye can find it */}
      <Circle cx={earth.x} cy={earth.y} r={1.6} fill="rgba(141,235,255,0.18)" />
    </Svg>
  );
});

const MilkyWay = memo(function MilkyWay({ size }: { size: number }) {
  const dots = useMemo(() => {
    const rand = seeded(7);
    const out: { x: number; y: number; r: number; o: number; c: string }[] = [];
    for (let arm = 0; arm < 4; arm++) {
      const major = arm % 2 === 0;
      const base = (arm * Math.PI) / 2;
      const steps = major ? 190 : 110;
      for (let s = 0; s < steps; s++) {
        const th = (s / steps) * 3.1 * Math.PI;
        const r = 5 * Math.exp(0.215 * th);
        if (r > 46) continue;
        const per = major ? 3 : 2;
        for (let k = 0; k < per; k++) {
          const spread = 0.5 + r * 0.045;
          const g = () => (rand() + rand() + rand() - 1.5) * spread;
          const a = base + th;
          out.push({
            x: 50 + r * Math.cos(a) + g(),
            y: 50 + r * Math.sin(a) + g(),
            r: 0.12 + rand() * 0.26,
            o: 0.3 + rand() * 0.55,
            c: rand() < 0.22 ? "#9FC3FF" : rand() < 0.1 ? "#FFD7B0" : "#E8F0FF",
          });
        }
      }
    }
    // Stars between the arms
    for (let i = 0; i < 140; i++) {
      const r = 46 * Math.sqrt(rand());
      const a = rand() * Math.PI * 2;
      out.push({
        x: 50 + r * Math.cos(a),
        y: 50 + r * Math.sin(a),
        r: 0.08 + rand() * 0.14,
        o: 0.12 + rand() * 0.2,
        c: "#DDE6F5",
      });
    }
    return out;
  }, []);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="mwDisc" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#B8C8FF" stopOpacity={0.22} />
          <Stop offset="60%" stopColor="#8EA2E0" stopOpacity={0.08} />
          <Stop offset="100%" stopColor="#8EA2E0" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="mwBulge" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFF0D2" stopOpacity={0.95} />
          <Stop offset="45%" stopColor="#FFD9A0" stopOpacity={0.4} />
          <Stop offset="100%" stopColor="#FFD9A0" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={50} cy={50} r={48} fill="url(#mwDisc)" />
      {dots.map((d, i) => (
        <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={d.o} />
      ))}
      <Ellipse
        cx={50}
        cy={50}
        rx={10}
        ry={4}
        fill="url(#mwBulge)"
        transform="rotate(28 50 50)"
      />
      <Circle cx={50} cy={50} r={7} fill="url(#mwBulge)" />
    </Svg>
  );
});

const LocalGroup = memo(function LocalGroup({ size }: { size: number }) {
  const mw = at(3);
  const dwarfs = useMemo(() => {
    const rand = seeded(31);
    return Array.from({ length: 34 }, () => {
      const r = 6 + 38 * Math.sqrt(rand());
      const a = rand() * Math.PI * 2;
      return {
        x: 50 + r * Math.cos(a),
        y: 50 + r * Math.sin(a),
        r: 0.25 + rand() * 0.35,
        o: 0.3 + rand() * 0.4,
      };
    });
  }, []);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="m31" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFF2DA" stopOpacity={1} />
          <Stop offset="30%" stopColor="#E9DCC8" stopOpacity={0.55} />
          <Stop offset="70%" stopColor="#B8C4E8" stopOpacity={0.18} />
          <Stop offset="100%" stopColor="#B8C4E8" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="m33" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#DDE8FF" stopOpacity={0.7} />
          <Stop offset="100%" stopColor="#B8C8FF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="lgHalo" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#8EA2E0" stopOpacity={0.06} />
          <Stop offset="100%" stopColor="#8EA2E0" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={50} cy={50} r={48} fill="url(#lgHalo)" />
      {dwarfs.map((d, i) => (
        <Circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="#C9D4EA"
          opacity={d.o}
        />
      ))}
      {/* Andromeda: the largest member, seen tilted */}
      <Ellipse
        cx={70}
        cy={38}
        rx={8.5}
        ry={2.9}
        fill="url(#m31)"
        transform="rotate(-35 70 38)"
      />
      <Circle cx={68.2} cy={41.4} r={0.45} fill="#E8E0D2" opacity={0.8} />
      <Circle cx={72.8} cy={35.4} r={0.4} fill="#E8E0D2" opacity={0.7} />
      {/* Triangulum */}
      <Circle cx={78} cy={53} r={2.2} fill="url(#m33)" />
      <SvgText
        x={70}
        y={46.5}
        fontSize={2.6}
        fill="rgba(220,230,245,0.6)"
        textAnchor="middle"
        fontFamily="Inter_400Regular"
      >
        Andromeda
      </SvgText>
      <SvgText
        x={78}
        y={58.5}
        fontSize={2.2}
        fill="rgba(220,230,245,0.45)"
        textAnchor="middle"
        fontFamily="Inter_400Regular"
      >
        Triangulum
      </SvgText>
      {/* The two Magellanic Clouds, close to the Milky Way */}
      <Circle
        cx={mw.x - 2.6}
        cy={mw.y + 2.4}
        r={0.55}
        fill="#D8E2F5"
        opacity={0.7}
      />
      <Circle
        cx={mw.x - 1.4}
        cy={mw.y + 3.3}
        r={0.38}
        fill="#D8E2F5"
        opacity={0.6}
      />
    </Svg>
  );
});

const ObservableUniverse = memo(function ObservableUniverse({
  size,
}: {
  size: number;
}) {
  const web = useMemo(() => {
    const rand = seeded(101);
    const nodes: { x: number; y: number; w: number }[] = [
      { x: 50, y: 50, w: 0.7 },
    ];
    while (nodes.length < 70) {
      const x = 6 + rand() * 88;
      const y = 6 + rand() * 88;
      if (Math.hypot(x - 50, y - 50) > 43) continue;
      nodes.push({ x, y, w: 0.5 + rand() * 0.8 });
    }
    const edges: [number, number][] = [];
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
        .filter((e) => e.j !== i)
        .sort((p, q) => p.d - q.d)
        .slice(0, 3);
      near.forEach(({ j, d }) => {
        if (
          d < 17 &&
          !edges.some(([p, q]) => (p === j && q === i) || (p === i && q === j))
        ) {
          edges.push([i, j]);
        }
      });
    });
    const dots: { x: number; y: number; r: number; o: number }[] = [];
    edges.forEach(([i, j]) => {
      const a = nodes[i];
      const b = nodes[j];
      for (let k = 1; k < 16; k++) {
        const f = k / 16;
        dots.push({
          x: a.x + (b.x - a.x) * f + (rand() - 0.5) * 1.1,
          y: a.y + (b.y - a.y) * f + (rand() - 0.5) * 1.1,
          r: 0.08 + rand() * 0.16,
          o: 0.25 + rand() * 0.5,
        });
      }
    });
    // Scattered galaxies everywhere else, much fainter
    for (let i = 0; i < 260; i++) {
      const r = 45 * Math.sqrt(rand());
      const a = rand() * Math.PI * 2;
      dots.push({
        x: 50 + r * Math.cos(a),
        y: 50 + r * Math.sin(a),
        r: 0.07 + rand() * 0.1,
        o: 0.12 + rand() * 0.2,
      });
    }
    return { nodes, edges, dots };
  }, []);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="edgeGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="86%" stopColor="#F3C98A" stopOpacity={0} />
          <Stop offset="95%" stopColor="#F3C98A" stopOpacity={0.16} />
          <Stop offset="100%" stopColor="#F3C98A" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="node" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#F2F6FF" stopOpacity={0.7} />
          <Stop offset="100%" stopColor="#B8C8FF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={50} cy={50} r={50} fill="url(#edgeGlow)" />
      <Circle
        cx={50}
        cy={50}
        r={47}
        stroke="rgba(243,201,138,0.3)"
        strokeWidth={0.2}
        fill="none"
      />
      {web.edges.map(([i, j], k) => (
        <Line
          key={k}
          x1={web.nodes[i].x}
          y1={web.nodes[i].y}
          x2={web.nodes[j].x}
          y2={web.nodes[j].y}
          stroke="rgba(169,195,224,0.07)"
          strokeWidth={0.5}
        />
      ))}
      {web.dots.map((d, k) => (
        <Circle
          key={k}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="#DDE6F5"
          opacity={d.o}
        />
      ))}
      {web.nodes.slice(1).map((n, k) => (
        <Circle key={k} cx={n.x} cy={n.y} r={n.w} fill="url(#node)" />
      ))}
    </Svg>
  );
});

interface Props {
  zoom: Animated.Value;
  /** Side of the square the pictures are drawn in. */
  size: number;
  /** Centre of the scene within its parent. */
  centerX: number;
  centerY: number;
  ambientMotion: boolean;
  /** A gentle pulse on the "you are here" ring, for the closing line. */
  pulse?: boolean;
  testID?: string;
}

export function ShiftZoomScene({
  zoom,
  size,
  centerX,
  centerY,
  ambientMotion,
  pulse = false,
  testID,
}: Props) {
  const samples = useMemo(() => shiftZoomSamples(), []);
  const frames = useMemo(
    () => samples.map((z) => shiftFrame(z, size)),
    [samples, size],
  );

  const layerStyles = useMemo(
    () =>
      Array.from({ length: SHIFT_LAYER_COUNT }, (_, i) => {
        const pick = (f: (frame: (typeof frames)[number]) => number) =>
          zoom.interpolate({
            inputRange: samples,
            outputRange: frames.map(f),
            extrapolate: "clamp",
          });
        return {
          opacity: pick((f) => f.layers[i].opacity),
          transform: [
            { translateX: pick((f) => f.layers[i].x) },
            { translateY: pick((f) => f.layers[i].y) },
            { scale: pick((f) => f.layers[i].scale) },
          ],
        };
      }),
    [frames, samples, zoom],
  );

  const marker = useMemo(() => {
    const pick = (f: (frame: (typeof frames)[number], z: number) => number) =>
      zoom.interpolate({
        inputRange: samples,
        outputRange: frames.map((frame, k) => f(frame, samples[k])),
        extrapolate: "clamp",
      });
    return {
      ring: {
        opacity: pick((_, z) => Math.min(1, Math.max(0, (z - 0.55) / 0.4))),
        transform: [
          { translateX: pick((f) => f.you.x) },
          { translateY: pick((f) => f.you.y) },
        ],
      },
      label: pick((_, z) => Math.min(1, Math.max(0, (z - 1.4) / 0.4))),
    };
  }, [frames, samples, zoom]);

  const pulseValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    pulseValue.stopAnimation();
    pulseValue.setValue(0);
    if (!pulse || !ambientMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [ambientMotion, pulse, pulseValue]);

  const box = {
    left: centerX - size / 2,
    top: centerY - size / 2,
    width: size,
    height: size,
  };
  const sphereScale = (size * EARTH_SPHERE_FRACTION) / 88;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} testID={testID}>
      {/* Largest first, so each smaller picture sits on top of the one it lives in */}
      <Animated.View style={[styles.layer, box, layerStyles[4]]}>
        <ObservableUniverse size={size} />
      </Animated.View>
      <Animated.View style={[styles.layer, box, layerStyles[3]]}>
        <LocalGroup size={size} />
      </Animated.View>
      <Animated.View style={[styles.layer, box, layerStyles[2]]}>
        <MilkyWay size={size} />
      </Animated.View>
      <Animated.View style={[styles.layer, box, layerStyles[1]]}>
        <SolarSystem size={size} />
      </Animated.View>
      <Animated.View
        style={[styles.layer, styles.centred, box, layerStyles[0]]}
      >
        <View style={{ transform: [{ scale: sphereScale }] }}>
          <HomeLocationSphere active={ambientMotion} variant="earth" />
        </View>
      </Animated.View>

      {/* You are here: a ring that follows Earth once it is too small to see */}
      <Animated.View
        style={[
          styles.marker,
          { left: centerX - 60, top: centerY - 9 },
          marker.ring,
        ]}
      >
        <Animated.View
          style={[
            styles.ring,
            {
              transform: [
                {
                  scale: pulseValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.35],
                  }),
                },
              ],
              opacity: pulseValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.55],
              }),
            },
          ]}
        />
        <Animated.View style={{ opacity: marker.label }}>
          <Text style={styles.markerLabel}>You are here</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: "absolute" },
  centred: { alignItems: "center", justifyContent: "center" },
  marker: {
    position: "absolute",
    width: 120,
    alignItems: "center",
  },
  ring: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#8DEBFF",
  },
  markerLabel: {
    color: "rgba(196,236,255,0.85)",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.4,
    marginTop: 6,
  },
});
