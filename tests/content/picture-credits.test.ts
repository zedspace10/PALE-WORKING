import fs from "node:fs";
import { describe, expect, it } from "vitest";

import { EXPLORE_ARTWORK_KEYS } from "@/constants/exploreArtwork";
import {
  allPictureCredits,
  photoCreditLine,
  PHOTO_CREDITS,
} from "@/constants/pictureCredits";

describe("picture credits", () => {
  it("credits every real photograph, and labels the rest as illustrations", () => {
    expect(photoCreditLine("moon")).toBe("Photo: NASA");
    for (const key of EXPLORE_ARTWORK_KEYS) {
      const c = PHOTO_CREDITS[key];
      if (!c) {
        expect(photoCreditLine(key)).toBeNull();
        continue;
      }
      expect(c.credit.length).toBeGreaterThan(2);
      expect(c.source.length).toBeGreaterThan(5);
      expect(["Public domain", "CC BY 4.0"]).toContain(c.licence);
      // Credited to an agency or telescope team, never a person alone (those are copyrighted).
      expect(c.credit).toMatch(/NASA|ESA|STScI|JPL|CSA/);
    }
    expect(allPictureCredits().length).toBe(Object.keys(PHOTO_CREDITS).length);
  });

  it("shows the credits on the You tab and on each place", () => {
    expect(fs.readFileSync("app/(tabs)/you.tsx", "utf8")).toContain(
      "<PictureCredits />",
    );
    expect(fs.readFileSync("app/location/[id].tsx", "utf8")).toContain(
      "photoCreditLine(",
    );
  });
});
