import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import colors from "@/constants/colors";
import { LOCATIONS } from "@/constants/cosmicData";
import {
  EXPLORE_ARTWORK_KEYS,
  isExploreArtworkKey,
} from "@/constants/exploreArtwork";
import { motionDuration, motionStartValue } from "@/constants/motion";

function read(file: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
}

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe("calm-space visual foundation", () => {
  it("uses cyan illumination, a violet accent, and readable text", () => {
    expect(colors.dark.primary).toBe("#8DEBFF");
    expect(colors.dark.violet).toBe("#A995FF");
    expect(colors.dark.primary).not.toBe("#C8A96E");
    expect(
      contrast(colors.dark.foreground, colors.dark.background),
    ).toBeGreaterThanOrEqual(7);
    expect(
      contrast(colors.dark.primary, colors.dark.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(colors.dark.mutedForeground, colors.dark.background),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("makes reduced-motion values immediately visible and removes duration", () => {
    expect(motionDuration(true, 520)).toBe(0);
    expect(motionDuration(false, 520)).toBe(520);
    expect(motionStartValue(true, 0)).toBe(1);
    expect(motionStartValue(false, 0.25)).toBe(0.25);
  });
});

describe("Explore artwork coverage", () => {
  it("maps all eight destinations to unique, bundled JPEG artwork", () => {
    expect(LOCATIONS).toHaveLength(8);
    expect(new Set(LOCATIONS.map((location) => location.id)).size).toBe(8);
    expect(new Set(LOCATIONS.map((location) => location.artworkKey))).toEqual(
      new Set(EXPLORE_ARTWORK_KEYS),
    );

    for (const key of EXPLORE_ARTWORK_KEYS) {
      const file = path.resolve(
        process.cwd(),
        "assets",
        "images",
        "explore",
        `${key}.jpg`,
      );
      const bytes = fs.readFileSync(file);
      expect(bytes.byteLength).toBeGreaterThan(20_000);
      expect([...bytes.subarray(0, 2)]).toEqual([0xff, 0xd8]);
      expect([...bytes.subarray(-2)]).toEqual([0xff, 0xd9]);
    }
  });

  it("rejects an unavailable artwork key and keeps a shared card fallback", () => {
    expect(isExploreArtworkKey("missing-image")).toBe(false);
    const card = read("components/LocationCard.tsx");
    expect(card).toContain("imageFailed");
    expect(card).toContain("setImageFailed(true)");
    expect(card).toContain(
      "backgroundColor: pressed ? colors.cardPressed : colors.card",
    );
  });

  it("reuses Explore artwork as the detail cover over a dark scroll surface", () => {
    const detail = read("app/location/[id].tsx");
    expect(detail).toContain("EXPLORE_ARTWORK[location.artworkKey]");
    expect(detail).toContain("bounces={false}");
    expect(detail).toContain('overScrollMode="never"');
    expect(detail).toContain("backgroundColor: colors.background");
  });
});

describe("refreshed screen contracts", () => {
  it("keeps compact visual qualification and removes source panels", () => {
    const illustration = read("components/IllustrationDisclosure.tsx");
    expect(illustration).toContain("accessibilityLabel");
    expect(illustration).not.toContain("borderWidth");

    for (const screen of [
      "app/(tabs)/index.tsx",
      "app/(tabs)/shift.tsx",
      "app/(tabs)/deeptime.tsx",
      "app/location/[id].tsx",
      "app/universe.tsx",
      "app/tonight-sky.tsx",
    ]) {
      expect(read(screen)).not.toContain("SourceDisclosure");
    }
  });

  it("registers an explicit discovery icon for Explore", () => {
    const tabs = read("app/(tabs)/_layout.tsx");
    expect(tabs).toContain('name="explore"');
    expect(tabs).toContain("ExploreIcon");
    expect(tabs).toContain('title: "Explore"');
  });

  it("provides daylight, twilight, and darkness celestial variants", () => {
    const icon = read("components/SkyStateIcon.tsx");
    expect(icon).toContain("Sun above the horizon");
    expect(icon).toContain("Deep twilight at the horizon");
    expect(icon).toContain("Moon and stars in a dark sky");
    expect(read("app/tonight-sky.tsx")).toContain("<SkyStateIcon");
  });

  it("keeps Tonight's Sky direction-aware and vertically scrollable", () => {
    const tonight = read("app/tonight-sky.tsx");
    expect(tonight).toContain('testID="sky-compass-indicator"');
    expect(tonight).toContain("Math.round(az / 45)");
    expect(tonight).toContain("<Animated.ScrollView");
    expect(tonight).toContain("nestedScrollEnabled");
    expect(tonight).toContain("onLayout={handlePagerLayout}");
    expect(tonight).toContain("pageWidth={pagerWidth}");
    expect(tonight).toContain("updatePageForOffset");
    expect(tonight).toContain("onScroll={(event)");
    expect(tonight).not.toContain('Dimensions.get("window")');
    expect(tonight).toContain('fontFamily: "Inter_700Bold"');
  });

  it("keeps both Home hero states centered and content-driven", () => {
    const home = read("app/(tabs)/index.tsx");
    expect(home).toContain("userDays !== null");
    expect(home).toContain("days since your birth date");
    expect(home).toContain("Set your birthday to see your place in time");
    expect(home).toContain('alignItems: "center"');
    expect(home).toContain('textAlign: "center"');
    expect(home).not.toContain("SCREEN_H");
  });

  it("resets every scrollable tab to the top when it regains focus", () => {
    const resetHook = read("hooks/useResetScrollOnFocus.ts");
    expect(resetHook).toContain("useFocusEffect");
    expect(resetHook).toContain("scrollToOffset({ offset: 0");
    expect(resetHook).toContain("scrollTo?.({ x: 0, y: 0");
    expect(resetHook).toContain("window.scrollTo({ top: 0");

    for (const screen of [
      "app/(tabs)/index.tsx",
      "app/(tabs)/you.tsx",
      "app/(tabs)/journal.tsx",
      "app/(tabs)/explore.tsx",
      "app/(tabs)/deeptime.tsx",
    ]) {
      const source = read(screen);
      expect(source).toContain("useResetScrollOnFocus(scrollRef)");
      expect(source).toContain("ref={scrollRef}");
    }
  });
});
