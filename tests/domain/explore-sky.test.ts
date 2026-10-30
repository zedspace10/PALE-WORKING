import { describe, expect, it } from "vitest";

import { LOCATIONS } from "@/constants/cosmicData";
import {
  birthdayLine,
  departureWords,
  lightLeftFor,
  noteFor,
  noteLine,
  skyFor,
} from "@/constants/exploreSky";
import { newNote } from "@/constants/notes";

const london = { lat: 51.5, lng: -0.13 };
const place = (id: string) => LOCATIONS.find((l) => l.id === id)!;

describe("the outward list", () => {
  it("goes outwards, each place further than the last", () => {
    const years = LOCATIONS.map((l) => l.lightYears);
    expect([...years].sort((a, b) => a - b)).toEqual(years);
    expect(LOCATIONS[0].jump).toBe("");
    for (const l of LOCATIONS.slice(1)) expect(l.jump).toMatch(/times further/);
  });

  it("has no star death in it", () => {
    const text = JSON.stringify(LOCATIONS);
    expect(text).not.toMatch(
      /supernova|dying|white dwarf|explode|end of its life/i,
    );
  });

  it("only links to note destinations the Notes screen knows", () => {
    const known = ["proxima", "orion", "centre", "andromeda"];
    for (const l of LOCATIONS) if (l.noteTo) expect(known).toContain(l.noteTo);
  });
});

describe("tonight's sky for each place", () => {
  it("says Proxima Centauri never rises from London", () => {
    const sky = skyFor(
      place("proxima"),
      london,
      new Date("2026-10-30T21:00:00Z"),
    );
    expect(sky.chip).toBe("Never rises here");
  });

  it("finds Andromeda up on an October evening in London", () => {
    const sky = skyFor(
      place("andromeda"),
      london,
      new Date("2026-10-30T21:00:00Z"),
    );
    expect(sky.chip).toBe("Up tonight");
    expect(sky.line).toMatch(/^Look (north|east|north east|south east)/);
  });

  it("says when the Orion Nebula climbs into view on an October evening", () => {
    const sky = skyFor(
      place("orion"),
      london,
      new Date("2026-10-30T19:00:00Z"),
    );
    expect(sky.tone).toBe("later");
    expect(sky.chip).toMatch(/^Up after /);
  });

  it("falls back to plain words without a location, and never asks for one", () => {
    const sky = skyFor(
      place("proxima"),
      null,
      new Date("2026-10-30T21:00:00Z"),
    );
    expect(sky.line).toMatch(/never rises from Britain/);
  });

  it("places the planets without a location", () => {
    const sky = skyFor(place("saturn"), null, new Date("2026-10-30T21:00:00Z"));
    expect(sky.chip).toBe("Up tonight");
  });
});

describe("personal lines", () => {
  const now = new Date("2026-10-30T12:00:00Z");

  it("fills in when Proxima's light left", () => {
    expect(departureWords(4.24, now)).toBe("the summer of 2022");
    expect(lightLeftFor(place("proxima"), now)).toBe(
      "The light reaching Earth tonight left in the summer of 2022.",
    );
  });

  it("says how old the person was when the light left, only when it makes sense", () => {
    const birthday = new Date("1994-03-14T12:00:00Z");
    expect(birthdayLine(place("proxima"), birthday, now)).toBe(
      "The light you would see from it tonight left when you were 28.",
    );
    expect(birthdayLine(place("moon"), birthday, now)).toBeNull();
    expect(birthdayLine(place("andromeda"), birthday, now)).toBeNull();
    expect(birthdayLine(place("proxima"), null, now)).toBeNull();
  });

  it("follows a note sent to this place", () => {
    const sent = newNote(
      "Hello from London",
      "proxima",
      now.getTime() - 86_400_000,
    );
    const other = newNote("Hi", "vega", now.getTime());
    const note = noteFor(place("proxima"), [other, sent]);
    expect(note).toBe(sent);
    expect(noteLine(sent, now.getTime())).toMatch(
      /^Your note “Hello from London” has travelled 25\.9 billion km so far\. It arrives in the year 2031\.$/,
    );
    expect(noteFor(place("saturn"), [sent])).toBeNull();
  });
});
