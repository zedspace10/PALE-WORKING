import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

type Props = { size?: number };

export function EarthView({ size = 180 }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slow breath pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 5000,
          easing: easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 5000,
          easing: easeInOut,
          useNativeDriver: true,
        }),
      ])
    );

    // Expanding rings
    const ringLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 5000,
            easing: easeInOut,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    pulse.start();
    ringLoop(ring1, 0).start();
    ringLoop(ring2, 2500).start();

    return () => {
      pulse.stop();
      ring1.stopAnimation();
      ring2.stopAnimation();
    };
  }, [pulseAnim, ring1, ring2]);

  const ringScale = (anim: Animated.Value) =>
    anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] });

  const ringOpacity = (anim: Animated.Value) =>
    anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0.18, 0] });

  const center = size / 2;
  const r = size * 0.42;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Expanding ring 1 */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: ringScale(ring1) }],
            opacity: ringOpacity(ring1),
          },
        ]}
      />
      {/* Expanding ring 2 */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: ringScale(ring2) }],
            opacity: ringOpacity(ring2),
          },
        ]}
      />

      {/* Earth sphere */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            {/* Ocean gradient */}
            <RadialGradient id="ocean" cx="40%" cy="35%" r="60%">
              <Stop offset="0%" stopColor="#1D4B8A" />
              <Stop offset="45%" stopColor="#0E2A58" />
              <Stop offset="100%" stopColor="#04111F" />
            </RadialGradient>

            {/* Atmosphere outer glow */}
            <RadialGradient id="atmos" cx="50%" cy="50%" r="50%">
              <Stop offset="78%" stopColor="#7BA9F0" stopOpacity="0" />
              <Stop offset="88%" stopColor="#7BA9F0" stopOpacity="0.12" />
              <Stop offset="100%" stopColor="#4D7FD4" stopOpacity="0" />
            </RadialGradient>

            {/* Clip to sphere */}
            <ClipPath id="sphere">
              <Circle cx="100" cy="100" r="88" />
            </ClipPath>
          </Defs>

          {/* Atmosphere glow (outside sphere) */}
          <Circle cx="100" cy="100" r="98" fill="url(#atmos)" />

          {/* Ocean base */}
          <Circle cx="100" cy="100" r="88" fill="url(#ocean)" />

          {/* ── Continents ── */}

          {/* North America */}
          <Path
            d="M 40,36 C 33,32 27,38 26,47 C 25,54 27,62 31,67 C 33,70 37,72 42,70 C 47,68 52,61 54,54 C 56,47 53,40 47,37 Z"
            fill="#2E4A20"
            clipPath="url(#sphere)"
            opacity={0.92}
          />
          {/* Lower North America / Central */}
          <Path
            d="M 44,70 C 40,71 38,76 39,82 C 40,86 44,87 48,85 C 52,83 53,77 51,73 C 50,70 47,70 44,70 Z"
            fill="#2E4A20"
            clipPath="url(#sphere)"
            opacity={0.88}
          />

          {/* South America */}
          <Path
            d="M 52,84 C 46,82 40,88 39,98 C 38,108 42,120 48,126 C 54,132 60,127 62,117 C 64,107 63,95 57,88 Z"
            fill="#35512A"
            clipPath="url(#sphere)"
            opacity={0.9}
          />

          {/* Europe */}
          <Path
            d="M 97,30 C 91,28 86,32 87,40 C 88,48 95,51 102,48 C 108,45 111,37 106,33 Z"
            fill="#3E5530"
            clipPath="url(#sphere)"
            opacity={0.9}
          />

          {/* Africa */}
          <Path
            d="M 98,52 C 90,50 84,57 85,70 C 85,84 91,98 98,104 C 105,98 111,84 111,70 C 111,57 106,50 98,52 Z"
            fill="#4A5E36"
            clipPath="url(#sphere)"
            opacity={0.9}
          />

          {/* Russia / Asia north */}
          <Path
            d="M 110,26 C 118,23 132,26 143,33 C 152,39 156,49 150,58 C 144,65 133,64 122,58 C 111,52 106,41 108,33 Z"
            fill="#3D5230"
            clipPath="url(#sphere)"
            opacity={0.88}
          />

          {/* India / SE Asia */}
          <Path
            d="M 130,62 C 124,59 119,64 120,72 C 121,80 128,85 135,82 C 142,79 144,71 140,66 Z"
            fill="#445A34"
            clipPath="url(#sphere)"
            opacity={0.85}
          />

          {/* Australia */}
          <Path
            d="M 148,90 C 141,87 134,91 133,100 C 132,109 137,117 145,119 C 153,121 159,114 159,105 C 159,96 155,93 148,90 Z"
            fill="#5E5030"
            clipPath="url(#sphere)"
            opacity={0.85}
          />

          {/* Greenland */}
          <Path
            d="M 72,18 C 66,16 62,21 64,28 C 66,35 73,36 78,32 C 82,28 80,20 72,18 Z"
            fill="#C8DCF0"
            clipPath="url(#sphere)"
            opacity={0.55}
          />

          {/* Antarctica */}
          <Ellipse
            cx="100"
            cy="158"
            rx="28"
            ry="14"
            fill="#D4E8F8"
            clipPath="url(#sphere)"
            opacity={0.45}
          />

          {/* North polar ice */}
          <Ellipse
            cx="88"
            cy="16"
            rx="18"
            ry="8"
            fill="#C8DCF0"
            clipPath="url(#sphere)"
            opacity={0.4}
          />

          {/* Specular highlight */}
          <Ellipse
            cx="68"
            cy="58"
            rx="18"
            ry="25"
            fill="white"
            clipPath="url(#sphere)"
            opacity={0.055}
          />

          {/* Limb darkening (sphere edge) */}
          <Circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="#000000"
            strokeWidth="14"
            opacity={0.5}
            clipPath="url(#sphere)"
          />

          {/* Thin atmosphere edge */}
          <Circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="#4D9BE6"
            strokeWidth="2.5"
            opacity={0.22}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#4D9BE6",
  },
});
