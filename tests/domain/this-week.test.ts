import fs from "node:fs";
import { describe, expect, it } from "vitest";

import {
  needsRefresh,
  parseSavedThisWeek,
  parseThisWeek,
  THIS_WEEK_REFRESH_MS,
} from "@/constants/thisWeek";

const good = {
  version: 1,
  id: "cats-head-nebula",
  date: "2026-10-29",
  title: "A cat in the dust",
  object: "Cat's Head Nebula",
  constellation: "Carina, the Keel",
  distance: "7,500 light years away",
  image: {
    src: "https://www.esa.int/var/esa/storage/images/cat.jpg",
    alt: "A dark pillar of dust shaped like a sitting cat.",
    credit: "NASA, ESA, CSA, STScI",
    licence: "CC BY 4.0",
  },
  body: [
    "A dark pillar of dust and gas.",
    "Its light left about 7,500 years ago.",
  ],
  reflection: null,
  source: { label: "ESA: Cat's Head Nebula", href: "https://www.esa.int/x" },
  universeUrl: "https://stellaraspace.com/?pin=cats-head-nebula",
};

describe("This week on Explore", () => {
  it("reads the weekly picture from the site", () => {
    const pin = parseThisWeek(good);
    expect(pin?.object).toBe("Cat's Head Nebula");
    expect(pin?.image?.src).toContain("esa.int");
    expect(pin?.universeUrl).toContain("stellaraspace.com");
  });

  it("only shows pictures from NASA, ESA and the telescope teams, over https", () => {
    expect(
      parseThisWeek({
        ...good,
        image: { ...good.image, src: "https://example.com/a.jpg" },
      })?.image,
    ).toBeNull();
    expect(
      parseThisWeek({
        ...good,
        image: { ...good.image, src: "http://www.esa.int/a.jpg" },
      })?.image,
    ).toBeNull();
    expect(
      parseThisWeek({ ...good, universeUrl: "https://elsewhere.com/" })
        ?.universeUrl,
    ).toBeNull();
  });

  it("refuses anything incomplete or of an unknown version", () => {
    expect(parseThisWeek({ ...good, version: 2 })).toBeNull();
    expect(parseThisWeek({ ...good, body: [] })).toBeNull();
    expect(parseThisWeek({ ...good, title: "" })).toBeNull();
    expect(parseThisWeek("nonsense")).toBeNull();
    expect(parseSavedThisWeek("{broken")).toBeNull();
  });

  it("checks for a new picture every few hours, and keeps the last one", () => {
    const pin = parseThisWeek(good)!;
    const now = Date.parse("2026-11-03T12:00:00Z");
    expect(needsRefresh(null, now)).toBe(true);
    expect(needsRefresh({ fetchedAt: now - 60_000, pin }, now)).toBe(false);
    expect(
      needsRefresh({ fetchedAt: now - THIS_WEEK_REFRESH_MS - 1, pin }, now),
    ).toBe(true);
    const saved = parseSavedThisWeek(
      JSON.stringify({ fetchedAt: now, pin: good }),
    );
    expect(saved?.pin.title).toBe("A cat in the dust");
  });

  it("sits at the top of Explore and opens its own page", () => {
    const explore = fs.readFileSync("app/(tabs)/explore.tsx", "utf8");
    expect(explore).toContain("<ThisWeekRow");
    expect(fs.existsSync("app/this-week.tsx")).toBe(true);
  });
});
