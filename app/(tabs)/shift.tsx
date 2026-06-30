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

import { StarField } from "@/components/StarField";
import { SHIFT_STAGES } from "@/constants/cosmicData";
import { useShiftCount } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";

const { width: SW } = Dimensions.get("window");

const STAGE_CIRCLE_SIZES = [6, 60, 150, 280, SW * 1.2, SW * 2.2];
const STAGE_DURATION_MS = 8000;
const FADE_MS = 900;

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

type CompletionPhase = "contracting" | "welcomeBack" | "welcomeSub" | "done";

export default function ShiftScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { count, incrementCount } = useShiftCount();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [journeyActive, setJourneyActive] = useState(false);
  const [stage, setStage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completionPhase, setCompletionPhase] = useState<CompletionPhase | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const stageOpacity = useRef(new Animated.Value(0)).current;
  const circleSize = useRef(new Animated.Value(24)).current;
  const welcomeBackOpacity = useRef(new Animated.Value(0)).current;
  const welcomeSubOpacity = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const runReturnSequence = useCallback(() => {
    setCompleted(true);
    setCompletionPhase("contracting");

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

            setTimeout(() => {
              setCompletionPhase("done");
              Animated.timing(screenFade, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
              }).start(() => {
                endJourney();
              });
            }, 2500);
          });
        }, 2000);
      });
    });
  }, [circleSize, welcomeBackOpacity, welcomeSubOpacity, screenFade]);

  const runStage = useCallback(
    (idx: number) => {
      if (idx >= SHIFT_STAGES.length) {
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
        Animated.timing(stageOpacity, {
          toValue: 1,
          duration: FADE_MS,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => runStage(idx + 1), STAGE_DURATION_MS - FADE_MS * 2);
        });
      });
    },
    [stageOpacity, circleSize, incrementCount, runReturnSequence]
  );

  const beginJourney = () => {
    stageOpacity.setValue(0);
    circleSize.setValue(24);
    welcomeBackOpacity.setValue(0);
    welcomeSubOpacity.setValue(0);
    screenFade.setValue(1);
    setStage(0);
    setCompleted(false);
    setCompletionPhase(null);
    setJourneyActive(true);
    setTimeout(() => runStage(0), 800);
  };

  const endJourney = () => {
    setJourneyActive(false);
    setCompleted(false);
    setCompletionPhase(null);
    setStage(0);
    stageOpacity.setValue(0);
    circleSize.setValue(24);
    welcomeBackOpacity.setValue(0);
    welcomeSubOpacity.setValue(0);
    screenFade.setValue(1);
  };

  const currentStage = SHIFT_STAGES[stage];

  return (
    <View style={[styles.container, { backgroundColor: "#000000" }]}>
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
          <TouchableOpacity
            onPress={beginJourney}
            style={[
              styles.beginBtn,
              {
                borderColor: colors.primary + "50",
                backgroundColor: colors.primary + "0C",
              },
            ]}
            activeOpacity={0.75}
          >
            <Text style={[styles.beginText, { color: colors.primary }]}>
              BEGIN THE SHIFT
            </Text>
            <Text style={[styles.beginSub, { color: colors.mutedForeground }]}>
              a 60-second journey to the edge of everything
            </Text>
          </TouchableOpacity>

          {count > 0 && (
            <Text style={[styles.countText, { color: colors.mutedForeground }]}>
              {count} {count === 1 ? "journey" : "journeys"} completed
            </Text>
          )}
        </View>
      </View>

      <Modal
        visible={journeyActive}
        animationType="fade"
        statusBarTranslucent
        transparent
      >
        <Animated.View style={[styles.journeyContainer, { opacity: screenFade }]}>

          {/* Always-visible back button */}
          <TouchableOpacity
            onPress={endJourney}
            style={{
              position: "absolute",
              top: topPad + 12,
              left: 24,
              zIndex: 200,
              padding: 12,
            }}
          >
            <Text style={{ color: "#C8A96E", fontSize: 22 }}>←</Text>
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
            <TouchableOpacity
              onPress={endJourney}
              style={{
                marginTop: 40,
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderWidth: 1,
                borderColor: "rgba(200,170,100,0.25)",
                borderRadius: 24,
              }}
            >
              <Text style={{
                color: "rgba(200,170,100,0.6)",
                fontSize: 11,
                letterSpacing: 3,
                fontFamily: "Inter_400Regular",
              }}>
                RETURN
              </Text>
            </TouchableOpacity>
          )}

          {completionPhase === "done" && (
            <TouchableOpacity
              onPress={() => router.push("/tonight-sky")}
              style={styles.universeLink}
            >
              <Text style={styles.universeLinkText}>TONIGHT'S SKY →</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    paddingHorizontal: 32,
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
  beginBtn: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 8,
  },
  beginText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 4,
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
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  journeyCircle: {
    position: "absolute",
    borderWidth: 1,
  },
  stageTextWrap: {
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 36,
    gap: 12,
  },
  stageHint: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 3,
  },
  stageTitle: {
    fontSize: 28,
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
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 40,
  },
  welcomeBack: {
    fontSize: 34,
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
  universeLink: {
    position: "absolute",
    bottom: 110,
    alignSelf: "center",
  },
  universeLinkText: {
    color: "#C8A96E",
    fontSize: 12,
    letterSpacing: 3,
    opacity: 0.7,
    fontFamily: "Inter_400Regular",
  },
});
