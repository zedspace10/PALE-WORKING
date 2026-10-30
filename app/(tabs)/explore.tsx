import { useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LocationCard } from "@/components/LocationCard";
import { StarField } from "@/components/StarField";
import { LOCATIONS, Location } from "@/constants/cosmicData";
import { noteFor, skyFor } from "@/constants/exploreSky";
import { calmTypography } from "@/constants/ui";
import { useColors } from "@/hooks/useColors";
import { useExploreContext } from "@/hooks/useExploreContext";
import { useResetScrollOnFocus } from "@/hooks/useResetScrollOnFocus";

/**
 * Places in the universe, in order outwards from Earth. Between each one is how much further light
 * has to travel, so scrolling the list is a slow version of the Shift.
 */
export default function ExploreScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<FlatList<Location>>(null);
  useResetScrollOnFocus(scrollRef);
  const { where, notes, now } = useExploreContext();

  const rows = useMemo(
    () =>
      LOCATIONS.map((location) => ({
        location,
        sky: skyFor(location, where, now),
        hasNote: noteFor(location, notes) !== null,
      })),
    [where, notes, now],
  );

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.4} />
      <FlatList
        ref={scrollRef}
        data={LOCATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: topPad + 20,
            paddingBottom: bottomPad + 100,
          },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Places in the universe
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Scroll outwards. At every step, light takes longer to reach us.
            </Text>
          </View>
        }
        renderItem={({ index }) => {
          const row = rows[index];
          return (
            <LocationCard
              location={row.location}
              sky={row.sky}
              hasNote={row.hasNote}
              onPress={() => router.push(`/location/${row.location.id}`)}
            />
          );
        }}
        ListFooterComponent={
          <Text style={[styles.footer, { color: colors.mutedForeground }]}>
            {where
              ? "Tonight's sky is worked out on your phone from the location you last shared."
              : "Share your location in Tonight's Sky to see exactly where each one is tonight."}
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    alignSelf: "center",
    maxWidth: 720,
    width: "100%",
    paddingHorizontal: 18,
  },
  header: {
    gap: 7,
    paddingBottom: 20,
    paddingHorizontal: 2,
  },
  title: {
    ...calmTypography.display,
  },
  subtitle: {
    ...calmTypography.body,
  },
  footer: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
    marginTop: 24,
    paddingHorizontal: 2,
  },
});
