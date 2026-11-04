import React from "react";

import { NotifyToggle } from "@/components/NotifyToggle";
import {
  areNoteMilestonesOn,
  setNoteMilestones,
} from "@/constants/noteMilestones";

/** On the You tab: a notification as each note passes a milestone. */
export function NoteMilestonesToggle() {
  return (
    <NotifyToggle
      title="Note milestones"
      subtitle="When your notes pass the Sun, Jupiter, Neptune and Voyager 1, and when they arrive"
      isOn={areNoteMilestonesOn}
      setOn={setNoteMilestones}
    />
  );
}
