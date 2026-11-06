/**
 * Kept notes: things written in PALE that stay on the phone. Nothing here leaves the device
 * unless the person chooses to send an entry out, when it becomes a note like any other.
 */

export const JOURNAL_STORAGE_KEY = "@pale_journal";
/** Kept entries can run longer than a note, which travels as one line. */
export const MAX_JOURNAL_ENTRY = 2000;

export interface JournalEntry {
  id: string;
  text: string;
  /** When it was written, in milliseconds. */
  at: number;
}

export function newEntry(text: string, now = Date.now()): JournalEntry {
  return {
    id: `j${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    text: text.trim().slice(0, MAX_JOURNAL_ENTRY),
    at: now,
  };
}

export function withoutEntry(
  entries: JournalEntry[],
  id: string,
): JournalEntry[] {
  return entries.filter((e) => e.id !== id);
}

/**
 * Reads kept entries back. Entries from PALE's earlier Journal (same storage, a `date` string
 * instead of `at`) are read too, so nothing anyone wrote then is lost.
 */
export function parseJournal(raw: string | null): JournalEntry[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const out: JournalEntry[] = [];
    for (const e of value) {
      if (!e || typeof e.id !== "string" || typeof e.text !== "string") {
        continue;
      }
      const at =
        typeof e.at === "number"
          ? e.at
          : typeof e.date === "string"
            ? Date.parse(e.date)
            : NaN;
      if (!Number.isFinite(at) || !e.text.trim()) continue;
      out.push({ id: e.id, text: e.text, at });
    }
    return out.sort((a, b) => b.at - a.at);
  } catch {
    return [];
  }
}

/** "Today", "Yesterday", "3 November", "3 November 2025". */
export function keptOnWords(at: number, now = Date.now()): string {
  const day = (t: number) => new Date(t).toDateString();
  if (day(at) === day(now)) return "Today";
  if (day(at) === day(now - 86_400_000)) return "Yesterday";
  const when = new Date(at);
  return when.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    ...(when.getFullYear() !== new Date(now).getFullYear()
      ? { year: "numeric" }
      : {}),
  });
}

export const KEPT_LINE =
  "It is only on this phone. You can send it out whenever you are ready.";
export const LET_GO_KEPT_ASK =
  "Let this go? It will be deleted from your phone for good.";
export const TOO_LONG_TO_SEND = (max: number) =>
  `Kept entries can be any length. A note travels as one line, so to send it, keep it to ${max} characters.`;
