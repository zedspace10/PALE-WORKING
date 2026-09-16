import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LocationCard } from "@/components/LocationCard";
import { StarField } from "@/components/StarField";
import { LOCATIONS, Location } from "@/constants/cosmicData";
import { calmTypography } from "@/constants/ui";
import { useColors } from "@/hooks/useColors";
import { useResetScrollOnFocus } from "@/hooks/useResetScrollOnFocus";

export default function ExploreScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<FlatList<Location>>(null);
  useResetScrollOnFocus(scrollRef);

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.4} />
      <FlatList
        ref={scrollRef}
        data={LOCATIONS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: topPad + 20,
            paddingBottom: bottomPad + 100,
            paddingHorizontal: 18,
            gap: 12,
          },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Traverse the Universe
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Journey to the far reaches of everything
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={() => router.push(`/location/${item.id}` as any)}
          />
        )}
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
  },
  row: {
    gap: 12,
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
