import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { LOCATIONS } from "@/constants/cosmicData";
import { TIME_MACHINE_EVENTS } from "@/constants/cosmicTimeMachine";
import { OBSERVATORY_ENTRIES } from "@/constants/observatory";
import {
  getSourceAccessibilityLabel,
  SCIENTIFIC_SOURCES,
} from "@/constants/scientificContent";
import { STAR_CATALOG } from "@/constants/starCatalog";

function textFor(value: unknown): string {
  return JSON.stringify(value);
}

describe("audited scientific corrections", () => {
  it("uses current early-universe wording", () => {
    const bigBang = TIME_MACHINE_EVENTS.find(
      (event) => event.id === "big-bang",
    );
    const darkAges = TIME_MACHINE_EVENTS.find(
      (event) => event.id === "dark-ages",
    );
    expect(textFor([bigBang])).not.toMatch(
      /single point|point of infinite density|protons and neutrons form/i,
    );
    expect(bigBang?.description).toMatch(/light atomic nuclei/i);
    expect(darkAges?.perspective).toMatch(/one to two hundred million years/i);
    expect(darkAges?.perspective).not.toMatch(/longer than the current age/i);
  });

  it("qualifies biological and human-history claims", () => {
    const content = textFor(TIME_MACHINE_EVENTS);
    expect(content).toMatch(/first mass extinction is debated/i);
    expect(content).toMatch(/Most cells in your body retain mitochondria/i);
    expect(content).not.toMatch(/Every cell in your body contains/i);
    expect(content).not.toMatch(/make no tools|Every human outside Africa/i);
    expect(content).toMatch(/Art and music go back much further/i);
  });

  it("keeps future scenarios conditional", () => {
    const andromeda = TIME_MACHINE_EVENTS.find(
      (event) => event.id === "milky-way-merger",
    );
    expect(andromeda?.title).toBe("A possible Andromeda encounter");
    expect(andromeda?.when).toMatch(/uncertain/i);
    expect(andromeda?.science.classification).toBe("model-dependent");
  });

  it("corrects audited observatory and star claims", () => {
    const content = textFor(OBSERVATORY_ENTRIES);
    expect(content).toMatch(/nearest major galactic neighbour/i);
    expect(content).toMatch(
      /has not yet passed the Solar System's distant Oort Cloud/i,
    );
    expect(content).toMatch(/total distributed mass/i);
    expect(content).toMatch(/methane and ethane/i);
    expect(content).toMatch(/subsurface ocean of liquid water/i);
    expect(content).toMatch(/much disputed/i);
    expect(content).toMatch(/not a known physical edge/i);
    expect(content).toMatch(/northern constellation Cassiopeia/i);
    expect(content).not.toMatch(
      /window into another universe|forever hidden|infinite unknown/i,
    );

    const proxima = STAR_CATALOG.find(
      (star) => star.name === "Proxima Centauri",
    );
    const barnard = STAR_CATALOG.find((star) => star.name === "Barnard's Star");
    expect(proxima?.note).toMatch(/type M star.*roughly 4.2 light years/i);
    expect(barnard?.note).toMatch(/type M star.*roughly 5.9 light years/i);
    expect(textFor(STAR_CATALOG.map((star) => star.note))).not.toMatch(
      /prime candidate for planets with life|civilisation|confirmed planet|known planets/i,
    );
  });

  it("corrects audited location and Tonight's Sky copy", () => {
    const andromeda = LOCATIONS.find((location) => location.id === "andromeda");
    expect(andromeda?.subtitle).toMatch(/nearest major/i);
    expect(textFor(andromeda)).not.toMatch(
      /will collide|collision is certain/i,
    );

    const tonightSource = fs.readFileSync(
      path.resolve(process.cwd(), "app/tonight-sky.tsx"),
      "utf8",
    );
    expect(tonightSource).not.toMatch(
      /does not orbit the Sun|Double Cluster[^\n]+contains|one star that never moves|Scorpius is best seen in summer from the southern hemisphere|two trillion more galaxies|with your own eyes/i,
    );
    expect(tonightSource).toMatch(/common barycentre/);
    expect(tonightSource).toMatch(/neighbouring constellation Perseus/);
    expect(tonightSource).toMatch(/Southern Hemisphere winter evenings/);
  });

  it("builds an accessible source label", () => {
    expect(getSourceAccessibilityLabel(SCIENTIFIC_SOURCES.nasaBigBang)).toBe(
      "Open source: Big Bang Q&A, NASA Science",
    );
  });
});

describe("Voyager 1's light day", () => {
  it("speaks of 18 November 2026 in the right tense", async () => {
    const { voyagerDayWords } = await import("@/constants/exploreSky");
    expect(voyagerDayWords(new Date("2026-11-07T12:00:00Z"))).toBe(
      "On 18 November 2026 it will reach a full light day from Earth, the first spacecraft ever to do so.",
    );
    expect(voyagerDayWords(new Date("2026-12-01T12:00:00Z"))).toBe(
      "On 18 November 2026 it became the first spacecraft ever to reach a full light day from Earth.",
    );
  });
});
