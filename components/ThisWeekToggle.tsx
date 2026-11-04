import React from "react";

import { NotifyToggle } from "@/components/NotifyToggle";
import {
  isThisWeekNotifyOn,
  setThisWeekNotify,
} from "@/constants/thisWeekNotification";

/** On the You tab: a note when a new weekly picture arrives. */
export function ThisWeekToggle() {
  return (
    <NotifyToggle
      title="This week's picture"
      subtitle="A note when a new Hubble or Webb picture arrives"
      isOn={isThisWeekNotifyOn}
      setOn={setThisWeekNotify}
      onNote="Your phone decides when PALE can check, so the note can arrive a day or so after the picture."
    />
  );
}
