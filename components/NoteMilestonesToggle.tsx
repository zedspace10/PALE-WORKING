import React from "react";

import { NotifyToggle } from "@/components/NotifyToggle";
import {
  areNoteMilestonesOn,
  nextNoteMilestoneLine,
  setNoteMilestones,
} from "@/constants/noteMilestones";

/** On the Notes and You tabs: a notification as each note passes a milestone. */
export function NoteMilestonesToggle({
  onChange,
}: {
  onChange?: (on: boolean) => void;
}) {
  return (
    <NotifyToggle
      title="Note milestones"
      subtitle="As your notes pass the Sun, Neptune and Voyager 1, then each year they travel, and when they arrive"
      isOn={areNoteMilestonesOn}
      setOn={setNoteMilestones}
      status={nextNoteMilestoneLine}
      onChange={onChange}
    />
  );
}
