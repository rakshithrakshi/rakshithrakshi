import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { eout, rand } from "../anim";

const PALETTE = ["#f4b73a", "#e9573f", "#3fb6a8", "#5b8def", "#f28fb5", "#8e6cf0"];

// Swinging string of pennants across the top of the frame
export const Bunting: React.FC<{ drop: number; y?: number; sag?: number; seed?: number }> = ({
  drop,
  y = 60,
  sag = 90,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const n = 16;
  const sway = Math.sin(frame / 22 + seed) * 6;
  const offsetY = (1 - drop) * -260;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return { x: -40 + t * (width + 80), y: y + Math.sin(t * Math.PI) * sag };
  });
  return (
    <svg width={width} height={400} style={{ position: "absolute", top: offsetY, left: 0, overflow: "visible" }}>
      <path
        d={`M${pts[0].x} ${pts[0].y} Q${width / 2} ${y + sag * 2} ${pts[n - 1].x} ${pts[n - 1].y}`}
        stroke="#6b4a36"
        strokeWidth={3}
        fill="none"
      />
      {pts.slice(0, -1).map((p, i) => {
        const swing = sway * Math.sin(i * 0.9 + frame / 14);
        return (
          <path
            key={i}
            d={`M${p.x + 8} ${p.y + 2} L${p.x + 62} ${p.y + 6} L${p.x + 34} ${p.y + 74} Z`}
            fill={PALETTE[(i + seed) % PALETTE.length]}
            transform={`rotate(${swing} ${p.x + 34} ${p.y + 4})`}
          />
        );
      })}
    </svg>
  );
};

// Balloons drifting upward with a gentle sway
export const Balloons: React.FC<{ start: number; count?: number; seed?: number }> = ({
  start,
  count = 9,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: number) => rand(seed * 100 + i * 7 + k);
        const side = i % 2 === 0 ? r(1) * 0.28 : 0.72 + r(1) * 0.28;
        const x = side * width;
        const speed = 3.2 + r(2) * 2.6;
        const t = Math.max(0, frame - start - r(3) * 30);
        const y = height + 80 - t * speed;
        const sway = Math.sin(t / 18 + i) * 18;
        const size = 70 + r(4) * 50;
        const color = PALETTE[i % PALETTE.length];
        return (
          <svg
            key={i}
            width={size}
            height={size * 2.2}
            viewBox="0 0 100 220"
            style={{ position: "absolute", left: x + sway, top: y, rotate: `${sway * 0.3}deg` }}
          >
            <defs>
              <radialGradient id={`bal-${seed}-${i}`} cx="0.35" cy="0.3" r="0.75">
                <stop offset="0" stopColor="#fff" stopOpacity={0.7} />
                <stop offset="0.25" stopColor={color} />
                <stop offset="1" stopColor={color} stopOpacity={0.85} />
              </radialGradient>
            </defs>
            <path d="M50 118 Q44 150 54 175 Q60 200 48 220" stroke="#ffffff" strokeOpacity={0.7} strokeWidth={1.5} fill="none" />
            <ellipse cx={50} cy={58} rx={44} ry={54} fill={`url(#bal-${seed}-${i})`} />
            <path d="M44 110 L56 110 L50 120 Z" fill={color} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

// Confetti burst with gravity and spin, starting at `start`
export const Confetti: React.FC<{ start: number; x?: number; y?: number; count?: number; seed?: number }> = ({
  start,
  x = 0.5,
  y = 0.45,
  count = 140,
  seed = 7,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = (frame - start) / fps;
  if (t < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: number) => rand(seed * 1000 + i * 13 + k);
        const ang = r(1) * Math.PI * 2;
        const v = 600 + r(2) * 1100;
        const drag = Math.exp(-t * 1.6);
        const dist = (v * (1 - drag)) / 1.6;
        const px = x * width + Math.cos(ang) * dist + Math.sin(t * 3 + i) * 20;
        const py = y * height + Math.sin(ang) * dist * 0.7 + 260 * t * t;
        const spin = t * (200 + r(3) * 500) * (r(4) > 0.5 ? 1 : -1);
        const w = 10 + r(5) * 12;
        const fade = interpolate(t, [2.4, 3.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const flip = Math.abs(Math.cos(t * 6 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: r(6) > 0.6 ? w : w * 0.45,
              borderRadius: r(6) > 0.85 ? "50%" : 2,
              background: PALETTE[i % PALETTE.length],
              rotate: `${spin}deg`,
              scale: `1 ${0.3 + flip * 0.7}`,
              opacity: fade,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// A comic speech bubble that pops in with overshoot
export const Bubble: React.FC<{
  text: string;
  at: number;
  x: number;
  y: number;
  color?: string;
  font: string;
  tail?: "left" | "right";
}> = ({ text, at, x, y, color = "#ffffff", font, tail = "left" }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [at, at + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (v) => {
      // ease-out-back
      const c1 = 1.9;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(v - 1, 3) + c1 * Math.pow(v - 1, 2);
    },
  });
  const float = Math.sin((frame - at) / 16) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        scale: String(Math.max(0, s)),
        transformOrigin: tail === "left" ? "10% 100%" : "90% 100%",
        opacity: interpolate(frame, [at, at + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eout }),
        background: color,
        padding: "18px 34px",
        borderRadius: 40,
        fontFamily: font,
        fontSize: 54,
        color: "#2b2340",
        boxShadow: "0 18px 40px rgba(60,30,10,0.25)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
      <div
        style={{
          position: "absolute",
          bottom: -18,
          [tail]: 36,
          width: 0,
          height: 0,
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderTop: `22px solid ${color}`,
        }}
      />
    </div>
  );
};
