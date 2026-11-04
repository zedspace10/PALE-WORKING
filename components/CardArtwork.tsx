import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, G, Line, Path } from "react-native-svg";

type CardArtworkName = "observatory" | "shift" | "timeMachine" | "tonightsSky";

interface CardArtworkProps {
  name: CardArtworkName;
  /** "left" keeps the drawing in the top right, clear of the text; "center" puts it above. */
  treatment?: "left" | "center";
}

const BLUE = "#8DC8FF";
const PALE = "#CFE6FF";
const WARM = "#F3DDB0";

/**
 * A small line drawing for each card, drawn in code rather than an image: the Shift's widening
 * view around one pale blue dot, the Time Machine's timeline, tonight's Moon over a horizon, and
 * the Observatory's sighting circle. Quiet enough to sit behind the words.
 */
export function CardArtwork({ name, treatment = "left" }: CardArtworkProps) {
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        preserveAspectRatio={
          treatment === "center" ? "xMidYMin meet" : "xMaxYMin meet"
        }
      >
        {DRAWINGS[name]}
      </Svg>
    </View>
  );
}

// Each drawing keeps to the upper right of a 200 by 200 square, so text below or to the left
// stays clear.
const DRAWINGS: Record<CardArtworkName, React.ReactNode> = {
  // Rings widening out from one pale blue dot.
  shift: (
    <G>
      {[10, 22, 38, 58, 82].map((r, i) => (
        <Circle
          key={r}
          cx={150}
          cy={58}
          r={r}
          fill="none"
          stroke={BLUE}
          strokeOpacity={0.34 - i * 0.06}
          strokeWidth={1}
        />
      ))}
      <Circle cx={150} cy={58} r={6} fill={BLUE} fillOpacity={0.12} />
      <Circle cx={150} cy={58} r={2.2} fill={PALE} />
    </G>
  ),
  // A line of time, the marks crowding together towards now, which is marked in warm light.
  timeMachine: (
    <G>
      <Line
        x1={36}
        y1={60}
        x2={184}
        y2={60}
        stroke={BLUE}
        strokeOpacity={0.3}
        strokeWidth={1}
      />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 184 - 148 * Math.pow(1 - i / 14, 1.9);
        const tall = i % 4 === 0;
        return (
          <Line
            key={i}
            x1={x}
            y1={tall ? 50 : 55}
            x2={x}
            y2={tall ? 70 : 65}
            stroke={BLUE}
            strokeOpacity={tall ? 0.42 : 0.26}
            strokeWidth={1}
          />
        );
      })}
      <Circle cx={184} cy={60} r={3} fill={WARM} />
    </G>
  ),
  // A crescent Moon and a few stars above a gentle horizon.
  tonightsSky: (
    <G>
      <Path
        d="M 170 32 A 20 20 0 1 0 170 72 A 15 15 0 1 1 170 32 Z"
        fill={WARM}
        fillOpacity={0.85}
      />
      {[
        [118, 38, 1.4],
        [134, 70, 1],
        [96, 64, 1.1],
        [190, 96, 1],
        [148, 104, 1.3],
      ].map(([x, y, r]) => (
        <Circle
          key={`${x}`}
          cx={x}
          cy={y}
          r={r}
          fill={PALE}
          fillOpacity={0.8}
        />
      ))}
      <Path
        d="M 60 150 Q 130 128 200 136"
        fill="none"
        stroke={BLUE}
        strokeOpacity={0.32}
        strokeWidth={1}
      />
    </G>
  ),
  // A sighting circle around tonight's object, set lower so the card's own button stays clear.
  observatory: (
    <G>
      <Circle
        cx={138}
        cy={104}
        r={34}
        fill="none"
        stroke={BLUE}
        strokeOpacity={0.36}
        strokeWidth={1}
      />
      <Circle
        cx={138}
        cy={104}
        r={48}
        fill="none"
        stroke={BLUE}
        strokeOpacity={0.14}
        strokeWidth={1}
      />
      {[
        [138, 66, 138, 76],
        [138, 132, 138, 142],
        [100, 104, 110, 104],
        [166, 104, 176, 104],
      ].map(([x1, y1, x2, y2]) => (
        <Line
          key={`${x1}-${y1}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={BLUE}
          strokeOpacity={0.45}
          strokeWidth={1}
        />
      ))}
      <Circle cx={144} cy={98} r={4} fill={WARM} fillOpacity={0.9} />
      <Circle cx={144} cy={98} r={9} fill={WARM} fillOpacity={0.1} />
    </G>
  ),
};
