import React from "react";
import { interpolate } from "remotion";
import { eout, rand } from "../anim";

// Illustrated school facade. `rise` 0..1 lifts it into place,
// `lights` 0..1 switches the windows on one by one, `flag` drives the flag wave.
export const School: React.FC<{ rise: number; lights: number; flag: number; doorOpen?: number }> = ({
  rise,
  lights,
  flag,
  doorOpen = 0,
}) => {
  const windows: { x: number; y: number; i: number }[] = [];
  let i = 0;
  for (const row of [330, 450]) {
    for (const x of [-560, -460, -360, -260, 200, 300, 400, 500]) {
      windows.push({ x, y: row, i: i++ });
    }
  }
  const order = (n: number) => rand(n + 3);
  const wave = Math.sin(flag * Math.PI * 2);

  return (
    <svg viewBox="-700 0 1400 700" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4e0" />
          <stop offset="1" stopColor="#f2d9b3" />
        </linearGradient>
        <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9553b" />
          <stop offset="1" stopColor="#a8382a" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#ffb648" />
        </linearGradient>
        <radialGradient id="doorGlow" cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="1" stopColor="#ffc35e" />
        </radialGradient>
      </defs>
      <g transform={`translate(0 ${(1 - rise) * 520})`} opacity={interpolate(rise, [0, 0.3], [0, 1], { extrapolateRight: "clamp" })}>
        {/* wings */}
        <rect x={-640} y={280} width={480} height={320} rx={10} fill="url(#wall)" />
        <rect x={160} y={280} width={480} height={320} rx={10} fill="url(#wall)" />
        <path d="M-660 290 L-400 210 L-140 290 Z" fill="url(#roof)" />
        <path d="M140 290 L400 210 L660 290 Z" fill="url(#roof)" />
        {/* central block */}
        <rect x={-180} y={200} width={360} height={400} rx={10} fill="url(#wall)" />
        <path d="M-210 212 L0 80 L210 212 Z" fill="url(#roof)" />
        {/* bell tower */}
        <rect x={-50} y={0} width={100} height={110} fill="#f6e3c3" />
        <path d="M-70 10 L0 -60 L70 10 Z" fill="url(#roof)" />
        <path d="M-26 30 Q0 10 26 30 L26 96 L-26 96 Z" fill="#5a3a2a" />
        <path d="M-14 50 Q0 36 14 50 L18 80 L-18 80 Z" fill="#f4b73a" />
        {/* clock */}
        <circle cx={0} cy={160} r={38} fill="#fffaf0" stroke="#a8382a" strokeWidth={6} />
        <path d="M0 160 L0 134 M0 160 L18 168" stroke="#3b2f2f" strokeWidth={5} strokeLinecap="round" />
        {/* flag */}
        <path d="M0 -60 L0 -170" stroke="#5a3a2a" strokeWidth={5} />
        <path
          d={`M0 -170 Q30 ${-182 + wave * 8} 60 -170 Q90 ${-158 - wave * 8} 110 -168 L110 -128 Q90 ${-118 - wave * 8} 60 -130 Q30 ${-142 + wave * 8} 0 -130 Z`}
          fill="#f4b73a"
        />
        {/* windows */}
        {windows.map((w) => {
          const on = interpolate(lights, [order(w.i) * 0.7, order(w.i) * 0.7 + 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: eout,
          });
          return (
            <g key={w.i}>
              <rect x={w.x} y={w.y} width={64} height={80} rx={8} fill="#6b5546" />
              <rect x={w.x + 5} y={w.y + 5} width={54} height={70} rx={5} fill="url(#glass)" opacity={on} />
              <rect x={w.x + 30} y={w.y + 5} width={4} height={70} fill="#fff4e0" />
              <rect x={w.x + 5} y={w.y + 38} width={54} height={4} fill="#fff4e0" />
              <rect x={w.x - 6} y={w.y + 80} width={76} height={8} rx={3} fill="#e7c89d" />
            </g>
          );
        })}
        {/* entrance */}
        <rect x={-110} y={400} width={220} height={200} rx={8} fill="url(#doorGlow)" />
        <rect x={-110} y={400} width={110 * (1 - doorOpen)} height={200} fill="#7a4b33" />
        <rect x={110 - 110 * (1 - doorOpen)} y={400} width={110 * (1 - doorOpen)} height={200} fill="#6a3f2b" />
        <path d="M-130 400 Q0 330 130 400" stroke="#a8382a" strokeWidth={14} fill="none" />
        {/* steps */}
        <rect x={-150} y={600} width={300} height={18} rx={4} fill="#e2c49a" />
        <rect x={-180} y={618} width={360} height={18} rx={4} fill="#d4b285" />
      </g>
    </svg>
  );
};
