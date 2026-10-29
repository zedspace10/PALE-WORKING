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
import { HomeLocationSphere } from "@/components/HomeHeroScene";
import { IllustrationDisclosure } from "@/components/IllustrationDisclosure";
import { MagicalAction } from "@/components/MagicalSurface";
import { ShiftZoomScene } from "@/components/ShiftZoomScene";
import { StarField } from "@/components/StarField";
import { SHIFT_STAGES } from "@/constants/cosmicData";
import { SHIFT_MAX_ZOOM } from "@/constants/shiftZoom";
import { getTonightsEvent } from "@/constants/skyEvents";
import { calmSpace, calmTypography } from "@/constants/ui";
import { useShiftCount } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";
import { useHomeHeroMotionActive } from "@/hooks/useHomeHeroMotionActive";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Each stage carries about 1.3s of animation overhead on top of these.
// Weighted so the setup moves and the closing line is given room.
const STAGE_DURATIONS_MS = [6000, 6500, 7000, 7500, 8000, 8800];
const FADE_MS = 900;
// How long the camera takes to pull back from one picture to the next, and to fly home at the end.
const ZOOM_OUT_MS = 2600;
const ZOOM_HOME_MS = 4200;

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

  // The pictures sit below the words, as large as the screen allows.
  const sceneSize = Math.min(viewportWidth * 0.9, viewportHeight * 0.46, 540);
  const sceneCenterY = Math.max(
    topPad + 290 + sceneSize / 2 - 50,
    viewportHeight * 0.635,
  );
  const stageTextTop = topPad + 56;

  const [journeyActive, setJourneyActive] = useState(false);
  const [stage, setStage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completionPhase, setCompletionPhase] =
    useState<CompletionPhase | null>(null);

  // Approximate calendar sky context. Read once per journey so it cannot
  // change while the sequence is running. Null on an ordinary night.
  const [tonight, setTonight] = useState<string | null>(null);

  const stageOpacity = useRef(new Animated.Value(0)).current;
  // 0 is Earth, 1 the solar system, 2 the Milky Way, 3 the Local Group, 4 everything we can see.
  const zoom = useRef(new Animated.Value(0)).current;
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

  // At the end, the camera flies all the way home to Earth before the welcome.
  const runReturnSequence = useCallback(() => {
    setCompleted(true);
    setCompletionPhase("contracting");

    if (reduceMotion) {
      zoom.setValue(0);
      welcomeBackOpacity.setValue(1);
      welcomeSubOpacity.setValue(1);
      endButtonsOpacity.setValue(1);
      setCompletionPhase("done");
      return;
    }

    Animated.timing(zoom, {
      toValue: 0,
      duration: ZOOM_HOME_MS,
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
    endButtonsOpacity,
    reduceMotion,
    welcomeBackOpacity,
    welcomeSubOpacity,
    zoom,
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

      // The last stage stays on the whole observable universe.
      const target = Math.min(idx, SHIFT_MAX_ZOOM);

      if (reduceMotion) {
        setStage(idx);
        zoom.setValue(target);
        stageOpacity.setValue(1);
        return;
      }

      Animated.parallel([
        Animated.timing(stageOpacity, {
          toValue: 0,
          duration: idx === 0 ? 0 : FADE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(zoom, {
          toValue: target,
          duration: idx === 0 ? 0 : ZOOM_OUT_MS,
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
    [incrementCount, reduceMotion, runReturnSequence, stageOpacity, zoom],
  );

  const skipStage = () => {
    if (stageRef.current >= SHIFT_STAGES.length) return;
    clearStageTimer();
    stageOpacity.stopAnimation();
    zoom.stopAnimation();
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
    zoom.stopAnimation();
    zoom.setValue(0);
    welcomeBackOpacity.setValue(0);
    welcomeSubOpacity.setValue(0);
    endButtonsOpacity.setValue(0);
    screenFade.setValue(reduceMotion ? 1 : 0);
    setStage(0);
    setCompleted(false);
    setCompletionPhase(null);
    setJourneyActive(true);
    if (reduceMotion) {
      runStage(0);
    } else {
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 620,
        easing: easeInOut,
        useNativeDriver: true,
      }).start(({ finished }) => {
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
    zoom.setValue(0);
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
    zoom.stopAnimation();

    if (reduceMotion) {
      finishExit(onDone);
      return;
    }

    Animated.timing(screenFade, {
      toValue: 0,
      duration: 360,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) finishExit(onDone);
    });
  };

  const currentStage = SHIFT_STAGES[stage];
  const lastStage = stage === SHIFT_STAGES.length - 1;

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
          <View style={styles.orbCenter}>
            <HomeLocationSphere
              active={ambientMotionActive}
              testID="shift-entry-sphere"
            />
          </View>

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
                Begin the Shift
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
            count={90}
            containerOpacity={0.55}
            drift={reduceMotion ? 0 : 16}
          />
          <ShiftZoomScene
            zoom={zoom}
            size={sceneSize}
            centerX={viewportWidth / 2}
            centerY={sceneCenterY}
            ambientMotion={ambientMotionActive}
            pulse={!completed && lastStage}
            testID="shift-zoom-scene"
          />
        </Animated.View>
      ) : null}

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
              style={[styles.skipBtn, { bottom: bottomPad + 28 }]}
              accessibilityRole="button"
              accessibilityLabel="Skip to the next stage"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.skipText}>Skip</Text>
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
                  style={[styles.stageHint, { color: colors.primary + "99" }]}
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
              <IllustrationDisclosure explanation="Sizes and distances are squeezed so each step fits on screen, not one physical scale." />
            </Animated.View>
          )}

          {completed && (
            <View style={[styles.completeWrap, { top: stageTextTop + 24 }]}>
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
              style={[
                styles.endActions,
                { opacity: endButtonsOpacity, bottom: bottomPad + 40 },
              ]}
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
                <Text style={styles.returnText}>Return</Text>
              </CalmPressable>

              <CalmPressable
                onPress={() => {
                  endJourney(() => router.push("/tonight-sky"));
                }}
                style={styles.universeLink}
                accessibilityRole="button"
                accessibilityLabel="Go and look up"
              >
                <Text style={styles.universeLinkText}>Go and look up</Text>
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
    right: 28,
    paddingVertical: 8,
    paddingHorizontal: 10,
    zIndex: 200,
  },
  skipText: {
    color: "rgba(169,149,255,0.7)",
    fontSize: 13,
    letterSpacing: 0.4,
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
    letterSpacing: 0.3,
  },
  universeLink: {
    alignSelf: "center",
    minHeight: calmSpace.touchTarget,
    justifyContent: "center",
  },
  universeLinkText: {
    color: "#A995FF",
    ...calmTypography.button,
    letterSpacing: 0.3,
  },
});
