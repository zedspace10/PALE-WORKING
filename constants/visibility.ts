export type ObservingObjectKind =
  "point-source" | "extended-object" | "constellation" | "moon" | "planet";

export interface VisibilityInput {
  altitude: number;
  apparentMagnitude?: number;
  kind: ObservingObjectKind;
  opticalAid?: "binoculars" | "telescope";
}

export interface ObservationGuidance {
  eligibleForCard: boolean;
  unaidedEligible: boolean;
  qualifier: string;
}

export const MINIMUM_GUIDANCE_ALTITUDE = 10;
export const CONSERVATIVE_NAKED_EYE_MAGNITUDE = 5.5;
export const LOCAL_CONDITIONS_NOTE =
  "Cloud, haze, streetlights or a building in the way can still hide it.";

export function getObservationGuidance(
  input: VisibilityInput,
): ObservationGuidance {
  if (
    !Number.isFinite(input.altitude) ||
    input.altitude <= MINIMUM_GUIDANCE_ALTITUDE
  ) {
    return {
      eligibleForCard: false,
      unaidedEligible: false,
      qualifier: "It is too low in the sky to find right now.",
    };
  }

  if (input.kind === "constellation" || input.kind === "extended-object") {
    return {
      eligibleForCard: true,
      unaidedEligible: false,
      qualifier: `Easiest to see from somewhere dark. ${LOCAL_CONDITIONS_NOTE}`,
    };
  }

  const magnitudeAllowsUnaided =
    input.apparentMagnitude !== undefined &&
    Number.isFinite(input.apparentMagnitude) &&
    input.apparentMagnitude <= CONSERVATIVE_NAKED_EYE_MAGNITUDE;

  if (!magnitudeAllowsUnaided) {
    const aid = input.opticalAid ?? "binoculars";
    return {
      eligibleForCard: true,
      unaidedEligible: false,
      qualifier: `Too faint to see without ${aid}. ${LOCAL_CONDITIONS_NOTE}`,
    };
  }

  return {
    eligibleForCard: true,
    unaidedEligible: true,
    qualifier: `Bright enough to see without help. ${LOCAL_CONDITIONS_NOTE}`,
  };
}
