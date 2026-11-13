import React from "react";

import { NotifyToggle } from "@/components/NotifyToggle";
import {
  isThisWeekNotifyOn,
  setThisWeekNotify,
} from "@/constants/thisWeekNotification";

/** On the This week screen: a note when a new weekly picture arrives. */
export function ThisWeekToggle() {
  return (
    <NotifyToggle
      title="Tell me when the next one arrives"
      subtitle="A note when a new Hubble or Webb picture is here"
      isOn={isThisWeekNotifyOn}
      setOn={setThisWeekNotify}
      onNote="Your phone decides when PALE can check, so the note can arrive a day or so after the picture."
    />
  );
}
