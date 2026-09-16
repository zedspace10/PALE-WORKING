import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { COSMIC_EVENTS } from "@/constants/cosmicData";
import { getMomentLines } from "@/constants/momentContent";
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
      "Approximately 13.8 billion years",
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
    expect(source).toMatch(/Most hydrogen nuclei/i);
    expect(source).toMatch(/Many heavier elements/i);
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

describe("Moment Card local-condition honesty", () => {
  it("uses neutral morning wording without a verified location", () => {
    const text = getMomentLines(7, 1, null)
      .map((line) => line.text)
      .join(" ");
    expect(text).toMatch(/device clock/i);
    expect(text).toMatch(/not verified/i);
    expect(text).not.toMatch(/Sun rose/i);
  });

  it("describes polar daylight from the calculated solar state", () => {
    const text = getMomentLines(23, 1, "daylight")
      .map((line) => line.text)
      .join(" ");
    expect(text).toMatch(/Sun is above the horizon/i);
    expect(text).not.toMatch(/stars.*visible/i);
  });

  it("does not claim a photon is on the user indoors", () => {
    const text = getMomentLines(12, 1, "daylight")
      .map((line) => line.text)
      .join(" ");
    expect(text).toMatch(
      /cannot tell whether sunlight is reaching you indoors/i,
    );
    expect(text).not.toMatch(/on your skin|just arrived/i);
  });

  it("qualifies evening star visibility", () => {
    const text = getMomentLines(19, 1, "civil-twilight")
      .map((line) => line.text)
      .join(" ");
    expect(text).toMatch(/civil twilight/i);
    expect(text).toMatch(/depends on twilight and local observing conditions/i);
  });
});
