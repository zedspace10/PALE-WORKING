import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarField } from "@/components/StarField";
import { dateWords } from "@/constants/thisWeek";
import { markThisWeekSeen } from "@/constants/thisWeekNotification";
import { ThisWeekToggle } from "@/components/ThisWeekToggle";
import { useColors } from "@/hooks/useColors";
import { useGoBack } from "@/hooks/useGoBack";
import { useThisWeek } from "@/hooks/useThisWeek";

const WARM = "#F3DDB0";

/** This week's picture from Hubble or Webb: the picture, a short plain write-up, and its credit. */
export default function ThisWeekScreen() {
  const colors = useColors();
  const router = useRouter();
  const goBack = useGoBack("/(tabs)/explore");
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const pin = useThisWeek();
  const [imageFailed, setImageFailed] = useState(false);
  // Once it has been opened there is nothing left to tell them about it.
  useEffect(() => {
    if (pin) markThisWeekSeen(pin.id).catch(() => undefined);
  }, [pin]);
  // The picture's own shape, once known, so the frame fits it exactly. Tall ones are capped.
  const [aspect, setAspect] = useState<number | null>(null);
  const frameWidth = Math.min(width, 640) - 48;
  const imageHeight = Math.min(
    aspect ? frameWidth / aspect : height * 0.45,
    height * 0.6,
    520,
  );

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const open = (url: string) => {
    WebBrowser.openBrowserAsync(url).catch(() => undefined);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.35} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 64, paddingBottom: bottomPad + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {pin ? (
          <>
            <Text style={[styles.label, { color: WARM }]}>
              This week · {dateWords(pin.date)}
            </Text>
            <Text
              style={[styles.title, { color: colors.foreground }]}
              accessibilityRole="header"
            >
              {pin.title}
            </Text>
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {pin.object}, {pin.distance}
              {pin.constellation ? `, in ${pin.constellation}` : ""}.
            </Text>

            {pin.image ? (
              <View style={styles.figure}>
                {!imageFailed ? (
                  <Image
                    source={{ uri: pin.image.src }}
                    accessibilityLabel={pin.image.alt}
                    style={[
                      styles.image,
                      {
                        height: imageHeight,
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    resizeMode="contain"
                    onLoad={(e) => {
                      const { width: w, height: h } =
                        e.nativeEvent.source ?? {};
                      if (w && h) setAspect(w / h);
                    }}
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <View
                    style={[
                      styles.image,
                      styles.missing,
                      {
                        height: 220,
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.mutedForeground }}>
                      {pin.object}
                    </Text>
                  </View>
                )}
                <Text
                  style={[styles.credit, { color: colors.mutedForeground }]}
                >
                  Image: {pin.image.credit}
                  {pin.image.licence ? ` (${pin.image.licence})` : ""}
                </Text>
              </View>
            ) : null}

            {pin.body.map((p) => (
              <Text
                key={p.slice(0, 24)}
                style={[styles.body, { color: colors.foreground }]}
              >
                {p}
              </Text>
            ))}
            {pin.reflection ? (
              <Text style={[styles.reflection, { color: WARM }]}>
                {pin.reflection}
              </Text>
            ) : null}

            <View style={[styles.links, { borderTopColor: colors.border }]}>
              {pin.universeUrl ? (
                <TouchableOpacity
                  onPress={() => open(pin.universeUrl!)}
                  accessibilityRole="link"
                  style={styles.link}
                >
                  <Text style={[styles.linkText, { color: colors.primary }]}>
                    See where it is in the universe
                  </Text>
                  <Feather
                    name="arrow-up-right"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              ) : null}
              {pin.source ? (
                <TouchableOpacity
                  onPress={() => open(pin.source!.href)}
                  accessibilityRole="link"
                  style={styles.link}
                >
                  <Text
                    style={[
                      styles.sourceText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Source: {pin.source.label}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </>
        ) : (
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            This week's picture will appear here once PALE has been online.
          </Text>
        )}

        <View style={styles.notify}>
          <ThisWeekToggle />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={goBack}
        style={[
          styles.backBtn,
          { top: topPad + 12, backgroundColor: colors.background + "CC" },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Back to Explore"
      >
        <Feather name="arrow-left" size={20} color={colors.foreground} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  notify: { marginTop: 28 },
  container: { flex: 1 },
  content: {
    alignSelf: "center",
    maxWidth: 640,
    width: "100%",
    paddingHorizontal: 24,
    gap: 10,
  },
  label: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_600SemiBold" },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  meta: { fontSize: 15, lineHeight: 22, fontFamily: "Inter_400Regular" },
  figure: { marginTop: 10, marginBottom: 8, gap: 8 },
  image: { width: "100%", borderRadius: 16, borderWidth: 1 },
  missing: { alignItems: "center", justifyContent: "center" },
  credit: { fontSize: 12, lineHeight: 17, fontFamily: "Inter_400Regular" },
  body: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  reflection: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  links: { marginTop: 20, paddingTop: 8, borderTopWidth: 1 },
  link: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  linkText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  sourceText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  backBtn: {
    position: "absolute",
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
