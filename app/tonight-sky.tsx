import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Linking,
  type LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SkyStateIcon } from "@/components/SkyStateIcon";
import { StarField } from "@/components/StarField";
import {
  CONTENT_REVIEWED_AT,
  scientificMeta,
  ScientificItem,
  ScientificSourceId,
} from "@/constants/scientificContent";
import { findStarByAge } from "@/constants/starCatalog";
import { useBirthday } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import {
  formatLightTime,
  getPlanetPosition,
  PlanetId,
} from "@/constants/planets";
import {
  equatorialToHorizontal,
  getMoonIllumination,
  getMoonPhaseFraction,
  getMoonPosition,
} from "@/constants/astronomy";
import {
  LOCATION_CACHE_KEY,
  parseCachedLocation,
  serializeCachedLocation,
  withTimeout,
} from "@/constants/location";
import {
  classifySolarAltitude,
  findEveningSolarCrossing,
  getSolarAltitude,
  SOLAR_STATE_LABELS,
  SolarCrossingResult,
  SolarState,
} from "@/constants/solar";
import { resolveSkyLocation } from "@/constants/skyLocation";
import {
  getObservationGuidance,
  LOCAL_CONDITIONS_NOTE,
  ObservingObjectKind,
} from "@/constants/visibility";

const GOLD = "#8DEBFF";
const WARM_WHITE = "#F5FAFF";
const BLUE_GREY = "#A7B6C6";

type NightObjectType =
  "moon" | "planet" | "star" | "constellation" | "galaxy" | "satellite";

interface NightObject extends ScientificItem {
  id: string;
  name: string;
  type: NightObjectType;
  /** Stars and deep sky objects only. Planets are computed, see PLANET_IDS. */
  ra?: number;
  dec?: number;
  color: string;
  truth: string;
  wonder: string;
  instruction: string;
  apparentMagnitude?: number;
  observingKind?: ObservingObjectKind;
  opticalAid?: "binoculars" | "telescope";
  alt?: number;
  az?: number;
}

type NightObjectSeed = Omit<NightObject, "alt" | "az" | "science">;

const NIGHT_OBJECTS_BASE: NightObjectSeed[] = [
  {
    id: "moon",
    name: "The Moon",
    type: "moon",
    color: "#E8E0D0",
    truth:
      "Lunar laser measurements show the Moon is currently receding from Earth by about 3.8 centimetres per year. That rate has changed over geological time.",
    wonder:
      "People across cultures have watched the Moon throughout recorded history.",
    instruction:
      "If it is above your horizon, look for the Moon along the direction shown. Its phase changes how easy it is to find.",
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    color: "#FFF8DC",
    truth:
      "Venus is the brightest planet in Earth's sky and, under very dark conditions, can cast faint shadows.",
    wonder:
      "What you are seeing is sunlight that bounced off Venus and carried on to your eyes.",
    instruction:
      "Look in the indicated direction for an exceptionally bright, steady planet. Other bright objects can be present too.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    color: "#C88B3A",
    truth:
      "Jupiter and the Sun both orbit their common barycentre. Because Jupiter is so massive, that point can lie just outside the Sun's surface.",
    wonder:
      "You are not seeing Jupiter as it is. You are seeing it as it was when the light set off.",
    instruction:
      "Look for the indicated bright point. Planets usually appear steadier than stars, though atmospheric turbulence near the horizon can still make them shimmer.",
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    color: "#E4D191",
    truth:
      "Saturn's rings are 282,000 kilometres wide but only about 10 metres thick. If Saturn were the size of a basketball, its rings would be thinner than a sheet of paper.",
    wonder:
      "The light reaching you from Saturn set off while you were doing something else entirely.",
    instruction:
      "Look for the indicated pale-gold point. It usually appears steadier than nearby stars when well above the horizon.",
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    color: "#C1440E",
    truth:
      "Robotic missions have explored Mars from orbit and on the surface. Perseverance has studied rocks in Jezero Crater and cached samples intended for possible future analysis.",
    wonder:
      "Mars has the largest volcano in the solar system — Olympus Mons, three times taller than Everest.",
    instruction:
      "Mars has a distinctive reddish tint. It doesn't twinkle like stars do.",
  },
  {
    id: "sirius",
    name: "Sirius",
    ra: 101.3,
    dec: -16.7,
    type: "star",
    color: "#B0C4DE",
    truth:
      "Sirius is roughly 8.6 light-years away. The light arriving from it began its journey about 8.6 years earlier, so every view is of its past.",
    wonder:
      "Sirius is the brightest star in Earth's night sky by apparent magnitude.",
    instruction:
      "The brightest star in the sky. Look for the one that sparkles with blue-white light.",
  },
  {
    id: "orion",
    name: "Orion",
    ra: 83,
    dec: 5,
    type: "constellation",
    color: "#E8F0FF",
    truth:
      "The three stars in Orion's belt are roughly 1,200 to 2,000 light-years away by current estimates. They are not physically adjacent; they appear aligned from our vantage point.",
    wonder:
      "Many cultures have recognised patterns in these stars, often telling very different stories about the same part of the sky.",
    instruction:
      "Look for three stars in a straight line. That's Orion's belt — one of the most recognisable patterns in the sky.",
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    ra: 88.8,
    dec: 7.4,
    type: "star",
    color: "#FF6B35",
    truth:
      "Betelgeuse is a red supergiant large enough to engulf the inner planets if placed at the centre of our Solar System. Its exact radius is difficult to define and published estimates vary.",
    wonder:
      "Betelgeuse varies in brightness and sheds material into space. Models agree it is enormous, but not on one exact boundary for its extended atmosphere.",
    instruction:
      "Find the reddish-orange star in Orion's shoulder. That's Betelgeuse.",
  },
  {
    id: "vega",
    name: "Vega",
    ra: 279.2,
    dec: 38.8,
    type: "star",
    color: "#E8F0FF",
    truth:
      "Vega is 25 light-years away. Due to Earth's axial precession, Vega will become the North Star in approximately 12,000 years. The night sky is always slowly changing.",
    wonder:
      "Carl Sagan chose Vega as the fictional source of the signal in his novel Contact. The literary choice is not evidence of a planet or civilisation there.",
    instruction:
      "Vega is one of the brightest stars in the summer sky. Look for a brilliant blue-white point high overhead.",
  },
  {
    id: "arcturus",
    name: "Arcturus",
    ra: 213.9,
    dec: 19.2,
    type: "star",
    color: "#FFB347",
    truth:
      "Arcturus is about 37 light-years away and has a comparatively large motion through the sky relative to the Sun.",
    wonder:
      "Its warm orange appearance comes from a cooler surface temperature than the Sun's, not from a nearby fire-like glow.",
    instruction:
      "Follow the curve of the Big Dipper's handle and it will arc to Arcturus — a warm orange star.",
  },
  {
    id: "milkyway",
    name: "The Milky Way",
    ra: 266,
    dec: -29,
    type: "galaxy",
    color: "#9966cc",
    truth:
      "The pale band is the combined light of vast numbers of unresolved stars, mixed with dark dust, as we look through the Milky Way's disk from inside it. The galaxy as a whole is estimated to contain roughly 100 to 400 billion stars.",
    wonder:
      "The Milky Way core is best seen from June to September in the northern hemisphere. The band of light you see is our galaxy seen edge-on from within.",
    instruction:
      "Find the darkest part of the sky and look for a faint band of light stretching across it. Let your eyes fully adjust — it takes 20 minutes.",
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    ra: 10,
    dec: 60,
    type: "constellation",
    color: "#E8F0FF",
    truth:
      "Near Cassiopeia lies the Double Cluster, which is physically in the neighbouring constellation Perseus. Under a dark sky it can appear as a faint patch to unaided eyes and resolves into many stars with binoculars.",
    wonder:
      "From many northern latitudes Cassiopeia is circumpolar, remaining above the horizon through the night, although weather and daylight often hide it.",
    instruction: "Look for a distinctive W or M shape near the North Star.",
  },
  {
    id: "ursamajor",
    name: "The Big Dipper",
    ra: 165,
    dec: 57,
    type: "constellation",
    color: "#E8F0FF",
    truth:
      "Five of the seven stars in the Big Dipper are moving through space together — they were born from the same cloud of gas and are travelling in the same direction. They will eventually drift apart over millions of years.",
    wonder:
      "The two stars at the end of the Big Dipper's bowl form a useful guide toward Polaris. Northern navigators have long used the surrounding sky for orientation.",
    instruction:
      "The Big Dipper is one of the most recognisable patterns in the northern sky. Look for seven stars in the shape of a ladle.",
  },
  {
    id: "polaris",
    name: "Polaris — The North Star",
    ra: 37.9,
    dec: 89.3,
    type: "star",
    color: "#F0F8FF",
    truth:
      "Polaris appears nearly fixed because it lies less than a degree from the north celestial pole. Other northern stars trace apparent arcs around that pole over a night.",
    wonder:
      "Polaris has long been used for northern navigation. It traces a small circle around the celestial pole rather than remaining perfectly fixed.",
    instruction:
      "Find the North Star by following the two stars at the end of the Big Dipper's bowl — they point directly to Polaris.",
  },
  {
    id: "scorpius",
    name: "Scorpius",
    ra: 252,
    dec: -26,
    type: "constellation",
    color: "#FF6B35",
    truth:
      "The heart of Scorpius is Antares — a red supergiant so large that if it replaced our Sun, it would swallow Mercury, Venus, Earth and Mars.",
    wonder:
      "Scorpius and Orion occupy nearly opposite parts of the sky, so one is usually prominent when the other is not. Near seasonal transitions, parts of both can briefly be above opposite horizons.",
    instruction:
      "Scorpius is best placed during Southern Hemisphere winter evenings. Look for a curved line of stars with the reddish star Antares near its heart.",
  },
];

const NIGHT_OBJECT_SOURCES: Partial<
  Record<string, readonly [ScientificSourceId, ...ScientificSourceId[]]>
> = {
  moon: ["nasaMoonFacts", "nasaMoonPhases"],
  venus: ["nasaSolarSystem"],
  jupiter: ["nasaBarycenter"],
  saturn: ["nasaSolarSystem"],
  mars: ["nasaSolarSystem"],
  betelgeuse: ["nasaBetelgeuse"],
  milkyway: ["nasaMilkyWay"],
  cassiopeia: ["nasaDoubleCluster"],
};

function getNightObjectSources(
  object: NightObjectSeed,
): readonly [ScientificSourceId, ...ScientificSourceId[]] {
  const specific = NIGHT_OBJECT_SOURCES[object.id];
  if (specific) return specific;
  if (object.type === "planet") return ["nasaSolarSystem"];
  if (object.type === "star" || object.type === "constellation")
    return ["nasaStars"];
  if (object.type === "galaxy") return ["nasaMilkyWay"];
  return ["nasaUniverseOverview"];
}

const NIGHT_OBJECT_OBSERVING: Record<
  string,
  Pick<NightObject, "apparentMagnitude" | "observingKind" | "opticalAid">
> = {
  moon: { apparentMagnitude: -12.7, observingKind: "moon" },
  venus: { apparentMagnitude: -4, observingKind: "planet" },
  jupiter: { apparentMagnitude: -2, observingKind: "planet" },
  saturn: { apparentMagnitude: 1, observingKind: "planet" },
  mars: { apparentMagnitude: 1.5, observingKind: "planet" },
  sirius: { apparentMagnitude: -1.46, observingKind: "point-source" },
  orion: { observingKind: "constellation" },
  betelgeuse: { apparentMagnitude: 0.5, observingKind: "point-source" },
  vega: { apparentMagnitude: 0.03, observingKind: "point-source" },
  arcturus: { apparentMagnitude: -0.05, observingKind: "point-source" },
  milkyway: { observingKind: "extended-object" },
  cassiopeia: { observingKind: "constellation" },
  ursamajor: { observingKind: "constellation" },
  polaris: { apparentMagnitude: 1.98, observingKind: "point-source" },
  scorpius: { observingKind: "constellation" },
};

const NIGHT_OBJECTS: Omit<NightObject, "alt" | "az">[] = NIGHT_OBJECTS_BASE.map(
  (object) => ({
    ...object,
    ...NIGHT_OBJECT_OBSERVING[object.id],
    science: scientificMeta({
      classification: "estimate",
      reviewedAt: CONTENT_REVIEWED_AT,
      sourceIds: getNightObjectSources(object),
      precisionNote:
        "Sky positions are approximate and visibility depends on local conditions.",
    }),
  }),
);

const OBJECT_PRIORITY_ORDER = [
  "moon",
  "venus",
  "jupiter",
  "saturn",
  "mars",
  "sirius",
  "betelgeuse",
  "vega",
  "arcturus",
  "orion",
  "ursamajor",
  "cassiopeia",
  "polaris",
  "scorpius",
  "milkyway",
];

const CATALOG_STAR_COORDS: Record<string, { ra: number; dec: number }> = {
  "Proxima Centauri": { ra: 217.4, dec: -62.7 },
  "Alpha Centauri": { ra: 219.9, dec: -60.8 },
  "Barnard's Star": { ra: 269.5, dec: 4.7 },
  Sirius: { ra: 101.3, dec: -16.7 },
  "Epsilon Eridani": { ra: 53.2, dec: -9.5 },
  Procyon: { ra: 114.8, dec: 5.2 },
  "Tau Ceti": { ra: 26.0, dec: -15.9 },
  Altair: { ra: 297.7, dec: 8.9 },
  Vega: { ra: 279.2, dec: 38.8 },
  Fomalhaut: { ra: 344.4, dec: -29.6 },
  Pollux: { ra: 116.3, dec: 28.0 },
  Arcturus: { ra: 213.9, dec: 19.2 },
  Capella: { ra: 79.2, dec: 46.0 },
  Castor: { ra: 113.6, dec: 31.9 },
  Caph: { ra: 2.3, dec: 59.1 },
  Deneb: { ra: 310.4, dec: 45.3 },
  Rigel: { ra: 78.6, dec: -8.2 },
  Betelgeuse: { ra: 88.8, dec: 7.4 },
  Aldebaran: { ra: 68.9, dec: 16.5 },
  Spica: { ra: 201.3, dec: -11.2 },
  Antares: { ra: 247.4, dec: -26.4 },
  Regulus: { ra: 152.1, dec: 11.9 },
  Adhara: { ra: 104.7, dec: -28.9 },
  Shaula: { ra: 263.4, dec: -37.1 },
  Canopus: { ra: 95.9, dec: -52.7 },
  Hadar: { ra: 210.9, dec: -60.4 },
  Acrux: { ra: 186.6, dec: -63.1 },
  Mimosa: { ra: 191.9, dec: -59.7 },
  Achernar: { ra: 24.4, dec: -57.2 },
  Polaris: { ra: 37.9, dec: 89.3 },
};

function azToCompass(az: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(az / 45) % 8];
}

function altToLabel(alt: number): string {
  if (alt < 20) return "low on the horizon";
  if (alt < 35) return "rising";
  if (alt < 60) return "in the mid sky";
  if (alt < 80) return "high overhead";
  return "nearly overhead";
}

const CONSTELLATION_DOTS: Record<string, { x: number; y: number }[]> = {
  orion: [
    { x: 0.3, y: 0.25 },
    { x: 0.7, y: 0.25 },
    { x: 0.35, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.65, y: 0.5 },
    { x: 0.7, y: 0.8 },
    { x: 0.3, y: 0.8 },
  ],
  orion_lines: [],
  cassiopeia: [
    { x: 0.1, y: 0.5 },
    { x: 0.3, y: 0.2 },
    { x: 0.5, y: 0.5 },
    { x: 0.7, y: 0.2 },
    { x: 0.9, y: 0.5 },
  ],
  ursamajor: [
    { x: 0.1, y: 0.2 },
    { x: 0.22, y: 0.35 },
    { x: 0.38, y: 0.42 },
    { x: 0.5, y: 0.3 },
    { x: 0.65, y: 0.3 },
    { x: 0.65, y: 0.5 },
    { x: 0.5, y: 0.5 },
  ],
  scorpius: [
    { x: 0.2, y: 0.15 },
    { x: 0.35, y: 0.12 },
    { x: 0.5, y: 0.2 },
    { x: 0.5, y: 0.38 },
    { x: 0.55, y: 0.52 },
    { x: 0.6, y: 0.65 },
    { x: 0.65, y: 0.78 },
    { x: 0.72, y: 0.85 },
    { x: 0.8, y: 0.78 },
  ],
};

const CONSTELLATION_LINE_INDICES: Record<string, [number, number][]> = {
  orion: [
    [0, 2],
    [1, 4],
    [2, 3],
    [3, 4],
    [4, 1],
    [5, 4],
    [6, 2],
  ],
  cassiopeia: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ],
  ursamajor: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 3],
  ],
  scorpius: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
  ],
};

interface VisibleObject extends NightObject {
  alt: number;
  az: number;
  visibilityQualifier: string;
  unaidedEligible: boolean;
  isPersonalStar?: boolean;
  personalStarDistance?: number;
  personalStarDepartureYear?: number;
}

interface NightSkyState {
  status:
    "loading" | "denied" | "unavailable" | "ready-current" | "ready-cached";
  objects: VisibleObject[];
  moonIllumination: number;
  moonPhase: number;
  solarAlt: number;
  solarState: SolarState;
  darkness: SolarCrossingResult | null;
  lat: number | null;
  lng: number | null;
  calculatedAt: Date;
}

const LOCATION_REQUEST_TIMEOUT_MS = 10000;

function computeVisibleObjects(
  lat: number,
  lng: number,
  date: Date,
): { objects: NightObject[]; moonIllumination: number; moonPhase: number } {
  const moonIllum = getMoonIllumination(date);
  const moonPhase = getMoonPhaseFraction(date);
  const moonPos = getMoonPosition(date);
  const moonAltAz = equatorialToHorizontal(moonPos, { lat, lng }, date);

  const visible: VisibleObject[] = [];

  if (moonAltAz.alt > 10 && moonIllum > 0.1) {
    const object = NIGHT_OBJECTS.find(
      (candidate) => candidate.id === "moon",
    ) as NightObject;
    const guidance = getObservationGuidance({
      altitude: moonAltAz.alt,
      apparentMagnitude: object.apparentMagnitude,
      kind: object.observingKind ?? "moon",
    });
    visible.push({
      ...object,
      alt: moonAltAz.alt,
      az: moonAltAz.az,
      visibilityQualifier: guidance.qualifier,
      unaidedEligible: guidance.unaidedEligible,
    });
  }

  for (const obj of NIGHT_OBJECTS) {
    if (obj.id === "moon") continue;

    // Planets move, so their position is computed for this moment rather
    // than stored. Their light travel time changes with it.
    if (obj.type === "planet") {
      const pos = getPlanetPosition(obj.id as PlanetId, date);
      const { alt, az } = equatorialToHorizontal(pos, { lat, lng }, date);
      if (alt > 10) {
        const guidance = getObservationGuidance({
          altitude: alt,
          apparentMagnitude: obj.apparentMagnitude,
          kind: obj.observingKind ?? "planet",
        });
        visible.push({
          ...obj,
          alt,
          az,
          wonder: `${obj.wonder} Right now its light takes ${formatLightTime(
            pos.lightMinutes,
          )} to reach you.`,
          visibilityQualifier: guidance.qualifier,
          unaidedEligible: guidance.unaidedEligible,
        });
      }
      continue;
    }

    if (!obj.ra || obj.dec === undefined) continue;
    const { alt, az } = equatorialToHorizontal(
      { ra: obj.ra, dec: obj.dec },
      { lat, lng },
      date,
    );
    if (alt > 10) {
      const guidance = getObservationGuidance({
        altitude: alt,
        apparentMagnitude: obj.apparentMagnitude,
        kind:
          obj.observingKind ??
          (obj.type === "constellation" ? "constellation" : "point-source"),
        opticalAid: obj.opticalAid,
      });
      visible.push({
        ...obj,
        alt,
        az,
        visibilityQualifier: guidance.qualifier,
        unaidedEligible: guidance.unaidedEligible,
      });
    }
  }

  visible.sort((a, b) => {
    const ai = OBJECT_PRIORITY_ORDER.indexOf(a.id);
    const bi = OBJECT_PRIORITY_ORDER.indexOf(b.id);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return { objects: visible, moonIllumination: moonIllum, moonPhase };
}

function CompassIndicator({
  az,
  alt,
  color,
}: {
  az: number;
  alt: number;
  color: string;
}) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const activeDir = ((Math.round(az / 45) % 8) + 8) % 8;
  const directionLabel = dirs[activeDir];
  const heightLabel = altToLabel(alt);

  return (
    <View
      accessible
      accessibilityLabel={`Estimated direction ${directionLabel}, ${heightLabel}`}
      style={styles.compassPanel}
      testID="sky-compass-indicator"
    >
      <View style={styles.compassHeader}>
        <Text style={styles.compassCaption}>DIRECTION</Text>
        <Text style={styles.compassReadout}>
          {directionLabel} · {heightLabel}
        </Text>
      </View>
      <View style={styles.compassRow}>
        <View style={styles.compassDirs}>
          {dirs.map((direction, index) => (
            <Text
              key={direction}
              style={[
                styles.compassDir,
                index === activeDir && styles.compassDirActive,
                {
                  backgroundColor:
                    index === activeDir ? color + "18" : "transparent",
                  color: index === activeDir ? color : "rgba(167,182,198,0.35)",
                  fontFamily:
                    index === activeDir ? "Inter_700Bold" : "Inter_400Regular",
                },
              ]}
            >
              {direction}
            </Text>
          ))}
        </View>
        <View style={styles.elevBar}>
          <View
            style={[
              styles.elevDot,
              {
                bottom:
                  `${Math.min(90, Math.max(0, alt))}%` as unknown as number,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

function MoonVisual({ phase, size }: { phase: number; size: number }) {
  const r = size / 2;
  const lit = phase < 0.5 ? 1 - phase * 2 : (phase - 0.5) * 2;
  const waning = phase > 0.5;
  const rx = Math.abs(lit - 0.5) * 2 * r;
  const d = waning
    ? `M ${r},0 A ${r},${r} 0 0,0 ${r},${size} A ${rx},${r} 0 0,1 ${r},0`
    : `M ${r},0 A ${r},${r} 0 0,1 ${r},${size} A ${rx},${r} 0 0,0 ${r},0`;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="mg" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#F0E8D8" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#E8E0D0" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r * 1.8} fill="url(#mg)" />
      <Circle cx={r} cy={r} r={r} fill="#1a1a2e" />
      <Path d={d} fill="#E8E0D0" opacity="0.9" />
    </Svg>
  );
}

function ConstellationVisual({
  id,
  color,
  size,
}: {
  id: string;
  color: string;
  size: number;
}) {
  const key = id === "ursamajor" ? "ursamajor" : id;
  const dots = CONSTELLATION_DOTS[key] ?? CONSTELLATION_DOTS.orion;
  const lines =
    CONSTELLATION_LINE_INDICES[key] ?? CONSTELLATION_LINE_INDICES.orion;
  return (
    <Svg width={size} height={size}>
      {lines.map(([a, b], i) => {
        const p1 = dots[a];
        const p2 = dots[b];
        if (!p1 || !p2) return null;
        return (
          <Line
            key={i}
            x1={p1.x * size}
            y1={p1.y * size}
            x2={p2.x * size}
            y2={p2.y * size}
            stroke={color}
            strokeWidth={0.5}
            opacity={0.25}
          />
        );
      })}
      {dots.map((pt, i) => (
        <G key={i}>
          <Circle
            cx={pt.x * size}
            cy={pt.y * size}
            r={4}
            fill={color}
            opacity={0.15}
          />
          <Circle
            cx={pt.x * size}
            cy={pt.y * size}
            r={1.5}
            fill={color}
            opacity={0.9}
          />
        </G>
      ))}
    </Svg>
  );
}

function GalaxyVisual({ size }: { size: number }) {
  const c = size / 2;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="gal" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <Stop offset="30%" stopColor="#9966cc" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="#9966cc" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={c} cy={c} r={c} fill="url(#gal)" />
    </Svg>
  );
}

function StarPlanetVisual({ color, size }: { color: string; size: number }) {
  const c = size / 2;
  const glowId = `sg${color.replace("#", "")}`;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="40%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={c} cy={c} r={c} fill={`url(#${glowId})`} />
      <Circle cx={c} cy={c} r={c * 0.18} fill={color} opacity={0.95} />
      <Circle
        cx={c * 0.88}
        cy={c * 0.82}
        r={c * 0.04}
        fill="#ffffff"
        opacity={0.7}
      />
    </Svg>
  );
}

function ObjectVisual({
  obj,
  moonPhase,
  size = 160,
}: {
  obj: VisibleObject;
  moonPhase: number;
  size?: number;
}) {
  if (obj.type === "moon") return <MoonVisual phase={moonPhase} size={size} />;
  if (obj.type === "constellation")
    return <ConstellationVisual id={obj.id} color={obj.color} size={size} />;
  if (obj.type === "galaxy") return <GalaxyVisual size={size} />;
  return <StarPlanetVisual color={obj.color} size={size} />;
}

interface CardProps {
  bottomPadding: number;
  pageWidth: number;
  obj: VisibleObject;
  moonPhase: number;
  moonIllumination: number;
  isAfterMidnight: boolean;
  isFullMoon: boolean;
  isNewMoon: boolean;
}

function ObjectCard({
  bottomPadding,
  pageWidth,
  obj,
  moonPhase,
  moonIllumination,
  isAfterMidnight,
  isFullMoon,
  isNewMoon,
}: CardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
    return () => {
      fadeAnim.setValue(0);
    };
  }, [obj.id, fadeAnim]);

  const dirLabel = obj.az !== undefined ? azToCompass(obj.az) : "—";
  const heightLabel = obj.alt !== undefined ? altToLabel(obj.alt) : "—";
  const isTimeless = obj.type === "star" || obj.type === "constellation";

  return (
    <Animated.ScrollView
      bounces={false}
      contentContainerStyle={[
        styles.card,
        { paddingBottom: bottomPadding + 82 },
      ]}
      nestedScrollEnabled
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      style={[styles.cardPage, { opacity: fadeAnim, width: pageWidth }]}
    >
      {obj.isPersonalStar && (
        <View style={styles.personalBadge}>
          <Text style={styles.personalBadgeText}>
            AGE–DISTANCE MATCH · DIRECTION ESTIMATE
          </Text>
        </View>
      )}

      <View style={styles.visualSection}>
        <ObjectVisual obj={obj} moonPhase={moonPhase} size={160} />
        <Text style={styles.objectName}>{obj.name.toUpperCase()}</Text>

        {obj.type === "moon" && (
          <Text style={styles.moonNote}>
            {isFullMoon
              ? "Moon appears nearly full · Brighter sky while it is up"
              : isNewMoon
                ? "Moon is near its new phase"
                : `${Math.round(moonIllumination * 100)}% illuminated`}
          </Text>
        )}
      </View>

      <View style={styles.truthSection}>
        {isAfterMidnight && (
          <Text style={styles.midnightNote}>
            You're up late.{"\n"}So is {obj.name}.
          </Text>
        )}
        <Text style={styles.truth}>{obj.truth}</Text>
        <Text style={styles.wonder}>{obj.wonder}</Text>
      </View>

      <View style={styles.inviteSection}>
        <View style={styles.separator} />
        <Text style={styles.direction}>
          Estimated direction: {dirLabel} · {heightLabel}
        </Text>
        <Text style={styles.instruction}>{obj.instruction}</Text>
        <Text style={styles.conditionNote}>{obj.visibilityQualifier}</Text>
        {obj.isPersonalStar &&
          obj.personalStarDistance !== undefined &&
          obj.personalStarDepartureYear !== undefined && (
            <Text style={styles.personalLine}>
              This is a storytelling match: its rounded distance in light-years
              is closest to your age in years, not a physical or astrological
              link.{"\n"}
              Light arriving around now left {obj.name} around{" "}
              {obj.personalStarDepartureYear}.{"\n"}
              {obj.unaidedEligible
                ? "It may be visible unaided in good conditions."
                : "Use the optical-aid guidance above."}
            </Text>
          )}
        <Text style={styles.goOutside}>
          If conditions allow, use the estimated direction above.
        </Text>
        {isTimeless && (
          <Text style={styles.eternityLine}>
            People have watched this part of the sky across many generations.
          </Text>
        )}
      </View>
    </Animated.ScrollView>
  );
}

function EndCard({
  bottomPadding,
  pageWidth,
}: {
  bottomPadding: number;
  pageWidth: number;
}) {
  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={[
        styles.card,
        styles.endCard,
        { paddingBottom: bottomPadding + 82 },
      ]}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      style={[styles.cardPage, { width: pageWidth }]}
    >
      <Text style={styles.endText}>And behind all of this —</Text>
      <Text style={styles.endText}>
        hundreds of billions of galaxies — perhaps more.
      </Text>
      <Text style={[styles.endSub, { marginTop: 24 }]}>
        Some are tiny dwarfs; others contain hundreds of billions of stars.
      </Text>
      <Text style={styles.endSub}>
        The sky you're looking at tonight is the smallest possible fraction of
        what exists.
      </Text>
    </ScrollView>
  );
}

function LocationStateScreen({
  denied,
  onRetry,
}: {
  denied: boolean;
  onRetry: () => void;
}) {
  const colors = useColors();
  const router = useRouter();
  return (
    <View style={[styles.fullCenter, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.3} />
      <TouchableOpacity
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={{
          position: "absolute",
          top: 60,
          left: 24,
          zIndex: 200,
          padding: 12,
        }}
      >
        <Text style={{ color: colors.primary, fontSize: 22 }}>←</Text>
      </TouchableOpacity>
      <View style={styles.deniedContent}>
        <Text style={styles.deniedMain}>
          We don't know where you are tonight.
        </Text>
        <Text style={styles.deniedSub}>
          {denied
            ? "Location permission is off, so PALE will not guess your sky from another city."
            : "Your current location could not be read and there is no fresh, valid cached location."}
        </Text>
        <TouchableOpacity
          onPress={denied ? () => Linking.openSettings() : onRetry}
          style={styles.retryButton}
          accessibilityRole="button"
          accessibilityLabel={
            denied ? "Open location settings" : "Try location again"
          }
        >
          <Text style={styles.retryText}>
            {denied ? "OPEN SETTINGS" : "TRY AGAIN"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DaylightScreen({
  solarState,
  darkness,
  now,
}: {
  solarState: SolarState;
  darkness: SolarCrossingResult | null;
  now: Date;
}) {
  const colors = useColors();
  const router = useRouter();
  const duskLine = (() => {
    if (!darkness) return "Astronomical-darkness timing is unavailable.";
    if (darkness.kind === "always-above") {
      return "The Sun does not reach astronomical darkness on this local date.";
    }
    if (darkness.kind === "always-below") {
      return "The Sun remains below the astronomical-darkness threshold on this local date.";
    }
    if (darkness.kind === "no-evening-crossing") {
      return "There is no evening astronomical-darkness crossing on this local date.";
    }
    const mins = Math.round((darkness.at.getTime() - now.getTime()) / 60000);
    const at = darkness.at.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (mins <= 0) return "Astronomical darkness is arriving around now.";
    if (mins < 60)
      return `Astronomical darkness begins around ${at}, in about ${mins} minutes.`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const gap = m === 0 ? `${h} ${h === 1 ? "hour" : "hours"}` : `${h}h ${m}m`;
    return `Astronomical darkness begins around ${at}, in about ${gap}.`;
  })();
  return (
    <View style={[styles.fullCenter, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.15} />
      <TouchableOpacity
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={{
          position: "absolute",
          top: 60,
          left: 24,
          zIndex: 200,
          padding: 12,
        }}
      >
        <Text style={{ color: colors.primary, fontSize: 22 }}>←</Text>
      </TouchableOpacity>
      <View style={styles.deniedContent}>
        <SkyStateIcon state={solarState} size={148} />
        <Text style={styles.skyStateLabel}>
          {SOLAR_STATE_LABELS[solarState]}
        </Text>
        <Text style={[styles.timeText]}>
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Text style={styles.deniedSub}>{duskLine}</Text>
        <Text style={[styles.deniedSub, { marginTop: 16 }]}>
          Bright objects may be detectable before astronomical darkness, but the
          Sun's light reduces contrast. Local conditions still matter.
        </Text>
      </View>
    </View>
  );
}

export default function TonightSkyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { birthday } = useBirthday();
  const reduceMotion = useReducedMotion();
  const [retryToken, setRetryToken] = useState(0);

  const [state, setState] = useState<NightSkyState>({
    status: "loading",
    objects: [],
    moonIllumination: 0,
    moonPhase: 0,
    solarAlt: -20,
    solarState: "astronomical-darkness",
    darkness: null,
    lat: null,
    lng: null,
    calculatedAt: new Date(),
  });
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const [pagerWidth, setPagerWidth] = useState(0);
  const scrollRef = useRef<ScrollView | undefined>(undefined);
  const fadeIn = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const personalStarCard = useMemo((): VisibleObject | null => {
    if (!birthday || state.lat === null || state.lng === null) return null;
    const ageYears =
      (state.calculatedAt.getTime() - birthday.getTime()) / (365.25 * 86400000);
    const star = findStarByAge(ageYears);
    if (!star) return null;
    const coords = CATALOG_STAR_COORDS[star.name];
    if (!coords) return null;
    const { alt, az } = equatorialToHorizontal(
      coords,
      { lat: state.lat, lng: state.lng },
      state.calculatedAt,
    );
    if (alt <= 10) return null;
    const guidance = getObservationGuidance({
      altitude: alt,
      apparentMagnitude: star.apparentMagnitude,
      kind: "point-source",
      opticalAid:
        star.apparentMagnitude === undefined || star.apparentMagnitude > 8
          ? "telescope"
          : "binoculars",
    });
    if (!guidance.eligibleForCard) return null;
    const departureYear =
      state.calculatedAt.getFullYear() - Math.round(star.distance);
    return {
      id: `personal_${star.name}`,
      name: star.name,
      type: "star",
      ra: coords.ra,
      dec: coords.dec,
      color: GOLD,
      truth: star.note,
      wonder: `This star is ${star.distance} light-years away. Light reaching Earth around now began its journey around ${departureYear}.`,
      instruction: `Estimated direction: ${azToCompass(az)} · ${altToLabel(alt)}. The light has been travelling toward Earth for about ${Math.round(star.distance)} years.`,
      alt,
      az,
      isPersonalStar: true,
      personalStarDistance: star.distance,
      personalStarDepartureYear: departureYear,
      science: star.science,
      apparentMagnitude: star.apparentMagnitude,
      observingKind: "point-source",
      visibilityQualifier: guidance.qualifier,
      unaidedEligible: guidance.unaidedEligible,
    };
  }, [birthday, state.calculatedAt, state.lat, state.lng]);

  const computeAndSet = (
    lat: number,
    lng: number,
    source: "current" | "cached",
    now = new Date(),
  ) => {
    const solarAlt = getSolarAltitude(lat, lng, now);
    const { objects, moonIllumination, moonPhase } = computeVisibleObjects(
      lat,
      lng,
      now,
    );
    setState({
      status: source === "current" ? "ready-current" : "ready-cached",
      darkness: findEveningSolarCrossing(lat, lng, now),
      objects: objects as VisibleObject[],
      moonIllumination,
      moonPhase,
      solarAlt,
      solarState: classifySolarAltitude(solarAlt),
      lat,
      lng,
      calculatedAt: now,
    });
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    const startRefresh = (
      lat: number,
      lng: number,
      source: "current" | "cached",
    ) => {
      if (interval) clearInterval(interval);
      computeAndSet(lat, lng, source);
      interval = setInterval(
        () => computeAndSet(lat, lng, source, new Date()),
        5 * 60 * 1000,
      );
    };

    (async () => {
      setState((previous) => ({ ...previous, status: "loading" }));
      const cache = parseCachedLocation(
        await AsyncStorage.getItem(LOCATION_CACHE_KEY).catch(() => null),
        Date.now(),
      );
      try {
        const { status } = await withTimeout(
          Location.requestForegroundPermissionsAsync(),
          LOCATION_REQUEST_TIMEOUT_MS,
          "Location permission request timed out",
        );
        if (cancelled) return;
        if (status !== "granted") {
          const resolution = resolveSkyLocation("denied", null, cache);
          setState((previous) => ({ ...previous, status: resolution.status }));
          return;
        }

        let loc: Location.LocationObject;
        try {
          loc = await withTimeout(
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            }),
            LOCATION_REQUEST_TIMEOUT_MS,
            "Current location request timed out",
          );
        } catch {
          if (cancelled) return;
          const resolution = resolveSkyLocation("granted", null, cache);
          if (resolution.status === "ready-cached") {
            startRefresh(
              resolution.coordinates.lat,
              resolution.coordinates.lng,
              "cached",
            );
          } else {
            setState((previous) => ({
              ...previous,
              status: resolution.status,
            }));
          }
          return;
        }

        const resolution = resolveSkyLocation(
          "granted",
          { lat: loc.coords.latitude, lng: loc.coords.longitude },
          cache,
        );
        if (resolution.status !== "ready-current") {
          throw new Error("Device returned invalid coordinates");
        }
        const { lat, lng } = resolution.coordinates;
        const serialized = serializeCachedLocation({ lat, lng }, Date.now());
        try {
          await AsyncStorage.setItem(LOCATION_CACHE_KEY, serialized);
        } catch {}
        if (!cancelled) startRefresh(lat, lng, "current");
      } catch (err) {
        console.warn("Tonight sky location error:", err);
        if (cancelled) return;
        const resolution = resolveSkyLocation("granted", null, cache);
        if (resolution.status === "ready-cached") {
          startRefresh(
            resolution.coordinates.lat,
            resolution.coordinates.lng,
            "cached",
          );
        } else {
          setState((previous) => ({ ...previous, status: resolution.status }));
        }
      }
    })();

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [retryToken]);

  useEffect(() => {
    if (state.status === "ready-current" || state.status === "ready-cached") {
      if (reduceMotion) {
        fadeIn.setValue(1);
        return;
      }
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }
  }, [state.status, fadeIn, reduceMotion]);

  const allCards = useMemo(() => {
    const cards: VisibleObject[] = [...state.objects];
    if (personalStarCard && !cards.find((c) => c.id === personalStarCard.id)) {
      cards.splice(1, 0, personalStarCard);
    }
    return cards;
  }, [state.objects, personalStarCard]);

  const now = state.calculatedAt;
  const isAfterMidnight = now.getHours() < 4;
  const isFullMoon = state.moonIllumination > 0.9;
  const isNewMoon = state.moonIllumination < 0.05;
  const featuredObj = allCards[page];

  useEffect(() => {
    if (pagerWidth <= 0) return;
    scrollRef.current?.scrollTo({
      x: pageRef.current * pagerWidth,
      y: 0,
      animated: false,
    });
  }, [pagerWidth]);

  const updatePageForOffset = (offsetX: number) => {
    if (pagerWidth <= 0) return;
    const nextPage = Math.max(
      0,
      Math.min(allCards.length, Math.round(offsetX / pagerWidth)),
    );
    if (pageRef.current === nextPage) return;
    pageRef.current = nextPage;
    setPage(nextPage);
  };

  const handlePagerLayout = (event: LayoutChangeEvent) => {
    const measuredWidth = Math.round(event.nativeEvent.layout.width);
    if (measuredWidth <= 0) return;
    setPagerWidth((currentWidth) =>
      currentWidth === measuredWidth ? currentWidth : measuredWidth,
    );
  };

  if (state.status === "loading") {
    return (
      <View style={[styles.fullCenter, { backgroundColor: colors.background }]}>
        <StarField count={80} containerOpacity={0.4} />
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={{
            position: "absolute",
            top: topPad + 12,
            left: 24,
            zIndex: 200,
            padding: 12,
          }}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.loadingText}>Reading the sky…</Text>
      </View>
    );
  }

  if (state.status === "denied") {
    return (
      <LocationStateScreen
        denied
        onRetry={() => setRetryToken((value) => value + 1)}
      />
    );
  }
  if (state.status === "unavailable") {
    return (
      <LocationStateScreen
        denied={false}
        onRetry={() => setRetryToken((value) => value + 1)}
      />
    );
  }
  if (state.solarState === "daylight") {
    return (
      <DaylightScreen
        solarState={state.solarState}
        darkness={state.darkness}
        now={state.calculatedAt}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={120} containerOpacity={0.5} />

      {/* Back button always visible — outside fade animation */}
      <TouchableOpacity
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={{
          position: "absolute",
          top: topPad + 12,
          left: 24,
          zIndex: 200,
          padding: 12,
        }}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeIn }]}>
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <View style={styles.skyHeaderIcon}>
            <SkyStateIcon state={state.solarState} size={76} />
          </View>
          <Text style={styles.screenTitle}>TONIGHT'S SKY</Text>
          <Text style={styles.guidanceStatus}>
            {state.status === "ready-cached"
              ? "Using a recent last-known location · "
              : "Using current device location · "}
            {SOLAR_STATE_LABELS[state.solarState]}
          </Text>
          {state.solarState !== "astronomical-darkness" && (
            <Text style={styles.twilightNote}>
              Twilight reduces contrast; directions are estimates.{" "}
              {LOCAL_CONDITIONS_NOTE}
            </Text>
          )}
          {featuredObj &&
            featuredObj.az !== undefined &&
            featuredObj.alt !== undefined && (
              <CompassIndicator
                az={featuredObj.az}
                alt={featuredObj.alt}
                color={GOLD}
              />
            )}
        </View>

        <ScrollView
          ref={(r) => {
            scrollRef.current = r ?? undefined;
          }}
          horizontal
          pagingEnabled
          directionalLockEnabled
          showsHorizontalScrollIndicator={false}
          onLayout={handlePagerLayout}
          scrollEventThrottle={32}
          onScroll={(event) =>
            updatePageForOffset(event.nativeEvent.contentOffset.x)
          }
          onMomentumScrollEnd={(e) => {
            updatePageForOffset(e.nativeEvent.contentOffset.x);
          }}
          style={styles.pager}
        >
          {pagerWidth > 0 &&
            allCards.map((obj) => (
              <ObjectCard
                key={obj.id}
                bottomPadding={bottomPad}
                pageWidth={pagerWidth}
                obj={obj}
                moonPhase={state.moonPhase}
                moonIllumination={state.moonIllumination}
                isAfterMidnight={isAfterMidnight}
                isFullMoon={isFullMoon}
                isNewMoon={isNewMoon}
              />
            ))}
          {pagerWidth > 0 && (
            <EndCard bottomPadding={bottomPad} pageWidth={pagerWidth} />
          )}
        </ScrollView>

        <View style={[styles.dots, { bottom: bottomPad + 20 }]}>
          {[...allCards, { id: "_end" }].map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === page ? GOLD : "rgba(141,235,255,0.3)",
                  width: i === page ? 16 : 4,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 10,
    zIndex: 100,
    position: "relative",
  },
  backBtn: { padding: 4, alignSelf: "flex-start" },
  backText: {
    color: GOLD,
    fontSize: 22,
    fontFamily: "Inter_400Regular",
  },
  screenTitle: {
    color: WARM_WHITE,
    fontSize: 22,
    letterSpacing: 1.6,
    fontFamily: "Inter_700Bold",
  },
  guidanceStatus: {
    color: "rgba(245,250,255,0.65)",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  twilightNote: {
    color: "rgba(167,182,198,0.78)",
    fontSize: 11,
    lineHeight: 17,
    fontFamily: "Inter_400Regular",
  },
  compassPanel: {
    backgroundColor: "rgba(11,18,28,0.72)",
    borderColor: "rgba(53,99,122,0.58)",
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginTop: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  compassHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  compassCaption: {
    color: "rgba(167,182,198,0.62)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    letterSpacing: 1.8,
  },
  compassReadout: {
    color: WARM_WHITE,
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  compassRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  compassDirs: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  compassDir: {
    borderRadius: 6,
    fontSize: 9,
    letterSpacing: 0.5,
    minWidth: 24,
    paddingVertical: 3,
    textAlign: "center",
  },
  compassDirActive: {
    overflow: "hidden",
  },
  elevBar: {
    width: 2,
    height: 20,
    backgroundColor: "rgba(141,235,255,0.2)",
    borderRadius: 1,
    position: "relative",
  },
  elevDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    left: -1,
  },
  cardPage: {
    flex: 1,
  },
  pager: {
    flex: 1,
    width: "100%",
  },
  card: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 12,
    gap: 0,
  },
  endCard: {
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  visualSection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 14,
  },
  objectName: {
    color: GOLD,
    fontSize: 11,
    letterSpacing: 5,
    fontFamily: "Inter_600SemiBold",
  },
  moonNote: {
    color: "rgba(141,235,255,0.6)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  truthSection: {
    gap: 16,
    paddingVertical: 8,
  },
  midnightNote: {
    color: BLUE_GREY,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  truth: {
    color: WARM_WHITE,
    fontSize: 15,
    lineHeight: 26,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
  wonder: {
    color: "rgba(245,250,255,0.55)",
    fontSize: 13,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  inviteSection: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(141,235,255,0.15)",
    marginBottom: 4,
  },
  direction: {
    color: "rgba(141,235,255,0.7)",
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: "Inter_500Medium",
  },
  instruction: {
    color: "rgba(245,250,255,0.65)",
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },
  conditionNote: {
    color: "rgba(245,250,255,0.5)",
    fontSize: 11,
    lineHeight: 17,
    fontFamily: "Inter_400Regular",
  },
  personalLine: {
    color: GOLD,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  goOutside: {
    color: GOLD,
    fontSize: 14,
    letterSpacing: 3,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  eternityLine: {
    color: "rgba(169,149,255,0.52)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  personalBadge: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  personalBadgeText: {
    color: GOLD,
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: "Inter_600SemiBold",
  },
  dots: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  loadingText: {
    color: "rgba(141,235,255,0.5)",
    fontSize: 13,
    letterSpacing: 2,
    fontFamily: "Inter_400Regular",
  },
  deniedContent: {
    paddingHorizontal: 36,
    gap: 14,
    alignItems: "center",
    maxWidth: 560,
  },
  skyStateLabel: {
    color: WARM_WHITE,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
    textTransform: "capitalize",
  },
  skyHeaderIcon: { alignItems: "center", marginBottom: -2 },
  deniedMain: {
    color: WARM_WHITE,
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  deniedSub: {
    color: "rgba(245,250,255,0.55)",
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  retryButton: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryText: {
    color: GOLD,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "Inter_600SemiBold",
  },
  timeText: {
    color: GOLD,
    fontSize: 34,
    lineHeight: 42,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
  },
  endText: {
    color: WARM_WHITE,
    fontSize: 20,
    lineHeight: 32,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  endSub: {
    color: "rgba(245,250,255,0.5)",
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
});
