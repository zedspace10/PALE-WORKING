import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  bigKmWords,
  currentLap,
  knownWhenBorn,
  ordinal,
  withoutAbout,
  discoveryAtBirth,
  EXOPLANETS_KNOWN_BY_END_OF,
  GALAXY_NOTE,
  galaxyDistanceKm,
} from "@/constants/youFacts";

const read = (p: string) =>
  readFileSync(resolve(__dirname, "../..", p), "utf8");

describe("Around the galaxy", () => {
  it("is the time since birth at the Sun's speed around the galaxy", () => {
    const born = new Date(1996, 0, 1);
    const now = new Date(2026, 0, 1);
    const km = galaxyDistanceKm(born, now);
    // About 30 years at 230 km/s.
    expect(km / 1e9).toBeGreaterThan(215);
    expect(km / 1e9).toBeLessThan(221);
    expect(bigKmWords(km)).toBe("about 218 billion");
    expect(bigKmWords(7.26e9)).toBe("about 7.3 billion");
    expect(galaxyDistanceKm(now, born)).toBe(0);
  });

  it("says plainly how the number is worked out", () => {
    expect(GALAXY_NOTE).toContain("230 km every second");
    expect(GALAXY_NOTE).toContain("230 million years");
    expect(GALAXY_NOTE).not.toMatch(/[–—]| - /);
  });
});

describe("What we knew when you were born", () => {
  it("counts the planets known by the end of the year before", () => {
    expect(discoveryAtBirth(new Date(1990, 5, 1))?.number).toBe("None");
    expect(discoveryAtBirth(new Date(1992, 5, 1))?.note).toContain(
      "the year you were born",
    );
    expect(discoveryAtBirth(new Date(1996, 5, 1))?.number).toBe("4");
    expect(discoveryAtBirth(new Date(2013, 5, 1))?.number).toBe("about 780");
    expect(discoveryAtBirth(new Date(2015, 5, 1))?.number).toBe("about 1,780");
    // Too recent for the comparison to say much.
    expect(discoveryAtBirth(new Date(2024, 5, 1))).toBeNull();
  });

  it("only ever grows, and agrees with NASA's milestones", () => {
    const years = Object.keys(EXOPLANETS_KNOWN_BY_END_OF).map(Number).sort();
    for (let i = 1; i < years.length; i++) {
      expect(EXOPLANETS_KNOWN_BY_END_OF[years[i]]).toBeGreaterThanOrEqual(
        EXOPLANETS_KNOWN_BY_END_OF[years[i - 1]],
      );
    }
    // NASA passed 5,000 in March 2022 and 6,000 in September 2025.
    expect(EXOPLANETS_KNOWN_BY_END_OF[2021]).toBeLessThan(5000);
    expect(EXOPLANETS_KNOWN_BY_END_OF[2022]).toBeGreaterThan(5000);
    expect(EXOPLANETS_KNOWN_BY_END_OF[2024]).toBeLessThan(6000);
    expect(EXOPLANETS_KNOWN_BY_END_OF[2025]).toBeGreaterThan(6000);
  });
});

describe("The You tab", () => {
  const you = read("app/(tabs)/you.tsx");
  const facts = read("constants/youFacts.ts");
  const card = read("components/ShareYourNumbers.tsx");

  it("shows the galaxy, the discoveries and the share button", () => {
    expect(you).toContain("around the middle of the Milky Way");
    expect(you).toContain("knownWhenBorn(birthday)");
    expect(you).toContain("<LapDrawing");
    expect(you).toContain("<ShareYourNumbers");
  });

  it("keeps the notification switches by the things they are about", () => {
    const you = read("app/(tabs)/you.tsx");
    expect(you).not.toMatch(/Toggle/);
    expect(read("app/(tabs)/index.tsx")).toContain("<NightlyReminderToggle");
    expect(read("components/NotesScreen.tsx")).toContain(
      "<NoteMilestonesToggle",
    );
    expect(read("app/this-week.tsx")).toContain("<ThisWeekToggle />");
  });

  it("is measurement, never astrology", () => {
    for (const text of [you, facts, card]) {
      expect(text).not.toMatch(
        /zodiac|star sign|horoscope|birth chart|your star|destiny|fate|personality|Aries|Taurus|Gemini|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces/i,
      );
    }
  });

  it("never puts the birthday itself on the shared picture", () => {
    expect(card).not.toMatch(
      /birthday\??:|: Date|toLocaleDateString|getFullYear/,
    );
  });
});

describe("This lap", () => {
  it("runs from the last birthday to the next", () => {
    const lap = currentLap(new Date(1996, 2, 14), new Date(2026, 10, 13, 12));
    expect(lap.number).toBe(31);
    expect(lap.daysIn).toBe(244);
    expect(lap.daysLeft).toBe(121);
    expect(lap.fraction).toBeCloseTo(244.5 / 365, 2);
    // On the birthday itself a new lap begins.
    expect(
      currentLap(new Date(1996, 2, 14), new Date(2026, 2, 14, 9)).number,
    ).toBe(31);
    expect(
      currentLap(new Date(1996, 2, 14), new Date(2026, 2, 13, 9)).number,
    ).toBe(30);
  });

  it("writes numbers the way a person would", () => {
    expect(ordinal(1)).toBe("1st");
    expect(ordinal(22)).toBe("22nd");
    expect(ordinal(13)).toBe("13th");
    expect(ordinal(31)).toBe("31st");
    expect(withoutAbout("about 28.8 billion")).toBe("28.8 billion");
  });

  it("says what was known the year you were born", () => {
    expect(knownWhenBorn(new Date(1980, 1, 1))).toBe(
      "Nobody had yet found a planet around another star.",
    );
    expect(knownWhenBorn(new Date(1996, 1, 1))).toBe(
      "We knew of 4 planets around other stars.",
    );
    expect(knownWhenBorn(new Date(2013, 1, 1))).toBe(
      "We knew of about 780 planets around other stars.",
    );
  });
});
