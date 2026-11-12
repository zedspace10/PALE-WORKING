import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  GUIDE_STEPS,
  onGuideRequested,
  requestGuide,
  tabCentre,
  TAB_BAR_HEIGHT,
} from "@/constants/tabGuide";

const read = (p: string) =>
  readFileSync(resolve(__dirname, "../..", p), "utf8");

describe("The guide to PALE's tabs", () => {
  it("walks the tabs in the order they sit along the bar", () => {
    const layout = read("app/(tabs)/_layout.tsx");
    const order = [...layout.matchAll(/title: "(\w+)"/g)].map((m) => m[1]);
    expect(GUIDE_STEPS.map((s) => s.title)).toEqual(order);
    GUIDE_STEPS.forEach((s, i) => expect(s.tab).toBe(i));
    expect(layout).toContain(`height: ${TAB_BAR_HEIGHT},`);
  });

  it("is plain, short and has no dashes", () => {
    for (const s of GUIDE_STEPS) {
      expect(s.body).not.toMatch(/[–—]| - /);
      expect(s.body.length).toBeLessThan(130);
    }
  });

  it("lights up the middle of each tab", () => {
    expect(tabCentre(0, 400, 800)).toEqual({
      x: 40,
      y: 800 - TAB_BAR_HEIGHT / 2,
    });
    expect(tabCentre(4, 400, 800).x).toBe(360);
  });

  it("shows once after the opening screens, and again from the You tab", () => {
    const root = read("app/_layout.tsx");
    expect(root).toContain("<TabGuide onDone={finishGuide} />");
    expect(root).toContain("guideSeen === false || guideAsked");
    expect(
      read("app/(tabs)/you.tsx").match(/onPress=\{requestGuide\}/g),
    ).toHaveLength(2);
    let asked = 0;
    const off = onGuideRequested(() => (asked += 1));
    requestGuide();
    off();
    requestGuide();
    expect(asked).toBe(1);
  });
});

describe("Leaving the Shift", () => {
  it("plays the way in backwards: the journey fades, the music fades slowly, Earth glides home", () => {
    const shift = read("app/(tabs)/shift.tsx");
    expect(shift).toContain("music.stop(glideHome ? 2800 : 1600)");
    expect(shift).toContain("!journeyActive || entering || leaving");
    expect(shift).toMatch(/Animated\.timing\(glide, \{\s*toValue: 0,/);
    expect(shift).not.toContain("duration: 360,");
  });
});
