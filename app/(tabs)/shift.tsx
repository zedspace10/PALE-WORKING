import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CalmPressable } from "@/components/CalmPressable";
import { IllustrationDisclosure } from "@/components/IllustrationDisclosure";
import { SourceDisclosure } from "@/components/SourceDisclosure";
import { StarField } from "@/components/StarField";
import { SHIFT_STAGES } from "@/constants/cosmicData";
import { getTonightsEvent } from "@/constants/skyEvents";
import { calmSpace, calmTypography } from "@/constants/ui";
import { useShiftCount } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const { width: SW } = Dimensions.get("window");

const STAGE_CIRCLE_SIZES = [6, 60, 150, 280, SW * 1.2, SW * 2.2];
// Each stage carries about 1.3s of animation overhead on top of these.
// Weighted so the setup moves and the closing line is given room.
const STAGE_DURATIONS_MS = [6000, 6500, 7000, 7500, 8000, 8800];
const FADE_MS = 900;

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
  const router = useRouter();
  const { count, incrementCount } = useShiftCount();
  const reduceMotion = useReducedMotion();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [journeyActive, setJourneyActive] = useState(false);
  const [stage, setStage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completionPhase, setCompletionPhase] =
    useState<CompletionPhase | null>(null);

  // Approximate calendar sky context. Read once per journey so it cannot
  // change while the sequence is running. Null on an ordinary night.
  const [tonight, setTonight] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const stageOpacity = useRef(new Animated.Value(0)).current;
  const circleSize = useRef(new Animated.Value(24)).current;
  const welcomeBackOpacity = useRef(new Animated.Value(0)).current;
  const welcomeSubOpacity = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;
  const endButtonsOpacity = useRef(new Animated.Value(0)).current;

  const stageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef(0);

  const clearStageTimer = () => {
    if (stageTimer.current) {
      clearTimeout(stageTimer.current);
      stageTimer.current = null;
    }
  };

  useEffect(() => clearStageTimer, []);

  useEffect(() => {
    if (reduceMotion) {
      pulseAnim.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.35,
          duration: 4000,
          easing: easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          easing: easeInOut,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim, reduceMotion]);

  const runReturnSequence = useCallback(() => {
    setCompleted(true);
    setCompletionPhase("contracting");

    if (reduceMotion) {
      circleSize.setValue(6);
      welcomeBackOpacity.setValue(1);
      welcomeSubOpacity.setValue(1);
      endButtonsOpacity.setValue(1);
      setCompletionPhase("done");
      return;
    }

    Animated.timing(circleSize, {
      toValue: 6,
      duration: 3000,
      easing: easeInOut,
      useNativeDriver: false,
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
    circleSize,
    endButtonsOpacity,
    reduceMotion,
    welcomeBackOpacity,
    welcomeSubOpacity,
  ]);

  const runStage = useCallback(
    (idx: number) => {
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
        }).start(() => {
          incrementCount();
          runReturnSequence();
        });
        return;
      }

      const targetSize = STAGE_CIRCLE_SIZES[idx] ?? 24;

      if (reduceMotion) {
        setStage(idx);
        stageRef.current = idx;
        circleSize.setValue(targetSize);
        stageOpacity.setValue(1);
        return;
      }

      Animated.parallel([
        Animated.timing(stageOpacity, {
          toValue: 0,
          duration: idx === 0 ? 0 : FADE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(circleSize, {
          toValue: targetSize,
          duration: 2200,
          easing: easeInOut,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setStage(idx);
        stageRef.current = idx;
        Animated.timing(stageOpacity, {
          toValue: 1,
          duration: FADE_MS,
          useNativeDriver: true,
        }).start(() => {
          const hold = STAGE_DURATIONS_MS[idx] ?? 8000;
          stageTimer.current = setTimeout(
            () => runStage(idx + 1),
            hold - FADE_MS * 2,
          );
        });
      });
    },
    [stageOpacity, circleSize, incrementCount, reduceMotion, runReturnSequence],
  );

  const skipStage = () => {
    clearStageTimer();
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
    circleSize.setValue(24);
    welcomeBackOpacity.setValue(0);
    welcomeSubOpacity.setValue(0);
    endButtonsOpacity.setValue(0);
    screenFade.setValue(1);
    setStage(0);
    setCompleted(false);
    setCompletionPhase(null);
    setJourneyActive(true);
    if (reduceMotion) {
      runStage(0);
    } else {
      setTimeout(() => runStage(0), 800);
    }
  };

  const endJourney = () => {
    clearStageTimer();
    stageRef.current = 0;
    setJourneyActive(false);
    setCompleted(false);
    setCompletionPhase(null);
    setStage(0);
    stageOpacity.setValue(0);
    circleSize.setValue(24);
    welcomeBackOpacity.setValue(0);
    welcomeSubOpacity.setValue(0);
    endButtonsOpacity.setValue(0);
    screenFade.setValue(1);
  };

  const currentStage = SHIFT_STAGES[stage];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.entryContent,
          { paddingTop: topPad, paddingBottom: bottomPad + 80 },
        ]}
      >
        <View style={styles.orbCenter}>
          <Animated.View
            style={[
              styles.orbGlow,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.35],
                  outputRange: [0.08, 0.18],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.orbRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.35],
                  outputRange: [0.18, 0.35],
                }),
              },
            ]}
          />
          <View style={styles.orbDot} />
        </View>

        <Text style={[styles.youAreHere, { color: colors.primary }]}>
          You are here.
        </Text>

        <View style={styles.spacer} />

        <View style={styles.ctaSection}>
          <CalmPressable
            onPress={beginJourney}
            wrapperStyle={styles.beginBtnWrap}
            accessibilityRole="button"
            accessibilityLabel="Begin the Shift"
            style={[
              styles.beginBtn,
              {
                borderColor: colors.primary + "72",
                backgroundColor: colors.glow,
              },
            ]}
          >
            <Text style={[styles.beginText, { color: colors.primary }]}>
              BEGIN THE SHIFT
            </Text>
            <Text style={[styles.beginSub, { color: colors.mutedForeground }]}>
              sixty seconds to the edge of everything
            </Text>
          </CalmPressable>

          {count > 0 && (
            <Text style={[styles.countText, { color: colors.mutedForeground }]}>
              {count} {count === 1 ? "journey" : "journeys"} completed
            </Text>
          )}
        </View>
      </View>

      <Modal
        visible={journeyActive}
        animationType={reduceMotion ? "none" : "fade"}
        statusBarTranslucent
        transparent
      >
        <Animated.View
          style={[styles.journeyContainer, { opacity: screenFade }]}
          accessibilityViewIsModal
        >
          {/* Always-visible back button */}
          <TouchableOpacity
            onPress={endJourney}
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

          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <StarField
              count={completed ? 80 : 60 + stage * 40}
              containerOpacity={0.4 + stage * 0.06}
            />
          </View>

          {(() => {
            const stageColor = completed
              ? "#B8D4E8"
              : (SHIFT_STAGES[stage]?.circleColor ?? "#B8D4E8");
            const isTransparent = stageColor === "transparent";
            return (
              <Animated.View
                style={[
                  styles.journeyCircle,
                  completed && styles.completedCircleAnchor,
                  {
                    width: circleSize,
                    height: circleSize,
                    borderRadius: Animated.divide(circleSize, 2) as any,
                    borderColor: isTransparent
                      ? "transparent"
                      : stageColor + "70",
                    backgroundColor: isTransparent
                      ? "transparent"
                      : stageColor + "15",
                  },
                ]}
              />
            );
          })()}

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
              style={[styles.stageTextWrap, { opacity: stageOpacity }]}
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
              <IllustrationDisclosure explanation="Circle sizes and transition speeds are a perspective device, not one physical scale." />
              <SourceDisclosure science={currentStage.science} />
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
                onPress={endJourney}
                style={styles.returnBtn}
                accessibilityRole="button"
                accessibilityLabel="Return to Shift"
              >
                <Text style={styles.returnText}>RETURN</Text>
              </CalmPressable>

              <CalmPressable
                onPress={() => {
                  endJourney();
                  router.push("/tonight-sky");
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
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  entryContent: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    maxWidth: 620,
    paddingHorizontal: 32,
    width: "100%",
  },
  orbCenter: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
  },
  orbGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#7BA9F0",
  },
  orbRing: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#7BA9F0",
  },
  orbDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#B8D4E8",
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
    borderRadius: calmSpace.radius.medium,
    borderWidth: 1,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 8,
  },
  beginText: {
    ...calmTypography.button,
    letterSpacing: 2.2,
  },
  beginSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
  countText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
  journeyContainer: {
    flex: 1,
    backgroundColor: "#06050B",
    alignItems: "center",
    justifyContent: "center",
  },
  journeyCircle: {
    position: "absolute",
    borderWidth: 1,
  },
  completedCircleAnchor: {
    left: "50%",
    marginLeft: -3,
    top: "35%",
  },
  stageTextWrap: {
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 36,
    gap: 10,
    maxWidth: 620,
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
