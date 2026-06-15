import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarField } from "@/components/StarField";
import { MirrorResponse, findResponse } from "@/constants/mirrorResponses";
import {
  PERSPECTIVE_LENSES,
  getLensSeed,
  getResponseForLens,
} from "@/constants/perspectiveLenses";
import { useColors } from "@/hooks/useColors";
import { useJournal } from "@/hooks/useJournal";

type MirrorMode = "input" | "animating" | "result";
type TabMode = "mirror" | "perspective";

const easeIn = (t: number) => t * t;

export default function MirrorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addEntry } = useJournal();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [tabMode, setTabMode] = useState<TabMode>("mirror");
  const [mirrorMode, setMirrorMode] = useState<MirrorMode>("input");
  const [mirrorInput, setMirrorInput] = useState("");
  const [mirrorResponse, setMirrorResponse] = useState<MirrorResponse | null>(null);
  const [savedToJournal, setSavedToJournal] = useState(false);

  // Animation values
  const feelingScale = useRef(new Animated.Value(1)).current;
  const feelingOpacity = useRef(new Animated.Value(1)).current;
  const starOpacity = useRef(new Animated.Value(0.28)).current;
  const truthOpacity = useRef(new Animated.Value(0)).current;
  const truthTranslate = useRef(new Animated.Value(20)).current;
  const actionsOpacity = useRef(new Animated.Value(0)).current;

  // Perspective state
  const [perspInput, setPerspInput] = useState("");
  const [perspSubmitted, setPerspSubmitted] = useState(false);
  const [expandedLens, setExpandedLens] = useState<string | null>(null);
  const perspFadeAnim = useRef(new Animated.Value(0)).current;

  const handleMirrorSubmit = async () => {
    if (!mirrorInput.trim()) return;
    Keyboard.dismiss();

    findResponse(mirrorInput).then(setMirrorResponse);
    setMirrorMode("animating");

    // Animation sequence per spec
    Animated.sequence([
      // Step 1: pause (400ms)
      Animated.delay(400),
      // Step 2: feeling shrinks and fades (1400ms)
      Animated.parallel([
        Animated.timing(feelingScale, {
          toValue: 0.15,
          duration: 1400,
          easing: easeIn,
          useNativeDriver: true,
        }),
        Animated.timing(feelingOpacity, {
          toValue: 0.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        // Star field intensifies
        Animated.timing(starOpacity, {
          toValue: 0.55,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
      // Step 3 & 4: speck fades to nothing
      Animated.timing(feelingOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(200),
      // Step 5: cosmic truth fades in (800ms)
      Animated.parallel([
        Animated.timing(truthOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(truthTranslate, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Step 6: haptic when truth fully visible
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setMirrorMode("result");
      // Actions fade in after 2 seconds
      setTimeout(() => {
        Animated.timing(actionsOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  const handleMirrorReset = () => {
    feelingScale.setValue(1);
    feelingOpacity.setValue(1);
    starOpacity.setValue(0.28);
    truthOpacity.setValue(0);
    truthTranslate.setValue(20);
    actionsOpacity.setValue(0);
    setMirrorMode("input");
    setMirrorInput("");
    setMirrorResponse(null);
    setSavedToJournal(false);
  };

  const handleSaveToJournal = async () => {
    if (savedToJournal || !mirrorInput.trim()) return;
    await addEntry({ type: "reflection", text: mirrorInput.trim() });
    setSavedToJournal(true);
  };

  const handlePerspSubmit = () => {
    if (!perspInput.trim()) return;
    Keyboard.dismiss();
    perspFadeAnim.setValue(0);
    setPerspSubmitted(true);
    setExpandedLens(PERSPECTIVE_LENSES[0].id);
    Animated.timing(perspFadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };

  const handlePerspReset = () => {
    setPerspSubmitted(false);
    setPerspInput("");
    setExpandedLens(null);
    perspFadeAnim.setValue(0);
  };

  const seed = perspSubmitted ? getLensSeed(perspInput) : 0;
  const isMirrorActive =
    mirrorMode === "animating" || mirrorMode === "result";

  return (
    <View style={[styles.container, { backgroundColor: "#000000" }]}>
      {/* Star field — opacity animated during response */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: starOpacity }]}
        pointerEvents="none"
      >
        <StarField count={80} containerOpacity={1} />
      </Animated.View>

      {/* ── MIRROR RESPONSE FULL SCREEN ── */}
      {isMirrorActive && mirrorResponse && (
        <View style={styles.responseScreen}>
          {/* Shrinking feeling text */}
          <Animated.View
            style={[
              styles.feelingWrap,
              {
                transform: [{ scale: feelingScale }],
                opacity: feelingOpacity,
              },
            ]}
          >
            <Text style={styles.feelingText}>{mirrorInput}</Text>
          </Animated.View>

          {/* Cosmic truth */}
          <Animated.View
            style={[
              styles.truthWrap,
              {
                opacity: truthOpacity,
                transform: [{ translateY: truthTranslate }],
              },
            ]}
          >
            <Text style={styles.truthText}>{mirrorResponse?.truth}</Text>
          </Animated.View>

          {/* Actions — after 2s */}
          {mirrorMode === "result" && (
            <Animated.View
              style={[styles.responseActions, { opacity: actionsOpacity }]}
            >
              <TouchableOpacity
                onPress={handleSaveToJournal}
                disabled={savedToJournal}
              >
                <Text
                  style={[
                    styles.actionGold,
                    savedToJournal && { opacity: 0.5 },
                  ]}
                >
                  {savedToJournal ? "Saved" : "Save to journal"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.actionDivider}>·</Text>
              <TouchableOpacity onPress={handleMirrorReset}>
                <Text style={styles.actionMuted}>Try again</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}

      {/* ── NORMAL SCROLL VIEW ── */}
      {!isMirrorActive && (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: topPad + 32,
              paddingBottom: bottomPad + 100,
              paddingHorizontal: 28,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.titleSection}>
            <Text style={[styles.screenTitle, { color: colors.foreground }]}>
              {tabMode === "mirror" ? "Mirror" : "Perspective"}
            </Text>
            <Text
              style={[styles.screenSub, { color: colors.mutedForeground }]}
            >
              {tabMode === "mirror"
                ? "speak, and the universe will answer"
                : "see your situation through different lenses"}
            </Text>
          </View>

          {/* Tab toggle */}
          <View
            style={[
              styles.tabRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {(["mirror", "perspective"] as TabMode[]).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTabMode(t)}
                style={[
                  styles.tabBtn,
                  tabMode === t && {
                    backgroundColor: colors.primary + "18",
                    borderRadius: 10,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        tabMode === t
                          ? colors.primary
                          : colors.mutedForeground,
                    },
                  ]}
                >
                  {t === "mirror" ? "Mirror" : "Perspective From..."}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ─── MIRROR MODE ─── */}
          {tabMode === "mirror" && mirrorMode === "input" && (
            <View style={styles.inputSection}>
              <View
                style={[
                  styles.inputWrap,
                  { borderBottomColor: mirrorInput.trim() ? colors.primary + "60" : colors.border },
                ]}
              >
                <TextInput
                  value={mirrorInput}
                  onChangeText={setMirrorInput}
                  placeholder="How are you feeling?"
                  placeholderTextColor={colors.mutedForeground + "60"}
                  style={[styles.input, { color: colors.foreground }]}
                  multiline
                  maxLength={300}
                  textAlignVertical="top"
                  autoFocus={false}
                />
              </View>

              {mirrorInput.trim().length > 0 && (
                <TouchableOpacity
                  onPress={handleMirrorSubmit}
                  style={styles.arrowBtn}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.arrowText, { color: colors.primary }]}>
                    →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ─── PERSPECTIVE FROM... MODE ─── */}
          {tabMode === "perspective" && (
            <>
              {!perspSubmitted && (
                <View style={styles.inputSection}>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        borderBottomColor: perspInput.trim()
                          ? colors.primary + "60"
                          : colors.border,
                      },
                    ]}
                  >
                    <TextInput
                      value={perspInput}
                      onChangeText={setPerspInput}
                      placeholder="What's on your mind?"
                      placeholderTextColor={colors.mutedForeground + "60"}
                      style={[styles.input, { color: colors.foreground }]}
                      multiline
                      maxLength={300}
                      textAlignVertical="top"
                      autoFocus={false}
                    />
                  </View>

                  {perspInput.trim().length > 0 && (
                    <TouchableOpacity
                      onPress={handlePerspSubmit}
                      style={styles.arrowBtn}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.arrowText,
                          { color: colors.primary },
                        ]}
                      >
                        →
                      </Text>
                    </TouchableOpacity>
                  )}

                  <Text
                    style={[
                      styles.perspHint,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    PALE will offer five different lenses — cosmic, stoic,
                    historical, scientific, and philosophical — to help you
                    see your situation differently.
                  </Text>
                </View>
              )}

              {perspSubmitted && (
                <Animated.View
                  style={[styles.lensSection, { opacity: perspFadeAnim }]}
                >
                  <View
                    style={[
                      styles.perspInputDisplay,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.perspInputText,
                        { color: colors.mutedForeground },
                      ]}
                      numberOfLines={2}
                    >
                      {perspInput}
                    </Text>
                  </View>

                  {PERSPECTIVE_LENSES.map((lens) => {
                    const isOpen = expandedLens === lens.id;
                    const response = getResponseForLens(lens, seed);
                    return (
                      <TouchableOpacity
                        key={lens.id}
                        onPress={() =>
                          setExpandedLens(isOpen ? null : lens.id)
                        }
                        activeOpacity={0.8}
                        style={[
                          styles.lensCard,
                          {
                            backgroundColor: colors.card,
                            borderColor: isOpen
                              ? lens.color + "40"
                              : colors.border,
                          },
                        ]}
                      >
                        <View style={styles.lensHeader}>
                          <View
                            style={[
                              styles.lensDot,
                              { backgroundColor: lens.color + "60" },
                            ]}
                          />
                          <View style={styles.lensLabelWrap}>
                            <Text
                              style={[
                                styles.lensLabel,
                                { color: lens.color },
                              ]}
                            >
                              {lens.label}
                            </Text>
                            <Text
                              style={[
                                styles.lensSubtitle,
                                { color: colors.mutedForeground },
                              ]}
                            >
                              {lens.subtitle}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.lensChevron,
                              { color: colors.mutedForeground },
                            ]}
                          >
                            {isOpen ? "−" : "+"}
                          </Text>
                        </View>

                        {isOpen && (
                          <View style={styles.lensBody}>
                            <View
                              style={[
                                styles.lensDivider,
                                { backgroundColor: lens.color + "30" },
                              ]}
                            />
                            <Text
                              style={[
                                styles.lensResponse,
                                { color: colors.foreground },
                              ]}
                            >
                              {response}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    onPress={handlePerspReset}
                    style={[
                      styles.resetBtn,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.card,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.resetText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Try another
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Full-screen response overlay
  responseScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 0,
  },
  feelingWrap: {
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  feelingText: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    color: "#6B6B7E",
    textAlign: "center",
    lineHeight: 28,
    fontStyle: "italic",
  },
  truthWrap: {
    paddingHorizontal: 8,
    paddingVertical: 24,
    borderLeftWidth: 1.5,
    borderLeftColor: "#C8A96E40",
    paddingLeft: 24,
  },
  truthText: {
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    color: "#F5F0E8",
    lineHeight: 34,
    letterSpacing: 0.6,
  },
  responseActions: {
    position: "absolute",
    bottom: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionGold: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#C8A96E",
    letterSpacing: 0.3,
  },
  actionDivider: {
    fontSize: 13,
    color: "#3A3A4A",
  },
  actionMuted: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#6B6B7E",
    letterSpacing: 0.3,
  },

  // Scroll content
  content: { gap: 24 },
  titleSection: { gap: 6 },
  screenTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  screenSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },

  // Borderless input
  inputSection: { gap: 16 },
  inputWrap: {
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  input: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    lineHeight: 32,
    minHeight: 80,
    padding: 0,
    letterSpacing: 0.2,
  },
  arrowBtn: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  arrowText: {
    fontSize: 28,
    lineHeight: 32,
  },
  perspHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    fontStyle: "italic",
    marginTop: 4,
  },

  // Perspective lenses
  lensSection: { gap: 12 },
  perspInputDisplay: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  perspInputText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    lineHeight: 22,
  },
  lensCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  lensHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lensDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  lensLabelWrap: { flex: 1, gap: 2 },
  lensLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  lensSubtitle: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  lensChevron: {
    fontSize: 20,
    fontFamily: "Inter_300Light",
    lineHeight: 22,
  },
  lensBody: { gap: 12, marginTop: 12 },
  lensDivider: { height: 1 },
  lensResponse: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 25,
    letterSpacing: 0.1,
  },
  resetBtn: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  resetText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
});
