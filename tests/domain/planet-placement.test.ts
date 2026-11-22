import { describe, expect, it } from "vitest";

import { getPlanetSkyPlacement } from "@/constants/planets";

// Late October 2026: Venus has just passed between Earth and the Sun (inferior conjunction on
// 24 October), Saturn was opposite the Sun on 4 October, and Mars and Jupiter rise around midnight.
// Worked out for the middle of the UK, as the app does with no location.
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

  it("has Mars and Jupiter rising later in the night, not only before dawn", () => {
    expect(getPlanetSkyPlacement("mars", when).placement).toBe("late");
    expect(getPlanetSkyPlacement("jupiter", when).placement).toBe("late");
  });

  it("follows a planet through the year: Saturn rises after midnight in June 2027", () => {
    expect(getPlanetSkyPlacement("saturn", new Date("2027-06-20T21:00:00Z")).placement).toBe("late");
    expect(getPlanetSkyPlacement("jupiter", new Date("2027-06-20T21:00:00Z")).placement).toBe("evening");
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
