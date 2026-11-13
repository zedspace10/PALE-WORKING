import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(__dirname, "../..", p), "utf8");

describe("Back arrows", () => {
  it("never lead nowhere, even on a screen opened from a notification", () => {
    for (const screen of [
      "app/this-week.tsx",
      "app/tonight-sky.tsx",
      "app/location/[id].tsx",
      "app/(tabs)/deeptime.tsx",
    ]) {
      const source = read(screen);
      expect(source, screen).not.toContain("router.back()");
      expect(source, screen).toMatch(/goBack|goBackOr/);
    }
    const hook = read("hooks/useGoBack.ts");
    expect(hook).toContain("router.canGoBack()");
    expect(hook).toContain("router.replace(fallback)");
  });

  it("can be read out by VoiceOver on the Time Machine", () => {
    expect(read("app/(tabs)/deeptime.tsx")).toContain(
      'accessibilityLabel="Back to Home"',
    );
  });
});
