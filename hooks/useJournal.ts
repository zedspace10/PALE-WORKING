import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  createJournalRepository,
  getJournalRetrospective,
  JournalEntry,
  LookingBackBucket,
} from "@/constants/journal";

export type {
  EntryType,
  JournalEntry,
  LookingBackBucket,
} from "@/constants/journal";

export type JournalErrorOperation = "load" | "save" | "delete";

export interface JournalError {
  operation: JournalErrorOperation;
  message: string;
}

export function useJournal() {
  const repository = useRef(createJournalRepository(AsyncStorage)).current;
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [error, setError] = useState<JournalError | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEntries(await repository.load());
      setError(null);
    } catch {
      setError({
        operation: "load",
        message: "Your locally stored journal could not be loaded.",
      });
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    load();
  }, [load]);

  const addEntry = useCallback(
    async (entry: Pick<JournalEntry, "type" | "text">) => {
      setSaving(true);
      try {
        const added = await repository.add(entry);
        setEntries([...repository.getCurrent()]);
        setError(null);
        return added;
      } catch {
        setError({
          operation: "save",
          message:
            "This entry was not saved. Your draft is still here; please retry.",
        });
        throw new Error("Journal save failed");
      } finally {
        setSaving(false);
      }
    },
    [repository],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      setDeletingIds((current) => [...current, id]);
      try {
        setEntries(await repository.delete(id));
        setError(null);
      } catch {
        setError({
          operation: "delete",
          message:
            "That entry could not be deleted. It remains on this device.",
        });
        throw new Error("Journal delete failed");
      } finally {
        setDeletingIds((current) =>
          current.filter((entryId) => entryId !== id),
        );
      }
    },
    [repository],
  );

  const onThisDay: LookingBackBucket | null = getJournalRetrospective(
    entries,
    new Date(),
  );

  return {
    entries,
    loading,
    saving,
    deletingIds,
    error,
    addEntry,
    deleteEntry,
    retryLoad: load,
    onThisDay,
  };
}
