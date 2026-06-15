import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Circle,
  Defs,
  Ellipse,
  FeGaussianBlur,
  Filter,
  G,
  Line,
  RadialGradient,
  Stop,
  Svg,
  Text as SvgText,
} from "react-native-svg";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Screen dimensions ────────────────────────────────────────────────────────

const { width: W, height: H } = Dimensions.get("window");
const CX = W / 2;
const CY = H / 2;
const MAX_R = Math.min(W, H) * 0.44;
const SCALE = MAX_R / 295;

// ─── Planet data ──────────────────────────────────────────────────────────────

interface Planet {
  name: string;
  color: string;
  r: number;
  size: number;
  speed: number;
  offset: number;
  title: string;
  subtitle: string;
}

const PLANETS: Planet[] = [
  { name: "Mercury", color: "#B5B5B5", r: 60 * SCALE, size: 3,  speed: 4.0,   offset: 0,   title: "Mercury.",   subtitle: "A year here lasts 88 days.\nCloser to the Sun than you can imagine." },
  { name: "Venus",   color: "#E8C87A", r: 85 * SCALE, size: 5,  speed: 1.6,   offset: 1.2, title: "Venus.",     subtitle: "Rotates backwards.\nThe Sun rises in the west." },
  { name: "Earth",   color: "#4B9CD3", r: 115 * SCALE, size: 5, speed: 1.0,   offset: 2.1, title: "You are here.", subtitle: "The only place in the known universe\nconfirmed to harbour life." },
  { name: "Mars",    color: "#C1440E", r: 145 * SCALE, size: 4, speed: 0.5,   offset: 0.8, title: "Mars.",      subtitle: "Has the largest volcano in the solar system —\nOlympus Mons." },
  { name: "Jupiter", color: "#C88B3A", r: 195 * SCALE, size: 10, speed: 0.08, offset: 1.5, title: "Jupiter.",   subtitle: "1,300 Earths could fit inside it." },
  { name: "Saturn",  color: "#E4D191", r: 235 * SCALE, size: 8,  speed: 0.03, offset: 3.2, title: "Saturn.",    subtitle: "Its rings are 282,000 km wide\nbut only 10 metres thick." },
  { name: "Uranus",  color: "#7DE8E8", r: 268 * SCALE, size: 6,  speed: 0.01, offset: 0.5, title: "Uranus.",    subtitle: "Rotates on its side. Its poles experience\n42 years of darkness." },
  { name: "Neptune", color: "#3F54BA", r: 295 * SCALE, size: 6,  speed: 0.006,offset: 2.8, title: "Neptune.",   subtitle: "Winds reach 2,100 km/h —\nthe fastest in the solar system." },
];

// ─── Galaxy "you are here" ─────────────────────────────────────────────────

const YOU_X = CX + Math.cos(2.8) * 110;
const YOU_Y = CY + Math.sin(2.8) * 110 * 0.42;

// ─── Cluster positions ────────────────────────────────────────────────────────

interface Cluster {
  name: string;
  px: number;
  py: number;
  size: number;
  you: boolean;
}

const CLUSTERS: Cluster[] = [
  { name: "Local Group",       px: 0.50 * W, py: 0.48 * H, size: 8, you: true },
  { name: "Virgo Cluster",     px: 0.28 * W, py: 0.35 * H, size: 6, you: false },
  { name: "Coma Cluster",      px: 0.72 * W, py: 0.30 * H, size: 7, you: false },
  { name: "Perseus Cluster",   px: 0.18 * W, py: 0.60 * H, size: 5, you: false },
  { name: "Centaurus Cluster", px: 0.82 * W, py: 0.65 * H, size: 6, you: false },
  { name: "Boötes Void edge",  px: 0.45 * W, py: 0.18 * H, size: 4, you: false },
  { name: "Sculptor Cluster",  px: 0.60 * W, py: 0.75 * H, size: 5, you: false },
  { name: "Hydra Cluster",     px: 0.88 * W, py: 0.42 * H, size: 4, you: false },
  { name: "Leo Cluster",       px: 0.12 * W, py: 0.28 * H, size: 3, you: false },
  { name: "Fornax Cluster",    px: 0.35 * W, py: 0.82 * H, size: 4, you: false },
  { name: "Hercules Cluster",  px: 0.78 * W, py: 0.15 * H, size: 3, you: false },
  { name: "Eridanus Void edge",px: 0.22 * W, py: 0.78 * H, size: 4, you: false },
];

// ─── Level labels & transition text ──────────────────────────────────────────

const LEVEL_LABEL: Record<number, string> = {
  1: "SOLAR SYSTEM",
  2: "MILKY WAY",
  3: "OBSERVABLE UNIVERSE",
};

const TRANSITION_MSG: Record<string, string> = {
  "1→2": "Our solar system is one of 400 billion in the Milky Way.",
  "2→3": "Our galaxy is one of two trillion in the observable universe.",
  "3→2": "Returning to our galaxy.",
  "2→1": "Returning to our solar system.",
};

const STAR_OP_BY_LEVEL: Record<number, number> = { 1: 0.6, 2: 0.25, 3: 0.1 };

const MW_FACTS = [
  "The Milky Way is approximately 100,000 light-years across.",
  "Our Sun is located about 26,000 light-years from the galactic centre.",
  "The Milky Way contains between 100 and 400 billion stars.",
  "It takes our Sun 225 million years to orbit the galactic centre once.",
  "The Milky Way is on a collision course with Andromeda — in 4.5 billion years.",
];

const UV_FACTS = [
  "The observable universe is 93 billion light-years across.",
  "There are approximately 2 trillion galaxies in the observable universe.",
  "The cosmic web spans hundreds of millions of light-years.",
  "Voids between galaxy filaments can be 300 million light-years across.",
  "Light from the most distant galaxies left when the universe was 400 million years old.",
];

// ─── Component ────────────────────────────────────────────────────────────────

type ZoomLevel = 1 | 2 | 3;

interface PlanetPos { x: number; y: number }
interface InfoData { title: string; subtitle: string }
interface ZoomMsg { title: string; subtitle: string }

export default function UniverseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [planetPos, setPlanetPos] = useState<Record<string, PlanetPos>>({});
  const [isZooming, setIsZooming] = useState(false);
  const [infoData, setInfoData] = useState<InfoData | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [zoomMsg, setZoomMsg] = useState<ZoomMsg | null>(null);
  const [transMsg, setTransMsg] = useState<string | null>(null);
  const [pbVisible, setPbVisible] = useState(false);

  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);
  const zoomLevelRef = useRef<ZoomLevel>(1);
  const mwFactRef = useRef(0);
  const uvFactRef = useRef(0);
  const infoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Animated values
  const starOp      = useRef(new Animated.Value(STAR_OP_BY_LEVEL[1])).current;
  const contentOp   = useRef(new Animated.Value(1)).current;
  const cinScale    = useRef(new Animated.Value(1)).current;
  const cinTX       = useRef(new Animated.Value(0)).current;
  const cinTY       = useRef(new Animated.Value(0)).current;
  const zoomTextOp  = useRef(new Animated.Value(0)).current;
  const transTextOp = useRef(new Animated.Value(0)).current;
  const infoOp      = useRef(new Animated.Value(0)).current;
  const infoTY      = useRef(new Animated.Value(30)).current;
  // Pale blue dot lines
  const pb1Op = useRef(new Animated.Value(0)).current;
  const pb2Op = useRef(new Animated.Value(0)).current;
  const pb3Op = useRef(new Animated.Value(0)).current;
  const pb4Op = useRef(new Animated.Value(0)).current;

  useEffect(() => { zoomLevelRef.current = zoomLevel; }, [zoomLevel]);

  // ── RAF loop (level 1 only) ────────────────────────────────────────────────

  useEffect(() => {
    if (zoomLevel !== 1) return;
    const tick = () => {
      timeRef.current += 0.008;
      frameRef.current++;
      if (frameRef.current % 3 === 0) {
        const pos: Record<string, PlanetPos> = {};
        PLANETS.forEach((p) => {
          const a = timeRef.current * p.speed + p.offset;
          pos[p.name] = { x: CX + Math.cos(a) * p.r, y: CY + Math.sin(a) * p.r * 0.38 };
        });
        setPlanetPos(pos);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [zoomLevel]);

  useEffect(() => () => { if (infoTimer.current) clearTimeout(infoTimer.current); }, []);

  // ── Info panel ─────────────────────────────────────────────────────────────

  const showInfo = useCallback((title: string, subtitle: string) => {
    if (infoTimer.current) clearTimeout(infoTimer.current);
    setInfoData({ title, subtitle });
    setInfoVisible(true);
    infoOp.setValue(0);
    infoTY.setValue(30);
    Animated.parallel([
      Animated.timing(infoOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(infoTY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
    infoTimer.current = setTimeout(() => {
      Animated.timing(infoOp, { toValue: 0, duration: 400, useNativeDriver: true }).start(() =>
        setInfoVisible(false)
      );
    }, 4000);
  }, [infoOp, infoTY]);

  const dismissInfo = useCallback(() => {
    if (infoTimer.current) clearTimeout(infoTimer.current);
    Animated.timing(infoOp, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
      setInfoVisible(false)
    );
  }, [infoOp]);

  // ── Cinematic zoom helper ──────────────────────────────────────────────────

  const doCinZoom = useCallback(
    (targetX: number, targetY: number, targetScale: number, onComplete: () => void) => {
      const tx = targetScale * (CX - targetX);
      const ty = targetScale * (CY - targetY);
      Animated.parallel([
        Animated.timing(cinScale, { toValue: targetScale, duration: 1400, useNativeDriver: true }),
        Animated.timing(cinTX, { toValue: tx, duration: 1400, useNativeDriver: true }),
        Animated.timing(cinTY, { toValue: ty, duration: 1400, useNativeDriver: true }),
      ]).start(onComplete);
    },
    [cinScale, cinTX, cinTY]
  );

  const cinZoomBack = useCallback(
    (duration: number, onComplete?: () => void) => {
      Animated.parallel([
        Animated.timing(cinScale, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(cinTX, { toValue: 0, duration, useNativeDriver: true }),
        Animated.timing(cinTY, { toValue: 0, duration, useNativeDriver: true }),
      ]).start(onComplete);
    },
    [cinScale, cinTX, cinTY]
  );

  // ── Earth tap ──────────────────────────────────────────────────────────────

  const triggerEarthZoom = useCallback(() => {
    const ep = planetPos["Earth"];
    if (!ep || isZooming) return;
    setIsZooming(true);
    if (infoVisible) dismissInfo();
    doCinZoom(ep.x, ep.y, 4, () => {
      setZoomMsg({ title: "You are here.", subtitle: "The only place in the known universe\nconfirmed to harbour life." });
      Animated.timing(zoomTextOp, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      setTimeout(() => {
        Animated.timing(zoomTextOp, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
          setZoomMsg(null);
          cinZoomBack(1000, () => setIsZooming(false));
        });
      }, 3000);
    });
  }, [planetPos, isZooming, infoVisible, dismissInfo, doCinZoom, cinZoomBack, zoomTextOp]);

  // ── Sun tap ────────────────────────────────────────────────────────────────

  const triggerSunZoom = useCallback(() => {
    if (isZooming) return;
    setIsZooming(true);
    if (infoVisible) dismissInfo();
    doCinZoom(CX, CY, 2.5, () => {
      setZoomMsg({ title: "Our star.", subtitle: "4.6 billion years old.\nOne of 400 billion in the Milky Way." });
      Animated.timing(zoomTextOp, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      setTimeout(() => {
        Animated.timing(zoomTextOp, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
          setZoomMsg(null);
          cinZoomBack(1000, () => setIsZooming(false));
        });
      }, 3000);
    });
  }, [isZooming, infoVisible, dismissInfo, doCinZoom, cinZoomBack, zoomTextOp]);

  // ── You-are-here tap (level 2) ─────────────────────────────────────────────

  const triggerYouMarker = useCallback(() => {
    if (isZooming) return;
    setIsZooming(true);
    doCinZoom(YOU_X, YOU_Y, 2, () => {
      setZoomMsg({ title: "You are here.", subtitle: "26,000 light-years from the galactic centre.\nIn a quiet arm of an ordinary galaxy." });
      Animated.timing(zoomTextOp, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      setTimeout(() => {
        Animated.timing(zoomTextOp, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
          setZoomMsg(null);
          cinZoomBack(1000, () => setIsZooming(false));
        });
      }, 3000);
    });
  }, [isZooming, doCinZoom, cinZoomBack, zoomTextOp]);

  // ── Pale blue dot moment (level 3) ─────────────────────────────────────────

  const triggerPaleBlue = useCallback(() => {
    if (isZooming) return;
    setIsZooming(true);
    const lc = CLUSTERS[0]; // Local Group
    pb1Op.setValue(0); pb2Op.setValue(0); pb3Op.setValue(0); pb4Op.setValue(0);

    doCinZoom(lc.px, lc.py, 8, () => {
      setPbVisible(true);
      const fade = (val: Animated.Value) =>
        Animated.timing(val, { toValue: 1, duration: 800, useNativeDriver: true });

      fade(pb1Op).start();
      setTimeout(() => fade(pb2Op).start(), 1500);
      setTimeout(() => fade(pb3Op).start(), 3000);
      setTimeout(() => fade(pb4Op).start(), 6000);
      setTimeout(() => {
        Animated.parallel([pb1Op, pb2Op, pb3Op, pb4Op].map((v) =>
          Animated.timing(v, { toValue: 0, duration: 700, useNativeDriver: true })
        )).start(() => {
          setPbVisible(false);
          cinZoomBack(2000, () => setIsZooming(false));
        });
      }, 9000);
    });
  }, [isZooming, pb1Op, pb2Op, pb3Op, pb4Op, doCinZoom, cinZoomBack]);

  // ── Level transition ───────────────────────────────────────────────────────

  const transitionLevel = useCallback(
    (newLevel: ZoomLevel) => {
      if (isZooming) return;
      const key = `${zoomLevelRef.current}→${newLevel}`;
      const msg = TRANSITION_MSG[key] ?? null;

      Animated.timing(contentOp, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        zoomLevelRef.current = newLevel;
        setZoomLevel(newLevel);
        Animated.timing(starOp, { toValue: STAR_OP_BY_LEVEL[newLevel], duration: 800, useNativeDriver: true }).start();

        if (msg) {
          setTransMsg(msg);
          Animated.sequence([
            Animated.timing(transTextOp, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.delay(1200),
            Animated.timing(transTextOp, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]).start(() => {
            setTransMsg(null);
            Animated.timing(contentOp, { toValue: 1, duration: 400, useNativeDriver: true }).start();
          });
        } else {
          Animated.timing(contentOp, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        }
      });
    },
    [isZooming, contentOp, starOp, transTextOp]
  );

  const handleZoomIn  = () => { if (zoomLevel < 3) transitionLevel((zoomLevel + 1) as ZoomLevel); };
  const handleZoomOut = () => { if (zoomLevel > 1) transitionLevel((zoomLevel - 1) as ZoomLevel); };

  const onPinch = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END && !isZooming) {
      if (nativeEvent.scale > 1.5 && zoomLevelRef.current < 3) transitionLevel((zoomLevelRef.current + 1) as ZoomLevel);
      else if (nativeEvent.scale < 0.6 && zoomLevelRef.current > 1) transitionLevel((zoomLevelRef.current - 1) as ZoomLevel);
    }
  };

  const handleBgTap = () => {
    if (isZooming) return;
    if (infoVisible) { dismissInfo(); return; }
    if (zoomLevel === 2) showInfo("Milky Way", MW_FACTS[mwFactRef.current++ % MW_FACTS.length]);
    else if (zoomLevel === 3) showInfo("Observable Universe", UV_FACTS[uvFactRef.current++ % UV_FACTS.length]);
  };

  // ── Memoised data ──────────────────────────────────────────────────────────

  const stars = useMemo(() =>
    Array.from({ length: 600 }, (_, i) => {
      const s1 = Math.sin(i * 127.1) * 43758.5453;
      const s2 = Math.sin(i * 311.7) * 43758.5453;
      const s3 = Math.sin(i * 74.3) * 43758.5453;
      const rx = s1 - Math.floor(s1);
      const ry = s2 - Math.floor(s2);
      const rs = s3 - Math.floor(s3);
      return { x: rx * W, y: ry * H, r: 0.4 + rs * 1.2, op: 0.2 + rs * 0.7 };
    }),
  []);

  const armDots = useMemo(() => {
    const dots: { x: number; y: number; size: number; op: number; color: string }[] = [];
    for (let arm = 0; arm < 4; arm++) {
      const off = arm * (Math.PI / 2);
      for (let t = 0.5; t <= 5.5 * Math.PI; t += 0.18) {
        const r = 15 + 6 * t;
        const x = CX + Math.cos(t + off) * r;
        const y = CY + Math.sin(t + off) * r * 0.42;
        if (x < 10 || x > W - 10 || y < 80 || y > H - 80) continue;
        const p = t / (5.5 * Math.PI);
        dots.push({
          x, y,
          size: Math.max(0.5, 1.8 - p * 1.3),
          op: Math.max(0.04, 0.55 - p * 0.48),
          color: Math.sin(t * 7.3) > 0.3 ? "#fff8e8" : "#e8f0ff",
        });
      }
    }
    return dots;
  }, []);

  const filaments = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < CLUSTERS.length; i++)
      for (let j = i + 1; j < CLUSTERS.length; j++) {
        const dx = CLUSTERS[i].px - CLUSTERS[j].px;
        const dy = CLUSTERS[i].py - CLUSTERS[j].py;
        if (Math.sqrt(dx * dx + dy * dy) < 250) list.push([i, j]);
      }
    return list;
  }, []);

  // ── SVG Defs ───────────────────────────────────────────────────────────────

  const svgDefs = (
    <Defs>
      <RadialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%"   stopColor="#fff8e0" stopOpacity="1" />
        <Stop offset="30%"  stopColor="#ffd54f" stopOpacity="0.8" />
        <Stop offset="70%"  stopColor="#ff9800" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#ff6500" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="galaxyCore" cx="50%" cy="50%" r="50%">
        <Stop offset="0%"   stopColor="#fffde7" stopOpacity="1" />
        <Stop offset="20%"  stopColor="#fff9c4" stopOpacity="0.9" />
        <Stop offset="50%"  stopColor="#C8A96E" stopOpacity="0.4" />
        <Stop offset="80%"  stopColor="#9c6ae1" stopOpacity="0.1" />
        <Stop offset="100%" stopColor="#6633aa" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="galaxyHalo" cx="50%" cy="50%" r="50%">
        <Stop offset="0%"   stopColor="#9966cc" stopOpacity="0.08" />
        <Stop offset="60%"  stopColor="#6644aa" stopOpacity="0.04" />
        <Stop offset="100%" stopColor="#442288" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="clusterGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%"   stopColor="#ffffff"  stopOpacity="0.9" />
        <Stop offset="40%"  stopColor="#C8A96E"  stopOpacity="0.4" />
        <Stop offset="100%" stopColor="#C8A96E"  stopOpacity="0" />
      </RadialGradient>
      <Filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
        <FeGaussianBlur stdDeviation="3" />
      </Filter>
      <Filter id="sunBloom" x="-100%" y="-100%" width="300%" height="300%">
        <FeGaussianBlur stdDeviation="8" />
      </Filter>
    </Defs>
  );

  const starDefs = (
    <Defs>
      <RadialGradient id="starGlowS" cx="50%" cy="50%" r="50%">
        <Stop offset="0%"   stopColor="#ffffff" stopOpacity="1" />
        <Stop offset="50%"  stopColor="#ffffff" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </RadialGradient>
    </Defs>
  );

  // ── Star elements (never re-renders) ──────────────────────────────────────

  const starElems = useMemo(() => (
    <>
      {stars.map((s, i) => (
        <Circle key={`sg${i}`} cx={s.x} cy={s.y} r={s.r * 4} fill="url(#starGlowS)" opacity={s.op * 0.28} />
      ))}
      {stars.map((s, i) => (
        <Circle key={`sc${i}`} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.op} />
      ))}
    </>
  ), [stars]);

  // ── Level SVG renderers ────────────────────────────────────────────────────

  const renderSolarSvg = () => (
    <>
      {/* Orbit rings */}
      {PLANETS.map((p) => (
        <Ellipse key={`orb${p.name}`} cx={CX} cy={CY} rx={p.r} ry={p.r * 0.38}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      ))}

      {/* Sun bloom */}
      <G filter="url(#sunBloom)">
        <Circle cx={CX} cy={CY} r={80} fill="url(#sunGlow)" opacity={0.45} />
      </G>

      {/* Sun layers */}
      <Circle cx={CX} cy={CY} r={40} fill="url(#sunGlow)" opacity={0.7} />
      <Circle cx={CX} cy={CY} r={16} fill="#fff8e0" opacity={1} />

      {/* Planet atmospheric bloom group */}
      <G filter="url(#bloom)">
        {PLANETS.map((p) => {
          const pos = planetPos[p.name];
          if (!pos) return null;
          return <Circle key={`pg${p.name}`} cx={pos.x} cy={pos.y} r={p.size * 3.5} fill={p.color} opacity={0.14} />;
        })}
      </G>

      {/* Planet cores */}
      {PLANETS.map((p) => {
        const pos = planetPos[p.name];
        if (!pos) return null;
        return (
          <G key={p.name}>
            <Circle cx={pos.x} cy={pos.y} r={p.size * 1.8} fill={p.color} opacity={0.28} />
            <Circle cx={pos.x} cy={pos.y} r={p.size} fill={p.color} opacity={0.95} />
            <Circle cx={pos.x - p.size * 0.3} cy={pos.y - p.size * 0.3}
              r={p.size * 0.35} fill="#ffffff" opacity={0.6} />
            {p.name === "Saturn" && (
              <Ellipse cx={pos.x} cy={pos.y} rx={p.size * 2.2} ry={p.size * 0.5}
                fill="none" stroke="#E4D191" strokeWidth={1.5} opacity={0.5} />
            )}
          </G>
        );
      })}
    </>
  );

  const renderMilkyWaySvg = () => (
    <>
      {/* Outer halo */}
      <Circle cx={CX} cy={CY} r={Math.min(W, H) * 0.48} fill="url(#galaxyHalo)" />

      {/* Spiral arm dots */}
      {armDots.map((d, i) => (
        <Circle key={i} cx={d.x} cy={d.y} r={d.size} fill={d.color} opacity={d.op} />
      ))}

      {/* Core bloom */}
      <G filter="url(#bloom)">
        <Circle cx={CX} cy={CY} r={50} fill="url(#galaxyCore)" opacity={0.5} />
      </G>

      {/* Core layers */}
      <Circle cx={CX} cy={CY} r={100} fill="url(#galaxyCore)" opacity={0.3} />
      <Circle cx={CX} cy={CY} r={18} fill="#fffde7" opacity={0.95} />
      <Circle cx={CX} cy={CY} r={8}  fill="#ffffff" opacity={1} />

      {/* You are here */}
      <G filter="url(#bloom)">
        <Circle cx={YOU_X} cy={YOU_Y} r={12} fill="#C8A96E" opacity={0.18} />
      </G>
      <Circle cx={YOU_X} cy={YOU_Y} r={3.5} fill="#C8A96E" opacity={0.9} />
      <SvgText x={YOU_X} y={YOU_Y + 14} fill="#C8A96E" fontSize={8}
        textAnchor="middle" opacity={0.7}>you</SvgText>
    </>
  );

  const renderCosmicWebSvg = () => (
    <>
      {/* Filament lines */}
      {filaments.map(([ci, cj], i) => (
        <Line key={i}
          x1={CLUSTERS[ci].px} y1={CLUSTERS[ci].py}
          x2={CLUSTERS[cj].px} y2={CLUSTERS[cj].py}
          stroke="#ffffff" strokeWidth={0.5} opacity={0.05} />
      ))}

      {/* Filament intermediate dots */}
      {filaments.map(([ci, cj], fi) =>
        [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((t, ti) => (
          <Circle key={`fd${fi}-${ti}`}
            cx={CLUSTERS[ci].px + t * (CLUSTERS[cj].px - CLUSTERS[ci].px)}
            cy={CLUSTERS[ci].py + t * (CLUSTERS[cj].py - CLUSTERS[ci].py)}
            r={0.8} fill="#ffffff" opacity={0.08} />
        ))
      )}

      {/* Cluster bloom */}
      <G filter="url(#bloom)">
        {CLUSTERS.map((c, i) => (
          <Circle key={i} cx={c.px} cy={c.py} r={c.size * 5}
            fill="url(#clusterGlow)" opacity={0.3} />
        ))}
      </G>

      {/* Cluster cores */}
      {CLUSTERS.map((c, i) => (
        <G key={i}>
          <Circle cx={c.px} cy={c.py} r={c.size * 2}
            fill={c.you ? "#C8A96E" : "#ffffff"} opacity={0.5} />
          <Circle cx={c.px} cy={c.py} r={c.size}
            fill={c.you ? "#C8A96E" : "#ffffff"} opacity={0.9} />
        </G>
      ))}
    </>
  );

  // ── Touch targets ──────────────────────────────────────────────────────────

  const renderPlanetTargets = () => (
    <>
      {/* Sun touch target */}
      <TouchableOpacity
        onPress={triggerSunZoom}
        style={{ position: "absolute", left: CX - 22, top: CY - 22, width: 44, height: 44 }}
      />
      {/* Planet touch targets */}
      {PLANETS.map((p) => {
        const pos = planetPos[p.name];
        if (!pos) return null;
        const hit = Math.max(44, p.size * 4);
        return (
          <TouchableOpacity
            key={p.name}
            onPress={() => {
              if (p.name === "Earth") triggerEarthZoom();
              else showInfo(p.title, p.subtitle);
            }}
            style={{
              position: "absolute",
              left: pos.x - hit / 2,
              top: pos.y - hit / 2,
              width: hit,
              height: hit,
            }}
          />
        );
      })}
    </>
  );

  const renderMilkyWayTargets = () => (
    <TouchableOpacity
      onPress={triggerYouMarker}
      style={{ position: "absolute", left: YOU_X - 22, top: YOU_Y - 22, width: 44, height: 44 }}
    />
  );

  const renderClusterTargets = () =>
    CLUSTERS.map((c, i) => {
      const hit = Math.max(44, c.size * 6);
      return (
        <TouchableOpacity
          key={i}
          onPress={() => { if (c.you) triggerPaleBlue(); else showInfo(c.name, UV_FACTS[i % UV_FACTS.length]); }}
          style={{ position: "absolute", left: c.px - hit / 2, top: c.py - hit / 2, width: hit, height: hit }}
        />
      );
    });

  // ── Layout ─────────────────────────────────────────────────────────────────

  const topPad = insets.top + 12;
  const botPad = insets.bottom + 16;

  return (
    <View style={styles.container}>
      {/* ── Zoomable canvas ── */}
      <PinchGestureHandler onHandlerStateChange={onPinch} enabled={!isZooming}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: cinScale }, { translateX: cinTX }, { translateY: cinTY }] }]}>

          {/* Star layer */}
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: starOp }]} pointerEvents="none">
            <Svg width={W} height={H}>
              {starDefs}
              {starElems}
            </Svg>
          </Animated.View>

          {/* Level content layer */}
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: contentOp }]} pointerEvents="none">
            <Svg width={W} height={H}>
              {svgDefs}
              {zoomLevel === 1 && renderSolarSvg()}
              {zoomLevel === 2 && renderMilkyWaySvg()}
              {zoomLevel === 3 && renderCosmicWebSvg()}
            </Svg>
          </Animated.View>

          {/* Background tap (behind targets) */}
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleBgTap} activeOpacity={1} disabled={isZooming} />

          {/* Object touch targets (on top) */}
          {!isZooming && zoomLevel === 1 && renderPlanetTargets()}
          {!isZooming && zoomLevel === 2 && renderMilkyWayTargets()}
          {!isZooming && zoomLevel === 3 && renderClusterTargets()}

        </Animated.View>
      </PinchGestureHandler>

      {/* ── Cinematic zoom text (not scaled) ── */}
      {zoomMsg && (
        <Animated.View style={[styles.overlay, { opacity: zoomTextOp }]} pointerEvents="none">
          <Text style={styles.overlayTitle}>{zoomMsg.title}</Text>
          <Text style={styles.overlaySub}>{zoomMsg.subtitle}</Text>
        </Animated.View>
      )}

      {/* ── Level transition text ── */}
      {transMsg && (
        <Animated.View style={[styles.overlay, { opacity: transTextOp }]} pointerEvents="none">
          <Text style={styles.transText}>{transMsg}</Text>
        </Animated.View>
      )}

      {/* ── Pale blue dot sequence ── */}
      {pbVisible && (
        <View style={styles.overlay} pointerEvents="none">
          <Animated.Text style={[styles.pbTitle, { opacity: pb1Op }]}>You are here.</Animated.Text>
          <Animated.Text style={[styles.pbLine, { opacity: pb2Op }]}>A pale blue dot.</Animated.Text>
          <Animated.Text style={[styles.pbLine, { opacity: pb3Op }]}>In one galaxy.</Animated.Text>
          <Animated.Text style={[styles.pbLine, { opacity: pb4Op }]}>Among two trillion.</Animated.Text>
          <Animated.Text style={[styles.pbEnd,  { opacity: pb4Op }]}>And yet — here you are.</Animated.Text>
        </View>
      )}

      {/* ── Top bar ── */}
      <View style={[styles.topBar, { paddingTop: topPad }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn} disabled={isZooming}>
          <Text style={styles.navArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.levelLabel}>{LEVEL_LABEL[zoomLevel]}</Text>
        <View style={styles.navBtn} />
      </View>

      {/* ── Bottom controls ── */}
      <View style={[styles.bottomBar, { paddingBottom: botPad }]}>
        <TouchableOpacity onPress={handleZoomOut} style={styles.zoomBtn} disabled={zoomLevel === 1 || isZooming}>
          <Text style={[styles.zoomArrow, (zoomLevel === 1 || isZooming) && styles.dimmed]}>←</Text>
        </TouchableOpacity>
        <View style={styles.dots}>
          {([1, 2, 3] as ZoomLevel[]).map((l) => (
            <View key={l} style={[styles.dot, zoomLevel === l && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleZoomIn} style={styles.zoomBtn} disabled={zoomLevel === 3 || isZooming}>
          <Text style={[styles.zoomArrow, (zoomLevel === 3 || isZooming) && styles.dimmed]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* ── Info panel ── */}
      {infoVisible && infoData && (
        <Animated.View style={[styles.infoPanel, { paddingBottom: botPad + 52 }, { opacity: infoOp, transform: [{ translateY: infoTY }] }]}>
          <TouchableOpacity onPress={dismissInfo} activeOpacity={1}>
            <Text style={styles.infoPlanetName}>{infoData.title}</Text>
            <Text style={styles.infoPlanetFact}>{infoData.subtitle}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#000000" },
  topBar:      { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, zIndex: 20 },
  navBtn:      { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  navArrow:    { color: "#C8A96E", fontSize: 20, opacity: 0.75 },
  levelLabel:  { color: "#C8A96E", fontSize: 10, letterSpacing: 4, fontFamily: "Inter_400Regular", opacity: 0.6 },
  bottomBar:   { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 28, zIndex: 20 },
  zoomBtn:     { padding: 16 },
  zoomArrow:   { color: "#C8A96E", fontSize: 16, opacity: 0.65 },
  dimmed:      { opacity: 0.18 },
  dots:        { flexDirection: "row", gap: 8, alignItems: "center" },
  dot:         { width: 4, height: 4, borderRadius: 2, backgroundColor: "#222232" },
  dotActive:   { width: 6, height: 6, borderRadius: 3, backgroundColor: "#C8A96E" },
  overlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 40, zIndex: 30,
  },
  overlayTitle:{ color: "#C8A96E", fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.3, textAlign: "center", marginBottom: 14 },
  overlaySub:  { color: "#F5F0E8", fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 28, opacity: 0.82 },
  transText:   { color: "#C8A96E", fontSize: 13, fontFamily: "Inter_400Regular", letterSpacing: 2, textAlign: "center", lineHeight: 24 },
  pbTitle:     { color: "#C8A96E", fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5, textAlign: "center", marginBottom: 32 },
  pbLine:      { color: "#F5F0E8", fontSize: 18, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 36, opacity: 0.85 },
  pbEnd:       { color: "#C8A96E", fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 36, letterSpacing: 1, opacity: 0.75 },
  infoPanel: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 28, paddingTop: 22, zIndex: 20,
  },
  infoPlanetName: { color: "#C8A96E", fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 3, marginBottom: 10 },
  infoPlanetFact: { color: "#F5F0E8", fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 28, letterSpacing: 0.2 },
});
