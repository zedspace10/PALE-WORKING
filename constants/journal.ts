import { getApproximateMoonPhase } from "@/constants/skyEvents";
import { formatUniverseAgeEstimate } from "@/constants/personalInsights";
import {
  AsyncKeyValueStore,
  createSerializedState,
} from "@/constants/serializedState";

export const JOURNAL_STORAGE_KEY = "@pale_journal";

export type EntryType = "worry" | "reflection" | "goal" | "thought";

export interface JournalEntry {
  id: string;
  date: string;
  type: EntryType;
  text: string;
  moonPhase?: string;
  /** Legacy numeric snapshot retained for backwards compatibility. */
  universeAge?: number;
  universeAgeEstimate?: string;
  metadataVersion?: 2;
}

export interface LookingBackBucket {
  exact: boolean;
  label: string;
  note: string;
  entries: JournalEntry[];
}

const ENTRY_TYPES: readonly EntryType[] = [
  "worry",
  "reflection",
  "goal",
  "thought",
];

export function parseJournalEntries(raw: string | null): JournalEntry[] {
  if (!raw) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value)) throw new Error("Journal data is not an array");
  if (
    !value.every((entry) => {
      if (!entry || typeof entry !== "object") return false;
      const candidate = entry as Partial<JournalEntry>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.date === "string" &&
        Number.isFinite(new Date(candidate.date).getTime()) &&
        typeof candidate.text === "string" &&
        ENTRY_TYPES.includes(candidate.type as EntryType)
      );
    })
  ) {
    throw new Error("Journal data contains an invalid entry");
  }
  return value as JournalEntry[];
}

export interface JournalRepository {
  load(): Promise<JournalEntry[]>;
  add(input: Pick<JournalEntry, "type" | "text">): Promise<JournalEntry>;
  delete(id: string): Promise<JournalEntry[]>;
  getCurrent(): JournalEntry[];
}

export function createJournalRepository(
  storage: AsyncKeyValueStore,
  options: {
    now?: () => Date;
    id?: (at: Date) => string;
  } = {},
): JournalRepository {
  const state = createSerializedState<JournalEntry[]>([]);
  const now = options.now ?? (() => new Date());
  const id =
    options.id ??
    ((at: Date) => `${at.getTime()}-${Math.random().toString(36).slice(2, 9)}`);

  return {
    async load() {
      const entries = parseJournalEntries(
        await storage.getItem(JOURNAL_STORAGE_KEY),
      );
      return state.replace(entries, async () => undefined);
    },
    async add(input) {
      const at = now();
      const moon = getApproximateMoonPhase(at);
      const entry: JournalEntry = {
        id: id(at),
        date: at.toISOString(),
        type: input.type,
        text: input.text,
        moonPhase: `Approx. ${moon.label}`,
        universeAgeEstimate: formatUniverseAgeEstimate(),
        metadataVersion: 2,
      };
      await state.update(
        (current) => [entry, ...current],
        (next) => storage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(next)),
      );
      return entry;
    },
    delete(entryId) {
      return state.update(
        (current) => current.filter((entry) => entry.id !== entryId),
        (next) => storage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(next)),
      );
    },
    getCurrent: state.getCurrent,
  };
}

function localCalendarDay(date: Date): number {
  return (
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000
  );
}

export function calendarDaysAgo(iso: string, now: Date): number {
  const entryDate = new Date(iso);
  return localCalendarDay(now) - localCalendarDay(entryDate);
}

export function getJournalRetrospective(
  entries: readonly JournalEntry[],
  now: Date,
): LookingBackBucket | null {
  const exact = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() < now.getFullYear() &&
      entryDate.getMonth() === now.getMonth() &&
      entryDate.getDate() === now.getDate()
    );
  });
  if (exact.length > 0) {
    return {
      exact: true,
      label: "ON THIS DAY",
      note: "On this calendar date in an earlier year, you wrote:",
      entries: exact.slice(0, 2),
    };
  }

  const buckets = [
    {
      min: 320,
      max: 410,
      label: "AROUND THIS TIME LAST YEAR",
      note: "Around this time last year, you wrote:",
    },
    {
      min: 175,
      max: 195,
      label: "AROUND SIX MONTHS AGO",
      note: "Around six months ago, you wrote:",
    },
    {
      min: 85,
      max: 100,
      label: "AROUND THREE MONTHS AGO",
      note: "Around three months ago, you wrote:",
    },
    {
      min: 28,
      max: 36,
      label: "AROUND ONE MONTH AGO",
      note: "Around one month ago, you wrote:",
    },
    {
      min: 6,
      max: 9,
      label: "AROUND ONE WEEK AGO",
      note: "Around one week ago, you wrote:",
    },
  ];

  for (const bucket of buckets) {
    const found = entries.filter((entry) => {
      const days = calendarDaysAgo(entry.date, now);
      return days >= bucket.min && days <= bucket.max;
    });
    if (found.length > 0) {
      return { exact: false, ...bucket, entries: found.slice(0, 2) };
    }
  }
  return null;
}

export function formatJournalUniverseAge(entry: JournalEntry): string {
  if (entry.universeAgeEstimate) return entry.universeAgeEstimate;
  return `${formatUniverseAgeEstimate(entry.universeAge)} (legacy entry)`;
}
