/**
 * Real photographs in PALE, and who to credit for each. NASA's own images are free to use with
 * credit; ESA/Hubble and ESA/Webb images are CC BY 4.0, credited exactly and marked as cropped.
 * A picture listed here is shown as a photo with its credit; anything not listed is an
 * illustration and is labelled as one.
 */
import type { ExploreArtworkKey } from "@/constants/exploreArtwork";

export interface PictureCredit {
  /** What the picture shows. */
  title: string;
  /** The credit line, exactly as the source gives it. */
  credit: string;
  /** Where it came from, so anyone can find the original. */
  source: string;
  /** "Public domain" for NASA's own images, or the licence. */
  licence: string;
}

export const PHOTO_CREDITS: Partial<Record<ExploreArtworkKey, PictureCredit>> =
  {
    moon: {
      title: "The Moon, from Clementine data (1994)",
      credit: "NASA",
      source: "NASA Image and Video Library, GSFC_20171208_Archive_e001982",
      licence: "Public domain",
    },
  };

/** "Photo: NASA" for a real photograph, or null when the picture is an illustration. */
export function photoCreditLine(key: ExploreArtworkKey): string | null {
  const c = PHOTO_CREDITS[key];
  return c ? `Photo: ${c.credit}` : null;
}

/** Every credit, for the list on the You tab. */
export function allPictureCredits(): PictureCredit[] {
  return Object.values(PHOTO_CREDITS).filter(
    (c): c is PictureCredit => c !== undefined,
  );
}
