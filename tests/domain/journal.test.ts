import { describe, expect, it } from "vitest";

import {
  KEPT_LINE,
  keptOnWords,
  LET_GO_KEPT_ASK,
  MAX_JOURNAL_ENTRY,
  newEntry,
  parseJournal,
  TOO_LONG_TO_SEND,
  withoutEntry,
} from "@/constants/journal";

const now = Date.parse("2026-11-06T14:00:00Z");

describe("Kept entries", () => {
  it("trims, caps the length and keeps the time it was written", () => {
    const e = newEntry("  a thought  ", now);
    expect(e.text).toBe("a thought");
    expect(e.at).toBe(now);
    expect(newEntry("x".repeat(MAX_JOURNAL_ENTRY + 50), now).text).toHaveLength(
      MAX_JOURNAL_ENTRY,
    );
  });

  it("reads only well formed entries back from the phone", () => {
    const good = newEntry("kept", now);
    expect(parseJournal(JSON.stringify([good, { id: 1 }, null]))).toEqual([
      good,
    ]);
    expect(parseJournal("not json")).toEqual([]);
    expect(parseJournal(null)).toEqual([]);
  });

  it("brings back entries from the earlier Journal instead of losing them", () => {
    const old = [
      {
        id: "old1",
        date: "2026-03-01T21:00:00.000Z",
        text: "First night with PALE.",
        moonPhase: "Waxing crescent",
      },
    ];
    expect(parseJournal(JSON.stringify(old))).toEqual([
      {
        id: "old1",
        text: "First night with PALE.",
        at: Date.parse("2026-03-01T21:00:00.000Z"),
      },
    ]);
  });

  it("removes only the one let go", () => {
    const a = newEntry("a", now);
    const b = newEntry("b", now + 1);
    expect(withoutEntry([a, b], a.id)).toEqual([b]);
  });

  it("dates entries simply", () => {
    expect(keptOnWords(now, now)).toBe("Today");
    expect(keptOnWords(now - 86_400_000, now)).toBe("Yesterday");
    expect(keptOnWords(Date.parse("2026-11-03T10:00:00Z"), now)).toBe(
      "3 November",
    );
    expect(keptOnWords(Date.parse("2025-11-03T10:00:00Z"), now)).toBe(
      "3 November 2025",
    );
  });

  it("uses plain words with no dashes", () => {
    for (const line of [KEPT_LINE, LET_GO_KEPT_ASK, TOO_LONG_TO_SEND(120)]) {
      expect(line).not.toMatch(/[–—]| - /);
    }
  });
});
