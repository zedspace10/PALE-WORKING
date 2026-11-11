import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { shouldRunHomeHeroMotion } from "@/constants/homeHeroMotion";

function read(file: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("Ambient motion", () => {
  it("runs only when focused, foregrounded, and motion is permitted", () => {
    expect(shouldRunHomeHeroMotion(false, true, "active")).toBe(true);
    expect(shouldRunHomeHeroMotion(true, true, "active")).toBe(false);
    expect(shouldRunHomeHeroMotion(false, false, "active")).toBe(false);
    expect(shouldRunHomeHeroMotion(false, true, "background")).toBe(false);
    expect(shouldRunHomeHeroMotion(false, true, "inactive")).toBe(false);
  });
});

describe("Home hero scene contracts", () => {
  it("gives each home card its own rendered picture, faded behind the text", () => {
    const home = read("app/(tabs)/index.tsx");
    const artwork = read("components/CardArtwork.tsx");
    const shift = read("app/(tabs)/shift.tsx");

    expect(home).toContain('<CardArtwork name="observatory"');
    expect(home).toContain('<CardArtwork name="shift"');
    expect(home).toContain('<CardArtwork name="timeMachine"');
    expect(home).toContain('<CardArtwork name="tonightsSky"');
    expect(shift).toContain("<ShiftEarthButton");
    for (const file of [
      "observatory",
      "shift",
      "time-machine",
      "tonights-sky",
    ]) {
      expect(artwork).toContain(`assets/images/home/${file}.jpg`);
      expect(fs.existsSync(`assets/images/home/${file}.jpg`)).toBe(true);
    }
    expect(artwork).toContain("LinearGradient");
    expect(artwork).not.toMatch(/https?:\/\//);
  });

  it("only moves while its screen is in front", () => {
    const lifecycle = read("hooks/useHomeHeroMotionActive.ts");
    expect(lifecycle).toContain("useFocusEffect");
    expect(lifecycle).toContain('AppState.addEventListener("change"');
    expect(lifecycle).toContain("shouldRunHomeHeroMotion");
  });

  it("opens Home on a single pale blue point rather than a globe", () => {
    const home = read("app/(tabs)/index.tsx");
    const hero = read("components/PaleDotHero.tsx");
    expect(home).toContain("<PaleDotHero");
    expect(home).not.toContain("<HomeLocationSphere");
    expect(home).toContain(
      "<StarField count={90} containerOpacity={0.85} drift={10}",
    );
    expect(home).toContain("useResetScrollOnFocus(scrollRef)");
    expect(hero).toContain("You are here");
    expect(hero).toContain("13.8 billion years old.");
    expect(hero).toContain("reduceMotion");
    // The dot pulses: a ring of light leaves it, and stays still when motion is reduced.
    expect(hero).toContain("styles.ripple");
    expect(hero).toContain("!reduceMotion ?");
  });

  it("zooms out through nested pictures in Shift, then flies home", () => {
    const shift = read("app/(tabs)/shift.tsx");
    const scene = read("components/ShiftZoomScene.tsx");
    expect(shift).toContain("useHomeHeroMotionActive(reduceMotion)");
    expect(shift).toContain("active={ambientMotionActive}");
    expect(shift).toContain("<ShiftZoomScene");
    // Earth itself is the way in, the same rendered Earth the journey starts from.
    expect(shift).toContain("<ShiftEarthButton");
    expect(read("components/ShiftEarthButton.tsx")).toContain(
      'testID="shift-entry-earth"',
    );
    expect(read("components/ShiftEarthButton.tsx")).toContain("<EarthGlobe");
    // Tapping Earth glides it to where the journey starts, then the journey fades in around it.
    expect(read("components/ShiftEarthButton.tsx")).toContain("measureInWindow");
    expect(shift).toContain("onPress={tapEarth}");
    expect(shift).toContain("duration: GLIDE_MS");
    expect(shift).toContain("!journeyActive || entering");
    expect(shift).toContain(
      "(sceneSize * EARTH_SPHERE_FRACTION) / SHIFT_ENTRY_DIAMETER",
    );
    expect(shift).toContain(
      "<StarField count={72} containerOpacity={0.38} drift={11}",
    );
    // Each stage pulls the camera back to the next picture; the last stays on everything.
    expect(shift).toContain("Math.min(idx, SHIFT_MAX_ZOOM)");
    // The return flies back to Earth before the welcome.
    expect(shift).toContain("duration: ZOOM_HOME_MS");
    expect(shift).toContain("accessibilityViewIsModal={journeyActive}");
    expect(shift).toContain("const stageRunId = useRef(0)");
    expect(shift).toContain("runId !== stageRunId.current");
    expect(shift).toContain(
      "if (stageRef.current >= SHIFT_STAGES.length) return",
    );
    // Reduced motion jumps straight to each picture.
    expect(shift).toContain("zoom.setValue(target)");
    // All movement runs on the native driver, sampled from the same zoom maths.
    expect(scene).toContain("shiftFrame(z, size)");
    expect(scene).toContain("<EarthGlobe");
    expect(read("components/EarthGlobe.tsx")).toContain(
      "assets/images/earth-globe.png",
    );
    expect(scene).toContain("You are here");
    expect(scene).not.toContain("useNativeDriver: false");
  });
});
