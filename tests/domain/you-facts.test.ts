import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  bigKmWords,
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
    expect(you).toContain("Around the galaxy");
    expect(you).toContain("What we knew when you were born");
    expect(you).toContain("<ShareYourNumbers");
  });

  it("is measurement, never astrology", () => {
    for (const text of [you, facts, card]) {
      expect(text).not.toMatch(
        /zodiac|star sign|horoscope|birth chart|your star|destiny|fate|personality|Aries|Taurus|Gemini|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces/i,
      );
    }
  });

  it("never puts the birthday itself on the shared picture", () => {
    expect(card).not.toMatch(/birthday\??:|: Date|toLocaleDateString|getFullYear/);
  });
});
