import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  createHomeHeroStars,
  HOME_HERO_LAYER_CONFIG,
  HOME_HERO_STARS,
  shouldRunHomeHeroMotion,
} from "@/constants/homeHeroMotion";

function read(file: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("Home hero ambient stars", () => {
  it("creates a deterministic, bounded three-layer star field", () => {
    expect(createHomeHeroStars()).toEqual(HOME_HERO_STARS);
    expect(createHomeHeroStars()).toHaveLength(39);
    expect(new Set(HOME_HERO_STARS.map((star) => star.id)).size).toBe(39);
    expect(new Set(HOME_HERO_STARS.map((star) => star.layer))).toEqual(
      new Set([0, 1, 2]),
    );

    for (const star of HOME_HERO_STARS) {
      expect(star.x).toBeGreaterThanOrEqual(3);
      expect(star.x).toBeLessThanOrEqual(97);
      expect(star.y).toBeGreaterThanOrEqual(4);
      expect(star.y).toBeLessThanOrEqual(96);
      expect(star.opacity).toBeGreaterThanOrEqual(0.15);
      expect(star.opacity).toBeLessThanOrEqual(0.38);
      expect(star.size).toBeLessThanOrEqual(2.1);
    }

    for (const layer of HOME_HERO_LAYER_CONFIG) {
      expect(
        HOME_HERO_STARS.filter((star) => star.layer === layer.layer),
      ).toHaveLength(layer.count);
      expect(layer.duration).toBeGreaterThanOrEqual(19_000);
    }
  });

  it("runs only when focused, foregrounded, and motion is permitted", () => {
    expect(shouldRunHomeHeroMotion(false, true, "active")).toBe(true);
    expect(shouldRunHomeHeroMotion(true, true, "active")).toBe(false);
    expect(shouldRunHomeHeroMotion(false, false, "active")).toBe(false);
    expect(shouldRunHomeHeroMotion(false, true, "background")).toBe(false);
    expect(shouldRunHomeHeroMotion(false, true, "inactive")).toBe(false);
  });
});

describe("Home hero scene contracts", () => {
  it("uses layer-level drift and a shader-like SVG sphere", () => {
    const scene = read("components/HomeHeroScene.tsx");
    expect(scene).toContain("HOME_HERO_LAYER_CONFIG.map");
    expect(scene).toContain("layer.stars.map");
    expect(scene).toContain("<RadialGradient");
    expect(scene).toContain('id="ambientHalo"');
    expect(scene).toContain('id="earthClip"');
    expect(scene).toContain('id="oceanBody"');
    expect(scene).toContain('id="atmosphereRim"');
    expect(scene).toContain('id="softEarth"');
    expect(scene).toContain("<FeGaussianBlur");
    expect(scene).toContain('testID="earth-land"');
    expect(scene).not.toContain('testID="earth-clouds"');
    expect(scene).toContain('testID="earth-energy"');
    expect(scene).toContain('id="surfaceHaze"');
    expect(scene).toContain('id="violetBloom"');
    expect(scene).toContain('id="cyanBloom"');
    expect(scene).not.toContain("M23 49 31 45");
    expect(scene).not.toContain("M29 61 36 57");
    expect(scene.indexOf('testID="earth-land"')).toBeLessThan(
      scene.indexOf('testID="earth-energy"'),
    );
    expect(scene).toContain('testID = "home-location-sphere"');
    expect(scene).toContain('transform="rotate(-28 37 35)"');
    expect(scene).not.toContain("origin=");
    expect(scene).toContain("useNativeDriver: true");
    expect(scene).not.toMatch(/<Image|https?:\/\/|require\(/);
  });

  it("uses generated calm-space artwork instead of utility icons on home cards", () => {
    const home = read("app/(tabs)/index.tsx");
    const artwork = read("components/CardArtwork.tsx");
    const shift = read("app/(tabs)/shift.tsx");

    expect(home).toContain('<CardArtwork name="observatory"');
    expect(home).toContain('<CardArtwork name="shift"');
    expect(home).toContain('<CardArtwork name="timeMachine"');
    expect(home).toContain('<CardArtwork name="tonightsSky"');
    expect(shift).toContain('<CardArtwork name="shift" />');
    expect(artwork).toContain("assets/images/home/observatory.jpg");
    expect(artwork).toContain("assets/images/home/shift.jpg");
    expect(artwork).toContain("assets/images/home/time-machine.jpg");
    expect(artwork).toContain("assets/images/home/tonights-sky.jpg");
  });

  it("keeps the scene decorative and lifecycle-aware", () => {
    const scene = read("components/HomeHeroScene.tsx");
    const lifecycle = read("hooks/useHomeHeroMotionActive.ts");
    expect(scene).toContain('pointerEvents="none"');
    expect(scene).toContain('importantForAccessibility="no-hide-descendants"');
    expect(scene).toContain("accessibilityElementsHidden");
    expect(lifecycle).toContain("useFocusEffect");
    expect(lifecycle).toContain('AppState.addEventListener("change"');
    expect(lifecycle).toContain("shouldRunHomeHeroMotion");
  });

  it("replaces the old Home dot while preserving the hero flow", () => {
    const home = read("app/(tabs)/index.tsx");
    expect(home).toContain("<HomeHeroStars");
    expect(home).toContain("<HomeLocationSphere");
    expect(home).toContain("useHomeHeroMotionActive(reduceMotion)");
    expect(home).toContain(
      "<StarField count={58} containerOpacity={0.3} drift={10}",
    );
    expect(home).toContain("useResetScrollOnFocus(scrollRef)");
    expect(home).toContain("You are here.");
    expect(home).not.toContain("styles.dotGlow");
    expect(home).not.toContain("styles.dotWrap");
  });

  it("keeps one centered dimensional sphere across Shift entry and journey", () => {
    const shift = read("app/(tabs)/shift.tsx");
    expect(shift).toContain('from "@/components/HomeHeroScene"');
    expect(shift).toContain("useHomeHeroMotionActive(reduceMotion)");
    expect(shift).toContain("active={ambientMotionActive}");
    expect(shift).toContain('testID="shift-continuous-sphere"');
    expect(shift.match(/<HomeLocationSphere/g)).toHaveLength(1);
    expect(shift).not.toContain('testID="shift-entry-sphere"');
    expect(shift).not.toContain('testID="shift-journey-sphere"');
    expect(shift).toContain(
      "<StarField count={72} containerOpacity={0.38} drift={11}",
    );
    expect(shift).toContain("SHIFT_SPHERE_VARIANTS");
    expect(shift).toContain('"solar"');
    expect(shift).toContain('"galaxy"');
    expect(shift).toContain('"cluster"');
    expect(shift).toContain('"cosmos"');
    expect(shift).toContain("variant={journeyActive");
    expect(shift).toContain("drift={14 + stage * 5}");
    expect(shift).toContain("scale: Animated.divide(");
    expect(shift).toContain("journeySphereSize.interpolate({");
    expect(shift).toContain("const stageSphereOffsets = useMemo(");
    expect(shift).toContain("viewportHeight * 0.26 + 140");
    expect(shift).toContain("outputRange: stageSphereOffsets");
    expect(shift).toContain("const stageTextTop =");
    expect(shift).toContain("top: stageTextTop");
    expect(shift).toContain("opacity: Animated.add(");
    expect(shift).not.toContain("JOURNEY_SPHERE_X");
    expect(shift).not.toContain("translateX:");
    expect(shift).toContain('left: "50%"');
    expect(shift).toContain("accessibilityViewIsModal={journeyActive}");
    expect(shift).toContain("const stageRunId = useRef(0)");
    expect(shift).toContain("runId !== stageRunId.current");
    expect(shift).toContain(
      "if (stageRef.current >= SHIFT_STAGES.length) return",
    );
    expect(shift).not.toContain("styles.journeyCircle");
    expect(shift).not.toContain("styles.completedCircleAnchor");
    expect(shift).not.toContain("styles.orbGlow");
    expect(shift).not.toContain("styles.orbRing");
    expect(shift).not.toContain("styles.orbDot");
  });
});
