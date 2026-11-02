import React, { useEffect, useRef, useState } from "react";
import {
  Image,
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

import { FindIt } from "@/components/FindIt";
import { LookBack } from "@/components/LookBack";
import { TravelThere } from "@/components/TravelThere";
import { StarField } from "@/components/StarField";
import { LOCATIONS } from "@/constants/cosmicData";
import { EXPLORE_ARTWORK } from "@/constants/exploreArtworkAssets";
import {
  canFindNow,
  lightLeftFor,
  noteFor,
  noteLine,
  skyFor,
} from "@/constants/exploreSky";
import { useColors } from "@/hooks/useColors";
import { useExploreContext } from "@/hooks/useExploreContext";

const WARM = "#F3DDB0";

/**
 * One place, kept short: its name, how far away it is, one sentence about its light, and where to
 * look if it is up tonight. Three things to do with it, and the next place further out.
 */
export default function LocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const { where, notes, now } = useExploreContext();

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const [imageFailed, setImageFailed] = useState(false);
  const [moment, setMoment] = useState<"look" | "travel" | "find" | null>(null);

  const index = LOCATIONS.findIndex((l) => l.id === id);
  const location = index >= 0 ? LOCATIONS[index] : undefined;
  const next = index >= 0 ? LOCATIONS[index + 1] : undefined;

  useEffect(() => {
    setImageFailed(false);
    setMoment(null);
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
  // Only say where it is when there is something to see tonight.
  const skyLine =
    where && (sky.tone === "up" || sky.tone === "later") ? sky.line : null;
  const findable = canFindNow(location, where, now);
  const note = noteFor(location, notes);

  const action = (
    icon: React.ComponentProps<typeof Feather>["name"],
    label: string,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.action, { borderColor: colors.border }]}
    >
      <Feather name={icon} size={18} color={colors.primary} />
      <Text style={[styles.actionText, { color: colors.foreground }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
            colors={["rgba(5,7,12,0)", "rgba(5,7,12,0.5)", colors.background]}
            locations={[0, 0.6, 1]}
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
        </View>

        <View style={styles.body}>
          <Text style={[styles.kind, { color: colors.primary }]}>
            {location.subtitle}
          </Text>
          <Text
            style={[styles.name, { color: colors.foreground }]}
            accessibilityRole="header"
          >
            {location.name}
          </Text>
          <Text style={[styles.distance, { color: colors.mutedForeground }]}>
            {location.distance}
          </Text>

          <Text style={[styles.text, { color: colors.foreground }]}>
            {lightLeftFor(location, now)}
          </Text>

          {skyLine ? (
            <Text style={[styles.sky, { color: colors.mutedForeground }]}>
              <Text style={{ color: colors.primary }}>Tonight. </Text>
              {skyLine}
            </Text>
          ) : null}

          {note ? (
            <Text style={[styles.sky, { color: WARM }]}>
              {noteLine(note, now.getTime())}
            </Text>
          ) : null}

          <View style={styles.actions}>
            {action("rotate-ccw", "Look back", () => setMoment("look"))}
            {action("navigation", "Travel there", () => setMoment("travel"))}
            {findable
              ? action("compass", "Find it", () => setMoment("find"))
              : null}
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            {location.noteTo ? (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/notes",
                    params: { to: location.noteTo },
                  })
                }
                accessibilityRole="button"
                style={styles.link}
              >
                <Text style={[styles.linkText, { color: colors.primary }]}>
                  Send a note here
                </Text>
              </TouchableOpacity>
            ) : null}
            {next ? (
              <TouchableOpacity
                onPress={() => router.replace(`/location/${next.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`Next: ${next.name}`}
                style={[styles.link, styles.nextLink]}
              >
                <Text
                  style={[styles.linkText, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  Next: {next.name}
                </Text>
                <Feather
                  name="arrow-right"
                  size={16}
                  color={colors.foreground}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => router.back()}
                accessibilityRole="button"
                style={[styles.link, styles.nextLink]}
              >
                <Text style={[styles.linkText, { color: colors.foreground }]}>
                  Back to the start
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

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

      <LookBack
        place={location}
        visible={moment === "look"}
        onClose={() => setMoment(null)}
      />
      <TravelThere
        place={location}
        visible={moment === "travel"}
        onClose={() => setMoment(null)}
      />
      {where ? (
        <FindIt
          place={location}
          where={where}
          visible={moment === "find"}
          onClose={() => setMoment(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  hero: {
    height: 340,
    overflow: "hidden",
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
  body: {
    alignSelf: "center",
    maxWidth: 640,
    width: "100%",
    paddingHorizontal: 24,
    marginTop: -40,
    gap: 6,
  },
  kind: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  name: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  distance: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },
  text: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: "Inter_400Regular",
    marginTop: 14,
  },
  sky: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  action: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 6,
  },
  actionText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  footer: {
    marginTop: 28,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  link: { minHeight: 48, justifyContent: "center" },
  nextLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  linkText: { fontSize: 15, fontFamily: "Inter_500Medium", flexShrink: 1 },
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
