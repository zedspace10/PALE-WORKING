import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { THIS_WEEK_CACHE_KEY } from "@/constants/thisWeek";
import {
  checkForNewPicture,
  markThisWeekSeen,
  nextLunchtime,
  setThisWeekNotify,
  THIS_WEEK_SEEN_KEY,
} from "@/constants/thisWeekNotification";

const mocks = vi.hoisted(() => ({
  storage: new Map<string, string>(),
  pending: new Map<string, { identifier: string; date: Date; title: string }>(),
  granted: true,
  registered: [] as string[],
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
vi.mock("expo-background-task", () => ({
  registerTaskAsync: vi.fn(
    async (name: string) => void mocks.registered.push(name),
  ),
  unregisterTaskAsync: vi.fn(async () => void (mocks.registered = [])),
}));
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
      content: { title: string };
      trigger: { date: Date };
    }) => {
      mocks.pending.set(r.identifier, {
        identifier: r.identifier,
        date: r.trigger.date,
        title: r.content.title,
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

const pin = (id: string, object: string) => ({
  version: 1,
  id,
  date: "2026-11-09",
  title: "A new picture",
  object,
  constellation: "Carina",
  distance: "7,500 light years away",
  image: {
    src: "https://www.esa.int/x.jpg",
    alt: "x",
    credit: "NASA, ESA",
    licence: "CC BY 4.0",
  },
  body: ["Something plain."],
  reflection: null,
  source: null,
  universeUrl: null,
});
const site = (body: unknown) =>
  (async () => ({
    ok: true,
    json: async () => body,
  })) as unknown as typeof fetch;

describe("This week notification", () => {
  const monday = new Date("2026-11-09T02:00:00Z");

  beforeEach(() => {
    mocks.storage.clear();
    mocks.pending.clear();
    mocks.granted = true;
    mocks.registered = [];
  });

  it("is off until the person turns it on", async () => {
    expect(
      await checkForNewPicture(monday, site(pin("a", "Cat's Head Nebula"))),
    ).toBe("off");
    expect(mocks.pending.size).toBe(0);
  });

  it("does not announce the picture already showing when it is turned on", async () => {
    mocks.storage.set(
      THIS_WEEK_CACHE_KEY,
      JSON.stringify({
        fetchedAt: monday.getTime(),
        pin: pin("a", "Cat's Head Nebula"),
      }),
    );
    expect(await setThisWeekNotify(true)).toBe(true);
    expect(mocks.registered).toEqual(["pale-this-week-check"]);
    expect(
      await checkForNewPicture(monday, site(pin("a", "Cat's Head Nebula"))),
    ).toBe("unchanged");
    expect(mocks.pending.size).toBe(0);
  });

  it("sends one note for a new picture, at the next lunchtime", async () => {
    mocks.storage.set(THIS_WEEK_SEEN_KEY, "a");
    await setThisWeekNotify(true);
    mocks.storage.set(THIS_WEEK_SEEN_KEY, "a");
    expect(
      await checkForNewPicture(monday, site(pin("b", "Pillars of Creation"))),
    ).toBe("scheduled");
    expect(
      await checkForNewPicture(monday, site(pin("b", "Pillars of Creation"))),
    ).toBe("unchanged");
    expect(mocks.pending.size).toBe(1);
    const note = mocks.pending.get("pale-this-week-b")!;
    expect(note.title).toBe("This week: Pillars of Creation");
    expect(note.date.getHours()).toBe(12);
    expect(note.date.getMinutes()).toBe(30);
    // Explore's copy is refreshed too.
    expect(mocks.storage.get(THIS_WEEK_CACHE_KEY)).toContain(
      "Pillars of Creation",
    );
  });

  it("drops the note once the picture has been opened, and when switched off", async () => {
    await setThisWeekNotify(true);
    mocks.storage.set(THIS_WEEK_SEEN_KEY, "a");
    await checkForNewPicture(monday, site(pin("b", "Pillars of Creation")));
    await markThisWeekSeen("b");
    expect(mocks.pending.size).toBe(0);
    mocks.storage.set(THIS_WEEK_SEEN_KEY, "b");
    await checkForNewPicture(monday, site(pin("c", "Orion Bar")));
    expect(mocks.pending.size).toBe(1);
    await setThisWeekNotify(false);
    expect(mocks.pending.size).toBe(0);
    expect(mocks.registered).toEqual([]);
  });

  it("stays quiet without permission or when the site cannot be read", async () => {
    await setThisWeekNotify(true);
    mocks.granted = false;
    expect(await checkForNewPicture(monday, site(pin("b", "x")))).toBe("off");
    mocks.granted = true;
    expect(await checkForNewPicture(monday, site({ broken: true }))).toBe(
      "failed",
    );
    expect(
      await checkForNewPicture(monday, (async () => {
        throw new Error("offline");
      }) as unknown as typeof fetch),
    ).toBe("failed");
    expect(mocks.pending.size).toBe(0);
  });

  it("picks the next 12:30", () => {
    const morning = new Date(2026, 10, 9, 9, 0);
    const afternoon = new Date(2026, 10, 9, 15, 0);
    expect(nextLunchtime(morning).getDate()).toBe(9);
    expect(nextLunchtime(afternoon).getDate()).toBe(10);
  });

  it("asks for no new permissions beyond background checks", () => {
    const app = JSON.parse(fs.readFileSync("app.json", "utf8"));
    expect(app.expo.plugins).toContain("expo-background-task");
    expect(JSON.stringify(app)).not.toMatch(
      /NSMicrophone|RECORD_AUDIO|"remote-notification"/,
    );
  });
});
