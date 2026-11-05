import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { eout, noise, rand } from "../anim";
import { HOLE, INK } from "./Figure";

// All "leather" props are drawn for a multiply layer: ink outlines, dyed fills,
// pale punched holes. Flames and glows are separate, for a screen layer.

const arches = (x0: number, y: number, n: number, w: number, h: number) =>
  Array.from({ length: n }, (_, i) => {
    const x = x0 + i * w;
    return <path key={i} d={`M${x + 8} ${y} L${x + 8} ${y - h * 0.6} Q${x + w / 2} ${y - h} ${x + w - 8} ${y - h * 0.6} L${x + w - 8} ${y} Z`} fill={HOLE} />;
  });

// Narakasura's fortress city on the horizon
export const Fortress: React.FC<{ color?: string }> = ({ color = "#2a0d08" }) => (
  <svg viewBox="0 0 1920 700" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g fill={color} stroke={INK} strokeWidth={3}>
      <path d="M0 700 L0 470 L140 470 L140 400 L200 360 L260 400 L260 470 L420 470 L420 330 L470 260 L520 330 L520 470 L700 470 L700 280 L760 200 L820 120 L880 200 L940 280 L940 470 L1100 470 L1100 300 L1160 220 L1220 300 L1220 470 L1400 470 L1400 380 L1460 330 L1520 380 L1520 470 L1700 470 L1700 350 L1760 290 L1820 350 L1820 470 L1920 470 L1920 700 Z" />
      {/* battlements */}
      {Array.from({ length: 48 }, (_, i) => (
        <rect key={i} x={i * 40} y={452} width={22} height={22} />
      ))}
      {/* banners */}
      <path d="M820 120 L820 40 L880 56 L820 74" />
      <path d="M470 260 L470 200 L516 212 L470 226" />
      <path d="M1160 220 L1160 160 L1206 172 L1160 186" />
    </g>
    {arches(720, 470, 5, 44, 110)}
    {arches(1110, 470, 2, 50, 90)}
    {arches(430, 470, 2, 44, 80)}
    {Array.from({ length: 30 }, (_, i) => (
      <circle key={i} cx={30 + i * 64} cy={560 + (i % 2) * 40} r={6} fill={HOLE} />
    ))}
  </svg>
);

// Golden Dwaraka: domes, a gopura and banners
export const Palace: React.FC = () => (
  <svg viewBox="0 0 1920 700" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g stroke={INK} strokeWidth={4}>
      <path d="M0 700 L0 430 L1920 430 L1920 700 Z" fill="#c98a2a" />
      {/* gopura */}
      <path d="M820 430 L840 300 L860 300 L870 220 L890 220 L900 150 L1020 150 L1030 220 L1050 220 L1060 300 L1080 300 L1100 430 Z" fill="#e0a42e" />
      <path d="M900 150 Q960 90 1020 150 Z" fill="#e0a42e" />
      <path d="M960 96 L960 50" />
      {/* domes */}
      {[[340, 1], [600, 0.8], [1320, 0.8], [1580, 1]].map(([x, s], i) => (
        <g key={i} transform={`translate(${x} 430) scale(${s})`}>
          <rect x={-120} y={-180} width={240} height={180} fill="#d99a2c" />
          <path d="M-110 -180 Q0 -360 110 -180 Z" fill="#f0bb45" />
          <path d="M0 -330 L0 -380" />
          <path d="M0 -380 L40 -366 L0 -352 Z" fill="#c2301e" />
        </g>
      ))}
    </g>
    {arches(840, 430, 6, 40, 70)}
    {arches(240, 430, 5, 40, 90)}
    {arches(1480, 430, 5, 40, 90)}
    {[[904, 300], [940, 300], [980, 300], [1016, 300], [920, 240], [960, 240], [1000, 240], [940, 190], [980, 190]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={7} fill={HOLE} />
    ))}
  </svg>
);

// Rolling layered clouds (leather cut-outs with scalloped edges)
export const Clouds: React.FC<{ seed?: number; color?: string; y?: number; speed?: number }> = ({ seed = 1, color = "#e8c9a0", y = 0, speed = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: 5 }, (_, i) => {
        const r = (k: number) => rand(seed * 31 + i * 7 + k);
        const w = 380 + r(1) * 300;
        const x = ((r(2) * 2400 - frame * speed * (1 + r(3))) % 2600 + 2600) % 2600 - 400;
        const yy = y + r(4) * 700;
        return (
          <svg key={i} viewBox="0 0 400 140" width={w} height={w * 0.35} style={{ position: "absolute", left: x, top: yy, overflow: "visible" }}>
            <path d="M20 120 Q0 80 50 70 Q60 20 120 40 Q160 0 220 30 Q280 10 300 60 Q380 60 370 110 Q390 130 350 130 L40 130 Q10 130 20 120 Z" fill={color} stroke={INK} strokeWidth={3} />
            {[80, 140, 200, 260, 320].map((cx) => (
              <circle key={cx} cx={cx} cy={100} r={5} fill={HOLE} />
            ))}
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

// Diya bowls (multiply layer); pair with <Flames> on a screen layer at the same spots
export const DiyaBowls: React.FC<{ pts: { x: number; y: number; s?: number; on?: number }[] }> = ({ pts }) => (
  <>
    {pts.map((p, i) => {
      const s = p.s ?? 1;
      return (
        <svg key={i} viewBox="-60 -20 120 60" width={120 * s} height={60 * s} style={{ position: "absolute", left: p.x - 60 * s, top: p.y - 20 * s, overflow: "visible" }}>
          <path d="M-52 0 Q0 46 52 0 L40 -8 L-40 -8 Z" fill="#a8562a" stroke={INK} strokeWidth={3} />
          <path d="M44 -6 L60 -14 L50 -2 Z" fill="#a8562a" stroke={INK} strokeWidth={2} />
          {holes3()}
        </svg>
      );
    })}
  </>
);
const holes3 = () => [-24, 0, 24].map((x) => <circle key={x} cx={x} cy={10} r={3.4} fill={HOLE} />);

export const Flames: React.FC<{ pts: { x: number; y: number; s?: number; on?: number }[]; seed?: number }> = ({ pts, seed = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {pts.map((p, i) => {
        const s = (p.s ?? 1) * (p.on ?? 1);
        if (s <= 0.01) return null;
        const fl = noise(frame / 2.6, i + seed);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: p.x + 44 * (p.s ?? 1) - 120 * s,
                top: p.y - 30 * (p.s ?? 1) - 120 * s,
                width: 240 * s,
                height: 240 * s,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,190,90,0.55) 0%, rgba(255,140,50,0.18) 40%, rgba(255,120,40,0) 70%)",
                opacity: 0.85 + fl * 0.15,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: p.x + 44 * (p.s ?? 1) - 14 * s,
                top: p.y - 30 * (p.s ?? 1) - 46 * s,
                width: 28 * s,
                height: 50 * s,
                borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%",
                background: "radial-gradient(ellipse at 50% 75%, #ffffff 0%, #fff0b0 30%, #ffb040 65%, rgba(255,120,30,0) 100%)",
                transformOrigin: "50% 100%",
                rotate: `${fl * 6}deg`,
                scale: `${1 + fl * 0.08} ${1 + noise(frame / 3.1, i + seed + 50) * 0.16}`,
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

// Aditi's divine earrings (kundalas)
export const Kundalas: React.FC<{ glow: number }> = ({ glow }) => (
  <svg viewBox="0 0 400 260" width="100%" height="100%" style={{ overflow: "visible" }}>
    {[100, 300].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={130} r={70} fill="#e8a92a" stroke={INK} strokeWidth={5} />
        <circle cx={cx} cy={130} r={42} fill={HOLE} stroke={INK} strokeWidth={4} opacity={0.4 + glow * 0.6} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={cx + Math.cos(a) * 56} cy={130 + Math.sin(a) * 56} r={6} fill={HOLE} />;
        })}
        <path d={`M${cx} 200 L${cx - 12} 240 L${cx} 254 L${cx + 12} 240 Z`} fill="#c2301e" stroke={INK} strokeWidth={3} />
      </g>
    ))}
  </svg>
);

// Prison bars with hanging chains
export const Bars: React.FC<{ dissolve?: number }> = ({ dissolve = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1200 600" width="100%" height="100%" style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={1200} height={40} fill="#2a1408" stroke={INK} strokeWidth={4} opacity={1 - dissolve} />
      <rect x={0} y={560} width={1200} height={40} fill="#2a1408" stroke={INK} strokeWidth={4} opacity={1 - dissolve} />
      {Array.from({ length: 13 }, (_, i) => {
        const gone = interpolate(dissolve, [i / 20, i / 20 + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eout });
        return (
          <rect key={i} x={40 + i * 90} y={40} width={18} height={520} fill="#2a1408" stroke={INK} strokeWidth={3} opacity={1 - gone} transform={`translate(0 ${-gone * 40})`} />
        );
      })}
      {[260, 700, 980].map((x, i) => (
        <g key={i} transform={`rotate(${Math.sin(frame / 20 + i) * 6} ${x} 40)`} opacity={1 - dissolve}>
          {Array.from({ length: 6 }, (_, k) => (
            <ellipse key={k} cx={x} cy={60 + k * 26} rx={8} ry={14} fill="none" stroke={INK} strokeWidth={6} />
          ))}
        </g>
      ))}
    </svg>
  );
};

// A Karnataka home with a tulasi katte and a doorway
export const Home: React.FC = () => (
  <svg viewBox="0 0 1100 700" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g stroke={INK} strokeWidth={4}>
      <path d="M80 700 L80 330 L1020 330 L1020 700 Z" fill="#d98a3a" />
      <path d="M30 340 L550 120 L1070 340 Z" fill="#a8401e" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${60 + i * 86} ${330 - Math.max(0, 210 - Math.abs(i * 86 + 60 - 550) * 0.42)} L${60 + i * 86} 336`} stroke="#6a2410" strokeWidth={3} />
      ))}
      <rect x={470} y={430} width={160} height={270} rx={8} fill="#6a3416" />
      <rect x={200} y={420} width={140} height={120} fill="#6a3416" />
      <rect x={760} y={420} width={140} height={120} fill="#6a3416" />
      {/* tulasi katte */}
      <path d="M840 700 L860 600 L960 600 L980 700 Z" fill="#e8b860" />
      <path d="M900 600 Q880 540 910 500 Q930 540 920 600 Z M910 560 Q960 520 980 540 Q950 560 912 572 Z M906 570 Q860 530 846 550 Q870 570 904 580 Z" fill="#3f8a3a" />
    </g>
    {[[490, 470], [530, 470], [570, 470], [610, 470], [220, 450], [260, 450], [300, 450], [780, 450], [820, 450], [860, 450]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={7} fill={HOLE} />
    ))}
    {/* mango-leaf thoranam over the door */}
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M${474 + i * 19} 430 Q${464 + i * 19} 460 ${474 + i * 19} 486 Q${484 + i * 19} 460 ${474 + i * 19} 430`} fill="#3f8a3a" stroke={INK} strokeWidth={2} />
    ))}
  </svg>
);

// Rangoli mandala (leather cut, lots of holes)
export const Rangoli: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => (
  <svg viewBox="-200 -200 400 400" width="100%" height="100%" style={{ overflow: "visible" }}>
    {Array.from({ length: 16 }, (_, i) => (
      <path
        key={i}
        d="M0 -40 Q30 -110 0 -180 Q-30 -110 0 -40 Z"
        fill={i % 2 ? "#d4302a" : "#efb43a"}
        stroke={INK}
        strokeWidth={3}
        transform={`rotate(${i * 22.5}) scale(${Math.min(1, Math.max(0, reveal * 1.6 - i * 0.04))})`}
      />
    ))}
    <circle r={44} fill="#2f9a6a" stroke={INK} strokeWidth={4} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 28} cy={Math.sin(a) * 28} r={4} fill={HOLE} />;
    })}
  </svg>
);

// Firework burst in the far sky (screen layer)
export const Burst: React.FC<{ at: number; x: number; y: number; color: string; seed: number }> = ({ at, x, y, color, seed }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 30;
  if (t < 0 || t > 1.6) return null;
  const p = 1 - Math.exp(-t * 4);
  const fade = Math.max(0, 1 - t / 1.6);
  return (
    <>
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2 + rand(seed) * 0.3;
        const d = p * (120 + rand(seed + i) * 60);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d,
              top: y + Math.sin(a) * d + t * t * 40,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 14px ${color}`,
              opacity: fade,
            }}
          />
        );
      })}
    </>
  );
};
