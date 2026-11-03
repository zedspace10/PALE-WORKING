/**
 * This week's picture from Hubble or Webb, chosen and written up on stellaraspace.com and shown
 * at the top of Explore. The app downloads it from the site about once a day and keeps the last
 * copy, so it still shows offline. Nothing about the person is sent.
 */

export const THIS_WEEK_URL = "https://stellaraspace.com/this-week.json";
export const THIS_WEEK_CACHE_KEY = "@pale_this_week";
/** Look for a new picture when the saved one is older than this. */
export const THIS_WEEK_REFRESH_MS = 6 * 3_600_000;

// Pictures only ever come from NASA, ESA and the telescope teams.
const IMAGE_HOSTS = [
  "www.esa.int",
  "esa.int",
  "science.nasa.gov",
  "assets.science.nasa.gov",
  "images-assets.nasa.gov",
  "esahubble.org",
  "cdn.esahubble.org",
  "esawebb.org",
  "cdn.esawebb.org",
  "stsci-opo.org",
];
const LINK_HOSTS = [
  "stellaraspace.com",
  "www.stellaraspace.com",
  ...IMAGE_HOSTS,
];

export interface ThisWeek {
  id: string;
  date: string;
  title: string;
  object: string;
  constellation: string;
  distance: string;
  image: {
    src: string;
    alt: string;
    credit: string;
    licence: string | null;
  } | null;
  body: string[];
  reflection: string | null;
  source: { label: string; href: string } | null;
  universeUrl: string | null;
}

export interface SavedThisWeek {
  fetchedAt: number;
  pin: ThisWeek;
}

const text = (v: unknown, max = 400): string | null =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max
    ? v.trim()
    : null;

function safeUrl(v: unknown, hosts: string[]): string | null {
  if (typeof v !== "string") return null;
  try {
    const u = new URL(v);
    return u.protocol === "https:" && hosts.includes(u.hostname)
      ? u.toString()
      : null;
  } catch {
    return null;
  }
}

/** Checks what came from the site before PALE shows any of it. Returns null if it is not usable. */
export function parseThisWeek(raw: unknown): ThisWeek | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.version !== 1) return null;
  const id = text(r.id, 80);
  const date =
    typeof r.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.date)
      ? r.date
      : null;
  const title = text(r.title, 120);
  const object = text(r.object, 120);
  const distance = text(r.distance, 120);
  const body = Array.isArray(r.body)
    ? r.body
        .map((p) => text(p, 1200))
        .filter((p): p is string => p !== null)
        .slice(0, 6)
    : [];
  if (!id || !date || !title || !object || !distance || body.length === 0)
    return null;

  const img = (r.image ?? {}) as Record<string, unknown>;
  const src = safeUrl(img.src, IMAGE_HOSTS);
  const credit = text(img.credit, 300);
  const image =
    src && credit
      ? {
          src,
          alt: text(img.alt, 400) ?? object,
          credit,
          licence: text(img.licence, 40),
        }
      : null;

  const s = (r.source ?? {}) as Record<string, unknown>;
  const href = safeUrl(s.href, LINK_HOSTS);
  const label = text(s.label, 200);

  return {
    id,
    date,
    title,
    object,
    constellation: text(r.constellation, 120) ?? "",
    distance,
    image,
    body,
    reflection: text(r.reflection, 400),
    source: href && label ? { label, href } : null,
    universeUrl: safeUrl(r.universeUrl, [
      "stellaraspace.com",
      "www.stellaraspace.com",
    ]),
  };
}

export function parseSavedThisWeek(raw: string | null): SavedThisWeek | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as { fetchedAt?: unknown; pin?: unknown };
    const pin = parseThisWeek(v.pin);
    return pin && typeof v.fetchedAt === "number"
      ? { fetchedAt: v.fetchedAt, pin }
      : null;
  } catch {
    return null;
  }
}

export function needsRefresh(
  saved: SavedThisWeek | null,
  now: number,
): boolean {
  return (
    !saved ||
    now - saved.fetchedAt > THIS_WEEK_REFRESH_MS ||
    saved.fetchedAt > now
  );
}

export function dateWords(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
