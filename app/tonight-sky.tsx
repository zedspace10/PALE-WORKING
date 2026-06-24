import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
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
import { StarField } from "@/components/StarField";
import { findStarByAge } from "@/constants/starCatalog";
import { useBirthday } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";

const { width: SW } = Dimensions.get("window");
const GOLD = "#C8A96E";
const WARM_WHITE = "#F5F0E8";
const BLUE_GREY = "#8B9BB4";

type NightObjectType = "moon" | "planet" | "star" | "constellation" | "galaxy" | "satellite";

interface NightObject {
  id: string;
  name: string;
  type: NightObjectType;
  ra?: number;
  dec?: number;
  color: string;
  truth: string;
  wonder: string;
  instruction: string;
  alt?: number;
  az?: number;
}

const NIGHT_OBJECTS: Omit<NightObject, "alt" | "az">[] = [
  {
    id: "moon",
    name: "The Moon",
    type: "moon",
    color: "#E8E0D0",
    truth:
      "The Moon is moving away from Earth at 3.8 centimetres per year — the same speed your fingernails grow. It has been doing this for 4.5 billion years.",
    wonder: "Every human who has ever lived has looked at this same Moon.",
    instruction:
      "Find the Moon tonight. It has been there every night of every human life ever lived.",
  },
  {
    id: "venus",
    name: "Venus",
    ra: 95,
    dec: 23,
    type: "planet",
    color: "#FFF8DC",
    truth:
      "Venus is the brightest object in the night sky after the Moon. It is so bright it can cast shadows. Ancient civilisations thought it was two different stars — the morning star and the evening star.",
    wonder:
      "What you're seeing is sunlight that left the Sun 6 minutes ago, bounced off Venus, and just arrived at your eyes.",
    instruction: "Look for the brightest point of light in the sky. That's Venus.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    ra: 68,
    dec: 22,
    type: "planet",
    color: "#C88B3A",
    truth:
      "Jupiter is so massive that it does not orbit the Sun. Both Jupiter and the Sun orbit a point called the barycentre — a point that lies just outside the Sun's surface.",
    wonder:
      "The light you're seeing left Jupiter 43 minutes ago. You are seeing Jupiter as it was 43 minutes in the past.",
    instruction: "Find the bright steady point that doesn't twinkle. That's Jupiter.",
  },
  {
    id: "saturn",
    name: "Saturn",
    ra: 350,
    dec: -7,
    type: "planet",
    color: "#E4D191",
    truth:
      "Saturn's rings are 282,000 kilometres wide but only about 10 metres thick. If Saturn were the size of a basketball, its rings would be thinner than a sheet of paper.",
    wonder: "The light reaching you from Saturn left it over an hour ago.",
    instruction: "Saturn doesn't twinkle. It shines with a steady golden light.",
  },
  {
    id: "mars",
    name: "Mars",
    ra: 130,
    dec: 18,
    type: "planet",
    color: "#C1440E",
    truth:
      "Right now there are active spacecraft on Mars. The Perseverance rover is driving across an ancient lake bed, collecting samples that may one day tell us if life existed there.",
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
      "Sirius is 8.6 light-years away. The light reaching your eyes right now left Sirius 8.6 years ago. You are not seeing Sirius as it is — you are seeing it as it was.",
    wonder:
      "Sirius is the brightest star in the night sky. Ancient Egyptians used its annual appearance to predict the flooding of the Nile.",
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
      "The three stars in Orion's belt are between 800 and 1,340 light-years away from Earth. They are not actually close to each other — they just appear aligned from our vantage point.",
    wonder:
      "Orion has been recognised as a figure by cultures on every inhabited continent. Every human civilisation that has ever existed looked up and saw the same pattern.",
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
      "Betelgeuse is so large that if it replaced our Sun, it would extend beyond the orbit of Jupiter. You could fit 700 million Suns inside it.",
    wonder:
      "Betelgeuse is one of the largest stars visible from Earth — so vast that if it replaced our Sun it would extend beyond the orbit of Jupiter. It has been shining steadily for millions of years and is one of the most remarkable objects in the night sky.",
    instruction: "Find the reddish-orange star in Orion's shoulder. That's Betelgeuse.",
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
      "Carl Sagan chose Vega as the source of the alien signal in his novel Contact. It was chosen because it is bright, close, and exactly the kind of star that could have planets.",
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
      "Arcturus is 37 light-years away and moving through the galaxy at an unusual angle to most other stars — it is a visitor from a different part of the Milky Way.",
    wonder:
      "The light from Arcturus was used to open the 1933 World's Fair in Chicago. Astronomers calculated that the light arriving at Earth that day had left Arcturus in 1893 — the year of the previous Chicago World's Fair.",
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
      "What you are seeing is not a cloud. It is 400 billion stars — so many and so distant that their individual light blurs into a band. You are looking at the plane of our galaxy from inside it.",
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
      "Cassiopeia contains several star clusters visible to the naked eye. One of them — the Double Cluster — contains over 300 young blue stars and is 7,000 light-years away.",
    wonder:
      "Cassiopeia is circumpolar from most of the northern hemisphere — it never sets below the horizon. It has been visible every single night from northern latitudes for all of human history.",
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
      "The two stars at the end of the Big Dipper's bowl always point toward the North Star. Sailors have used this for navigation for thousands of years.",
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
      "Polaris appears stationary because it sits almost exactly above Earth's North Pole. Every other star in the northern sky appears to rotate around it over the course of a night.",
    wonder:
      "Polaris has been used for navigation by sailors, travellers and explorers for thousands of years. It is the one star that never moves.",
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
      "Scorpius and Orion are on opposite sides of the sky and never appear at the same time — an ancient myth says they were placed there so they would never meet.",
    instruction:
      "Scorpius is best seen in summer from the southern hemisphere. Look for a curved line of stars with a distinctive red star — Antares — at its heart.",
  },
];

const PRIORITY: NightObjectType[] = ["satellite", "moon", "planet", "star", "constellation", "galaxy"];

const OBJECT_PRIORITY_ORDER = ["moon", "venus", "jupiter", "saturn", "mars", "sirius", "betelgeuse", "vega", "arcturus", "orion", "ursamajor", "cassiopeia", "polaris", "scorpius", "milkyway"];

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

function getLocalSiderealTime(lng: number, date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const T = (JD - 2451545.0) / 36525;
  const GMST =
    280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T;
  return ((GMST + lng) % 360 + 360) % 360;
}

function getAltAz(
  ra: number,
  dec: number,
  lat: number,
  lst: number
): { alt: number; az: number } {
  const ha = ((lst - ra) % 360 + 360) % 360;
  const haRad = (ha * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) +
    Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const alt = (altRad * 180) / Math.PI;
  const cosAlt = Math.cos(altRad);
  const cosAz =
    cosAlt > 0.0001
      ? (Math.sin(decRad) - Math.sin(latRad) * sinAlt) /
        (Math.cos(latRad) * cosAlt)
      : 0;
  let az = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;
  if (Math.sin(haRad) > 0) az = 360 - az;
  return { alt, az };
}

function getMoonPosition(date: Date): { ra: number; dec: number } {
  const d = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
  const L = ((218.316 + 13.176396 * d) % 360 + 360) % 360;
  const M = ((134.963 + 13.064993 * d) % 360 + 360) % 360;
  const F = ((93.272 + 13.22935 * d) % 360 + 360) % 360;
  const lam = L + 6.289 * Math.sin((M * Math.PI) / 180);
  const b = 5.128 * Math.sin((F * Math.PI) / 180);
  const eps = (23.439 * Math.PI) / 180;
  const lamRad = (lam * Math.PI) / 180;
  const bRad = (b * Math.PI) / 180;
  const ra =
    (Math.atan2(
      Math.sin(lamRad) * Math.cos(eps) - Math.tan(bRad) * Math.sin(eps),
      Math.cos(lamRad)
    ) *
      180) /
    Math.PI;
  const dec =
    (Math.asin(
      Math.sin(bRad) * Math.cos(eps) +
        Math.cos(bRad) * Math.sin(eps) * Math.sin(lamRad)
    ) *
      180) /
    Math.PI;
  return { ra: ((ra % 360) + 360) % 360, dec };
}

function getMoonIllumination(date: Date): number {
  const knownNew = new Date("2024-01-11T11:57:00Z").getTime();
  const synodic = 29.53059 * 86400000;
  const phase = (((date.getTime() - knownNew) % synodic) + synodic) % synodic / synodic;
  return 0.5 * (1 - Math.cos(2 * Math.PI * phase));
}

function getMoonPhaseAngle(date: Date): number {
  const knownNew = new Date("2024-01-11T11:57:00Z").getTime();
  const synodic = 29.53059 * 86400000;
  return (((date.getTime() - knownNew) % synodic) + synodic) % synodic / synodic;
}

function getSolarAltitude(lat: number, lng: number, date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const n = JD - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
  const lam =
    (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * (Math.PI / 180);
  const eps = 23.439 * (Math.PI / 180);
  const ra = Math.atan2(
    Math.cos(eps) * Math.sin(lam),
    Math.cos(lam)
  );
  const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
  const lst = getLocalSiderealTime(lng, date);
  const ha = ((lst - (ra * 180) / Math.PI + 360) % 360) * (Math.PI / 180);
  const latRad = (lat * Math.PI) / 180;
  const sinAlt =
    Math.sin(dec) * Math.sin(latRad) +
    Math.cos(dec) * Math.cos(latRad) * Math.cos(ha);
  return (Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180) / Math.PI;
}

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
  orion: [[0,2],[1,4],[2,3],[3,4],[4,1],[5,4],[6,2]],
  cassiopeia: [[0,1],[1,2],[2,3],[3,4]],
  ursamajor: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
  scorpius: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]],
};

interface VisibleObject extends NightObject {
  alt: number;
  az: number;
  isPersonalStar?: boolean;
  personalStarDistance?: number;
  personalStarBirthYear?: number;
}

interface NightSkyState {
  status: "loading" | "denied" | "before_dark" | "ready";
  objects: VisibleObject[];
  moonIllumination: number;
  moonPhase: number;
  solarAlt: number;
  lat: number;
  lng: number;
}

function computeVisibleObjects(
  lat: number,
  lng: number,
  date: Date
): { objects: NightObject[]; moonIllumination: number; moonPhase: number } {
  const lst = getLocalSiderealTime(lng, date);
  const moonIllum = getMoonIllumination(date);
  const moonPhase = getMoonPhaseAngle(date);
  const moonPos = getMoonPosition(date);
  const moonAltAz = getAltAz(moonPos.ra, moonPos.dec, lat, lst);

  const visible: VisibleObject[] = [];

  if (moonAltAz.alt > 10 && moonIllum > 0.1) {
    visible.push({
      ...(NIGHT_OBJECTS.find((o) => o.id === "moon") as NightObject),
      alt: moonAltAz.alt,
      az: moonAltAz.az,
    });
  }

  for (const obj of NIGHT_OBJECTS) {
    if (obj.id === "moon") continue;
    if (!obj.ra || obj.dec === undefined) continue;
    const { alt, az } = getAltAz(obj.ra, obj.dec, lat, lst);
    if (alt > 10) {
      visible.push({ ...obj, alt, az });
    }
  }

  visible.sort((a, b) => {
    const ai = OBJECT_PRIORITY_ORDER.indexOf(a.id);
    const bi = OBJECT_PRIORITY_ORDER.indexOf(b.id);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return { objects: visible, moonIllumination: moonIllum, moonPhase };
}

function CompassIndicator({ az, alt, color }: { az: number; alt: number; color: string }) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const activeDir = Math.round(az / 45) % 8;
  return (
    <View style={styles.compassRow}>
      <View style={styles.compassDirs}>
        {dirs.map((d, i) => (
          <Text
            key={d}
            style={[
              styles.compassDir,
              {
                color: i === activeDir ? GOLD : "rgba(200,169,110,0.25)",
                fontFamily: i === activeDir ? "Inter_600SemiBold" : "Inter_400Regular",
              },
            ]}
          >
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.elevBar}>
        <View
          style={[
            styles.elevDot,
            {
              bottom: `${Math.min(90, Math.max(0, alt))}%` as unknown as number,
              backgroundColor: GOLD,
            },
          ]}
        />
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

function ConstellationVisual({ id, color, size }: { id: string; color: string; size: number }) {
  const key = id === "ursamajor" ? "ursamajor" : id;
  const dots = CONSTELLATION_DOTS[key] ?? CONSTELLATION_DOTS.orion;
  const lines = CONSTELLATION_LINE_INDICES[key] ?? CONSTELLATION_LINE_INDICES.orion;
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
      <Circle cx={c * 0.88} cy={c * 0.82} r={c * 0.04} fill="#ffffff" opacity={0.7} />
    </Svg>
  );
}

function ObjectVisual({ obj, moonPhase, size = 160 }: { obj: VisibleObject; moonPhase: number; size?: number }) {
  if (obj.type === "moon") return <MoonVisual phase={moonPhase} size={size} />;
  if (obj.type === "constellation") return <ConstellationVisual id={obj.id} color={obj.color} size={size} />;
  if (obj.type === "galaxy") return <GalaxyVisual size={size} />;
  return <StarPlanetVisual color={obj.color} size={size} />;
}

interface CardProps {
  obj: VisibleObject;
  moonPhase: number;
  moonIllumination: number;
  isAfterMidnight: boolean;
  isFullMoon: boolean;
  isNewMoon: boolean;
}

function ObjectCard({ obj, moonPhase, moonIllumination, isAfterMidnight, isFullMoon, isNewMoon }: CardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
    return () => { fadeAnim.setValue(0); };
  }, [obj.id, fadeAnim]);

  const dirLabel = obj.az !== undefined ? azToCompass(obj.az) : "—";
  const heightLabel = obj.alt !== undefined ? altToLabel(obj.alt) : "—";
  const isTimeless = obj.type === "star" || obj.type === "constellation";

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, width: SW }]}>
      {obj.isPersonalStar && (
        <View style={styles.personalBadge}>
          <Text style={styles.personalBadgeText}>YOUR STAR IS VISIBLE TONIGHT</Text>
        </View>
      )}

      <View style={styles.visualSection}>
        <ObjectVisual obj={obj} moonPhase={moonPhase} size={160} />
        <Text style={styles.objectName}>{obj.name.toUpperCase()}</Text>

        {obj.type === "moon" && (
          <Text style={styles.moonNote}>
            {isFullMoon
              ? "Full Moon · Bright sky tonight"
              : isNewMoon
              ? "New Moon · Darkest sky of the month"
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
          Look {dirLabel} · {heightLabel}
        </Text>
        <Text style={styles.instruction}>{obj.instruction}</Text>
        {obj.isPersonalStar && obj.personalStarDistance !== undefined && obj.personalStarBirthYear !== undefined && (
          <Text style={styles.personalLine}>
            Light leaving {obj.name} right now will reach Earth in {obj.personalStarBirthYear}.
            {"\n"}Tonight you can see the source of that light with your own eyes.
          </Text>
        )}
        <Text style={styles.goOutside}>Go outside. Look up. It's there.</Text>
        {isTimeless && (
          <Text style={styles.eternityLine}>
            It's been there every night of every human life ever lived.
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

function EndCard() {
  return (
    <View style={[styles.card, { width: SW, justifyContent: "center", paddingHorizontal: 32 }]}>
      <Text style={styles.endText}>And behind all of this —</Text>
      <Text style={styles.endText}>two trillion more galaxies.</Text>
      <Text style={[styles.endSub, { marginTop: 24 }]}>
        Each containing hundreds of billions of stars.
      </Text>
      <Text style={styles.endSub}>
        The sky you're looking at tonight is the smallest possible fraction of what exists.
      </Text>
    </View>
  );
}

function DeniedScreen() {
  const colors = useColors();
  const router = useRouter();
  return (
    <View style={[styles.fullCenter, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.3} />
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: "absolute", top: 60, left: 24, zIndex: 200, padding: 12 }}
      >
        <Text style={{ color: "#C8A96E", fontSize: 22 }}>←</Text>
      </TouchableOpacity>
      <View style={styles.deniedContent}>
        <Text style={styles.deniedMain}>
          We don't know where you are tonight.
        </Text>
        <Text style={styles.deniedSub}>
          But wherever you are, the same stars are above you that were above
          every human who ever lived.
        </Text>
      </View>
    </View>
  );
}

function BeforeDarkScreen({ solarAlt }: { solarAlt: number }) {
  const colors = useColors();
  const router = useRouter();
  const now = new Date();
  const hoursUntilDark = Math.max(0, ((solarAlt + 6) / 15)).toFixed(1);
  return (
    <View style={[styles.fullCenter, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.15} />
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: "absolute", top: 60, left: 24, zIndex: 200, padding: 12 }}
      >
        <Text style={{ color: "#C8A96E", fontSize: 22 }}>←</Text>
      </TouchableOpacity>
      <View style={styles.deniedContent}>
        <Text style={styles.deniedMain}>The stars are coming.</Text>
        <Text style={[styles.timeText]}>
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Text style={styles.deniedSub}>
          Darkness arrives in approximately {hoursUntilDark} hours.
        </Text>
        <Text style={[styles.deniedSub, { marginTop: 16 }]}>
          The same stars that are above you right now — invisible in the
          daylight — have been there your entire life.
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

  const [state, setState] = useState<NightSkyState>({
    status: "loading",
    objects: [],
    moonIllumination: 0,
    moonPhase: 0,
    solarAlt: -20,
    lat: 40,
    lng: -74,
  });
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView | undefined>(undefined);
  const fadeIn = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const personalStarCard = useMemo((): VisibleObject | null => {
    if (!birthday) return null;
    const ageYears = (Date.now() - birthday.getTime()) / (365.25 * 86400000);
    const star = findStarByAge(Math.round(ageYears));
    if (!star) return null;
    const coords = CATALOG_STAR_COORDS[star.name];
    if (!coords) return null;
    const lst = getLocalSiderealTime(state.lng, new Date());
    const { alt, az } = getAltAz(coords.ra, coords.dec, state.lat, lst);
    if (alt <= 10) return null;
    const birthYear = birthday.getFullYear();
    return {
      id: `personal_${star.name}`,
      name: star.name,
      type: "star",
      ra: coords.ra,
      dec: coords.dec,
      color: GOLD,
      truth: star.note,
      wonder: `This star is ${star.distance} light-years away. Light that left it in ${birthYear} is only just arriving at Earth around now.`,
      instruction: `Look ${azToCompass(az)} · ${altToLabel(alt)}. It's been travelling toward this moment your entire life.`,
      alt,
      az,
      isPersonalStar: true,
      personalStarDistance: star.distance,
      personalStarBirthYear: birthYear,
    };
  }, [birthday, state.lat, state.lng]);

  const computeAndSet = (lat: number, lng: number) => {
    const now = new Date();
    const solarAlt = getSolarAltitude(lat, lng, now);
    const { objects, moonIllumination, moonPhase } = computeVisibleObjects(lat, lng, now);
    setState({
      status: solarAlt > -6 ? "before_dark" : "ready",
      objects: objects as VisibleObject[],
      moonIllumination,
      moonPhase,
      solarAlt,
      lat,
      lng,
    });
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    (async () => {
      try {
        // Check cached location first
        try {
          const cached = await AsyncStorage.getItem("pale_location_cache");
          if (cached) {
            const { lat, lng, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;
            if (age < 30 * 60 * 1000) {
              computeAndSet(lat, lng);
              interval = setInterval(() => {
                computeAndSet(lat, lng);
              }, 5 * 60 * 1000);
              return;
            }
          }
        } catch {}

        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setState((s) => ({ ...s, status: "denied" }));
          return;
        }

        // Get location with 10-second timeout
        let loc: Location.LocationObject;
        try {
          loc = await Promise.race([
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 10000)
            ),
          ]);
        } catch {
          // Location timed out or failed — fall back to London silently
          computeAndSet(51.5074, -0.1278);
          return;
        }

        const lat = loc.coords.latitude;
        const lng = loc.coords.longitude;

        // Cache the location
        try {
          await AsyncStorage.setItem(
            "pale_location_cache",
            JSON.stringify({ lat, lng, timestamp: Date.now() })
          );
        } catch {}

        computeAndSet(lat, lng);
        interval = setInterval(() => {
          computeAndSet(lat, lng);
        }, 5 * 60 * 1000);

      } catch (err) {
        // Any unexpected error — fall back to London
        console.warn("Tonight sky location error:", err);
        computeAndSet(51.5074, -0.1278);
      }
    })();

    return () => { if (interval) clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (state.status === "ready") {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }
  }, [state.status, fadeIn]);

  const allCards = useMemo(() => {
    const cards: VisibleObject[] = [...state.objects];
    if (personalStarCard && !cards.find((c) => c.id === personalStarCard.id)) {
      cards.splice(1, 0, personalStarCard);
    }
    return cards;
  }, [state.objects, personalStarCard]);

  const now = new Date();
  const isAfterMidnight = now.getHours() < 4;
  const isFullMoon = state.moonIllumination > 0.9;
  const isNewMoon = state.moonIllumination < 0.05;
  const featuredObj = allCards[page];

  if (state.status === "loading") {
    return (
      <View style={[styles.fullCenter, { backgroundColor: colors.background }]}>
        <StarField count={80} containerOpacity={0.4} />
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", top: topPad + 12, left: 24, zIndex: 200, padding: 12 }}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.loadingText}>Reading the sky…</Text>
      </View>
    );
  }

  if (state.status === "denied") return <DeniedScreen />;
  if (state.status === "before_dark") return <BeforeDarkScreen solarAlt={state.solarAlt} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={120} containerOpacity={0.5} />

      {/* Back button always visible — outside fade animation */}
      <TouchableOpacity
        onPress={() => router.back()}
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
          <Text style={styles.screenTitle}>TONIGHT'S SKY</Text>
          {featuredObj && featuredObj.az !== undefined && featuredObj.alt !== undefined && (
            <CompassIndicator az={featuredObj.az} alt={featuredObj.alt} color={GOLD} />
          )}
        </View>

        <ScrollView
          ref={(r) => { scrollRef.current = r ?? undefined; }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
            setPage(idx);
          }}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: bottomPad + 60 }}
        >
          {allCards.map((obj) => (
            <ObjectCard
              key={obj.id}
              obj={obj}
              moonPhase={state.moonPhase}
              moonIllumination={state.moonIllumination}
              isAfterMidnight={isAfterMidnight}
              isFullMoon={isFullMoon}
              isNewMoon={isNewMoon}
            />
          ))}
          <EndCard />
        </ScrollView>

        <View style={[styles.dots, { bottom: bottomPad + 20 }]}>
          {[...allCards, { id: "_end" }].map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === page ? GOLD : "rgba(200,169,110,0.3)",
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
    color: GOLD,
    fontSize: 11,
    letterSpacing: 4,
    fontFamily: "Inter_600SemiBold",
  },
  compassRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  compassDirs: {
    flexDirection: "row",
    gap: 6,
  },
  compassDir: {
    fontSize: 10,
    letterSpacing: 1,
  },
  elevBar: {
    width: 2,
    height: 20,
    backgroundColor: "rgba(200,169,110,0.2)",
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
  card: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 12,
    gap: 0,
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
    color: "rgba(200,169,110,0.6)",
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
    color: "rgba(245,240,232,0.55)",
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
    backgroundColor: "rgba(200,169,110,0.15)",
    marginBottom: 4,
  },
  direction: {
    color: "rgba(200,169,110,0.7)",
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: "Inter_500Medium",
  },
  instruction: {
    color: "rgba(245,240,232,0.65)",
    fontSize: 14,
    lineHeight: 22,
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
    color: "rgba(200,169,110,0.45)",
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
    color: "rgba(200,169,110,0.5)",
    fontSize: 13,
    letterSpacing: 2,
    fontFamily: "Inter_400Regular",
  },
  deniedContent: {
    paddingHorizontal: 36,
    gap: 20,
    alignItems: "center",
  },
  deniedMain: {
    color: WARM_WHITE,
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  deniedSub: {
    color: "rgba(245,240,232,0.55)",
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  timeText: {
    color: GOLD,
    fontSize: 28,
    fontFamily: "Inter_400Regular",
    letterSpacing: 4,
  },
  endText: {
    color: WARM_WHITE,
    fontSize: 20,
    lineHeight: 32,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  endSub: {
    color: "rgba(245,240,232,0.5)",
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
});
