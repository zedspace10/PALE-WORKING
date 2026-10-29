import { describe, expect, it } from "vitest";

import { getPlanetSkyPlacement } from "@/constants/planets";

// Late October 2026: Venus has just passed between Earth and the Sun (inferior conjunction on
// 24 October), Saturn was opposite the Sun on 4 October, and Mars and Jupiter rise before dawn.
const when = new Date("2026-10-28T20:00:00Z");

describe("planet placement without a location", () => {
  it("puts Venus in the Sun's glare just after inferior conjunction", () => {
    expect(getPlanetSkyPlacement("venus", when).placement).toBe("in-glare");
  });

  it("keeps Saturn up most of the night soon after opposition", () => {
    const saturn = getPlanetSkyPlacement("saturn", when);
    expect(saturn.placement).toBe("all-night");
    expect(saturn.elongation).toBeGreaterThan(145);
  });

  it("puts Mars and Jupiter in the morning sky", () => {
    expect(getPlanetSkyPlacement("mars", when).placement).toBe("morning");
    expect(getPlanetSkyPlacement("jupiter", when).placement).toBe("morning");
  });

  it("never gives an elongation outside 0 to 180 degrees", () => {
    for (let day = 0; day < 730; day += 17) {
      const date = new Date(Date.UTC(2026, 0, 1 + day));
      for (const planet of ["mercury", "venus", "mars"] as const) {
        const { elongation } = getPlanetSkyPlacement(planet, date);
        expect(elongation).toBeGreaterThanOrEqual(0);
        expect(elongation).toBeLessThanOrEqual(180);
      }
    }
  });

  it("never lets Venus stray further than it can from the Sun", () => {
    for (let day = 0; day < 730; day += 5) {
      const date = new Date(Date.UTC(2026, 0, 1 + day));
      expect(getPlanetSkyPlacement("venus", date).elongation).toBeLessThan(48);
    }
  });
});
