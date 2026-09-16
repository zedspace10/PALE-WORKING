import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  LOCATION_CACHE_KEY,
  serializeCachedLocation,
} from "@/constants/location";
import {
  areNotificationsEnabled,
  cancelObservatoryNotifications,
  NOTIFICATION_IDS_KEY,
  refreshObservatorySchedule,
} from "@/constants/notifications";

const mocks = vi.hoisted(() => ({
  storage: new Map<string, string>(),
  cancel: vi.fn(async () => undefined),
  schedule: vi.fn<() => Promise<string>>(),
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
    mocks.cancel.mockClear();
    mocks.schedule.mockReset();
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
