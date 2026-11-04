import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  afterWords,
  milestonesFor,
  NOTE_BUDGET,
  planNoteNotifications,
  refreshNoteMilestones,
  setNoteMilestones,
} from "@/constants/noteMilestones";
import { NOTES_STORAGE_KEY, type Note } from "@/constants/notes";

const mocks = vi.hoisted(() => ({
  storage: new Map<string, string>(),
  pending: new Map<
    string,
    { identifier: string; title: string; body: string; date: Date }
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
      content: { title: string; body: string };
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
      "pale-note-a-arrived",
    ]);
    expect(plan[0].body).toBe(
      "It has just passed the Sun's distance, 8 minutes after you sent it.",
    );
    expect(plan[3].body).toContain(
      "Voyager 1, the farthest thing people have built",
    );
    expect(plan[4].title).toBe("Your note has reached Sirius");
    expect(plan[4].body).toBe(
      "After 8 years and 7 months at the speed of light.",
    );
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
    expect(mocks.pending.size).toBe(5);
    await refreshNoteMilestones();
    expect(mocks.pending.size).toBe(5);
    expect(await setNoteMilestones(false)).toBe(false);
    expect(mocks.pending.size).toBe(0);
    vi.useRealTimers();
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
