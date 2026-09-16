import { describe, expect, it } from "vitest";

import { FIXED_NOW, TEST_LOCATIONS } from "@/tests/fixtures";

describe("verification harness", () => {
  it("resolves the project alias and deterministic fixtures", () => {
    expect(FIXED_NOW.toISOString()).toBe("2026-09-16T21:00:00.000Z");
    expect(TEST_LOCATIONS.greenwich).toEqual({ lat: 51.4769, lng: 0 });
  });
});
