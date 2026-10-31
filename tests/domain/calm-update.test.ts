import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { eveningLine, isDarkOut } from "@/constants/eveningLine";
import {
  UNIVERSE_AGE_YEARS,
  heldToGoBack,
  historyRateWords,
  passedMarker,
  timeMarkers,
  timeSummary,
  yearsAgoWords,
  yearsBack,
} from "@/constants/timeJourney";

const london = { lat: 51.5, lng: -0.13 };
const read = (file: string) =>
  fs.readFileSync(path.resolve(process.cwd(), file), "utf8");

describe("the evening line on Home", () => {
  it("says nothing in daylight", () => {
    expect(eveningLine(london, new Date("2026-10-31T12:00:00Z"))).toBeNull();
  });

  it("names the Moon when it is up after dark", () => {
    // 30 October 2026, 9pm in London: a bright waning Moon in the east.
    expect(eveningLine(london, new Date("2026-10-30T21:00:00Z"))).toMatch(
      /^The Moon is up in the (east|north east|south east)\.$/,
    );
  });

  it("falls back to a planet without a location", () => {
    const line = eveningLine(null, new Date(2026, 9, 30, 21, 0));
    expect(line).toBe("Saturn is out tonight.");
    expect(isDarkOut(null, new Date(2026, 9, 30, 14, 0))).toBe(false);
  });
});

describe("travelling back in time", () => {
  const now = new Date("2026-10-31T12:00:00Z");
  const markers = timeMarkers(now, new Date("1994-03-14T12:00:00Z"));

  it("reaches the beginning in about half a minute", () => {
    const seconds = heldToGoBack(UNIVERSE_AGE_YEARS);
    expect(seconds).toBeGreaterThan(30);
    expect(seconds).toBeLessThan(40);
    expect(yearsBack(seconds)).toBeCloseTo(UNIVERSE_AGE_YEARS, -6);
  });

  it("passes the person's own birth early, then the deep past", () => {
    expect(markers[0].name).toBe("the day you were born");
    expect(passedMarker(markers, 60)?.name).toBe("the first steps on the Moon");
    expect(passedMarker(markers, 7e7)?.name).toBe(
      "the asteroid that ended the dinosaurs",
    );
    expect(heldToGoBack(32.6)).toBeLessThan(6);
  });

  it("speaks plainly about time and speed", () => {
    expect(yearsAgoWords(57.3)).toBe("57 years ago");
    expect(yearsAgoWords(4.54e9)).toBe("4.5 billion years ago");
    expect(historyRateWords(0)).toBe(
      "Each second you hold is now a year of history.",
    );
    expect(timeSummary(markers, heldToGoBack(UNIVERSE_AGE_YEARS))).toMatch(
      /to the beginning\. Everything that has ever happened fits inside that half a minute\.$/,
    );
    expect(timeSummary(markers, heldToGoBack(7e7))).toMatch(
      /past the asteroid that ended the dinosaurs\. The beginning is still 13\.7 billion years further back\.$/,
    );
  });

  it("has no star death on the way", () => {
    expect(JSON.stringify(markers)).not.toMatch(
      /supernova|dying|death|explod/i,
    );
  });
});

describe("first open and the Journal", () => {
  it("shows three quiet screens once, and never asks for anything", () => {
    const onboarding = read("components/Onboarding.tsx");
    const layout = read("app/_layout.tsx");
    expect(onboarding).toContain("A calm place to look up.");
    expect(onboarding).toContain("Nothing about you leaves this phone.");
    expect(onboarding).not.toMatch(/sign in|sign up|email|account\b(?! and)/i);
    expect(layout).toContain("<Onboarding onDone={finishOnboarding} />");
    expect(layout).toContain('"@pale_birthday"');
  });

  it("no longer has a Journal screen", () => {
    expect(
      fs.existsSync(path.resolve(process.cwd(), "app/(tabs)/journal.tsx")),
    ).toBe(false);
    expect(read("components/NotesScreen.tsx")).not.toMatch(/journal/i);
  });
});
