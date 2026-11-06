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

  it("reaches the beginning in a little over twenty seconds", () => {
    const seconds = heldToGoBack(UNIVERSE_AGE_YEARS);
    expect(seconds).toBeGreaterThan(20);
    expect(seconds).toBeLessThan(25);
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
      /went back 13\.8 billion years, to the beginning\./,
    );
    expect(timeSummary(markers, heldToGoBack(7e7))).toMatch(
      /past the asteroid that ended the dinosaurs\. That is 0\.5% of the way to the beginning\. Hold again to keep going\.$/,
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

  it("keeps writing inside Notes, with no separate Journal screen", () => {
    expect(
      fs.existsSync(path.resolve(process.cwd(), "app/(tabs)/journal.tsx")),
    ).toBe(false);
    const notes = read("components/NotesScreen.tsx");
    expect(notes).toContain("Keep it");
    expect(notes).toContain("Send it");
  });
});

describe("the cosmic calendar", () => {
  it("puts each moment on one calendar year", async () => {
    const { calendarWords, calendarFor } =
      await import("@/constants/cosmicCalendar");
    expect(calendarWords(13.8e9)).toBe("1 January, just after midnight");
    expect(calendarFor("cmb")).toBe("1 January, 12:14 am");
    expect(calendarFor("sun-born")).toBe("1 September");
    expect(calendarFor("dinosaurs")).toBe("25 December");
    expect(calendarFor("asteroid")).toBe("30 December, 6:06 am");
    expect(calendarFor("homo-sapiens")).toBe("31 December, 11:48 pm");
    expect(calendarFor("civilization")).toBe("31 December, 11:59:32 pm");
    expect(calendarFor("now")).toBe("Midnight, 31 December");
    expect(calendarFor("vega-pole-star")).toBeNull();
  });

  it("goes back further as you hold, with recent history given room", async () => {
    const { journeyDepth, passedMarkers, shareOfTheWay } =
      await import("@/constants/timeJourney");
    expect(journeyDepth(0)).toBe(0);
    expect(journeyDepth(13.8e9)).toBe(1);
    expect(journeyDepth(57)).toBeGreaterThan(0.15);
    expect(shareOfTheWay(4.6e9)).toBe("33% of the way");
    expect(shareOfTheWay(250_000)).toBe("0.002% of the way");
    const now = new Date("2026-10-31T12:00:00Z");
    const names = passedMarkers(timeMarkers(now, null), 7e7).map((m) => m.name);
    expect(names[0]).toBe("the asteroid that ended the dinosaurs");
    expect(names).toContain("the first steps on the Moon");
  });
});
