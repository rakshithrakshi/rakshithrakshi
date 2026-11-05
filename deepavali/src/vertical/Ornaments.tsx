import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { noise, rand } from "../anim";
import { START, TOTAL } from "../timeline";

export const V = { W: 1080, H: 1920 };

export const C = {
  gold: "#f6c54a",
  goldDeep: "#c9861a",
  saffron: "#ff9a1f",
  marigold: "#ff7a12",
  magenta: "#e0338a",
  teal: "#19b3a6",
  plum: "#2a0a3a",
  ruby: "#b3132e",
};

export const GOLD_FILL = "linear-gradient(180deg, #fff1b8 0%, #f6c54a 35%, #d38f1c 70%, #9a5a0c 100%)";

// Background palette per scene (top, bottom, glow), cross-fading at scene starts
const PALETTES: [number, [string, string, string]][] = [
  [START.title, ["#3a0d3f", "#7a1d3a", "#ff9a1f"]],
  [START.demon, ["#2a0508", "#6a0f14", "#ff4a1f"]],
  [START.darkness, ["#0d0a2a", "#2a0a3a", "#6a4aff"]],
  [START.call, ["#3a1a05", "#0f4a4a", "#ffc23a"]],
  [START.battle, ["#2a0505", "#7a1a0a", "#ff6a1f"]],
  [START.wish, ["#2a0a3a", "#6a1a5a", "#ff7ab8"]],
  [START.light, ["#0a2a3a", "#7a3a0a", "#ffc23a"]],
  [START.message, ["#0a0a2a", "#3a1a4a", "#ffb84a"]],
];

const palette = (frame: number) => {
  const xs: number[] = [];
  const tops: string[] = [];
  const bots: string[] = [];
  const glows: string[] = [];
  PALETTES.forEach(([at, [t, b, g]], i) => {
    const a = i === 0 ? 0 : at - 8;
    const z = i === 0 ? 0 : at + 8;
    if (i > 0) {
      xs.push(a);
      tops.push(tops[tops.length - 1]);
      bots.push(bots[bots.length - 1]);
      glows.push(glows[glows.length - 1]);
    }
    xs.push(i === 0 ? 0 : z);
    tops.push(t);
    bots.push(b);
    glows.push(g);
  });
  const f = Math.min(Math.max(frame, 0), xs[xs.length - 1]);
  return [interpolateColors(f, xs, tops), interpolateColors(f, xs, bots), interpolateColors(f, xs, glows)];
};

// Rich drifting backdrop: scene-tinted gradient, colour blobs and a jaali lattice
export const FestiveBackground: React.FC = () => {
  const f = useCurrentFrame();
  const [top, bot, glow] = palette(f);
  const blob = (x: number, y: number, r: number, color: string, seed: number) => (
    <div
      style={{
        position: "absolute",
        left: x + noise(f / 90, seed) * 120 - r,
        top: y + noise(f / 110, seed + 5) * 120 - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        opacity: 0.55,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${bot} 100%)`, overflow: "hidden" }}>
      {blob(180, 260, 520, C.magenta, 1)}
      {blob(900, 380, 480, glow, 2)}
      {blob(540, 1560, 640, C.teal, 3)}
      {blob(120, 1780, 420, C.saffron, 4)}
      {blob(980, 1500, 460, C.magenta, 5)}
      <AbsoluteFill style={{ opacity: 0.09, translate: `0 ${(f * 0.4) % 120}px` }}>
        <svg width="1080" height="2160" style={{ position: "absolute", top: -120 }}>
          <defs>
            <pattern id="jaali" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 10 Q80 40 60 60 Q40 40 60 10 Z M60 110 Q80 80 60 60 Q40 80 60 110 Z M10 60 Q40 40 60 60 Q40 80 10 60 Z M110 60 Q80 40 60 60 Q80 80 110 60 Z" fill="none" stroke="#fff2c0" strokeWidth="3" />
              <circle cx="60" cy="60" r="6" fill="#fff2c0" />
              <circle cx="0" cy="0" r="4" fill="#fff2c0" />
              <circle cx="120" cy="0" r="4" fill="#fff2c0" />
              <circle cx="0" cy="120" r="4" fill="#fff2c0" />
              <circle cx="120" cy="120" r="4" fill="#fff2c0" />
            </pattern>
          </defs>
          <rect width="1080" height="2160" fill="url(#jaali)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Multi-ring mandala, rings counter-rotating
export const Mandala: React.FC<{ size: number; x: number; y: number; opacity?: number }> = ({ size, x, y, opacity = 1 }) => {
  const f = useCurrentFrame();
  const rings = [
    { n: 24, r: 92, len: 30, color: C.gold, rot: f * 0.25 },
    { n: 16, r: 70, len: 26, color: C.magenta, rot: -f * 0.35 },
    { n: 12, r: 50, len: 22, color: C.teal, rot: f * 0.5 },
    { n: 8, r: 32, len: 18, color: C.saffron, rot: -f * 0.6 },
  ];
  return (
    <svg viewBox="-110 -110 220 220" width={size} height={size} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, opacity, overflow: "visible" }}>
      <circle r={104} fill="none" stroke={C.gold} strokeWidth={1.5} strokeDasharray="2 4" transform={`rotate(${f * 0.1})`} />
      {rings.map((ring, k) => (
        <g key={k} transform={`rotate(${ring.rot})`}>
          {Array.from({ length: ring.n }, (_, i) => (
            <path
              key={i}
              d={`M0 ${-ring.r + ring.len} Q${ring.len * 0.4} ${-ring.r + ring.len / 2} 0 ${-ring.r} Q${-ring.len * 0.4} ${-ring.r + ring.len / 2} 0 ${-ring.r + ring.len} Z`}
              fill={ring.color}
              opacity={0.9}
              transform={`rotate(${(i * 360) / ring.n})`}
            />
          ))}
          <circle r={ring.r - ring.len - 2} fill="none" stroke={ring.color} strokeWidth={1.2} opacity={0.7} />
        </g>
      ))}
      <circle r={12} fill={C.gold} />
      <circle r={6} fill={C.magenta} />
    </svg>
  );
};

// Marigold garland swags across the top with mango leaves
export const Garland: React.FC<{ y?: number }> = ({ y = 0 }) => {
  const f = useCurrentFrame();
  const swags = 4;
  const w = V.W / swags;
  return (
    <svg width={V.W} height={220} style={{ position: "absolute", left: 0, top: y, overflow: "visible" }}>
      {Array.from({ length: swags }, (_, s) => {
        const x0 = s * w;
        const sag = 70 + Math.sin(f / 26 + s) * 6;
        const beads = 15;
        return (
          <g key={s}>
            {Array.from({ length: beads }, (_, i) => {
              const t = i / (beads - 1);
              const bx = x0 + t * w;
              const by = 18 + Math.sin(t * Math.PI) * sag;
              return <circle key={i} cx={bx} cy={by} r={12} fill={i % 2 ? C.marigold : "#ffc21a"} stroke="#9a3a05" strokeWidth={1.5} />;
            })}
            {/* hanging tassel of flowers */}
            <g transform={`rotate(${Math.sin(f / 20 + s) * 8} ${x0 + w / 2} ${18 + sag})`}>
              {[0, 1, 2, 3].map((k) => (
                <circle key={k} cx={x0 + w / 2} cy={18 + sag + 20 + k * 20} r={10 - k} fill={k % 2 ? "#ffc21a" : C.marigold} stroke="#9a3a05" strokeWidth={1.2} />
              ))}
              <path d={`M${x0 + w / 2} ${18 + sag + 96} q-14 30 0 52 q14 -22 0 -52`} fill="#2f8a3a" />
            </g>
          </g>
        );
      })}
      {Array.from({ length: swags + 1 }, (_, s) => (
        <g key={`k${s}`}>
          <circle cx={s * w} cy={18} r={18} fill={C.magenta} stroke={C.gold} strokeWidth={3} />
          <circle cx={s * w} cy={18} r={7} fill={C.gold} />
        </g>
      ))}
    </svg>
  );
};

// Swinging brass temple bell
export const Bell: React.FC<{ x: number; y: number; phase?: number }> = ({ x, y, phase = 0 }) => {
  const f = useCurrentFrame();
  const swing = Math.sin(f / 18 + phase) * 9;
  return (
    <svg viewBox="-60 0 120 240" width={110} height={220} style={{ position: "absolute", left: x - 55, top: y, overflow: "visible", rotate: `${swing}deg`, transformOrigin: "50% 0%" }}>
      <defs>
        <linearGradient id={`bell${phase}`} x1="0" x2="1">
          <stop offset="0" stopColor="#9a5a0c" />
          <stop offset="0.45" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#b8720e" />
        </linearGradient>
      </defs>
      <path d="M0 0 L0 70" stroke="#8a4a0a" strokeWidth={5} />
      {[20, 40, 58].map((cy) => (
        <circle key={cy} cx={0} cy={cy} r={6} fill="#ffc21a" />
      ))}
      <path d="M-14 80 Q0 64 14 80 L22 130 Q30 170 50 190 L-50 190 Q-30 170 -22 130 Z" fill={`url(#bell${phase})`} stroke="#6a3a05" strokeWidth={3} />
      <rect x={-54} y={186} width={108} height={12} rx={6} fill={`url(#bell${phase})`} stroke="#6a3a05" strokeWidth={3} />
      <circle cx={0} cy={214} r={11} fill={`url(#bell${phase})`} stroke="#6a3a05" strokeWidth={3} />
    </svg>
  );
};

// Marigold petals and rose petals drifting down the whole frame
export const Petals: React.FC<{ count?: number }> = ({ count = 34 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: number) => rand(i * 17 + k);
        const speed = 1.6 + r(1) * 2.2;
        const y = ((r(2) * 2400 + f * speed) % 2200) - 140;
        const x = r(3) * V.W + Math.sin(f / (30 + r(4) * 30) + i) * 50;
        const s = 14 + r(5) * 16;
        const colors = [C.marigold, "#ffc21a", C.magenta, "#ff5a7a"];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s * 0.62,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), ${colors[i % 4]} 45%)`,
              rotate: `${f * (2 + r(6) * 4) * (i % 2 ? 1 : -1)}deg`,
              scale: `1 ${0.4 + Math.abs(Math.sin(f / 12 + i)) * 0.6}`,
              opacity: 0.9,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Four-point twinkling stars
export const Twinkles: React.FC<{ area: [number, number, number, number]; count?: number; seed?: number }> = ({ area, count = 18, seed = 1 }) => {
  const f = useCurrentFrame();
  const [x0, y0, w, h] = area;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: number) => rand(seed * 41 + i * 7 + k);
        const tw = Math.max(0, Math.sin(f / (10 + r(1) * 18) + i * 2));
        const s = 10 + r(2) * 22;
        return (
          <svg key={i} viewBox="-10 -10 20 20" width={s} height={s} style={{ position: "absolute", left: x0 + r(3) * w, top: y0 + r(4) * h, opacity: tw, scale: String(0.5 + tw * 0.6), mixBlendMode: "screen" }}>
            <path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10 Z" fill="#fff4c8" />
          </svg>
        );
      })}
    </>
  );
};

// Diya-shaped progress marker along a gold line
export const Progress: React.FC<{ y: number }> = ({ y }) => {
  const f = useCurrentFrame();
  const p = f / (TOTAL - 1);
  const x0 = 120;
  const x1 = 960;
  const x = x0 + (x1 - x0) * p;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: V.W, height: 40 }}>
      <div style={{ position: "absolute", left: x0, top: 18, width: x1 - x0, height: 4, borderRadius: 2, background: "rgba(255,230,170,0.25)" }} />
      <div style={{ position: "absolute", left: x0, top: 18, width: x - x0, height: 4, borderRadius: 2, background: GOLD_FILL, boxShadow: "0 0 12px rgba(255,190,80,0.9)" }} />
      <div
        style={{
          position: "absolute",
          left: x - 9,
          top: -6,
          width: 18,
          height: 26,
          borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%",
          background: "radial-gradient(ellipse at 50% 75%, #fff 0%, #ffe08a 35%, #ff9a1f 70%, rgba(255,120,30,0) 100%)",
          scale: `1 ${1 + noise(f / 3, 2) * 0.15}`,
          filter: "drop-shadow(0 0 8px rgba(255,170,60,0.9))",
        }}
      />
    </div>
  );
};
