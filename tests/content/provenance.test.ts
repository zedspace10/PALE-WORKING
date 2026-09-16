import { describe, expect, it } from "vitest";

import {
  COSMIC_EVENTS,
  DEEP_TIME_CALENDAR,
  LOCATIONS,
  SHIFT_STAGES,
} from "@/constants/cosmicData";
import { TIME_MACHINE_EVENTS } from "@/constants/cosmicTimeMachine";
import { OBSERVATORY_ENTRIES } from "@/constants/observatory";
import {
  CanonicalClaim,
  ScientificItem,
  validateCanonicalClaims,
  validateScientificItems,
} from "@/constants/scientificContent";
import { STAR_CATALOG } from "@/constants/starCatalog";
import { FIXED_NOW } from "@/tests/fixtures";

const COLLECTIONS: [string, readonly ScientificItem[]][] = [
  ["locations", LOCATIONS],
  ["deep-time-calendar", DEEP_TIME_CALENDAR],
  ["cosmic-events", COSMIC_EVENTS],
  ["shift-stages", SHIFT_STAGES],
  ["time-machine", TIME_MACHINE_EVENTS],
  ["observatory", OBSERVATORY_ENTRIES],
  ["star-catalog", STAR_CATALOG],
];

const CANONICAL_CLAIMS: CanonicalClaim[] = [
  {
    itemId: "locations:andromeda",
    subject: "andromeda",
    property: "relationship-to-milky-way",
    value: "nearest-major-galaxy",
  },
  {
    itemId: "observatory:andromeda",
    subject: "andromeda",
    property: "relationship-to-milky-way",
    value: "nearest-major-galaxy",
  },
  {
    itemId: "observatory:betelgeuse",
    subject: "betelgeuse",
    property: "solar-system-size-wording",
    value: "uncertain-model-range",
  },
  {
    itemId: "tonight:betelgeuse",
    subject: "betelgeuse",
    property: "solar-system-size-wording",
    value: "uncertain-model-range",
  },
];

describe("scientific content provenance", () => {
  it.each(COLLECTIONS)("validates %s", (name, items) => {
    expect(validateScientificItems(name, items, FIXED_NOW)).toEqual([]);
  });

  it("reports the stable id for missing metadata", () => {
    const invalid = [{ id: "missing-meta" }] as unknown as ScientificItem[];
    expect(validateScientificItems("fixture", invalid, FIXED_NOW)).toContain(
      "fixture:missing-meta is missing scientific metadata",
    );
  });

  it("rejects expired dynamic content", () => {
    const expired: ScientificItem = {
      id: "old-mission-status",
      science: {
        classification: "dynamic",
        reviewedAt: "2025-01-01",
        reviewBy: "2025-12-31",
        sourceIds: ["nasaVoyager"],
      },
    };
    expect(validateScientificItems("fixture", [expired], FIXED_NOW)).toContain(
      "fixture:old-mission-status expired on 2025-12-31",
    );
  });

  it("keeps declared duplicate-subject values consistent", () => {
    expect(validateCanonicalClaims(CANONICAL_CLAIMS)).toEqual([]);
  });

  it("uses claim-specific sources for audited milestones", () => {
    expect(
      TIME_MACHINE_EVENTS.find((event) => event.id === "earth-forms")?.science
        .sourceIds,
    ).toContain("nasaMoonFormation");
    expect(
      TIME_MACHINE_EVENTS.find((event) => event.id === "first-life")?.science
        .sourceIds,
    ).toContain("nasaAstrobiologyStrategy");
    expect(
      DEEP_TIME_CALENDAR.find((event) => event.id === "dinosaurs")?.science
        .sourceIds,
    ).toContain("smithsonianDeepTime");
    expect(
      OBSERVATORY_ENTRIES.find((entry) => entry.id === "kepler-442b")?.science
        .sourceIds,
    ).toContain("nasaKepler442b");
    expect(
      COSMIC_EVENTS.find((event) => event.year === 2015)?.science.sourceIds,
    ).toContain("ligoFirstDetection");
    expect(
      COSMIC_EVENTS.find((event) => event.year === 2022)?.science.sourceIds,
    ).toContain("nasaWebbCarbonDioxide");
  });

  it("reports contradictory duplicate-subject values", () => {
    expect(
      validateCanonicalClaims([
        CANONICAL_CLAIMS[0],
        { ...CANONICAL_CLAIMS[1], value: "nearest-galaxy" },
      ]),
    ).toEqual([
      "observatory:andromeda contradicts locations:andromeda for andromeda:relationship-to-milky-way: nearest-galaxy != nearest-major-galaxy",
    ]);
  });
});
