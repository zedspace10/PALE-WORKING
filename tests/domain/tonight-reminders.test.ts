import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { equatorialToHorizontal } from "@/constants/astronomy";
import {
  parseCachedLocation,
  serializeCachedLocation,
  withTimeout,
} from "@/constants/location";
import {
  buildObservatorySchedule,
  parseNotificationIds,
} from "@/constants/notificationDomain";
import { resolveSkyLocation } from "@/constants/skyLocation";

afterEach(() => vi.useRealTimers());

describe("Tonight's Sky location states", () => {
  const now = Date.parse("2026-09-16T21:00:00Z");
  const validCache = parseCachedLocation(
    serializeCachedLocation({ lat: 51.5, lng: -0.1 }, now - 60_000),
    now,
  );
  const invalidCache = parseCachedLocation('{"lat":"bad"}', now);

  it("keeps denial explicit even when a cache exists", () => {
    expect(resolveSkyLocation("denied", null, validCache)).toEqual({
      status: "denied",
    });
  });

  it("uses a valid current location before cache", () => {
    expect(
      resolveSkyLocation("granted", { lat: -33.9, lng: 151.2 }, validCache),
    ).toEqual({
      status: "ready-current",
      coordinates: { lat: -33.9, lng: 151.2 },
    });
  });

  it("uses fresh validated cache after live failure", () => {
    expect(resolveSkyLocation("granted", null, validCache)).toMatchObject({
      status: "ready-cached",
      coordinates: { lat: 51.5, lng: -0.1 },
    });
  });

  it("reports unavailable for malformed cache and live failure", () => {
    expect(resolveSkyLocation("granted", null, invalidCache)).toEqual({
      status: "unavailable",
    });
  });

  it("bounds a stalled permission or location operation", async () => {
    vi.useFakeTimers();
    const stalled = new Promise<string>(() => {});
    const result = withTimeout(stalled, 10_000, "location timed out");
    const rejection = expect(result).rejects.toThrow("location timed out");

    await vi.advanceTimersByTimeAsync(10_000);

    await rejection;
  });

  it("contains no default-city fallback", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "app/tonight-sky.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/51\.5074|London|fall back to/i);
    expect(source).toMatch(/ready-current/);
    expect(source).toMatch(/ready-cached/);
  });
});

describe("time refresh and personal-star wording", () => {
  it("changes sky coordinates when the fake clock advances", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-16T00:00:00Z"));
    const first = equatorialToHorizontal(
      { ra: 0, dec: 0 },
      { lat: 0, lng: 0 },
      new Date(),
    );
    vi.advanceTimersByTime(6 * 60 * 60 * 1000);
    const later = equatorialToHorizontal(
      { ra: 0, dec: 0 },
      { lat: 0, lng: 0 },
      new Date(),
    );
    expect(Math.abs(first.alt - later.alt)).toBeGreaterThan(50);
  });

  it("does not describe a birth year as a future arrival year", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "app/tonight-sky.tsx"),
      "utf8",
    );
    expect(source).toContain("Light arriving around now left");
    expect(source).not.toMatch(
      /Light leaving .* right now will reach Earth in/i,
    );
    expect(source).toContain("setInterval");
  });
});

describe("qualified sky copy and scoped reminders", () => {
  it("removes unconditional visibility language", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "app/tonight-sky.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/with your own eyes|It's there|fully dark/i);
    expect(source).toContain("LOCAL_CONDITIONS_NOTE");
  });

  it("builds reminders for astronomical darkness", () => {
    const schedule = buildObservatorySchedule(
      { lat: 51.5074, lng: -0.1278 },
      new Date("2026-09-16T12:00:00Z"),
      2,
    );
    expect(schedule.length).toBeGreaterThan(0);
    expect(schedule[0].body).toMatch(
      /PALE estimates astronomical darkness is beginning/,
    );
  });

  it("parses only scoped identifiers and never cancels all notifications", () => {
    expect(parseNotificationIds('["ours-1",null,"",12,"ours-2"]')).toEqual([
      "ours-1",
      "ours-2",
    ]);
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "constants/notifications.ts"),
      "utf8",
    );
    expect(source).toContain("cancelScheduledNotificationAsync");
    expect(source).not.toContain("cancelAllScheduledNotificationsAsync");
  });

  it("leaves reminder controls recoverable after rejection", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "components/NightlyReminderToggle.tsx"),
      "utf8",
    );
    expect(source).toMatch(/catch \{/);
    expect(source).toMatch(/finally \{\s*setBusy\(false\)/);
  });
});
