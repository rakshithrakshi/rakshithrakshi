import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { eio, rand } from "../anim";

// Animated film grain: an SVG turbulence whose seed changes every frame
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 30} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.45 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,8,0,${strength}) 100%)`,
    }}
  />
);

// Soft drifting bokeh dust motes catching the light
export const Bokeh: React.FC<{ count?: number; color?: string; seed?: number }> = ({
  count = 26,
  color = "255,226,160",
  seed = 3,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: number) => rand(seed * 50 + i * 11 + k);
        const size = 12 + r(1) * 70;
        const x = (r(2) * width + frame * (0.3 + r(3)) * (r(4) > 0.5 ? 1 : -1) + width) % width;
        const y = (r(5) * height - frame * (0.4 + r(6) * 0.8) + height * 2) % height;
        const tw = 0.25 + 0.75 * Math.abs(Math.sin(frame / (20 + r(7) * 30) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${color},${0.55 * tw}) 0%, rgba(${color},0) 70%)`,
              filter: `blur(${size > 50 ? 4 : 1}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Warm anamorphic light leak sweeping across, driven by local frames [start, start+dur]
export const LightLeak: React.FC<{ start: number; dur?: number; hue?: string }> = ({
  start,
  dur = 30,
  hue = "255,170,70",
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: eio,
  });
  if (p <= 0 || p >= 1) return null;
  const strength = Math.sin(p * Math.PI);
  const x = -0.4 * width + p * 1.8 * width;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: strength }}>
      <div
        style={{
          position: "absolute",
          left: x - 700,
          top: -300,
          width: 1400,
          height: 1700,
          rotate: "18deg",
          background: `radial-gradient(ellipse at center, rgba(${hue},0.9) 0%, rgba(255,90,60,0.45) 35%, rgba(255,60,80,0) 70%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "48%",
          height: 6,
          background: `linear-gradient(90deg, rgba(${hue},0) 0%, rgba(255,240,210,0.9) ${p * 100}%, rgba(${hue},0) 100%)`,
          filter: "blur(3px)",
        }}
      />
    </AbsoluteFill>
  );
};

// Rotating god rays from a point
export const Rays: React.FC<{ x: string; y: string; opacity: number; color?: string }> = ({
  x,
  y,
  opacity,
  color = "255,236,180",
}) => {
  const frame = useCurrentFrame();
  const stops = Array.from({ length: 18 }, (_, i) => {
    const a = i * 20;
    return `rgba(${color},0.22) ${a}deg, rgba(${color},0) ${a + 7}deg, rgba(${color},0) ${a + 20}deg`;
  }).join(",");
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "screen",
        background: `conic-gradient(from ${frame * 0.25}deg at ${x} ${y}, ${stops})`,
        maskImage: `radial-gradient(circle at ${x} ${y}, black 0%, transparent 65%)`,
        WebkitMaskImage: `radial-gradient(circle at ${x} ${y}, black 0%, transparent 65%)`,
      }}
    />
  );
};
