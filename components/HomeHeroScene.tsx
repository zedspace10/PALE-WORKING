import React, { memo, useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  FeGaussianBlur,
  Filter,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

import {
  HOME_HERO_LAYER_CONFIG,
  HOME_HERO_STARS,
  HOME_HERO_STATIC_PROGRESS,
} from "@/constants/homeHeroMotion";

interface MotionProps {
  active: boolean;
}

export type JourneySphereVariant =
  "earth" | "solar" | "galaxy" | "cluster" | "cosmos" | "return";

interface LocationSphereProps extends MotionProps {
  testID?: string;
  variant?: JourneySphereVariant;
}

const STARS_BY_LAYER = HOME_HERO_LAYER_CONFIG.map((config) => ({
  ...config,
  stars: HOME_HERO_STARS.filter((star) => star.layer === config.layer),
}));

function createProgressValues() {
  return HOME_HERO_LAYER_CONFIG.map(
    () => new Animated.Value(HOME_HERO_STATIC_PROGRESS),
  );
}

const JOURNEY_PALETTES = {
  solar: ["#F4FAFF", "#8DEBFF", "#7E6BC9"],
  galaxy: ["#FFFFFF", "#9C8FFF", "#235E8D"],
  cluster: ["#D9FBFF", "#62CDE7", "#7A5CB8"],
  cosmos: ["#F2ECFF", "#8D7DE0", "#163A68"],
  return: ["#FFFFFF", "#8DEBFF", "#A995FF"],
} as const;

function CosmicJourneyVisual({
  variant,
}: {
  variant: Exclude<JourneySphereVariant, "earth">;
}) {
  const [core, middle, edge] = JOURNEY_PALETTES[variant];
  const haloId = `${variant}-journey-halo`;
  const bodyId = `${variant}-journey-body`;
  const blurId = `${variant}-journey-blur`;

  return (
    <Svg width={88} height={88} viewBox="0 0 96 96">
      <Defs>
        <RadialGradient id={haloId} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={middle} stopOpacity={0.32} />
          <Stop offset="54%" stopColor={edge} stopOpacity={0.14} />
          <Stop offset="100%" stopColor={edge} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={bodyId} cx="38%" cy="34%" r="68%">
          <Stop offset="0%" stopColor={core} stopOpacity={0.94} />
          <Stop offset="34%" stopColor={middle} stopOpacity={0.78} />
          <Stop offset="100%" stopColor={edge} stopOpacity={0.08} />
        </RadialGradient>
        <Filter id={blurId} x="-30%" y="-30%" width="160%" height="160%">
          <FeGaussianBlur stdDeviation={1.15} />
        </Filter>
      </Defs>
      <Circle cx={48} cy={48} r={45} fill={`url(#${haloId})`} />
      <G filter={`url(#${blurId})`}>
        {variant === "solar" ? (
          <>
            <Circle cx={48} cy={48} r={22} fill={`url(#${bodyId})`} />
            <Circle cx={70} cy={39} r={2.6} fill="#D9FBFF" opacity={0.72} />
            <Circle cx={29} cy={60} r={1.9} fill="#A995FF" opacity={0.68} />
            <Circle cx={59} cy={72} r={1.3} fill="#8DEBFF" opacity={0.58} />
          </>
        ) : variant === "galaxy" ? (
          <G transform="rotate(-22 48 48)">
            <Ellipse cx={48} cy={48} fill={`url(#${bodyId})`} rx={33} ry={15} />
            <Ellipse
              cx={48}
              cy={48}
              fill={`url(#${bodyId})`}
              opacity={0.58}
              rx={23}
              ry={8}
            />
            <Circle cx={48} cy={48} r={4.2} fill={core} opacity={0.86} />
          </G>
        ) : variant === "cluster" ? (
          <>
            <Circle cx={37} cy={42} r={18} fill={`url(#${bodyId})`} />
            <Circle
              cx={59}
              cy={38}
              r={14}
              fill={`url(#${bodyId})`}
              opacity={0.72}
            />
            <Circle
              cx={55}
              cy={61}
              r={17}
              fill={`url(#${bodyId})`}
              opacity={0.64}
            />
            <Circle cx={29} cy={65} r={2.2} fill={core} opacity={0.72} />
          </>
        ) : variant === "cosmos" ? (
          <>
            <Circle cx={48} cy={48} r={34} fill={`url(#${bodyId})`} />
            <Ellipse
              cx={48}
              cy={48}
              fill={`url(#${haloId})`}
              rx={40}
              ry={26}
              transform="rotate(18 48 48)"
            />
            <Circle cx={32} cy={33} r={1.8} fill={core} opacity={0.7} />
            <Circle cx={64} cy={58} r={1.4} fill="#8DEBFF" opacity={0.62} />
            <Circle cx={70} cy={31} r={1.1} fill="#FFFFFF" opacity={0.56} />
          </>
        ) : (
          <>
            <Ellipse
              cx={48}
              cy={48}
              fill={`url(#${bodyId})`}
              rx={19}
              ry={27}
              transform="rotate(28 48 48)"
            />
            <Circle cx={48} cy={48} r={6} fill={core} opacity={0.76} />
          </>
        )}
      </G>
    </Svg>
  );
}

export const HomeHeroStars = memo(function HomeHeroStars({
  active,
}: MotionProps) {
  const progressValues = useRef<Animated.Value[] | null>(null);
  if (progressValues.current === null) {
    progressValues.current = createProgressValues();
  }
  const progress = progressValues.current;

  useEffect(() => {
    progress.forEach((value) => {
      value.stopAnimation();
      value.setValue(active ? 0 : HOME_HERO_STATIC_PROGRESS);
    });

    if (!active) return;

    const loops = progress.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: HOME_HERO_LAYER_CONFIG[index].duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: HOME_HERO_LAYER_CONFIG[index].duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [active, progress]);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.starScene}
    >
      {STARS_BY_LAYER.map((layer, index) => {
        const layerProgress = progress[index];
        return (
          <Animated.View
            key={layer.layer}
            testID={`home-hero-star-layer-${layer.layer}`}
            style={[
              styles.starLayer,
              {
                opacity: layerProgress.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.82, 0.94, 0.82],
                }),
                transform: [
                  {
                    translateX: layerProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-layer.driftX, layer.driftX],
                    }),
                  },
                  {
                    translateY: layerProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-layer.driftY, layer.driftY],
                    }),
                  },
                ],
              },
            ]}
          >
            {layer.stars.map((star) => (
              <View
                key={star.id}
                style={[
                  styles.star,
                  {
                    backgroundColor: layer.color,
                    height: star.size,
                    left: `${star.x}%`,
                    opacity: star.opacity,
                    top: `${star.y}%`,
                    width: star.size,
                  },
                ]}
              />
            ))}
          </Animated.View>
        );
      })}
    </View>
  );
});

export const HomeLocationSphere = memo(function HomeLocationSphere({
  active,
  testID = "home-location-sphere",
  variant = "earth",
}: LocationSphereProps) {
  const floatProgress = useRef(
    new Animated.Value(HOME_HERO_STATIC_PROGRESS),
  ).current;
  const breathProgress = useRef(
    new Animated.Value(HOME_HERO_STATIC_PROGRESS),
  ).current;
  const energyProgress = useRef(
    new Animated.Value(HOME_HERO_STATIC_PROGRESS),
  ).current;

  useEffect(() => {
    floatProgress.stopAnimation();
    breathProgress.stopAnimation();
    energyProgress.stopAnimation();
    floatProgress.setValue(active ? 0 : HOME_HERO_STATIC_PROGRESS);
    breathProgress.setValue(active ? 0 : HOME_HERO_STATIC_PROGRESS);
    energyProgress.setValue(active ? 0 : HOME_HERO_STATIC_PROGRESS);

    if (!active) return;

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatProgress, {
          toValue: 1,
          duration: 4_800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatProgress, {
          toValue: 0,
          duration: 4_800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathProgress, {
          toValue: 1,
          duration: 3_600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathProgress, {
          toValue: 0,
          duration: 3_600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const energyLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(energyProgress, {
          toValue: 1,
          duration: 14_000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(energyProgress, {
          toValue: 0,
          duration: 14_000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    floatLoop.start();
    breathLoop.start();
    energyLoop.start();
    return () => {
      floatLoop.stop();
      breathLoop.stop();
      energyLoop.stop();
    };
  }, [active, breathProgress, energyProgress, floatProgress]);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.sphereAnchor}
    >
      <Animated.View
        testID={testID}
        style={[
          styles.sphereBodyWrap,
          {
            opacity: breathProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.96, 1],
            }),
            transform: [
              {
                translateY: floatProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, -2],
                }),
              },
              {
                scale: breathProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.995, 1.018],
                }),
              },
            ],
          },
        ]}
      >
        {variant === "earth" ? (
          <>
            <Svg width={88} height={88} viewBox="0 0 96 96">
              <Defs>
                <RadialGradient id="ambientHalo" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#8DEBFF" stopOpacity={0.34} />
                  <Stop offset="45%" stopColor="#67D7FF" stopOpacity={0.16} />
                  <Stop offset="76%" stopColor="#A995FF" stopOpacity={0.07} />
                  <Stop offset="100%" stopColor="#A995FF" stopOpacity={0} />
                </RadialGradient>
                <RadialGradient
                  id="oceanBody"
                  cx="31%"
                  cy="25%"
                  r="78%"
                  fx="27%"
                  fy="21%"
                >
                  <Stop offset="0%" stopColor="#A9F5FF" />
                  <Stop offset="13%" stopColor="#3CC9ED" />
                  <Stop offset="42%" stopColor="#177FBE" />
                  <Stop offset="70%" stopColor="#10477D" />
                  <Stop offset="90%" stopColor="#092440" />
                  <Stop offset="100%" stopColor="#050D1B" />
                </RadialGradient>
                <RadialGradient id="atmosphereRim" cx="47%" cy="42%" r="60%">
                  <Stop offset="56%" stopColor="#8DEBFF" stopOpacity={0} />
                  <Stop offset="82%" stopColor="#8DEBFF" stopOpacity={0.18} />
                  <Stop offset="100%" stopColor="#C7F6FF" stopOpacity={0.84} />
                </RadialGradient>
                <RadialGradient id="surfaceHaze" cx="34%" cy="28%" r="72%">
                  <Stop offset="0%" stopColor="#D8FAFF" stopOpacity={0.28} />
                  <Stop offset="38%" stopColor="#8DEBFF" stopOpacity={0.08} />
                  <Stop offset="78%" stopColor="#A995FF" stopOpacity={0.08} />
                  <Stop offset="100%" stopColor="#A995FF" stopOpacity={0} />
                </RadialGradient>
                <LinearGradient id="landFill" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#8BD8A8" />
                  <Stop offset="48%" stopColor="#4BB89B" />
                  <Stop offset="100%" stopColor="#277D78" />
                </LinearGradient>
                <LinearGradient id="nightShade" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0%" stopColor="#020610" stopOpacity={0} />
                  <Stop offset="58%" stopColor="#020610" stopOpacity={0.08} />
                  <Stop offset="100%" stopColor="#020610" stopOpacity={0.76} />
                </LinearGradient>
                <ClipPath id="earthClip">
                  <Circle cx={48} cy={48} r={28} />
                </ClipPath>
                <Filter
                  id="softEarth"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <FeGaussianBlur stdDeviation={0.9} />
                </Filter>
              </Defs>
              <Circle cx={48} cy={48} r={45} fill="url(#ambientHalo)" />
              <G filter="url(#softEarth)">
                <G clipPath="url(#earthClip)">
                  <Circle cx={48} cy={48} r={28} fill="url(#oceanBody)" />
                  <G testID="earth-land" opacity={0.76}>
                    <Path
                      d="M27 34 C30 29 36 27 41 29 L44 33 41 37 38 38 36 43 31 42 28 39Z"
                      fill="url(#landFill)"
                    />
                    <Path
                      d="M39 42 C43 43 46 47 44 51 L42 55 43 59 40 65 37 59 38 54 35 50Z"
                      fill="url(#landFill)"
                    />
                    <Path
                      d="M51 30 C55 27 62 29 67 33 L70 38 66 41 61 39 58 42 55 39 50 38 48 34Z"
                      fill="url(#landFill)"
                    />
                    <Path
                      d="M54 42 C59 40 65 44 66 49 L62 53 60 61 56 67 52 62 53 56 49 51Z"
                      fill="url(#landFill)"
                    />
                    <Path
                      d="M66 57 C70 56 74 60 72 63 L68 64 65 61Z"
                      fill="#65C7A7"
                    />
                  </G>
                  <Circle cx={48} cy={48} r={28} fill="url(#nightShade)" />
                  <Circle cx={48} cy={48} r={28} fill="url(#surfaceHaze)" />
                </G>
                <Circle cx={48} cy={48} r={28} fill="url(#atmosphereRim)" />
                <Ellipse
                  cx={37}
                  cy={35}
                  rx={7.2}
                  ry={3.1}
                  fill="#FFFFFF"
                  opacity={0.13}
                  transform="rotate(-28 37 35)"
                />
              </G>
            </Svg>
            <Animated.View
              style={[
                styles.energyLayer,
                {
                  opacity: energyProgress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.54, 0.72, 0.54],
                  }),
                  transform: [
                    {
                      rotate: energyProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["-7deg", "7deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Svg width={88} height={88} viewBox="0 0 96 96">
                <Defs>
                  <ClipPath id="energyClip">
                    <Circle cx={48} cy={48} r={28} />
                  </ClipPath>
                  <RadialGradient id="violetBloom" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%" stopColor="#DCCFFF" stopOpacity={0.38} />
                    <Stop offset="48%" stopColor="#A995FF" stopOpacity={0.16} />
                    <Stop offset="100%" stopColor="#A995FF" stopOpacity={0} />
                  </RadialGradient>
                  <RadialGradient id="cyanBloom" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%" stopColor="#BDF7FF" stopOpacity={0.3} />
                    <Stop offset="52%" stopColor="#67D7FF" stopOpacity={0.12} />
                    <Stop offset="100%" stopColor="#67D7FF" stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <G testID="earth-energy" clipPath="url(#energyClip)">
                  <Ellipse
                    cx={39}
                    cy={38}
                    fill="url(#violetBloom)"
                    rx={17}
                    ry={12}
                    transform="rotate(-18 39 38)"
                  />
                  <Ellipse
                    cx={56}
                    cy={55}
                    fill="url(#cyanBloom)"
                    rx={18}
                    ry={11}
                    transform="rotate(22 56 55)"
                  />
                </G>
              </Svg>
            </Animated.View>
          </>
        ) : (
          <Animated.View
            style={[
              styles.energyLayer,
              {
                opacity: energyProgress.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.78, 1, 0.78],
                }),
                transform: [
                  {
                    rotate: energyProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["-9deg", "9deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <CosmicJourneyVisual variant={variant} />
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  starScene: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  starLayer: {
    bottom: -14,
    left: -14,
    position: "absolute",
    right: -14,
    top: -14,
  },
  star: {
    borderRadius: 999,
    position: "absolute",
  },
  sphereAnchor: {
    alignItems: "center",
    height: 94,
    justifyContent: "center",
    width: 110,
  },
  sphereBodyWrap: {
    height: 88,
    position: "relative",
    width: 88,
    filter: 'brightness(1.5) blur(4px)',
  },
  energyLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});
