import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { COSMIC_EVENTS } from "@/constants/cosmicData";
import { getMomentLines, momentFacts } from "@/constants/momentContent";
import {
  formatUniverseAgeEstimate,
  getEventsAfterBirth,
  getPersonalTravelMetrics,
  parseBirthdayInput,
} from "@/constants/personalInsights";
import { createSerializedState } from "@/constants/serializedState";

describe("birthday validation", () => {
  const now = new Date(2026, 8, 16, 18);

  it("preserves valid leap-day components", () => {
    const result = parseBirthdayInput("29/02/2024", now);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect([
        result.date.getFullYear(),
        result.date.getMonth() + 1,
        result.date.getDate(),
      ]).toEqual([2024, 2, 29]);
    }
  });

  it.each(["31/02/2020", "29/02/2023", "00/12/2000", "31/04/2000"])(
    "rejects impossible date %s",
    (input) =>
      expect(parseBirthdayInput(input, now)).toMatchObject({
        ok: false,
        reason: "impossible",
      }),
  );

  it("rejects future and unsupported-old dates", () => {
    expect(parseBirthdayInput("17/09/2026", now)).toMatchObject({
      ok: false,
      reason: "future",
    });
    expect(parseBirthdayInput("31/12/1899", now)).toMatchObject({
      ok: false,
      reason: "too-old",
    });
    expect(parseBirthdayInput("01/01/1900", now)).toMatchObject({ ok: true });
  });

  it("filters historical events by full date, including later same-year events", () => {
    const beforeLanding = getEventsAfterBirth(
      COSMIC_EVENTS,
      new Date(1969, 0, 1, 12),
    );
    const afterLanding = getEventsAfterBirth(
      COSMIC_EVENTS,
      new Date(1969, 7, 1, 12),
    );
    expect(beforeLanding.some((event) => event.date === "1969-07-20")).toBe(
      true,
    );
    expect(afterLanding.some((event) => event.date === "1969-07-20")).toBe(
      false,
    );
  });
});

describe("honest personal metrics", () => {
  it("separates whole orbits from the current partial year", () => {
    const birthday = new Date(2000, 8, 17, 12);
    const before = getPersonalTravelMetrics(
      birthday,
      new Date(2026, 8, 16, 12),
    );
    const after = getPersonalTravelMetrics(birthday, new Date(2026, 8, 17, 12));
    expect(before.completedSolarOrbits).toBe(25);
    expect(after.completedSolarOrbits).toBe(26);
    expect(after.daysSinceLastBirthday).toBe(0);
    expect(after.approximateOrbitDistanceKm).toBeGreaterThan(20_000_000_000);
  });

  it("handles leap-day anniversaries without decimal completed orbits", () => {
    const metrics = getPersonalTravelMetrics(
      new Date(2000, 1, 29, 12),
      new Date(2023, 2, 1, 12),
    );
    expect(metrics.completedSolarOrbits).toBe(23);
    expect(metrics.daysSinceLastBirthday).toBe(0);
  });

  it("labels calendar progress and keeps universe age rounded", () => {
    expect(formatUniverseAgeEstimate(13_797_002_345)).toBe(
      "About 13.8 billion years",
    );
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "app/(tabs)/index.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(
      /universeAgeSecs|getUniverseAgeYears|setInterval\([^)]*1000/,
    );
  });

  it("uses qualified biological ancestry wording", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "app/(tabs)/you.tsx"),
      "utf8",
    );
    expect(source).toMatch(/first moments\s+after the Big Bang/i);
    expect(source).toMatch(/13\.8 billion years old/);
    // No mention of stars dying anywhere in the reflection.
    expect(source).not.toMatch(/died|dying|death/i);
    expect(source).not.toMatch(/hydrogen atoms[^\n]+formed 13\.8/i);
  });
});

describe("serialized local state", () => {
  it("retains both overlapping successful increments", async () => {
    const state = createSerializedState(0);
    let releaseFirst!: () => void;
    const firstPersist = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    const first = state.update(
      (value) => value + 1,
      () => firstPersist,
    );
    const second = state.update(
      (value) => value + 1,
      async () => undefined,
    );
    releaseFirst();
    await expect(first).resolves.toBe(1);
    await expect(second).resolves.toBe(2);
    expect(state.getCurrent()).toBe(2);
  });

  it("does not advance state after a failed persistence operation", async () => {
    const state = createSerializedState(3);
    await expect(
      state.update(
        (value) => value + 1,
        async () => {
          throw new Error("storage unavailable");
        },
      ),
    ).rejects.toThrow("storage unavailable");
    expect(state.getCurrent()).toBe(3);
    await expect(
      state.update(
        (value) => value + 1,
        async () => undefined,
      ),
    ).resolves.toBe(4);
  });
});

describe("the opening card", () => {
  const at = (h: number) => new Date(2026, 10, 8, h, 0, 0);
  const say = (...args: Parameters<typeof getMomentLines>) =>
    getMomentLines(...args)
      .map((line) => line.text)
      .join(" ");

  it("greets by the time of day", () => {
    expect(say(at(7), null)).toMatch(/^Good morning\./);
    expect(say(at(14), null)).toMatch(/^Good afternoon\./);
    expect(say(at(19), null)).toMatch(/^Good evening\./);
    expect(say(at(1), "astronomical-darkness")).toMatch(/^Still up\?/);
    // Late, but the Sun has not set (summer near the poles).
    expect(say(at(23), "daylight")).toMatch(/^Hello again\./);
  });

  it("says nothing about the Sun without a verified location", () => {
    const text = say(at(7), null);
    expect(text).not.toMatch(/Sun (rose|is up|is above)/i);
    expect(say(at(19), "civil-twilight")).toMatch(
      /Where you are, it is twilight\./,
    );
  });

  it("leads with how far Earth has carried you since the last visit", () => {
    const now = at(9);
    const lines = getMomentLines(now, null, {
      lastVisitAt: now.getTime() - 3 * 86_400_000,
    });
    expect(lines[lines.length - 1].text).toBe(
      "Since you last opened PALE, Earth has carried you 7.7 million km around the Sun.",
    );
  });

  it("only says true things about this moment, and changes day to day", () => {
    const facts = momentFacts(new Date(2026, 10, 20, 21));
    // Nothing ties a star to the person: that reads like astrology.
    expect(facts.join(" ")).not.toMatch(/you were born|light years away, past/);
    expect(facts.join(" ")).toMatch(
      /The Moon is \d+% lit today, and growing each night\./,
    );
    expect(facts.join(" ")).toMatch(
      /Voyager 1 is now about 25\.\d billion km from Earth/,
    );
    const days = new Set(
      [8, 9, 10, 11, 12].map((d) => {
        const lines = getMomentLines(new Date(2026, 10, d, 21), null);
        return lines[lines.length - 1].text;
      }),
    );
    expect(days.size).toBeGreaterThan(2);
    for (const line of facts) {
      expect(line).not.toMatch(/[\u2013\u2014]| - /);
    }
  });
});
