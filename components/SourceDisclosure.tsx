import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  getScientificSources,
  getSourceAccessibilityLabel,
  ScientificContentMeta,
} from "@/constants/scientificContent";
import { calmSpace, calmTypography } from "@/constants/ui";
import { useColors } from "@/hooks/useColors";

export function SourceDisclosure({
  science,
}: {
  science: ScientificContentMeta;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const sources = getScientificSources(science);
  const reviewed = new Date(
    `${science.reviewedAt}T00:00:00Z`,
  ).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded((value) => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Sources and methods. Evidence level ${science.classification}. Reviewed ${reviewed}. Sources: ${sources.map((source) => source.title).join(", ")}.`}
        style={styles.disclosure}
      >
        <Feather name="info" size={13} color={colors.mutedForeground} />
        <Text
          style={[styles.disclosureText, { color: colors.mutedForeground }]}
        >
          Sources & methods
        </Text>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={13}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>

      {expanded ? (
        <View style={[styles.details, { borderLeftColor: colors.border }]}>
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {science.classification} · reviewed {reviewed}
          </Text>
          {science.precisionNote ? (
            <Text style={[styles.note, { color: colors.mutedForeground }]}>
              {science.precisionNote}
            </Text>
          ) : null}
          <View style={styles.sources}>
            {sources.map((source) => (
              <TouchableOpacity
                key={source.id}
                accessibilityRole="link"
                accessibilityLabel={getSourceAccessibilityLabel(source)}
                onPress={() => WebBrowser.openBrowserAsync(source.url)}
                style={styles.link}
              >
                <Text
                  style={[styles.linkText, { color: colors.primaryStrong }]}
                >
                  {source.title}
                </Text>
                <Feather
                  name="arrow-up-right"
                  size={12}
                  color={colors.primaryStrong}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  disclosure: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 7,
    minHeight: calmSpace.touchTarget,
  },
  disclosureText: {
    ...calmTypography.meta,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "none",
  },
  details: {
    borderLeftWidth: 1,
    gap: 8,
    marginBottom: 6,
    paddingLeft: 12,
    paddingVertical: 4,
  },
  meta: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    letterSpacing: 0.2,
    textTransform: "capitalize",
  },
  sources: { gap: 8 },
  link: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    minHeight: 32,
  },
  linkText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textDecorationLine: "underline",
  },
  note: { fontFamily: "Inter_400Regular", fontSize: 10, lineHeight: 16 },
});
