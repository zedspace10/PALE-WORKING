import { describe, expect, it } from "vitest";

import {
  aimAt,
  compassWords,
  DESTINATIONS,
  morsePulses,
  newNote,
  noteLink,
  parseNotes,
  progressWords,
  signalSeconds,
  signalText,
  voyagerLightSeconds,
} from "@/constants/notes";

// How the Stellara website reads a note link (src/lib/notes.ts, noteFromHash).
function readLikeTheWebsite(url: string) {
  const m = url.match(/#n=([A-Za-z0-9_-]+)$/);
  if (!m) return null;
  const b64 =
    m[1].replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((m[1].length + 3) % 4);
  const bin = atob(b64);
  return JSON.parse(
    new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))),
  ) as { t: string; s: number; d: string };
}

describe("notes shared with the website", () => {
  it("makes a link the website can read, including accents", () => {
    const note = newNote("Bonne nuit, étoiles ✨", "vega", 1_793_000_000_000);
    const url = noteLink(note);
    expect(url.startsWith("https://stellaraspace.com/note#n=")).toBe(true);
    expect(readLikeTheWebsite(url)).toEqual({
      t: "Bonne nuit, étoiles ✨",
      s: 1_793_000_000_000,
      d: "vega",
    });
  });

  it("only offers stars the website knows, and nothing about stars dying", () => {
    const website = [
      "proxima",
      "sirius",
      "tau-ceti",
      "vega",
      "trappist",
      "pleiades",
      "betelgeuse",
      "orion",
      "centre",
      "andromeda",
    ];
    for (const d of DESTINATIONS) {
      expect(website).toContain(d.id);
      expect(d.line).not.toMatch(/end of its life|dying|death/i);
    }
    expect(DESTINATIONS.map((d) => d.id)).not.toContain("betelgeuse");
  });

  it("keeps saved notes readable and ignores anything malformed", () => {
    const good = newNote("Hello", "sirius", 1);
    expect(parseNotes(JSON.stringify([good, { nope: true }]))).toEqual([good]);
    expect(parseNotes("not json")).toEqual([]);
  });

  it("describes how far a note has gone", () => {
    const sent = Date.UTC(2026, 9, 29, 21);
    const note = newNote("Hello", "proxima", sent);
    expect(progressWords(note, sent + 500)).toBe("just leaving Earth");
    expect(progressWords(note, sent + 2_000)).toBe("past the Moon");
    expect(progressWords(note, sent + 600_000)).toBe("past the Sun's distance");
    // Voyager 1 is about a light day out, so a note passes it a little over a day after sending.
    expect(progressWords(note, sent + 86_000_000)).toBe("past Neptune's orbit");
    expect(progressWords(note, sent + 88_000_000)).toBe("past Voyager 1");
  });

  it("keeps Voyager 1 moving outwards", () => {
    expect(voyagerLightSeconds(Date.UTC(2026, 10, 15))).toBe(86_400);
    const ayearOn = voyagerLightSeconds(Date.UTC(2027, 10, 15));
    expect(ayearOn).toBeGreaterThan(88_000);
    expect(ayearOn).toBeLessThan(88_400);
  });
});

describe("real light from the torch", () => {
  it("spells a line in standard Morse timing", () => {
    // S is three dots, O three dashes: on 1, off 1, on 1, off 1, on 1, off 3 ...
    const sos = morsePulses("sos", 100);
    expect(sos.map((p) => [p.on, p.ms])).toEqual([
      [true, 100],
      [false, 100],
      [true, 100],
      [false, 100],
      [true, 100],
      [false, 300],
      [true, 300],
      [false, 100],
      [true, 300],
      [false, 100],
      [true, 300],
      [false, 300],
      [true, 100],
      [false, 100],
      [true, 100],
      [false, 100],
      [true, 100],
      [false, 300],
    ]);
  });

  it("leaves a seven unit gap between words", () => {
    const pulses = morsePulses("e e", 100);
    // e: on 1, off 3; space adds 4 more; e: on 1, off 3
    expect(pulses.map((p) => p.ms)).toEqual([100, 300, 400, 100, 300]);
  });

  it("keeps the signal under a minute and skips characters Morse cannot send", () => {
    const long = "Putting this down for a while, out here among the stars!";
    expect(signalText(long).length).toBeLessThanOrEqual(24);
    expect(signalText("Hi! ✨ 2026")).toBe("hi 2026");
    expect(signalSeconds(long)).toBeLessThan(60);
  });
});

describe("pointing at the star", () => {
  const london = { lat: 51.5, lng: -0.13 };

  it("finds Sirius low in the south on a winter night in London", () => {
    // Sirius crosses the meridian around midnight in early January, about 22 degrees up.
    const sirius = DESTINATIONS.find((d) => d.id === "sirius")!;
    const aim = aimAt(sirius, london, new Date("2027-01-02T00:00:00Z"));
    expect(aim.kind).toBe("up");
    if (aim.kind === "up") {
      expect(aim.direction).toBe("south");
      expect(aim.alt).toBeGreaterThan(15);
      expect(aim.alt).toBeLessThan(28);
    }
  });

  it("says when a star that never rises from London will not rise", () => {
    const proxima = DESTINATIONS.find((d) => d.id === "proxima")!;
    const aim = aimAt(proxima, london, new Date("2026-10-29T21:00:00Z"));
    expect(aim).toEqual({ kind: "below", risesAt: null });
  });

  it("names the compass points", () => {
    expect(compassWords(0)).toBe("north");
    expect(compassWords(135)).toBe("south east");
    expect(compassWords(359)).toBe("north");
  });
});
