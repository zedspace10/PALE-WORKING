import * as Haptics from "expo-haptics";
import { useNavigation, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CalmPressable } from "@/components/CalmPressable";
import { CardArtwork } from "@/components/CardArtwork";
import {
  HomeLocationSphere,
  type JourneySphereVariant,
} from "@/components/HomeHeroScene";
import { IllustrationDisclosure } from "@/components/IllustrationDisclosure";
import { MagicalAction } from "@/components/MagicalSurface";
import { StarField } from "@/components/StarField";
import { SHIFT_STAGES } from "@/constants/cosmicData";
import { getTonightsEvent } from "@/constants/skyEvents";
import { calmSpace, calmTypography } from "@/constants/ui";
import { useShiftCount } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";
import { useHomeHeroMotionActive } from "@/hooks/useHomeHeroMotionActive";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SPHERE_BODY_SIZE = 88;
const ENTRY_SPHERE_SIZE = 88;
// Each stage carries about 1.3s of animation overhead on top of these.
// Weighted so the setup moves and the closing line is given room.
const STAGE_DURATIONS_MS = [6000, 6500, 7000, 7500, 8000, 8800];
const FADE_MS = 900;
const SHIFT_SPHERE_VARIANTS: readonly JourneySphereVariant[] = [
  "earth",
  "solar",
  "galaxy",
  "cluster",
  "cosmos",
  "return",
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

/**
 * The line shown at the end of the journey. Never blocks the sequence: if
 * anything goes wrong, the journey simply ends without it as it did before.
 */
function readTonight(): string | null {
  try {
    return getTonightsEvent()?.line ?? null;
  } catch {
    return null;
  }
}

type CompletionPhase = "contracting" | "welcomeBack" | "welcomeSub" | "done";

export default function ShiftScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { height: viewportHeight, width: viewportWidth } =
    useWindowDimensions();
  const router = useRouter();
  const navigation = useNavigation();
  const { count, incrementCount } = useShiftCount();
  const reduceMotion = useReducedMotion();
  const ambientMotionActive = useHomeHeroMotionActive(reduceMotion);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const visibleTabBarStyle = useMemo(
    () => ({
      position: "absolute" as const,
      backgroundColor: Platform.OS === "ios" ? "transparent" : colors.glass,
      borderTopWidth: 1,
      borderTopColor: colors.luminousBorder + "88",
      elevation: 0,
      height: 58,
      paddingBottom: 0,
      paddingTop: 0,
    }),
    [colors.glass, colors.luminousBorder],
  );
  const stageSphereSizes = useMemo(() => {
    const width = Math.max(viewportWidth, 320);
    return [20, 70, 150, 280, width * 1.2, width * 2.2];
  }, [viewportWidth]);
  const stageSphereOffsets = useMemo(
    () => [
      -170,
      -190,
      -230,
      Math.round(viewportHeight * 0.26 + 140),
      Math.round(viewportHeight * 0.26 + viewportWidth * 0.6),
      Math.round(viewportHeight * 0.18 + viewportWidth * 1.1),
    ],
    [viewportHeight, viewportWidth],
  );
  const entrySphereTop = Math.max(topPad + 48, viewportHeight * 0.1);
  const journeySphereTop = viewportHeight / 2 - 47;

  const [journeyActive, setJourneyActive] = useState(false);
  const [stage, setStage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completionPhase, setCompletionPhase] =
    useState<CompletionPhase | null>(null);

  // Approximate calendar sky context. Read once per journey so it cannot
  // change while the sequence is running. Null on an ordinary night.
  const [tonight, setTonight] = useState<string | null>(null);

  const stageOpacity = useRef(new Animated.Value(0)).current;
  const journeySphereSize = useRef(
    new Animated.Value(ENTRY_SPHERE_SIZE),
  ).current;
  const journeyProgress = useRef(new Animated.Value(0)).current;
  const journeySphereDrift = useRef(new Animated.Value(0.5)).current;
  const welcomeBackOpacity = useRef(new Animated.Value(0)).current;
  const welcomeSubOpacity = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;
  const endButtonsOpacity = useRef(new Animated.Value(0)).current;

  const stageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef(0);
  const stageRunId = useRef(0);

  const clearStageTimer = () => {
    if (stageTimer.current) {
      clearTimeout(stageTimer.current);
      stageTimer.current = null;
    }
  };

  useEffect(
    () => () => {
      clearStageTimer();
      stageRunId.current += 1;
    },
    [],
  );

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: journeyActive ? { display: "none" } : visibleTabBarStyle,
    });

    return () => navigation.setOptions({ tabBarStyle: undefined });
  }, [journeyActive, navigation, visibleTabBarStyle]);

  useEffect(() => {
    journeySphereDrift.stopAnimation();
    journeySphereDrift.setValue(ambientMotionActive && journeyActive ? 0 : 0.5);

    if (!ambientMotionActive || !journeyActive) return;

    const drift = Animated.loop(
      Animated.sequence([
        Animated.timing(journeySphereDrift, {
          toValue: 1,
          duration: 7_000,
          easing: easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(journeySphereDrift, {
          toValue: 0,
          duration: 7_000,
          easing: easeInOut,
          useNativeDriver: true,
        }),
      ]),
    );

    drift.start();
    return () => drift.stop();
  }, [ambientMotionActive, journeyActive, journeySphereDrift]);

  const runReturnSequence = useCallback(() => {
    setCompleted(true);
    setCompletionPhase("contracting");

    if (reduceMotion) {
      journeySphereSize.setValue(stageSphereSizes[0]);
      welcomeBackOpacity.setValue(1);
      welcomeSubOpacity.setValue(1);
      endButtonsOpacity.setValue(1);
      setCompletionPhase("done");
      return;
    }

    Animated.timing(journeySphereSize, {
      toValue: stageSphereSizes[0],
      duration: 3000,
      easing: easeInOut,
      useNativeDriver: true,
    }).start(() => {
      setCompletionPhase("welcomeBack");

      Animated.timing(welcomeBackOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setCompletionPhase("welcomeSub");

          Animated.timing(welcomeSubOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            // Hold here. The journey ends when the person decides it does,
            // not on a timer they cannot see.
            setCompletionPhase("done");
            Animated.timing(endButtonsOpacity, {
              toValue: 1,
              duration: 900,
              useNativeDriver: true,
            }).start();
          });
        }, 1500);
      });
    });
  }, [
    journeySphereSize,
    endButtonsOpacity,
    reduceMotion,
    stageSphereSizes,
    welcomeBackOpacity,
    welcomeSubOpacity,
  ]);

  const runStage = useCallback(
    (idx: number) => {
      const runId = ++stageRunId.current;
      stageRef.current = idx;

      if (idx >= SHIFT_STAGES.length) {
        if (reduceMotion) {
          stageOpacity.setValue(0);
          incrementCount();
          runReturnSequence();
          return;
        }
        Animated.timing(stageOpacity, {
          toValue: 0,
          duration: FADE_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (!finished || runId !== stageRunId.current) return;
          incrementCount();
          runReturnSequence();
        });
        return;
      }

      const targetSize = stageSphereSizes[idx] ?? ENTRY_SPHERE_SIZE;

      if (reduceMotion) {
        setStage(idx);
        stageRef.current = idx;
        journeySphereSize.setValue(targetSize);
        stageOpacity.setValue(1);
        return;
      }

      Animated.parallel([
        Animated.timing(stageOpacity, {
          toValue: 0,
          duration: idx === 0 ? 0 : FADE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(journeySphereSize, {
          toValue: targetSize,
          duration: 2200,
          easing: easeInOut,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || runId !== stageRunId.current) return;
        setStage(idx);
        Animated.timing(stageOpacity, {
          toValue: 1,
          duration: FADE_MS,
          useNativeDriver: true,
        }).start(({ finished: didFadeIn }) => {
          if (!didFadeIn || runId !== stageRunId.current) return;
          const hold = STAGE_DURATIONS_MS[idx] ?? 8000;
          stageTimer.current = setTimeout(
            () => runStage(idx + 1),
            hold - FADE_MS * 2,
          );
        });
      });
    },
    [
      stageOpacity,
      journeySphereSize,
      incrementCount,
      reduceMotion,
      runReturnSequence,
      stageSphereSizes,
    ],
  );

  const skipStage = () => {
    if (stageRef.current >= SHIFT_STAGES.length) return;
    clearStageTimer();
    stageOpacity.stopAnimation();
    journeySphereSize.stopAnimation();
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    runStage(stageRef.current + 1);
  };

  const beginJourney = () => {
    clearStageTimer();
    stageRef.current = 0;
    setTonight(readTonight());
    stageOpacity.setValue(0);
    journeyProgress.stopAnimation();
    journeySphereSize.stopAnimation();
    journeyProgress.setValue(0);
    journeySphereSize.setValue(ENTRY_SPHERE_SIZE);
    welcomeBackOpacity.setValue(0);
    welcomeSubOpacity.setValue(0);
    endButtonsOpacity.setValue(0);
    screenFade.setValue(reduceMotion ? 1 : 0);
    setStage(0);
    setCompleted(false);
    setCompletionPhase(null);
    setJourneyActive(true);
    if (reduceMotion) {
      journeyProgress.setValue(1);
      runStage(0);
    } else {
      Animated.parallel([
        Animated.timing(screenFade, {
          toValue: 1,
          duration: 520,
          easing: easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(journeyProgress, {
          toValue: 1,
          duration: 820,
          easing: easeInOut,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) runStage(0);
      });
    }
  };

  const finishExit = (onDone?: () => void) => {
    clearStageTimer();
    stageRunId.current += 1;
    stageRef.current = 0;
    setJourneyActive(false);
    setCompleted(false);
    setCompletionPhase(null);
    setStage(0);
    stageOpacity.setValue(0);
    journeyProgress.setValue(0);
    journeySphereSize.setValue(ENTRY_SPHERE_SIZE);
    welcomeBackOpacity.setValue(0);
    welcomeSubOpacity.setValue(0);
    endButtonsOpacity.setValue(0);
    screenFade.setValue(1);
    onDone?.();
  };

  const endJourney = (onDone?: () => void) => {
    clearStageTimer();
    stageRunId.current += 1;
    stageOpacity.stopAnimation();
    journeyProgress.stopAnimation();
    journeySphereSize.stopAnimation();

    if (reduceMotion) {
      finishExit(onDone);
      return;
    }

    Animated.parallel([
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(journeyProgress, {
        toValue: 0,
        duration: 720,
        easing: easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(journeySphereSize, {
        toValue: ENTRY_SPHERE_SIZE,
        duration: 720,
        easing: easeInOut,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) finishExit(onDone);
    });
  };

  const currentStage = SHIFT_STAGES[stage];
  const stageTextTop =
    stage <= 2
      ? Math.max(topPad + 50, viewportHeight / 2 - 115)
      : Math.max(topPad + 36, viewportHeight * 0.16);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={72} containerOpacity={0.38} drift={11} />
      {!journeyActive ? (
        <View
          style={[
            styles.entryContent,
            { paddingTop: topPad, paddingBottom: bottomPad + 80 },
          ]}
        >
          <View style={styles.orbCenter} />

          <Text style={[styles.youAreHere, { color: colors.foreground }]}>
            You are here.
          </Text>

          <View style={styles.spacer} />

          <View style={styles.ctaSection}>
            <MagicalAction
              onPress={beginJourney}
              wrapperStyle={styles.beginBtnWrap}
              accessibilityRole="button"
              accessibilityLabel="Begin the Shift"
              contentStyle={styles.beginBtn}
            >
              <CardArtwork name="shift" />
              <Text style={[styles.beginText, { color: colors.foreground }]}>
                BEGIN THE SHIFT
              </Text>
              <Text
                style={[styles.beginSub, { color: colors.mutedForeground }]}
              >
                sixty seconds to the edge of everything
              </Text>
            </MagicalAction>

            {count > 0 ? (
              <Text
                style={[styles.countText, { color: colors.mutedForeground }]}
              >
                {count} {count === 1 ? "journey" : "journeys"} completed
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {journeyActive ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.journeyBackdrop,
            { backgroundColor: colors.background, opacity: screenFade },
          ]}
        >
          <StarField
            key={`shift-stage-stars-${stage}`}
            count={completed ? 80 : 60 + stage * 40}
            containerOpacity={0.48 + stage * 0.055}
            drift={14 + stage * 5}
          />
        </Animated.View>
      ) : null}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.continuousSpherePosition,
          {
            opacity: Animated.add(
              journeyProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              Animated.multiply(
                journeyProgress,
                journeySphereSize.interpolate({
                  inputRange: stageSphereSizes,
                  outputRange: [0.96, 0.86, 0.68, 0.48, 0.3, 0.18],
                  extrapolate: "clamp",
                }),
              ),
            ),
            transform: [
              {
                translateY: Animated.add(
                  journeyProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [entrySphereTop, journeySphereTop],
                  }),
                  Animated.multiply(
                    journeyProgress,
                    Animated.add(
                      journeySphereSize.interpolate({
                        inputRange: stageSphereSizes,
                        outputRange: stageSphereOffsets,
                        extrapolate: "clamp",
                      }),
                      journeySphereDrift.interpolate({
                        inputRange: [0, 1],
                        outputRange: [5, -5],
                      }),
                    ),
                  ),
                ),
              },
            ],
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [
              {
                scale: Animated.divide(journeySphereSize, SPHERE_BODY_SIZE),
              },
            ],
          }}
        >
          <HomeLocationSphere
            active={ambientMotionActive}
            testID="shift-continuous-sphere"
            variant={journeyActive ? SHIFT_SPHERE_VARIANTS[stage] : "earth"}
          />
        </Animated.View>
      </Animated.View>

      {journeyActive ? (
        <Animated.View
          accessibilityViewIsModal={journeyActive}
          style={[styles.journeyContent, { opacity: screenFade }]}
        >
          {/* Always-visible back button */}
          <TouchableOpacity
            onPress={() => endJourney()}
            accessibilityRole="button"
            accessibilityLabel="Exit the Shift"
            style={{
              position: "absolute",
              top: topPad + 12,
              left: 24,
              zIndex: 200,
              padding: 12,
            }}
          >
            <Text style={{ color: colors.primary, fontSize: 22 }}>←</Text>
          </TouchableOpacity>

          {!completed && (count > 0 || reduceMotion) && (
            <TouchableOpacity
              onPress={skipStage}
              style={styles.skipBtn}
              accessibilityRole="button"
              accessibilityLabel="Skip to the next stage"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>
          )}

          {!completed && currentStage && (
            <Animated.View
              style={[
                styles.stageTextWrap,
                { opacity: stageOpacity, top: stageTextTop },
              ]}
            >
              {currentStage.hint ? (
                <Text
                  style={[styles.stageHint, { color: colors.primary + "80" }]}
                >
                  {currentStage.hint}
                </Text>
              ) : null}
              <Text style={[styles.stageTitle, { color: colors.foreground }]}>
                {currentStage.title}
              </Text>
              <Text
                style={[
                  styles.stageSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                {currentStage.subtitle}
              </Text>
              <IllustrationDisclosure explanation="Sphere sizes and transition speeds are a perspective device, not one physical scale." />
            </Animated.View>
          )}

          {completed && (
            <View style={styles.completeWrap}>
              <Animated.Text
                style={[
                  styles.welcomeBack,
                  { color: colors.foreground, opacity: welcomeBackOpacity },
                ]}
              >
                Welcome back.
              </Animated.Text>

              <Animated.Text
                style={[
                  styles.welcomeSub,
                  { color: colors.mutedForeground, opacity: welcomeSubOpacity },
                ]}
              >
                You were always here.
              </Animated.Text>
            </View>
          )}

          {completionPhase === "done" && (
            <Animated.View
              style={[styles.endActions, { opacity: endButtonsOpacity }]}
            >
              {tonight && (
                <Text
                  style={[
                    styles.tonightLine,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {tonight}
                </Text>
              )}

              <CalmPressable
                onPress={() => endJourney()}
                style={styles.returnBtn}
                accessibilityRole="button"
                accessibilityLabel="Return to Shift"
              >
                <Text style={styles.returnText}>RETURN</Text>
              </CalmPressable>

              <CalmPressable
                onPress={() => {
                  endJourney(() => router.push("/tonight-sky"));
                }}
                style={styles.universeLink}
                accessibilityRole="button"
                accessibilityLabel="Go and look up"
              >
                <Text style={styles.universeLinkText}>GO AND LOOK UP</Text>
              </CalmPressable>
            </Animated.View>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  entryContent: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    maxWidth: 620,
    paddingHorizontal: 32,
    width: "100%",
    zIndex: 1,
  },
  orbCenter: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
  },
  youAreHere: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 3,
    marginTop: 24,
  },
  spacer: { flex: 1 },
  ctaSection: { width: "100%", gap: 16, alignItems: "center" },
  beginBtnWrap: { width: "100%" },
  beginBtn: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: 5,
    minHeight: 120,
  },
  beginText: {
    ...calmTypography.cardTitle,
    letterSpacing: 0.8,
    position: "relative",
    zIndex: 1,
  },
  beginSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
    position: "relative",
    zIndex: 1,
  },
  countText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
  journeyBackdrop: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 2,
  },
  journeyContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },
  continuousSpherePosition: {
    alignItems: "center",
    height: 94,
    justifyContent: "center",
    left: "50%",
    marginLeft: -55,
    position: "absolute",
    top: 0,
    width: 110,
    zIndex: 3,
  },
  stageTextWrap: {
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 36,
    gap: 10,
    maxWidth: 620,
    width: "100%",
    zIndex: 2,
  },
  stageHint: {
    ...calmTypography.meta,
  },
  stageTitle: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  stageSubtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  completeWrap: {
    position: "absolute",
    top: "44%",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 40,
  },
  welcomeBack: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  welcomeSub: {
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    letterSpacing: 0.5,
    textAlign: "center",
    lineHeight: 26,
  },
  skipBtn: {
    position: "absolute",
    bottom: 56,
    right: 28,
    paddingVertical: 8,
    paddingHorizontal: 10,
    zIndex: 200,
  },
  skipText: {
    color: "rgba(169,149,255,0.58)",
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "Inter_400Regular",
  },
  tonightLine: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    textAlign: "center",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  endActions: {
    position: "absolute",
    bottom: 120,
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    gap: 22,
  },
  returnBtn: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: calmSpace.touchTarget,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderWidth: 1,
    borderColor: "rgba(169,149,255,0.55)",
    borderRadius: 24,
  },
  returnText: {
    color: "#C4B8FF",
    ...calmTypography.button,
    letterSpacing: 2,
  },
  universeLink: {
    alignSelf: "center",
    minHeight: calmSpace.touchTarget,
    justifyContent: "center",
  },
  universeLinkText: {
    color: "#A995FF",
    ...calmTypography.button,
    letterSpacing: 2.1,
  },
});
