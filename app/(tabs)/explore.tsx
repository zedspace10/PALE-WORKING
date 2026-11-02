import { useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LocationCard } from "@/components/LocationCard";
import { StarField } from "@/components/StarField";
import { LOCATIONS, Location } from "@/constants/cosmicData";
import { skyFor } from "@/constants/exploreSky";
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
  const { where, now } = useExploreContext();

  const rows = useMemo(
    () =>
      LOCATIONS.map((location) => ({
        location,
        upTonight: where !== null && skyFor(location, where, now).tone === "up",
      })),
    [where, now],
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
              From the Moon to the edge of what we can see.
            </Text>
          </View>
        }
        renderItem={({ index }) => {
          const row = rows[index];
          return (
            <LocationCard
              location={row.location}
              upTonight={row.upTonight}
              onPress={() => router.push(`/location/${row.location.id}`)}
            />
          );
        }}
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
});
