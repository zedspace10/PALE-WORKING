import { describe, expect, it } from "vitest";

import {
  getObservationGuidance,
  LOCAL_CONDITIONS_NOTE,
} from "@/constants/visibility";
import { STAR_CATALOG } from "@/constants/starCatalog";

describe("conservative observing guidance", () => {
  it.each([
    ["Proxima Centauri", 11.13],
    ["Barnard's Star", 9.54],
  ])("does not call %s naked-eye visible", (_name, apparentMagnitude) => {
    expect(
      STAR_CATALOG.find((star) => star.name === _name)?.apparentMagnitude,
    ).toBe(apparentMagnitude);
    const guidance = getObservationGuidance({
      altitude: 40,
      apparentMagnitude: apparentMagnitude as number,
      kind: "point-source",
      opticalAid: "telescope",
    });
    expect(guidance.unaidedEligible).toBe(false);
    expect(guidance.qualifier).toMatch(/not expected to be visible unaided/i);
  });

  it("allows a bright high point source with a standing condition note", () => {
    const guidance = getObservationGuidance({
      altitude: 30,
      apparentMagnitude: -1.46,
      kind: "point-source",
    });
    expect(guidance).toMatchObject({
      eligibleForCard: true,
      unaidedEligible: true,
    });
    expect(guidance.qualifier).toContain(LOCAL_CONDITIONS_NOTE);
  });

  it("does not treat an extended object as a point-source visibility promise", () => {
    expect(
      getObservationGuidance({
        altitude: 45,
        apparentMagnitude: 3.4,
        kind: "extended-object",
      }),
    ).toMatchObject({ eligibleForCard: true, unaidedEligible: false });
  });
});
