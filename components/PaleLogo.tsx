import React from "react";
import Svg, { Circle, Ellipse, Line } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
  dotColor?: string;
}

export function PaleLogo({ size = 72, color = "#C8A96E", dotColor = "#8B9BB4" }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.44;
  const innerR = size * 0.28;
  const stroke = size * 0.022;

  // Perspective horizon line y position
  const horizonY = cy + outerR * 0.18;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={outerR}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        opacity={0.9}
      />

      {/* Inner ring — subtle */}
      <Circle
        cx={cx}
        cy={cy}
        r={innerR}
        stroke={color}
        strokeWidth={stroke * 0.5}
        fill="none"
        opacity={0.3}
      />

      {/* Horizon line across the circle */}
      <Line
        x1={cx - outerR + stroke}
        y1={horizonY}
        x2={cx + outerR - stroke}
        y2={horizonY}
        stroke={color}
        strokeWidth={stroke * 0.6}
        opacity={0.45}
      />

      {/* Perspective vanishing point lines */}
      <Line
        x1={cx}
        y1={horizonY}
        x2={cx - outerR * 0.55}
        y2={cy + outerR * 0.78}
        stroke={color}
        strokeWidth={stroke * 0.5}
        opacity={0.25}
      />
      <Line
        x1={cx}
        y1={horizonY}
        x2={cx + outerR * 0.55}
        y2={cy + outerR * 0.78}
        stroke={color}
        strokeWidth={stroke * 0.5}
        opacity={0.25}
      />

      {/* Pale Blue Dot — small dot sitting on horizon */}
      <Circle
        cx={cx}
        cy={horizonY}
        r={size * 0.038}
        fill={dotColor}
        opacity={0.9}
      />

      {/* Glow halo around dot */}
      <Circle
        cx={cx}
        cy={horizonY}
        r={size * 0.072}
        fill={dotColor}
        opacity={0.12}
      />
    </Svg>
  );
}
