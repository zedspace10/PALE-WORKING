import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { getMoonPhase, getUniverseAgeYears } from "@/constants/starCatalog";

const STORAGE_KEY = "@pale_journal";

export type EntryType = "worry" | "reflection" | "goal" | "thought";

export interface JournalEntry {
  id: string;
  date: string;
  type: EntryType;
  text: string;
  moonPhase?: string;
  universeAge?: number;
}

export interface LookingBackBucket {
  label: string;
  note: string;
  entries: JournalEntry[];
}

function getDaysAgo(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setEntries(JSON.parse(raw));
        } catch {}
      }
      setLoading(false);
    });
  }, []);

  const persist = useCallback(async (updated: JournalEntry[]) => {
    setEntries(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addEntry = useCallback(
    async (entry: Pick<JournalEntry, "type" | "text">) => {
      const now = new Date();
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: now.toISOString(),
        moonPhase: getMoonPhase(now),
        universeAge: getUniverseAgeYears(),
        ...entry,
      };
      const updated = [newEntry, ...entries];
      await persist(updated);
      return newEntry;
    },
    [entries, persist]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      await persist(entries.filter((e) => e.id !== id));
    },
    [entries, persist]
  );

  // Legacy — kept for backwards compat
  const lookingBack = entries.filter((e) => {
    const days = getDaysAgo(e.date);
    return days >= 320 && days <= 410;
  });

  // On This Day — multiple time buckets, most recent non-empty wins
  const onThisDay: LookingBackBucket | null = (() => {
    const buckets: Array<{ min: number; max: number; label: string; note: string }> = [
      {
        min: 355,
        max: 380,
        label: "ONE YEAR AGO",
        note: "A year ago today, you wrote:",
      },
      {
        min: 175,
        max: 195,
        label: "SIX MONTHS AGO",
        note: "Six months ago, you wrote:",
      },
      {
        min: 85,
        max: 100,
        label: "THREE MONTHS AGO",
        note: "Three months ago, you wrote:",
      },
      {
        min: 28,
        max: 36,
        label: "ONE MONTH AGO",
        note: "A month ago, you wrote:",
      },
      {
        min: 6,
        max: 9,
        label: "ONE WEEK AGO",
        note: "A week ago, you wrote:",
      },
    ];

    for (const bucket of buckets) {
      const found = entries.filter((e) => {
        const d = getDaysAgo(e.date);
        return d >= bucket.min && d <= bucket.max;
      });
      if (found.length > 0) {
        return {
          label: bucket.label,
          note: bucket.note,
          entries: found.slice(0, 2), // max 2 per bucket
        };
      }
    }
    return null;
  })();

  return { entries, loading, addEntry, deleteEntry, lookingBack, onThisDay };
}
