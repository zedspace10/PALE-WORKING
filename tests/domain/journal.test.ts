import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  calendarDaysAgo,
  createJournalRepository,
  formatJournalUniverseAge,
  getJournalRetrospective,
  JOURNAL_STORAGE_KEY,
  JournalEntry,
} from "@/constants/journal";
import { AsyncKeyValueStore } from "@/constants/serializedState";

class MemoryStorage implements AsyncKeyValueStore {
  values = new Map<string, string>();
  getItem = async (key: string) => this.values.get(key) ?? null;
  setItem = async (key: string, value: string) => {
    this.values.set(key, value);
  };
  removeItem = async (key: string) => {
    this.values.delete(key);
  };
}

function entry(id: string, date: Date): JournalEntry {
  return { id, date: date.toISOString(), type: "reflection", text: id };
}

describe("journal repository integrity", () => {
  it("serializes overlapping saves without losing an entry", async () => {
    const storage = new MemoryStorage();
    let releaseFirst!: () => void;
    let writes = 0;
    const originalSet = storage.setItem;
    storage.setItem = async (key, value) => {
      writes += 1;
      if (writes === 1) {
        await new Promise<void>((resolve) => {
          releaseFirst = resolve;
        });
      }
      await originalSet(key, value);
    };
    let nextId = 0;
    const repository = createJournalRepository(storage, {
      now: () => new Date("2026-09-16T12:00:00Z"),
      id: () => `entry-${++nextId}`,
    });
    await repository.load();

    const first = repository.add({ type: "thought", text: "first" });
    const second = repository.add({ type: "goal", text: "second" });
    await Promise.resolve();
    releaseFirst();
    await Promise.all([first, second]);

    const stored = JSON.parse(storage.values.get(JOURNAL_STORAGE_KEY) ?? "[]");
    expect(stored.map((item: JournalEntry) => item.text)).toEqual([
      "second",
      "first",
    ]);
    expect(repository.getCurrent()).toHaveLength(2);
  });

  it("keeps current entries after a rejected save and recovers", async () => {
    const storage = new MemoryStorage();
    const repository = createJournalRepository(storage, {
      now: () => new Date("2026-09-16T12:00:00Z"),
      id: () => "retry-entry",
    });
    await repository.load();
    storage.setItem = async () => {
      throw new Error("quota");
    };
    await expect(
      repository.add({ type: "thought", text: "keep my draft" }),
    ).rejects.toThrow("quota");
    expect(repository.getCurrent()).toEqual([]);

    storage.setItem = async (key, value) => {
      storage.values.set(key, value);
    };
    await repository.add({ type: "thought", text: "keep my draft" });
    expect(repository.getCurrent()[0].text).toBe("keep my draft");
  });

  it("surfaces rejected reads and serializes overlapping deletes", async () => {
    const broken: AsyncKeyValueStore = {
      getItem: async () => {
        throw new Error("read failed");
      },
      setItem: async () => undefined,
      removeItem: async () => undefined,
    };
    await expect(createJournalRepository(broken).load()).rejects.toThrow(
      "read failed",
    );

    const storage = new MemoryStorage();
    storage.values.set(
      JOURNAL_STORAGE_KEY,
      JSON.stringify([
        entry("one", new Date("2026-01-01T12:00:00Z")),
        entry("two", new Date("2026-01-02T12:00:00Z")),
      ]),
    );
    const repository = createJournalRepository(storage);
    await repository.load();
    await Promise.all([repository.delete("one"), repository.delete("two")]);
    expect(repository.getCurrent()).toEqual([]);
  });

  it("formats legacy universe snapshots with honest precision", () => {
    expect(
      formatJournalUniverseAge({
        ...entry("legacy", new Date()),
        universeAge: 13_797_002_345.123,
      }),
    ).toBe("Approximately 13.8 billion years (legacy entry)");
  });
});

describe("journal retrospective labels", () => {
  it("reserves on-this-day wording for an exact calendar anniversary", () => {
    const now = new Date(2026, 8, 16, 9);
    const result = getJournalRetrospective(
      [entry("exact", new Date(2025, 8, 16, 22))],
      now,
    );
    expect(result).toMatchObject({ exact: true, label: "ON THIS DAY" });
    expect(result?.note).toMatch(/On this calendar date/i);
  });

  it.each([
    ["week", new Date(2026, 8, 9), "AROUND ONE WEEK AGO"],
    ["month", new Date(2026, 7, 16), "AROUND ONE MONTH AGO"],
    ["three", new Date(2026, 5, 16), "AROUND THREE MONTHS AGO"],
    ["six", new Date(2026, 2, 16), "AROUND SIX MONTHS AGO"],
    ["year", new Date(2025, 8, 10), "AROUND THIS TIME LAST YEAR"],
  ])(
    "uses approximate wording for the %s discovery window",
    (_name, date, label) => {
      expect(
        getJournalRetrospective(
          [entry(String(_name), date as Date)],
          new Date(2026, 8, 16, 12),
        ),
      ).toMatchObject({ exact: false, label });
    },
  );

  it("does not turn a leap-day entry into an exact March anniversary", () => {
    const result = getJournalRetrospective(
      [entry("leap", new Date(2024, 1, 29, 12))],
      new Date(2025, 2, 1, 12),
    );
    expect(result?.exact).toBe(false);
    expect(result?.label).toBe("AROUND THIS TIME LAST YEAR");
  });

  it("uses local calendar days across a DST-adjacent interval", () => {
    const before = new Date(2026, 2, 28, 23, 30);
    const after = new Date(2026, 2, 29, 23, 30);
    expect(calendarDaysAgo(before.toISOString(), after)).toBe(1);
  });
});

describe("journal UI contract", () => {
  it("uses consistent local unencrypted storage disclosure and preserves failed drafts", () => {
    const screen = fs.readFileSync(
      path.resolve(process.cwd(), "app/(tabs)/journal.tsx"),
      "utf8",
    );
    expect(screen).toMatch(/stored locally · unencrypted/i);
    expect(
      screen.match(/unencrypted app storage/g)?.length,
    ).toBeGreaterThanOrEqual(2);
    expect(screen).not.toMatch(/This is private|private perspective/i);
    expect(screen).toMatch(/draft stays in `write`/);
  });

  it("uses one canonical journal implementation", () => {
    const compatibilityRoute = fs.readFileSync(
      path.resolve(process.cwd(), "app/journal.tsx"),
      "utf8",
    );
    expect(compatibilityRoute).toContain(
      'export { default } from "./(tabs)/journal"',
    );
  });

  it("gives the Save action an equal-width wrapper", () => {
    const screen = fs.readFileSync(
      path.resolve(process.cwd(), "app/(tabs)/journal.tsx"),
      "utf8",
    );
    expect(screen).toContain("wrapperStyle={styles.saveBtnWrap}");
    expect(screen).toContain("saveBtnWrap: { flex: 1 }");
    expect(screen).toContain(
      'saveBtnFrame: { borderRadius: 12, width: "100%" }',
    );
  });
});
