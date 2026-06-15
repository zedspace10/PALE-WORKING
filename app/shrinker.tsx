import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import {
  PerspectiveResponse,
  detectCategory,
  getResponse,
  getResponseCount,
} from "@/constants/shrinkerResponses";
import { useColors } from "@/hooks/useColors";
import { useJournal } from "@/hooks/useJournal";

type Stage = "input" | "responding" | "result";

export default function ShrinkerScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addEntry } = useJournal();

  const [stage, setStage] = useState<Stage>("input");
  const [text, setText] = useState("");
  const [response, setResponse] = useState<PerspectiveResponse | null>(null);
  const [seed, setSeed] = useState(0);
  const [savedToJournal, setSavedToJournal] = useState(false);
  const [category, setCategory] = useState<ReturnType<typeof detectCategory>>("general");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const fadeIn = () =>
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();

  const fadeOut = (cb: () => void) =>
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(cb);

  const handleSubmit = () => {
    if (!text.trim()) return;
    Keyboard.dismiss();
    const cat = detectCategory(text);
    setCategory(cat);
    const resp = getResponse(cat, 0);
    setSeed(0);
    fadeAnim.setValue(0);
    setStage("responding");
    setTimeout(() => {
      setResponse(resp);
      setStage("result");
      fadeIn();
    }, 600);
  };

  const handleTryAgain = () => {
    const cat = category;
    const count = getResponseCount(cat);
    const nextSeed = (seed + 1) % count;
    setSeed(nextSeed);
    fadeOut(() => {
      const resp = getResponse(cat, nextSeed);
      setResponse(resp);
      setSavedToJournal(false);
      fadeAnim.setValue(0);
      fadeIn();
    });
  };

  const handleSaveToJournal = async () => {
    if (!response || savedToJournal) return;
    await addEntry({
      type: "worry",
      text: text.trim(),
    });
    setSavedToJournal(true);
  };

  const handleReset = () => {
    fadeOut(() => {
      setStage("input");
      setResponse(null);
      setSavedToJournal(false);
      setSeed(0);
      setText("");
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={80} containerOpacity={0.5} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Problem Shrinker
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            perspective, not dismissal
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: bottomPad + 40,
            paddingHorizontal: 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Input stage */}
        {stage === "input" && (
          <View style={styles.inputSection}>
            <Text style={[styles.inputPrompt, { color: colors.foreground }]}>
              What's weighing on you?
            </Text>
            <Text
              style={[styles.inputSubtext, { color: colors.mutedForeground }]}
            >
              Your worry won't be dismissed. You'll receive a genuine
              perspective — not a solution, but a wider view.
            </Text>

            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="I have an interview tomorrow. I'm worried about my future. I argued with someone I care about..."
                placeholderTextColor={colors.mutedForeground + "70"}
                style={[styles.textArea, { color: colors.foreground }]}
                multiline
                textAlignVertical="top"
                autoFocus
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!text.trim()}
              style={[
                styles.submitBtn,
                {
                  borderColor: text.trim()
                    ? colors.primary + "55"
                    : colors.border,
                  backgroundColor: text.trim()
                    ? colors.primary + "12"
                    : "transparent",
                },
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.submitText,
                  {
                    color: text.trim()
                      ? colors.primary
                      : colors.mutedForeground,
                    letterSpacing: 2.5,
                  },
                ]}
              >
                SEEK PERSPECTIVE
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Responding animation */}
        {stage === "responding" && (
          <View style={styles.respondingSection}>
            <View
              style={[
                styles.respondingOrb,
                { borderColor: colors.primary + "30" },
              ]}
            >
              <View
                style={[
                  styles.respondingOrbInner,
                  { backgroundColor: colors.primary + "18" },
                ]}
              >
                <View
                  style={[
                    styles.respondingOrbDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
              </View>
            </View>
            <Text
              style={[styles.respondingText, { color: colors.mutedForeground }]}
            >
              Considering the larger view…
            </Text>
          </View>
        )}

        {/* Result */}
        {stage === "result" && response && (
          <Animated.View style={[styles.resultSection, { opacity: fadeAnim }]}>
            {/* Worry echo */}
            <View
              style={[
                styles.worryEcho,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[styles.worryLabel, { color: colors.mutedForeground }]}
              >
                YOUR WORRY
              </Text>
              <Text style={[styles.worryText, { color: colors.foreground }]}>
                {text}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: colors.border },
                ]}
              />
              <Text
                style={[
                  styles.dividerLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                A wider view
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: colors.border },
                ]}
              />
            </View>

            {/* Cosmic angle */}
            <View
              style={[
                styles.responseBlock,
                {
                  backgroundColor: colors.primary + "08",
                  borderColor: colors.primary + "22",
                },
              ]}
            >
              <Text
                style={[styles.blockLabel, { color: colors.primary }]}
              >
                COSMIC SCALE
              </Text>
              <Text
                style={[styles.blockText, { color: colors.foreground }]}
              >
                {response.cosmicAngle}
              </Text>
            </View>

            {/* Human angle */}
            <View
              style={[
                styles.responseBlock,
                {
                  backgroundColor: colors.accent + "08",
                  borderColor: colors.accent + "22",
                },
              ]}
            >
              <Text
                style={[styles.blockLabel, { color: colors.accent }]}
              >
                HUMAN WISDOM
              </Text>
              <Text
                style={[styles.blockText, { color: colors.foreground }]}
              >
                {response.humanAngle}
              </Text>
            </View>

            {/* Closing */}
            <View
              style={[
                styles.closingBlock,
                { borderLeftColor: colors.primary + "60" },
              ]}
            >
              <Text style={[styles.closingText, { color: colors.foreground }]}>
                {response.closing}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {!savedToJournal ? (
                <TouchableOpacity
                  onPress={handleSaveToJournal}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="bookmark"
                    size={15}
                    color={colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Save to Journal
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="check"
                    size={15}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.actionText, { color: colors.primary }]}
                  >
                    Saved to Journal
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleTryAgain}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather
                  name="refresh-cw"
                  size={15}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Different perspective
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleReset}
              style={styles.resetBtn}
            >
              <Text
                style={[styles.resetText, { color: colors.mutedForeground }]}
              >
                Bring another worry
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 4, marginBottom: 2 },
  headerTitles: { flex: 1, gap: 2 },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  content: { paddingTop: 32, gap: 20 },
  inputSection: { gap: 20 },
  inputPrompt: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  inputSubtext: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginTop: -4,
  },
  inputWrap: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  textArea: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    minHeight: 140,
  },
  submitBtn: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 20,
    alignItems: "center",
  },
  submitText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  respondingSection: {
    alignItems: "center",
    paddingTop: 60,
    gap: 24,
  },
  respondingOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  respondingOrbInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  respondingOrbDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  respondingText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  resultSection: { gap: 18 },
  worryEcho: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  worryLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2.5,
  },
  worryText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 23,
    fontStyle: "italic",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  responseBlock: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  blockLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2.5,
  },
  blockText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 25,
  },
  closingBlock: {
    borderLeftWidth: 2,
    paddingLeft: 16,
    paddingVertical: 4,
    marginLeft: 4,
  },
  closingText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    lineHeight: 26,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.1,
  },
  resetBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  resetText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "underline",
    letterSpacing: 0.2,
  },
});
