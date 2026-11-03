import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  stageStartSeconds,
  TRACK_CUES,
  TRACK_LENGTH_SECONDS,
} from "@/constants/shiftTiming";

const read = (p: string) =>
  fs.readFileSync(path.resolve(process.cwd(), p), "utf8");

describe("Shift music", () => {
  it("was composed to the Shift's real timings", () => {
    // If this fails, the journey's timings changed: remake the track with
    // scripts/audio/shift_ambient.py and update TRACK_CUES.
    const starts = stageStartSeconds();
    expect(starts).toHaveLength(TRACK_CUES.length);
    starts.forEach((s, i) => expect(s).toBeCloseTo(TRACK_CUES[i], 1));
    expect(TRACK_LENGTH_SECONDS).toBeGreaterThan(starts[starts.length - 1] + 8);
  });

  it("ships the track and never asks for the microphone", () => {
    expect(fs.existsSync("assets/audio/shift-ambient.m4a")).toBe(true);
    const app = JSON.parse(read("app.json"));
    const audio = app.expo.plugins.find(
      (p: unknown) => Array.isArray(p) && p[0] === "expo-audio",
    );
    expect(audio?.[1]).toMatchObject({
      microphonePermission: false,
      recordAudioAndroid: false,
    });
    expect(app.expo.plugins).not.toContain("expo-audio");
  });

  it("respects the silent switch, other audio and the person's choice", () => {
    const hook = read("hooks/useShiftMusic.ts");
    expect(hook).toContain("playsInSilentMode: false");
    expect(hook).toContain('interruptionMode: "mixWithOthers"');
    expect(hook).toContain("@pale_shift_sound");
    const shift = read("app/(tabs)/shift.tsx");
    expect(shift).toContain("useShiftMusic");
    expect(shift).toContain("music.jumpTo(stageRef.current + 1)");
    expect(shift).toMatch(/Turn the music (off|on)/);
  });
});
