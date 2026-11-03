import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { TRACK_CUES, TRACK_LENGTH_SECONDS } from "@/constants/shiftTiming";

const SOUND_KEY = "@pale_shift_sound";
const VOLUME = 0.8;

/**
 * The Shift's music: an original ambient track timed to the journey. It fades in and out rather
 * than cutting, never plays when the phone is on silent, plays alongside anything else the person
 * is listening to, pauses when PALE is in the background, and can be turned off (remembered).
 */
export function useShiftMusic() {
  const player = useAudioPlayer(require("@/assets/audio/shift-ambient.m4a"));
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true);
  const active = useRef(false);
  // When the track's second zero would have been, so turning sound on mid journey joins in step.
  const origin = useRef(0);
  const pausedAt = useRef<number | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: false,
      interruptionMode: "mixWithOthers",
      shouldPlayInBackground: false,
    }).catch(() => undefined);
    AsyncStorage.getItem(SOUND_KEY)
      .then((v) => {
        const on = v !== "off";
        soundOnRef.current = on;
        setSoundOn(on);
      })
      .catch(() => undefined);
  }, []);

  const clearFade = () => {
    if (fadeTimer.current) clearInterval(fadeTimer.current);
    fadeTimer.current = null;
  };

  const fadeTo = useCallback(
    (target: number, ms: number, done?: () => void) => {
      clearFade();
      let from = 0;
      try {
        from = player.volume;
      } catch {
        return;
      }
      const steps = Math.max(1, Math.round(ms / 50));
      let i = 0;
      fadeTimer.current = setInterval(() => {
        i += 1;
        try {
          // The last step lands exactly on the target, and volume always stays within 0 to 1.
          const v = i >= steps ? target : from + ((target - from) * i) / steps;
          player.volume = Math.min(1, Math.max(0, v));
        } catch {
          clearFade();
          return;
        }
        if (i >= steps) {
          clearFade();
          done?.();
        }
      }, 50);
    },
    [player],
  );

  const playFrom = useCallback(
    (seconds: number, fadeMs: number) => {
      if (seconds >= TRACK_LENGTH_SECONDS) return;
      try {
        player.volume = 0;
        player
          .seekTo(Math.max(0, seconds))
          .then(() => {
            if (!active.current || !soundOnRef.current) return;
            player.play();
            fadeTo(VOLUME, fadeMs);
          })
          .catch(() => undefined);
      } catch {
        // Sound is a nicety: the journey carries on without it.
      }
    },
    [fadeTo, player],
  );

  const pauseQuietly = useCallback(
    (ms: number) => {
      fadeTo(0, ms, () => {
        try {
          player.pause();
        } catch {
          /* already gone */
        }
      });
    },
    [fadeTo, player],
  );

  /** The journey has begun. */
  const start = useCallback(() => {
    active.current = true;
    origin.current = Date.now();
    pausedAt.current = null;
    if (soundOnRef.current) playFrom(0, 1500);
  }, [playFrom]);

  /** Skipped to a stage (6 means the journey is heading home): keep the music in step. */
  const jumpTo = useCallback(
    (index: number) => {
      const cue = TRACK_CUES[Math.min(index, TRACK_CUES.length - 1)];
      origin.current = Date.now() - cue * 1000;
      if (!active.current || !soundOnRef.current) return;
      fadeTo(0, 250, () => playFrom(cue, 700));
    },
    [fadeTo, playFrom],
  );

  /** The journey has ended or been left. */
  const stop = useCallback(() => {
    active.current = false;
    pauseQuietly(600);
  }, [pauseQuietly]);

  const toggleSound = useCallback(() => {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    setSoundOn(next);
    AsyncStorage.setItem(SOUND_KEY, next ? "on" : "off").catch(() => undefined);
    if (!active.current) return;
    if (next) playFrom((Date.now() - origin.current) / 1000, 800);
    else pauseQuietly(500);
  }, [pauseQuietly, playFrom]);

  // Quiet in the background; carry on from the same place on return.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (!active.current || !soundOnRef.current) return;
      if (state === "active") {
        if (pausedAt.current !== null) {
          origin.current += Date.now() - pausedAt.current;
          pausedAt.current = null;
          try {
            player.play();
            fadeTo(VOLUME, 600);
          } catch {
            /* ignore */
          }
        }
      } else if (pausedAt.current === null) {
        pausedAt.current = Date.now();
        clearFade();
        try {
          player.pause();
        } catch {
          /* ignore */
        }
      }
    });
    return () => sub.remove();
  }, [fadeTo, player]);

  useEffect(() => () => clearFade(), []);

  return { soundOn, toggleSound, start, jumpTo, stop };
}
