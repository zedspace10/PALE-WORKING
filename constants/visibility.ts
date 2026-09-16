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
  "Cloud, haze, light pollution, atmospheric conditions, and a blocked horizon can prevent a sighting.";

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
      qualifier: "This object is too low for reliable guidance at the moment.",
    };
  }

  if (input.kind === "constellation" || input.kind === "extended-object") {
    return {
      eligibleForCard: true,
      unaidedEligible: false,
      qualifier: `Its pattern or glow may be detectable from a dark site. ${LOCAL_CONDITIONS_NOTE}`,
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
      qualifier: `This target is not expected to be visible unaided; ${aid} may be required. ${LOCAL_CONDITIONS_NOTE}`,
    };
  }

  return {
    eligibleForCard: true,
    unaidedEligible: true,
    qualifier: `It may be visible unaided from the estimated direction. ${LOCAL_CONDITIONS_NOTE}`,
  };
}
