import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  travelledWhileAway,
  WELCOME_LINE,
  WELCOME_TITLE,
} from "@/constants/shiftWelcome";

describe("The end of the Shift", () => {
  it("welcomes the person home with a true line", () => {
    expect(WELCOME_TITLE).toBe("Welcome home.");
    expect(WELCOME_LINE).toMatch(/only place we know of with life/);
    for (const line of [WELCOME_TITLE, WELCOME_LINE]) {
      expect(line).not.toMatch(/[\u2013\u2014]| - /);
    }
  });

  it("says how far Earth carried them during the journey", () => {
    // About a minute at 29.78 km/s.
    expect(travelledWhileAway(60)).toBe(
      "While you were out there, Earth carried you about 1,790 km around the Sun.",
    );
    expect(travelledWhileAway(12)).toContain("about 360 km");
    expect(travelledWhileAway(2)).toBeNull();
    expect(travelledWhileAway(Number.NaN)).toBeNull();
  });

  it("shows all three lines on the last screen", () => {
    const shift = readFileSync(
      resolve(__dirname, "../../app/(tabs)/shift.tsx"),
      "utf8",
    );
    expect(shift).toContain("{WELCOME_TITLE}");
    expect(shift).toContain("{WELCOME_LINE}");
    expect(shift).toContain("{awayLine}");
    expect(shift).not.toContain("Back on Earth.");
  });
});
