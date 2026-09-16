import type { ScientificContentMeta } from "@/constants/scientificContent";

const invalidClassification: ScientificContentMeta = {
  // @ts-expect-error invalid classifications must fail the type check
  classification: "certain",
  reviewedAt: "2026-09-16",
  sourceIds: ["nasaUniverseOverview"],
};

// @ts-expect-error dynamic claims require an explicit review-by date
const missingDynamicExpiry: ScientificContentMeta = {
  classification: "dynamic",
  reviewedAt: "2026-09-16",
  sourceIds: ["nasaUniverseOverview"],
};

void invalidClassification;
void missingDynamicExpiry;
