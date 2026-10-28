/**
 * The Shift zoom: five nested pictures, each one held inside the next.
 *
 * Layer 0 is Earth, 1 the solar system, 2 the Milky Way, 3 the Local Group and 4 the observable
 * universe. Each picture is drawn in a square of side D. Inside layer i, the whole of layer i - 1
 * shrinks to a square of side D / ZOOM_STEP, sitting at CHILD_OFFSETS[i] from the centre. So as the
 * zoom level z rises from 0 to 4, Earth becomes a dot on its orbit, the solar system becomes a
 * point in one arm of the galaxy, and so on, and the eye can follow where it went.
 *
 * Sizes and distances are a perspective device, not one physical scale: the real steps between
 * these pictures range from about a thousand to about a hundred thousand times.
 */

export const SHIFT_LAYER_COUNT = 5;
export const SHIFT_MAX_ZOOM = SHIFT_LAYER_COUNT - 1;

/** How many times smaller each picture becomes when the next one takes over. */
export const ZOOM_STEP = 22;

/**
 * Where the previous picture sits inside each picture, as a fraction of D from the centre.
 * Index i is the position of layer i - 1 inside layer i. Index 0 is unused.
 */
export const CHILD_OFFSETS: readonly (readonly [number, number])[] = [
  [0, 0],
  // Earth on its orbit, up and to the right of the Sun
  [0.135 * Math.cos(-0.62), 0.135 * Math.sin(-0.62)],
  // The Sun, a little over half way out from the centre of the galaxy
  [-0.2, 0.14],
  // The Milky Way within the Local Group
  [-0.16, 0.09],
  // We are at the centre of our own observable universe
  [0, 0],
];

export interface LayerFrame {
  scale: number;
  x: number;
  y: number;
  opacity: number;
}

export interface ShiftFrame {
  layers: LayerFrame[];
  /** Where Earth is on screen, relative to the scene centre. */
  you: { x: number; y: number };
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Every layer's scale, position and opacity at zoom level z, for a scene of side d pixels.
 * Between two whole levels the camera glides from the smaller picture's centre to the larger's.
 */
export function shiftFrame(z: number, d: number): ShiftFrame {
  const zc = Math.min(SHIFT_MAX_ZOOM, Math.max(0, z));
  const n = Math.min(SHIFT_MAX_ZOOM - 1, Math.floor(zc));
  const t = smooth(zc - n);

  const scales = Array.from(
    { length: SHIFT_LAYER_COUNT },
    (_, i) => ZOOM_STEP ** (i - zc),
  );
  const pos: { x: number; y: number }[] = Array.from(
    { length: SHIFT_LAYER_COUNT },
    () => ({ x: 0, y: 0 }),
  );

  // The picture we are moving out to slides from "its child is centred" to "it is centred".
  const [ox, oy] = CHILD_OFFSETS[n + 1];
  pos[n + 1] = {
    x: -(1 - t) * ox * d * scales[n + 1],
    y: -(1 - t) * oy * d * scales[n + 1],
  };
  for (let i = n + 1; i < SHIFT_MAX_ZOOM; i++) {
    const [cx, cy] = CHILD_OFFSETS[i + 1];
    pos[i + 1] = {
      x: pos[i].x - cx * d * scales[i + 1],
      y: pos[i].y - cy * d * scales[i + 1],
    };
  }
  for (let i = n + 1; i > 0; i--) {
    const [cx, cy] = CHILD_OFFSETS[i];
    pos[i - 1] = {
      x: pos[i].x + cx * d * scales[i],
      y: pos[i].y + cy * d * scales[i],
    };
  }

  const layers = scales.map((scale, i) => {
    const depth = i - zc; // above 0: bigger than the screen; below 0: shrinking away
    const fadeIn = i === 0 ? 1 : clamp01((0.75 - depth) / 0.45);
    const fadeOut = clamp01((depth + 1.7) / 0.4);
    return {
      // Scales and offsets of pictures nobody can see are capped, so the numbers stay sane.
      scale: Math.min(12, Math.max(0.0005, scale)),
      x: Math.max(-4000, Math.min(4000, pos[i].x)),
      y: Math.max(-4000, Math.min(4000, pos[i].y)),
      opacity: Math.min(fadeIn, fadeOut),
    };
  });

  return { layers, you: { x: pos[0].x, y: pos[0].y } };
}

/** Samples of the zoom, for building smooth native animations. */
export function shiftZoomSamples(step = 0.02): number[] {
  const count = Math.round(SHIFT_MAX_ZOOM / step);
  return Array.from({ length: count + 1 }, (_, i) =>
    Number((i * step).toFixed(4)),
  );
}
