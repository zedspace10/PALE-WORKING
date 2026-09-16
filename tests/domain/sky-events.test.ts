import { describe, expect, it } from "vitest";

import {
  getApproximateMoonPhase,
  getSkyEvents,
  validateSeasonalData,
} from "@/constants/skyEvents";

describe("approximation-aware sky events", () => {
  it("uses a phase window rather than an exact all-night Moon claim", () => {
    const event = getSkyEvents(new Date("2026-01-03T12:00:00Z"), 45).find(
      (candidate) => candidate.kind === "moon",
    );
    if (event) {
      expect(event.estimate.accuracy).toBe("approximate");
      expect(event.line).not.toMatch(/No Moon tonight|full tonight/i);
    }
    expect(
      getApproximateMoonPhase(new Date("2024-01-11T11:57:00Z")).label,
    ).toBe("near new Moon");
  });

  it("handles recurring windows across a year boundary", () => {
    const events = getSkyEvents(new Date("2027-01-02T12:00:00Z"), 45);
    const quadrantids = events.find((event) => event.id === "quadrantids");
    expect(quadrantids?.line).toMatch(/typical peak window/i);
    expect(quadrantids?.line).not.toMatch(/peak tonight/i);
  });

  it("qualifies meteor rates as ideal-condition estimates", () => {
    const geminids = getSkyEvents(new Date("2026-12-13T12:00:00Z"), 51).find(
      (event) => event.id === "geminids",
    );
    expect(geminids?.line).toMatch(/ideal dark-sky conditions/i);
    expect(geminids?.estimate.accuracy).toBe("typical-window");
  });

  it("uses year-specific seasonal instants and hemisphere wording", () => {
    const date = new Date("2026-06-21T08:24:00Z");
    const north = getSkyEvents(date, 51).find(
      (event) => event.id === "jun-solstice",
    );
    const south = getSkyEvents(date, -33).find(
      (event) => event.id === "jun-solstice",
    );
    expect(north?.line).toMatch(/longest daylight period/i);
    expect(south?.line).toMatch(/shortest daylight period/i);
    expect(north?.estimate.accuracy).toBe("sourced-instant");
  });

  it("expires the seasonal table", () => {
    expect(validateSeasonalData(new Date("2030-12-31T12:00:00Z"))).toEqual([]);
    expect(validateSeasonalData(new Date("2031-01-01T00:00:00Z"))).toEqual([
      "seasonal-instants expired on 2030-12-31",
    ]);
  });
});
