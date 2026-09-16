import React from "react";
import { View } from "react-native";
import Svg, { Circle, G, Line, Path } from "react-native-svg";

import type { SolarState } from "@/constants/solar";
import { useColors } from "@/hooks/useColors";

interface SkyStateIconProps {
  state: SolarState;
  size?: number;
}

const LABELS: Record<SolarState, string> = {
  daylight: "Sun above the horizon",
  "civil-twilight": "Sun just below the horizon",
  "nautical-twilight": "Deep twilight at the horizon",
  "astronomical-twilight": "Last astronomical twilight",
  "astronomical-darkness": "Moon and stars in a dark sky",
};

export function SkyStateIcon({ state, size = 128 }: SkyStateIconProps) {
  const colors = useColors();
  const isDaylight = state === "daylight";
  const isDark = state === "astronomical-darkness";

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={LABELS[state]}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox="0 0 128 128">
        <Circle cx={64} cy={64} r={54} fill={colors.glow} opacity={0.55} />
        {isDaylight ? (
          <G>
            {Array.from({ length: 12 }, (_, index) => {
              const angle = (index * Math.PI) / 6;
              return (
                <Line
                  key={index}
                  x1={64 + Math.cos(angle) * 31}
                  y1={64 + Math.sin(angle) * 31}
                  x2={64 + Math.cos(angle) * 43}
                  y2={64 + Math.sin(angle) * 43}
                  stroke={colors.primaryStrong}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  opacity={0.8}
                />
              );
            })}
            <Circle cx={64} cy={64} r={20} fill={colors.primaryStrong} />
            <Circle cx={58} cy={58} r={6} fill="#F7F4FF" opacity={0.5} />
          </G>
        ) : isDark ? (
          <G>
            <Path
              d="M78 32A34 34 0 1 0 94 84 29 29 0 0 1 78 32Z"
              fill={colors.primaryStrong}
            />
            <Circle cx={96} cy={38} r={2.3} fill="#F7F4FF" />
            <Circle cx={101} cy={55} r={1.5} fill="#F7F4FF" opacity={0.75} />
            <Circle cx={83} cy={24} r={1.4} fill="#F7F4FF" opacity={0.65} />
          </G>
        ) : (
          <G>
            <Circle
              cx={64}
              cy={66}
              r={21}
              fill={colors.primaryStrong}
              opacity={0.9}
            />
            <Path d="M18 66H110V96H18Z" fill={colors.background} />
            <Path
              d="M20 78 C42 67 86 67 108 78"
              stroke={colors.primaryStrong}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx={38} cy={43} r={1.7} fill="#F7F4FF" opacity={0.75} />
            <Circle cx={92} cy={35} r={2} fill="#F7F4FF" opacity={0.8} />
          </G>
        )}
      </Svg>
    </View>
  );
}
