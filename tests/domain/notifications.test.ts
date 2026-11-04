import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  LOCATION_CACHE_KEY,
  serializeCachedLocation,
} from "@/constants/location";
import {
  areNotificationsEnabled,
  cancelObservatoryNotifications,
  NOTIFICATION_IDS_KEY,
  OBSERVATORY_ID_PREFIX,
  refreshObservatorySchedule,
} from "@/constants/notifications";

type Pending = { identifier: string; content: { title: string } };
const mocks = vi.hoisted(() => ({
  storage: new Map<string, string>(),
  // The phone's own list of scheduled notifications.
  pending: new Map<string, Pending>(),
  cancel: vi.fn(async (_id: string) => undefined),
  schedule: vi.fn<(req: unknown) => Promise<string>>(),
  requestPermission: vi.fn(async () => ({ granted: true })),
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async (key: string) => mocks.storage.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      mocks.storage.set(key, value);
    }),
  },
}));

vi.mock("expo-notifications", () => ({
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: "date" },
  cancelScheduledNotificationAsync: mocks.cancel,
  getAllScheduledNotificationsAsync: vi.fn(async () => [
    ...mocks.pending.values(),
  ]),
  getPermissionsAsync: vi.fn(async () => ({
    granted: true,
    canAskAgain: true,
  })),
  requestPermissionsAsync: mocks.requestPermission,
  scheduleNotificationAsync: mocks.schedule,
  setNotificationChannelAsync: vi.fn(async () => undefined),
  setNotificationHandler: vi.fn(),
}));

vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

describe("notification persistence and failures", () => {
  const now = new Date("2026-09-16T12:00:00Z");

  beforeEach(() => {
    mocks.storage.clear();
    mocks.pending.clear();
    mocks.cancel.mockReset();
    mocks.cancel.mockImplementation(async (id: string) => {
      mocks.pending.delete(id);
    });
    mocks.schedule.mockReset();
  });

  // Behaves like the phone: a request with a name already in the list replaces it.
  let n = 0;
  const realScheduler = async (req: unknown) => {
    const r = req as { identifier?: string; content: { title: string } };
    const id = r.identifier ?? `random-${n++}`;
    // Let other work run in between, as the real native call does.
    await new Promise((resolve) => setTimeout(resolve, 0));
    mocks.pending.set(id, { identifier: id, content: r.content });
    return id;
  };
  const enable = () => {
    mocks.storage.set("pale_notifications_enabled", "true");
    mocks.storage.set(
      LOCATION_CACHE_KEY,
      serializeCachedLocation({ lat: 51.5, lng: -0.1 }, now.getTime()),
    );
  };

  it("never leaves two reminders on one evening, even when refreshes overlap", async () => {
    enable();
    mocks.schedule.mockImplementation(realScheduler);
    const [a, b] = await Promise.all([
      refreshObservatorySchedule(now),
      refreshObservatorySchedule(now),
    ]);
    expect(a).toBeGreaterThan(20);
    expect(a).toBeLessThanOrEqual(30);
    expect(b).toBe(a);
    expect(mocks.pending.size).toBe(a);
    for (const id of mocks.pending.keys()) {
      expect(id.startsWith(OBSERVATORY_ID_PREFIX)).toBe(true);
    }
    const evenings = [...mocks.pending.keys()];
    expect(new Set(evenings).size).toBe(evenings.length);
  });

  it("sweeps away reminders left by older versions, and nothing else", async () => {
    mocks.pending.set("legacy-1", {
      identifier: "legacy-1",
      content: { title: "The Observatory: Andromeda Galaxy" },
    });
    mocks.pending.set("pale-observatory-2026-09-20", {
      identifier: "pale-observatory-2026-09-20",
      content: { title: "The Observatory: Voyager 1" },
    });
    mocks.pending.set("someone-else", {
      identifier: "someone-else",
      content: { title: "Not ours" },
    });
    await cancelObservatoryNotifications();
    expect([...mocks.pending.keys()]).toEqual(["someone-else"]);
  });

  it("cancels only PALE-scoped notification identifiers", async () => {
    mocks.storage.set(
      NOTIFICATION_IDS_KEY,
      JSON.stringify(["pale-one", "pale-two"]),
    );

    await cancelObservatoryNotifications();

    expect(mocks.cancel).toHaveBeenCalledTimes(2);
    expect(mocks.cancel).toHaveBeenCalledWith("pale-one");
    expect(mocks.cancel).toHaveBeenCalledWith("pale-two");
    expect(mocks.storage.get(NOTIFICATION_IDS_KEY)).toBe("[]");
  });

  it("preserves the enabled state and scheduled IDs after a scheduling rejection", async () => {
    mocks.storage.set("pale_notifications_enabled", "true");
    mocks.storage.set(
      LOCATION_CACHE_KEY,
      serializeCachedLocation({ lat: 51.5, lng: -0.1 }, now.getTime()),
    );
    mocks.schedule
      .mockResolvedValueOnce("scheduled-before-failure")
      .mockRejectedValueOnce(new Error("native scheduler unavailable"));

    await expect(refreshObservatorySchedule(now)).rejects.toThrow(
      "native scheduler unavailable",
    );

    expect(await areNotificationsEnabled()).toBe(true);
    expect(JSON.parse(mocks.storage.get(NOTIFICATION_IDS_KEY) ?? "[]")).toEqual(
      ["scheduled-before-failure"],
    );
  });
});
