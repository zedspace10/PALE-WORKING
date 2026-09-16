import { describe, expect, it } from "vitest";

import {
  classifySolarAltitude,
  findEveningSolarCrossing,
  SOLAR_THRESHOLDS,
} from "@/constants/solar";

describe("solar states", () => {
  it.each([
    [0.01, "daylight"],
    [0, "civil-twilight"],
    [-6, "nautical-twilight"],
    [-12, "astronomical-twilight"],
    [-18, "astronomical-darkness"],
  ])("classifies %s degrees as %s", (altitude, expected) => {
    expect(classifySolarAltitude(altitude as number)).toBe(expected);
  });

  it("uses minus eighteen degrees for astronomical darkness", () => {
    expect(SOLAR_THRESHOLDS.astronomical).toBe(-18);
  });

  it("returns explicit polar no-crossing states", () => {
    expect(
      findEveningSolarCrossing(89, 0, new Date("2026-06-21T12:00:00Z")),
    ).toMatchObject({ kind: "always-above", threshold: -18 });
    expect(
      findEveningSolarCrossing(89, 0, new Date("2026-12-21T12:00:00Z")),
    ).toMatchObject({ kind: "always-below", threshold: -18 });
  });

  it("finds an evening astronomical-darkness crossing at mid latitudes", () => {
    const result = findEveningSolarCrossing(
      51.5074,
      -0.1278,
      new Date("2026-09-16T12:00:00Z"),
    );
    expect(result.kind).toBe("crossing");
    if (result.kind === "crossing") {
      expect(result.at.getTime()).toBeGreaterThan(
        Date.parse("2026-09-16T17:00:00Z"),
      );
    }
  });
});
