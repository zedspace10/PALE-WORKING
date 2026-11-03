/**
 * Registers the background check for a new weekly picture. Imported once at the top of the app,
 * because the phone may start PALE in the background just to run it.
 */
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

import {
  checkForNewPicture,
  THIS_WEEK_TASK,
} from "@/constants/thisWeekNotification";

if (Platform.OS !== "web") {
  TaskManager.defineTask(THIS_WEEK_TASK, async () => {
    try {
      const result = await checkForNewPicture();
      return result === "failed"
        ? BackgroundTask.BackgroundTaskResult.Failed
        : BackgroundTask.BackgroundTaskResult.Success;
    } catch {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}
