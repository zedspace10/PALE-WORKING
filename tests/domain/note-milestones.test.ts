import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  afterWords,
  milestonesFor,
  nextNoteMilestoneLine,
  NOTE_BUDGET,
  noteIdFromIdentifier,
  planNoteNotifications,
  refreshNoteMilestones,
  setNoteMilestones,
} from "@/constants/noteMilestones";
import { NOTES_STORAGE_KEY, type Note } from "@/constants/notes";

const mocks = vi.hoisted(() => ({
  storage: new Map<string, string>(),
  pending: new Map<
    string,
    {
      identifier: string;
      title: string;
      subtitle?: string;
      body: string;
      data?: Record<string, unknown>;
      date: Date;
    }
  >(),
  granted: true,
}));
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async (k: string) => mocks.storage.get(k) ?? null),
    setItem: vi.fn(
      async (k: string, v: string) => void mocks.storage.set(k, v),
    ),
  },
}));
vi.mock("react-native", () => ({ Platform: { OS: "ios" } }));
vi.mock("expo-notifications", () => ({
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: "date" },
  setNotificationHandler: vi.fn(),
  setNotificationChannelAsync: vi.fn(async () => undefined),
  getPermissionsAsync: vi.fn(async () => ({
    granted: mocks.granted,
    canAskAgain: true,
  })),
  requestPermissionsAsync: vi.fn(async () => ({ granted: mocks.granted })),
  scheduleNotificationAsync: vi.fn(
    async (r: {
      identifier: string;
      content: {
        title: string;
        subtitle?: string;
        body: string;
        data?: Record<string, unknown>;
      };
      trigger: { date: Date };
    }) => {
      mocks.pending.set(r.identifier, {
        identifier: r.identifier,
        ...r.content,
        date: r.trigger.date,
      });
      return r.identifier;
    },
  ),
  cancelScheduledNotificationAsync: vi.fn(
    async (id: string) => void mocks.pending.delete(id),
  ),
  getAllScheduledNotificationsAsync: vi.fn(async () => [
    ...mocks.pending.values(),
  ]),
}));

const sent = Date.parse("2026-11-04T08:00:00Z");
const note = (
  id: string,
  to: string,
  at = sent,
  text = "Something private",
): Note => ({
  id,
  text,
  sentAt: at,
  to,
});

describe("Note milestone notifications", () => {
  beforeEach(() => {
    mocks.storage.clear();
    mocks.pending.clear();
    mocks.granted = true;
  });

  it("says when each milestone is passed, in plain words", () => {
    expect(afterWords(499)).toBe("8 minutes");
    expect(afterWords(2600)).toBe("43 minutes");
    expect(afterWords(15000)).toBe("about 4 hours");
    expect(afterWords(86_400)).toBe("about a day");
    const plan = milestonesFor(note("a", "sirius"), sent);
    expect(plan.map((p) => p.identifier)).toEqual([
      "pale-note-a-sun",
      "pale-note-a-jupiter",
      "pale-note-a-neptune",
      "pale-note-a-voyager",
      "pale-note-a-week",
      "pale-note-a-oort",
      "pale-note-a-year-1",
      "pale-note-a-year-2",
      "pale-note-a-year-3",
      "pale-note-a-year-4",
      "pale-note-a-halfway",
      "pale-note-a-year-5",
      "pale-note-a-year-6",
      "pale-note-a-year-7",
      "pale-note-a-year-8",
      "pale-note-a-arrived",
    ]);
    expect(plan[0].body).toBe(
      "It has just passed the Sun's distance, 8 minutes after you sent it.",
    );
    expect(plan[3].body).toContain(
      "Voyager 1, the farthest thing people have built",
    );
    expect(plan[4].body).toBe(
      "It is now a light week from Earth, about 181 billion km away.",
    );
    expect(plan[6].body).toBe(
      "A year ago today it left Earth. It is now a light year away, 9.5 trillion km.",
    );
    expect(plan[7].body).toContain("2 years ago today");
    expect(plan[10].body).toBe("It is halfway to Sirius.");
    const last = plan[plan.length - 1];
    expect(last.title).toBe("Your note has reached Sirius");
    expect(last.body).toBe("After 8 years and 7 months at the speed of light.");
  });

  it("keeps telling you about old notes: a note sent long ago still has its anniversaries", () => {
    const old = note("o", "proxima", sent - 400 * 86_400_000);
    const plan = milestonesFor(old, sent);
    expect(plan[0].identifier).toBe("pale-note-o-year-2");
    // Galaxies millions of light years away still get yearly notes, just never an arrival.
    const far = milestonesFor(note("g", "andromeda"), sent);
    expect(far.some((p) => p.identifier.endsWith("-year-1"))).toBe(true);
    expect(far.some((p) => p.identifier.endsWith("-arrived"))).toBe(false);
    for (const p of [...plan, ...far]) {
      expect(`${p.title} ${p.body}`).not.toMatch(/[\u2013\u2014]| - /);
    }
  });

  it("says on the You tab what comes next, so it is clear they are set", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(sent + 1000);
    expect(await nextNoteMilestoneLine(sent + 1000)).toBeNull();
    mocks.storage.set(NOTES_STORAGE_KEY, JSON.stringify([note("a", "sirius")]));
    await setNoteMilestones(true);
    expect(await nextNoteMilestoneLine(sent + 1000)).toMatch(
      /^Next: your note to Sirius, today at \d\d:\d\d\.$/,
    );
    mocks.storage.set(NOTES_STORAGE_KEY, "[]");
    expect(await nextNoteMilestoneLine(sent + 1000)).toBe(
      "Nothing is due yet. Send a note and PALE will follow it.",
    );
    mocks.granted = false;
    expect(await nextNoteMilestoneLine(sent + 1000)).toContain("turned off");
    await setNoteMilestones(false);
    vi.useRealTimers();
  });

  it("for a planet, only what comes before it arrives, then the arrival", () => {
    // Mars was 11.7 light minutes away: past the Sun's distance (8 minutes), then there.
    const at = Date.parse("2026-11-04T09:00:00Z");
    const plan = milestonesFor(note("m", "mars", at), at);
    expect(plan.map((p) => p.identifier)).toEqual([
      "pale-note-m-sun",
      "pale-note-m-arrived",
    ]);
    expect(plan[1].title).toBe("Your note has reached Mars");
    expect(plan[1].body).toBe("After 12 minutes at the speed of light.");
  });

  it("never puts the note's own words on the lock screen", () => {
    for (const p of milestonesFor(note("a", "proxima"), sent)) {
      expect(`${p.title} ${p.body}`).not.toContain("Something private");
    }
  });

  it("skips the Moon (1.3 seconds) and arrivals centuries away", () => {
    const far = milestonesFor(note("b", "pleiades"), sent);
    expect(far.some((p) => p.identifier.endsWith("arrived"))).toBe(false);
    expect(far.some((p) => p.body.includes("Moon"))).toBe(false);
  });

  it("only plans what is still to come, soonest first, within the budget", () => {
    const later = sent + 3 * 3_600_000;
    const plan = milestonesFor(note("a", "sirius"), later);
    expect(plan[0].identifier).toBe("pale-note-a-neptune");
    const many = Array.from({ length: 20 }, (_, i) =>
      note(`n${i}`, "vega", sent + i * 1000),
    );
    const planned = planNoteNotifications(many, sent);
    expect(planned).toHaveLength(NOTE_BUDGET);
    for (let i = 1; i < planned.length; i++) {
      expect(planned[i].at).toBeGreaterThanOrEqual(planned[i - 1].at);
    }
    // With the Observatory's 30 evenings and This week's one, the phone's limit of 64 is kept.
    expect(NOTE_BUDGET + 30 + 1).toBeLessThanOrEqual(64);
  });

  it("sets them on the phone when turned on, without repeats, and clears them when off", async () => {
    mocks.storage.set(NOTES_STORAGE_KEY, JSON.stringify([note("a", "sirius")]));
    vi.useFakeTimers();
    vi.setSystemTime(sent + 1000);
    expect(await setNoteMilestones(true)).toBe(true);
    expect(mocks.pending.size).toBe(16);
    await refreshNoteMilestones();
    expect(mocks.pending.size).toBe(16);
    expect(await setNoteMilestones(false)).toBe(false);
    expect(mocks.pending.size).toBe(0);
    vi.useRealTimers();
  });

  it("drops a note's reminders once it is let go, and keeps the others", async () => {
    mocks.storage.set(
      NOTES_STORAGE_KEY,
      JSON.stringify([note("a", "sirius"), note("b", "vega")]),
    );
    vi.useFakeTimers();
    vi.setSystemTime(sent + 1000);
    await setNoteMilestones(true);
    const before = [...mocks.pending.keys()];
    expect(before.some((id) => id.startsWith("pale-note-a-"))).toBe(true);
    mocks.storage.set(NOTES_STORAGE_KEY, JSON.stringify([note("b", "vega")]));
    await refreshNoteMilestones();
    const after = [...mocks.pending.keys()];
    expect(after.some((id) => id.startsWith("pale-note-a-"))).toBe(false);
    expect(after.some((id) => id.startsWith("pale-note-b-"))).toBe(true);
    await setNoteMilestones(false);
    vi.useRealTimers();
  });

  it("says which note each one is about, and carries it for the tap", async () => {
    mocks.storage.set(
      NOTES_STORAGE_KEY,
      JSON.stringify([
        note("a", "sirius"),
        note("b", "sirius", sent + 3 * 3_600_000),
      ]),
    );
    vi.useFakeTimers();
    vi.setSystemTime(sent + 1000);
    await setNoteMilestones(true);
    const all = [...mocks.pending.values()];
    const a = all.filter((p) => p.identifier.startsWith("pale-note-a-"));
    const b = all.filter((p) => p.identifier.startsWith("pale-note-b-"));
    // Two notes to the same star are told apart by when they were sent.
    expect(a[0].subtitle).toMatch(/^Sent 4 November at \d\d:\d\d$/);
    expect(a[0].subtitle).not.toBe(b[0].subtitle);
    for (const p of all) {
      expect(p.data).toEqual({
        url: "/notes",
        note: noteIdFromIdentifier(p.identifier),
      });
      // Still nothing of the note's own words on a locked screen.
      expect(`${p.title} ${p.subtitle} ${p.body}`).not.toContain(
        "Something private",
      );
    }
    await setNoteMilestones(false);
    vi.useRealTimers();
  });

  it("sets again any notifications an earlier version left on the phone", async () => {
    mocks.storage.set(NOTES_STORAGE_KEY, JSON.stringify([note("a", "sirius")]));
    mocks.storage.set("@pale_note_milestones", "true");
    vi.useFakeTimers();
    vi.setSystemTime(sent + 1000);
    // An old notification for the same milestone, without the note's id or when it was sent.
    const [first] = planNoteNotifications([note("a", "sirius")], sent + 1000);
    mocks.pending.set(first.identifier, {
      identifier: first.identifier,
      title: first.title,
      body: first.body,
      date: new Date(first.at),
    });
    await refreshNoteMilestones();
    expect(mocks.pending.get(first.identifier)?.data).toEqual({
      url: "/notes",
      note: "a",
    });
    expect(mocks.pending.get(first.identifier)?.subtitle).toMatch(/^Sent /);
    // Only once: after that, ones already set are left as they are.
    const scheduled = mocks.pending.size;
    await refreshNoteMilestones();
    expect(mocks.pending.size).toBe(scheduled);
    await setNoteMilestones(false);
    vi.useRealTimers();
  });

  it("finds the note from an older notification's identifier", () => {
    expect(noteIdFromIdentifier("pale-note-mhk2x9ab12cd-year-3")).toBe(
      "mhk2x9ab12cd",
    );
    expect(noteIdFromIdentifier("pale-note-a-voyager")).toBe("a");
    expect(noteIdFromIdentifier("pale-observatory-2026-11-05")).toBeNull();
  });

  it("leaves other notifications alone", async () => {
    mocks.pending.set("pale-observatory-2026-11-05", {
      identifier: "pale-observatory-2026-11-05",
      title: "The Observatory: x",
      body: "",
      date: new Date(),
    });
    await setNoteMilestones(false);
    expect([...mocks.pending.keys()]).toEqual(["pale-observatory-2026-11-05"]);
  });
});

describe("the switch on the Notes tab", () => {
  it("sits on the Notes tab, beside the notes, and stays in step", async () => {
    const fs = await import("node:fs");
    const notes = fs.readFileSync("components/NotesScreen.tsx", "utf8");
    expect(notes).toContain("<NoteMilestonesToggle");
    expect(notes).toContain("onChange={setMilestonesOn}");
    // It lives on Notes only, beside the notes it is about.
    const you = fs.readFileSync("app/(tabs)/you.tsx", "utf8");
    expect(you).not.toContain("<NoteMilestonesToggle");
  });
});
