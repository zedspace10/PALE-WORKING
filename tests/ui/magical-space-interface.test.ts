import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import colors from "@/constants/colors";
import { calmSpace, calmTypography } from "@/constants/ui";

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

describe("magical-space visual system", () => {
  it("uses cyan-blue illumination with violet as a secondary accent", () => {
    expect(colors.dark.primary).toBe("#8DEBFF");
    expect(colors.dark.violet).toBe("#A995FF");
    expect(colors.dark.background).toBe("#05070C");
    expect(colors.dark.glass).toBe("#0B121C");
    expect(colors.dark.luminousBorder).toBe("#35637A");
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

  it("provides bold hierarchy, generous geometry, and accessible targets", () => {
    expect(calmTypography.display.fontFamily).toBe("Inter_700Bold");
    expect(calmTypography.display.fontSize).toBeGreaterThanOrEqual(36);
    expect(calmTypography.cardTitle.fontFamily).toBe("Inter_700Bold");
    expect(calmTypography.button.fontFamily).toBe("Inter_700Bold");
    expect(calmSpace.radius.large).toBeGreaterThanOrEqual(26);
    expect(calmSpace.touchTarget).toBeGreaterThanOrEqual(44);
  });

  it("ships reusable luminous surfaces and actions with reduced-motion support", () => {
    const surfaces = read("components/MagicalSurface.tsx");
    expect(surfaces).toContain("LuminousSurface");
    expect(surfaces).toContain("MagicalAction");
    expect(surfaces).toContain("LinearGradient");
    expect(surfaces).toContain("CalmPressable");
    expect(surfaces).toContain("useReducedMotion");
    expect(surfaces).toContain("minHeight: calmSpace.touchTarget");
  });

  it("fills the compact five-tab navigation without inset gaps", () => {
    const tabs = read("app/(tabs)/_layout.tsx");
    const shift = read("app/(tabs)/shift.tsx");

    expect(tabs).not.toContain("useSafeAreaInsets");
    expect(tabs).toContain("height: 58");
    expect(tabs).toContain("paddingBottom: 0");
    expect(tabs).toContain("paddingTop: 0");
    expect(tabs).toContain("borderRadius: 0");
    expect(tabs).toContain("marginHorizontal: 0");
    expect(tabs).toContain("lineHeight: 14");
    expect(shift).toContain("visibleTabBarStyle");
    expect(shift).toContain("height: 58");
    expect(shift).toContain("paddingBottom: 0");
  });
});

describe("protected Explore composition", () => {
  it("retains the existing two-column artwork-led list and detail cover", () => {
    const explore = read("app/(tabs)/explore.tsx");
    const card = read("components/LocationCard.tsx");
    const detail = read("app/location/[id].tsx");

    expect(explore).toContain("numColumns={2}");
    expect(explore).toContain("<LocationCard");
    expect(card).toContain("EXPLORE_ARTWORK[location.artworkKey]");
    expect(card).toContain("minHeight: 206");
    expect(card).toContain('justifyContent: "flex-start"');
    expect(detail).toContain("EXPLORE_ARTWORK[location.artworkKey]");
    expect(detail).toContain("bounces={false}");
    expect(detail).toContain('overScrollMode="never"');
  });
});
