/**
 * The Shift's timings, shared by the journey and its music. The music was composed to these
 * exact times (scripts/audio/shift_piano.py), so if any of them change, remake the track and
 * update TRACK_CUES; a test checks the two still agree.
 */

/** The screen fading in after Begin, before the first stage. */
export const ENTRY_FADE_MS = 620;
// Each stage carries about 1.3s of animation overhead on top of these.
// Weighted so the setup moves and the closing line is given room.
export const STAGE_DURATIONS_MS = [6000, 6500, 7000, 7500, 8000, 8800];
export const FADE_MS = 900;
// How long the camera takes to pull back from one picture to the next, and to fly home at the end.
export const ZOOM_OUT_MS = 2600;
export const ZOOM_HOME_MS = 4200;

/**
 * Seconds from tapping Begin to the start of each stage, then one more: when the last line starts
 * to fade and the journey heads home.
 */
export function stageStartSeconds(): number[] {
  const starts = [ENTRY_FADE_MS / 1000];
  // The first stage has no zoom: it fades in, holds, and fades out.
  let ms = ENTRY_FADE_MS + FADE_MS + (STAGE_DURATIONS_MS[0] - 2 * FADE_MS);
  for (let i = 1; i < STAGE_DURATIONS_MS.length; i++) {
    starts.push(ms / 1000);
    ms += ZOOM_OUT_MS + FADE_MS + (STAGE_DURATIONS_MS[i] - 2 * FADE_MS);
  }
  starts.push(ms / 1000);
  return starts;
}

/** Where each of those moments falls in the music, in seconds. */
export const TRACK_CUES = [0.62, 5.72, 13.92, 22.62, 31.82, 41.52, 52.02];

/** The music fades to silence by this point, so there is nothing to resume after it. */
export const TRACK_LENGTH_SECONDS = 70;
