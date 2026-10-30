import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Linking,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { CalmPressable } from "@/components/CalmPressable";
import { SkyChip } from "@/components/LocationCard";
import { StarField } from "@/components/StarField";
import { LOCATIONS } from "@/constants/cosmicData";
import { EXPLORE_ARTWORK } from "@/constants/exploreArtworkAssets";
import {
  birthdayLine,
  lightLeftFor,
  noteFor,
  noteLine,
  skyFor,
} from "@/constants/exploreSky";
import { useColors } from "@/hooks/useColors";
import { useExploreContext } from "@/hooks/useExploreContext";

const WARM = "#F3DDB0";

/**
 * One place, always in the same order: where it is in your sky, how far that really is, and when
 * the light we see left. A short reflective line follows, kept apart from the science, and then the
 * next place further out.
 */
export default function LocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const { where, notes, birthday, now } = useExploreContext();

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const [imageFailed, setImageFailed] = useState(false);

  const index = LOCATIONS.findIndex((l) => l.id === id);
  const location = index >= 0 ? LOCATIONS[index] : undefined;
  const next = index >= 0 ? LOCATIONS[index + 1] : undefined;

  useEffect(() => {
    setImageFailed(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [id]);

  if (!location) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.mutedForeground }}>
          Location not found
        </Text>
      </View>
    );
  }

  const sky = skyFor(location, where, now);
  const note = noteFor(location, notes);
  const personalNote = note ? noteLine(note, now.getTime()) : null;
  const personalAge = birthdayLine(location, birthday, now);

  const card = [
    styles.card,
    { backgroundColor: colors.glass, borderColor: colors.luminousBorder },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={80} />

      <ScrollView
        ref={scrollRef}
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          {
            backgroundColor: colors.background,
            paddingBottom: bottomPad + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.hero}>
          {!imageFailed ? (
            <Image
              source={EXPLORE_ARTWORK[location.artworkKey]}
              style={styles.heroArtwork}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
              accessible={false}
            />
          ) : null}
          <LinearGradient
            colors={[
              "rgba(5,7,12,0.08)",
              "rgba(5,7,12,0.56)",
              colors.background,
            ]}
            locations={[0, 0.54, 1]}
            style={StyleSheet.absoluteFill}
          />
          <Text
            style={[
              styles.illustration,
              { color: colors.mutedForeground, top: topPad + 22 },
            ]}
          >
            Illustration
          </Text>
          <View
            style={[
              styles.heroContent,
              { paddingTop: topPad + 96, paddingBottom: 34 },
            ]}
          >
            <Text style={[styles.heroLabel, { color: colors.primary }]}>
              {location.subtitle}
            </Text>
            <Text
              style={[styles.heroName, { color: colors.foreground }]}
              accessibilityRole="header"
            >
              {location.name}
            </Text>
            <Text
              style={[styles.heroDistance, { color: colors.mutedForeground }]}
            >
              {location.distance}. Light takes {location.light} to get here.
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={card}>
            <View style={styles.cardHead}>
              <Text
                style={[styles.cardLabel, { color: colors.mutedForeground }]}
              >
                In your sky
              </Text>
              {sky.chip ? <SkyChip sky={sky} /> : null}
            </View>
            <Text style={[styles.cardText, { color: colors.foreground }]}>
              {sky.line}
            </Text>
          </View>

          <View style={card}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>
              How far that really is
            </Text>
            <Text style={[styles.cardText, { color: colors.foreground }]}>
              {location.far}
            </Text>
          </View>

          <View style={card}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>
              When this light left
            </Text>
            <Text style={[styles.cardText, { color: colors.foreground }]}>
              {lightLeftFor(location, now)}
            </Text>
          </View>

          {personalNote || personalAge ? (
            <View style={[styles.card, styles.personal]}>
              <Text style={[styles.cardLabel, { color: WARM }]}>
                Just for you
              </Text>
              {personalNote ? (
                <Text style={[styles.cardText, { color: colors.foreground }]}>
                  {personalNote}
                </Text>
              ) : null}
              {personalAge ? (
                <Text style={[styles.cardText, { color: colors.foreground }]}>
                  {personalAge}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={[styles.thought, { borderTopColor: colors.border }]}>
            <Text
              style={[styles.thoughtText, { color: colors.mutedForeground }]}
            >
              {location.reflection}
            </Text>
          </View>

          {location.noteTo ? (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/notes",
                  params: { to: location.noteTo },
                })
              }
              accessibilityRole="button"
              style={[styles.primary, { borderColor: colors.primary }]}
            >
              <Text style={[styles.primaryText, { color: colors.foreground }]}>
                Send a note here
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://stellaraspace.com").catch(
                () => undefined,
              )
            }
            accessibilityRole="link"
            style={styles.linkBtn}
          >
            <Text style={[styles.link, { color: colors.primary }]}>
              See it in the 3D universe
            </Text>
          </TouchableOpacity>

          {next ? (
            <CalmPressable
              onPress={() => router.replace(`/location/${next.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Next, further out: ${next.name}. ${next.jump}.`}
              style={({ pressed }) => [
                styles.next,
                {
                  borderColor: colors.primary + "4D",
                  backgroundColor: pressed
                    ? colors.cardPressed
                    : "rgba(141,235,255,0.06)",
                },
              ]}
            >
              <View style={styles.nextCopy}>
                <Text style={[styles.nextLabel, { color: colors.primary }]}>
                  Next, further out
                </Text>
                <Text style={[styles.nextName, { color: colors.foreground }]}>
                  {next.name}
                </Text>
                <Text
                  style={[styles.nextJump, { color: colors.mutedForeground }]}
                >
                  {next.jump}. Light takes {next.light}.
                </Text>
              </View>
              <Feather name="arrow-right" size={20} color={colors.primary} />
            </CalmPressable>
          ) : (
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              style={[styles.primary, { borderColor: colors.primary + "4D" }]}
            >
              <Text style={[styles.primaryText, { color: colors.foreground }]}>
                As far as we can see. Back to the start
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[
          styles.backBtn,
          {
            top: topPad + 12,
            backgroundColor: colors.background + "CC",
          },
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
  container: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  hero: {
    minHeight: 410,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroArtwork: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
  illustration: {
    position: "absolute",
    right: 20,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  heroContent: {
    alignSelf: "center",
    maxWidth: 760,
    width: "100%",
    paddingHorizontal: 24,
    gap: 6,
  },
  heroLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },
  heroName: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
    lineHeight: 40,
  },
  heroDistance: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  details: {
    alignSelf: "center",
    maxWidth: 760,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 14,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 8,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  cardLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: "Inter_400Regular",
  },
  personal: {
    borderColor: "rgba(243,221,176,0.4)",
  },
  thought: {
    borderTopWidth: 1,
    paddingTop: 18,
    paddingHorizontal: 2,
  },
  thoughtText: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  primary: {
    alignItems: "center",
    borderRadius: 27,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  primaryText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  linkBtn: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center" },
  link: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textDecorationLine: "underline",
  },
  next: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 80,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  nextCopy: { flex: 1, gap: 3 },
  nextLabel: { fontSize: 12, lineHeight: 16, fontFamily: "Inter_600SemiBold" },
  nextName: { fontSize: 17, lineHeight: 22, fontFamily: "Inter_600SemiBold" },
  nextJump: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_400Regular" },
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
