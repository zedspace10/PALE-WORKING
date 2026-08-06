import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

import { refreshObservatorySchedule } from "@/constants/notifications";

/**
 * Keeps the scheduled notifications in step with the app.
 *
 * Runs once on mount and again every time the app returns to the foreground.
 * Each run cancels and rebuilds the whole batch, so the schedule stays correct
 * after the user travels, changes the toggle, or installs an update that
 * changes the Observatory entries.
 *
 * Safe to call unconditionally: refreshObservatorySchedule does nothing when
 * notifications are off, permission is missing, or no location is cached.
 */
export function useNotificationSchedule() {
  useEffect(() => {
    refreshObservatorySchedule().catch(() => {});

    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "active") {
        refreshObservatorySchedule().catch(() => {});
      }
    });

    return () => sub.remove();
  }, []);
}
