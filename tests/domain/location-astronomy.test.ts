import { describe, expect, it } from "vitest";

import { equatorialToHorizontal } from "@/constants/astronomy";
import {
  isValidCoordinates,
  parseCachedLocation,
  serializeCachedLocation,
} from "@/constants/location";

describe("location validation", () => {
  it.each([
    { lat: -90, lng: -180 },
    { lat: 90, lng: 180 },
    { lat: 0, lng: 0 },
  ])("accepts boundary coordinate $lat,$lng", (coordinates) => {
    expect(isValidCoordinates(coordinates)).toBe(true);
  });

  it.each([
    { lat: 90.001, lng: 0 },
    { lat: 0, lng: -180.001 },
    { lat: Number.NaN, lng: 0 },
    { lat: 0, lng: Number.POSITIVE_INFINITY },
  ])("rejects invalid coordinates", (coordinates) => {
    expect(isValidCoordinates(coordinates)).toBe(false);
  });

  it("rejects corrupt, stale, and future cache records", () => {
    const now = Date.parse("2026-09-16T21:00:00Z");
    expect(parseCachedLocation("not-json", now)).toEqual({
      ok: false,
      reason: "malformed",
    });
    expect(
      parseCachedLocation('{"lat":200,"lng":0,"timestamp":1}', now),
    ).toEqual({ ok: false, reason: "invalid-coordinates" });
    expect(
      parseCachedLocation(
        serializeCachedLocation({ lat: 51.5, lng: -0.1 }, now - 31 * 60_000),
        now,
      ),
    ).toEqual({ ok: false, reason: "stale" });
    expect(
      parseCachedLocation(
        serializeCachedLocation({ lat: 51.5, lng: -0.1 }, now + 120_000),
        now,
      ),
    ).toEqual({ ok: false, reason: "future" });
  });

  it("returns a fresh validated cache record", () => {
    const now = Date.parse("2026-09-16T21:00:00Z");
    const result = parseCachedLocation(
      serializeCachedLocation({ lat: 51.5, lng: -0.1 }, now - 60_000),
      now,
    );
    expect(result).toMatchObject({
      ok: true,
      value: { lat: 51.5, lng: -0.1 },
      ageMs: 60_000,
    });
  });
});

describe("altitude and azimuth", () => {
  it("uses the explicit time input", () => {
    const coordinates = { lat: 0, lng: 0 };
    const first = equatorialToHorizontal(
      { ra: 0, dec: 0 },
      coordinates,
      new Date("2026-09-16T00:00:00Z"),
    );
    const later = equatorialToHorizontal(
      { ra: 0, dec: 0 },
      coordinates,
      new Date("2026-09-16T06:00:00Z"),
    );
    expect(Math.abs(first.alt - later.alt)).toBeGreaterThan(50);
    expect(first.az).toBeGreaterThanOrEqual(0);
    expect(first.az).toBeLessThanOrEqual(360);
  });
});
