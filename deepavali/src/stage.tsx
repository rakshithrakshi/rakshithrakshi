import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { eio, flicker, noise, rand } from "./anim";
import { HEIGHT, WIDTH } from "./timeline";

// Scenes are always drawn on a 1920x1080 canvas, even when a composition
// (e.g. the 9:16 cut) shows them scaled inside a different frame size.
const useCanvas = () => ({ width: WIDTH, height: HEIGHT });

// ------------------------------------------------------------------ 2.5D camera

export type Cam = { x: number; y: number; zoom: number; shake?: number };
const CamCtx = createContext<Cam>({ x: 0, y: 0, zoom: 1 });

// A scene's stage: everything inside shares one camera.
export const Stage: React.FC<{ cam: Cam; children: React.ReactNode; fade?: number }> = ({
  cam,
  children,
  fade = 1,
}) => {
  const frame = useCurrentFrame();
  const s = cam.shake ?? 0;
  const shaken = {
    ...cam,
    x: cam.x + noise(frame / 1.3, 3) * 26 * s,
    y: cam.y + noise(frame / 1.3, 9) * 18 * s,
  };
  return (
    <CamCtx.Provider value={shaken}>
      <AbsoluteFill style={{ overflow: "hidden", background: "#050201" }}>
        {children}
        {/* lamp dims between scenes */}
        <AbsoluteFill style={{ background: "#050201", opacity: 1 - fade, pointerEvents: "none" }} />
      </AbsoluteFill>
    </CamCtx.Provider>
  );
};

// One depth plane. depth 1 = the cloth screen (sharp). >1 sits further away,
// <1 is in front of the screen, closer to the viewer. Parallax, scale and
// defocus all follow from depth.
export const Layer: React.FC<{
  depth: number;
  blend?: React.CSSProperties["mixBlendMode"];
  blur?: number; // extra blur multiplier
  opacity?: number;
  children: React.ReactNode;
}> = ({ depth, blend, blur = 1, opacity = 1, children }) => {
  const c = useContext(CamCtx);
  const k = 1 / depth;
  const scale = 1 + (c.zoom - 1) * k;
  const defocus = Math.abs(Math.log2(depth)) * 5 * blur;
  return (
    <AbsoluteFill
      style={{
        translate: `${-c.x * k}px ${-c.y * k}px`,
        scale: String(scale),
        filter: defocus > 0.3 ? `blur(${defocus.toFixed(2)}px)` : undefined,
        mixBlendMode: blend,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the screen

export type ScreenTint = { core: string; mid: string; edge: string };
export const TINTS = {
  amber: { core: "#fff1cc", mid: "#f3a24c", edge: "#5a1d06" },
  ember: { core: "#ffd2a0", mid: "#d2512a", edge: "#3a0804" },
  dusk: { core: "#ffe0c0", mid: "#b8607a", edge: "#20102e" },
  gold: { core: "#fff6dc", mid: "#f0bb55", edge: "#6a3410" },
  night: { core: "#c9d7ff", mid: "#4a5a9a", edge: "#0a0c22" },
} satisfies Record<string, ScreenTint>;

// Far larger than the frame so camera moves and zooms never reveal its edge
const OVERSIZE: React.CSSProperties = { position: "absolute", left: -1100, top: -800, width: 1920 + 2200, height: 1080 + 1600 };

// The backlit cotton screen of a Togalu Gombeyaata stage: a flickering oil-lamp
// hotspot, cloth weave, and a darkness level that dims the whole stage.
export const Screen: React.FC<{ tint: ScreenTint; level?: number; hotspot?: [number, number] }> = ({
  tint,
  level = 1,
  hotspot = [50, 52],
}) => {
  const frame = useCurrentFrame();
  const f = flicker(frame) * level;
  const hx = hotspot[0] + noise(frame / 25, 2) * 1.5;
  const hy = hotspot[1] + noise(frame / 25, 5) * 1.2;
  return (
    <Layer depth={1.15} blur={0}>
      <div
        style={{
          ...OVERSIZE,
          background: `radial-gradient(ellipse 30% 36% at ${(1100 + (hx / 100) * 1920) / 41.2}% ${(800 + (hy / 100) * 1080) / 26.8}%, ${tint.core} 0%, ${tint.mid} 42%, ${tint.edge} 100%)`,
        }}
      />
      {/* cloth weave */}
      <div style={{ ...OVERSIZE, opacity: 0.16, mixBlendMode: "multiply" }}>
        <svg width="100%" height="100%">
          <filter id="weave">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves={2} seed={4} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#weave)" />
        </svg>
      </div>
      <div style={{ ...OVERSIZE, background: "#000", opacity: Math.min(1, Math.max(0, 1 - f)) }} />
    </Layer>
  );
};

// ------------------------------------------------------------------ foreground

// Mango-leaf thoranam strung across the top, very close to the lens (dark, defocused).
export const Thoranam: React.FC<{ y?: number; sway?: number }> = ({ y = -30, sway = 1 }) => {
  const frame = useCurrentFrame();
  const { width } = useCanvas();
  const n = 22;
  return (
    <svg width={width + 400} height={320} style={{ position: "absolute", left: -200, top: y, overflow: "visible" }}>
      <path d={`M0 40 Q${(width + 400) / 2} 120 ${width + 400} 40`} stroke="#120803" strokeWidth={8} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const x = t * (width + 400);
        const yy = 40 + Math.sin(t * Math.PI) * 40;
        const rot = Math.sin(frame / 30 + i * 0.7) * 6 * sway;
        return (
          <g key={i} transform={`rotate(${rot} ${x} ${yy})`}>
            <path d={`M${x} ${yy} Q${x - 26} ${yy + 70} ${x} ${yy + 150} Q${x + 26} ${yy + 70} ${x} ${yy}`} fill="#120803" />
            {i % 3 === 0 && <circle cx={x + 40} cy={yy + 20} r={14} fill="#120803" />}
          </g>
        );
      })}
    </svg>
  );
};

// Brass oil lamp (kuthuvilakku) silhouette standing in the foreground corner
export const LampStand: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  const frame = useCurrentFrame();
  const x = side === "left" ? -60 : 1640;
  return (
    <div style={{ position: "absolute", left: x, bottom: -40, width: 340, height: 760 }}>
      <svg viewBox="0 0 340 760" width="100%" height="100%" style={{ overflow: "visible" }}>
        <path d="M150 760 L190 760 L184 300 L156 300 Z M90 760 Q170 700 250 760 Z M110 300 Q170 340 230 300 L220 280 L120 280 Z M160 280 L180 280 L175 150 L165 150 Z M150 150 Q170 110 190 150 Z" fill="#100602" />
      </svg>
      {/* the flames themselves add light */}
      {[120, 170, 220].map((fx, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: fx - 40,
            top: 200 + (i === 1 ? -20 : 0),
            width: 80,
            height: 110,
            borderRadius: "50% 50% 45% 45% / 65% 65% 35% 35%",
            background: "radial-gradient(ellipse at 50% 70%, rgba(255,250,220,1) 0%, rgba(255,190,80,0.85) 35%, rgba(255,120,30,0) 70%)",
            scale: `${1 + noise(frame / 2.5, i) * 0.12} ${1 + noise(frame / 3, i + 4) * 0.18}`,
            mixBlendMode: "screen",
          }}
        />
      ))}
    </div>
  );
};

// ------------------------------------------------------------------ light fx

// Glowing embers / sparks drifting upward (screen-blended)
export const Embers: React.FC<{ count?: number; seed?: number; color?: string; rise?: number; from?: number }> = ({
  count = 40,
  seed = 1,
  color = "255,170,80",
  rise = 1,
  from = 0,
}) => {
  const frame = useCurrentFrame() - from;
  const { width, height } = useCanvas();
  if (frame < 0) return null;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: number) => rand(seed * 77 + i * 13 + k);
        const life = 90 + r(1) * 120;
        const t = ((frame + r(2) * life) % life) / life;
        const x = r(3) * width + noise(frame / 40 + i, seed) * 60;
        const y = height + 40 - t * (height * 0.9) * rise * (0.6 + r(4));
        const size = 3 + r(5) * 7;
        const a = Math.sin(t * Math.PI) * (0.5 + r(6) * 0.5);
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
              background: `rgba(${color},${a})`,
              boxShadow: `0 0 ${size * 3}px rgba(${color},${a})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Full-frame flash (lightning, impacts)
export const Flash: React.FC<{ at: number[]; color?: string; dur?: number; strength?: number }> = ({
  at,
  color = "#fff3d6",
  dur = 10,
  strength = 0.85,
}) => {
  const frame = useCurrentFrame();
  const v = Math.max(
    0,
    ...at.map((a) => interpolate(frame, [a, a + 1, a + dur], [0, strength, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio })),
  );
  if (v <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: v, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

// Warm light leak sweeping across, local frames [start, start+dur]
export const LightLeak: React.FC<{ start: number; dur?: number; hue?: string }> = ({ start, dur = 34, hue = "255,170,70" }) => {
  const frame = useCurrentFrame();
  const { width } = useCanvas();
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });
  if (p <= 0 || p >= 1) return null;
  const x = -0.4 * width + p * 1.8 * width;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: Math.sin(p * Math.PI) }}>
      <div
        style={{
          position: "absolute",
          left: x - 700,
          top: -300,
          width: 1400,
          height: 1700,
          rotate: "18deg",
          background: `radial-gradient(ellipse at center, rgba(${hue},0.85) 0%, rgba(255,90,40,0.4) 35%, rgba(255,60,40,0) 70%)`,
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.7 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(8,2,0,${strength}) 100%)`,
    }}
  />
);
