import { describe, expect, it } from "vitest";

import {
  CHILD_OFFSETS,
  shiftFrame,
  SHIFT_MAX_ZOOM,
  ZOOM_STEP,
} from "@/constants/shiftZoom";

const D = 360;

describe("Shift zoom", () => {
  it("centres each picture when its stage is reached", () => {
    for (let z = 0; z <= SHIFT_MAX_ZOOM; z++) {
      const frame = shiftFrame(z, D);
      expect(frame.layers[z].x).toBeCloseTo(0, 6);
      expect(frame.layers[z].y).toBeCloseTo(0, 6);
      expect(frame.layers[z].scale).toBeCloseTo(1, 6);
      expect(frame.layers[z].opacity).toBe(1);
    }
  });

  it("puts each smaller picture exactly where the larger one says it is", () => {
    for (const z of [0.3, 1, 1.7, 2.5, 3.2, 4]) {
      const { layers } = shiftFrame(z, D);
      for (let i = 1; i <= SHIFT_MAX_ZOOM; i++) {
        const parent = layers[i];
        const child = layers[i - 1];
        if (parent.scale >= 12 || child.scale <= 0.0005) continue;
        expect(child.scale * ZOOM_STEP).toBeCloseTo(parent.scale, 6);
        expect(child.x).toBeCloseTo(
          parent.x + CHILD_OFFSETS[i][0] * D * parent.scale,
          3,
        );
        expect(child.y).toBeCloseTo(
          parent.y + CHILD_OFFSETS[i][1] * D * parent.scale,
          3,
        );
      }
    }
  });

  it("moves Earth smoothly, with no jump between stages", () => {
    let prev = shiftFrame(0, D).you;
    for (let z = 0.005; z <= SHIFT_MAX_ZOOM; z += 0.005) {
      const you = shiftFrame(z, D).you;
      expect(Math.hypot(you.x - prev.x, you.y - prev.y)).toBeLessThan(6);
      prev = you;
    }
  });

  it("keeps Earth on screen the whole way out", () => {
    for (let z = 0; z <= SHIFT_MAX_ZOOM; z += 0.05) {
      const { you } = shiftFrame(z, D);
      expect(Math.abs(you.x)).toBeLessThan(D / 2);
      expect(Math.abs(you.y)).toBeLessThan(D / 2);
    }
  });
});
