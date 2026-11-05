import React from "react";
import { useCurrentFrame } from "remotion";
import { ein, eio, eout, keys, noise, tw } from "../anim";
import { KRISHNA, NARAKA, SATYABHAMA } from "../puppets/cast";
import { Figure, HOLE, INK } from "../puppets/Figure";
import { Garuda } from "../puppets/Garuda";
import { Clouds, Fortress } from "../puppets/Props";
import { Puppet } from "../puppets/Puppet";
import { Embers, Flash, Layer, Screen, Stage, TINTS } from "../stage";
import { SCENES } from "../timeline";

// Key beats (local frames) — mirrored in scripts/make-audio.py
export const BATTLE = {
  chakraOut: 20,
  chakraHit: 58,
  arrowOut: 70,
  arrowHit: 92,
  raise: 115,
  draw: 180,
  release: 282, // just after "ಅಧರ್ಮಕ್ಕೆ… ಇಂದು ಅಂತ್ಯ!"
  impact: 304,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// A glowing projectile streak, from (x0,y0) to (x1,y1) over [t0,t1]
const Streak: React.FC<{ f: number; t0: number; t1: number; from: [number, number]; to: [number, number]; color: string; size?: number }> = ({
  f,
  t0,
  t1,
  from,
  to,
  color,
  size = 1,
}) => {
  if (f < t0 || f > t1 + 2) return null;
  const p = tw(f, t0, t1, 0, 1, ein);
  const x = lerp(from[0], to[0], p);
  const y = lerp(from[1], to[1], p);
  const ang = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
  return (
    <div style={{ position: "absolute", left: x, top: y, rotate: `${ang}deg`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: -320 * size, top: -10 * size, width: 340 * size, height: 20 * size, borderRadius: 20, background: `linear-gradient(90deg, rgba(${color},0), rgba(${color},0.9))`, filter: "blur(3px)" }} />
      <div style={{ position: "absolute", left: -40 * size, top: -40 * size, width: 80 * size, height: 80 * size, borderRadius: "50%", background: `radial-gradient(circle, #ffffff 0%, rgba(${color},0.9) 30%, rgba(${color},0) 70%)` }} />
    </div>
  );
};

const Burst: React.FC<{ f: number; at: number; x: number; y: number; color: string; size?: number }> = ({ f, at, x, y, color, size = 1 }) => {
  const p = tw(f, at, at + 22, 0, 1, eout);
  if (f < at || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 300 * size,
        top: y - 300 * size,
        width: 600 * size,
        height: 600 * size,
        borderRadius: "50%",
        scale: String(0.2 + p),
        opacity: 1 - p,
        background: `radial-gradient(circle, #ffffff 0%, rgba(${color},0.9) 25%, rgba(${color},0) 65%)`,
      }}
    />
  );
};

// 0:36 — the battle in the sky over Pragjyotishapura
export const S5Battle: React.FC = () => {
  const f = useCurrentFrame();
  const D = SCENES.battle;
  const B = BATTLE;
  const fade = Math.min(tw(f, 0, 14, 0, 1, eio), tw(f, D - 14, D, 1, 0, eio));

  // Garuda hovers on the right, facing left toward Naraka
  const gx = 1020 + noise(f / 30, 1) * 20;
  const gy = 230 + Math.sin(f / 11) * 18;
  const SAT: [number, number] = [gx + 575, gy + 150];
  const KRI: [number, number] = [gx + 400, gy + 140];
  const NAR: [number, number] = [470, 560];

  // Krishna is struck, Satyabhama raises and draws
  const struck = tw(f, B.arrowHit, B.arrowHit + 10, 0, 1, eout) * tw(f, B.arrowHit + 60, B.arrowHit + 120, 1, 0.5, eio);
  const raise = tw(f, B.raise, B.raise + 30, 40, 92, eio);
  const draw = tw(f, B.draw, B.release - 2, 0, 1, eio) * (f < B.release ? 1 : 0);

  // Naraka falls
  const fall = tw(f, B.impact + 2, B.impact + 50, 0, 1, ein);

  const cx = keys(f, [[0, 0], [100, 0], [180, 952], [280, 1143], [300, -637], [360, -560], [485, 0]]);
  const cy = keys(f, [[0, 0], [100, 0], [180, -240], [280, -288], [300, 26], [360, 40], [485, 0]]);
  const zoom = keys(f, [[0, 1], [100, 1.02], [180, 1.5], [280, 1.8], [300, 1.3], [360, 1.25], [485, 1.0]]);
  const shake = Math.max(tw(f, B.arrowHit, B.arrowHit + 16, 0.8, 0), tw(f, B.impact, B.impact + 30, 1.6, 0), tw(f, B.chakraHit, B.chakraHit + 10, 0.4, 0));

  return (
    <Stage cam={{ x: cx, y: cy, zoom, shake }} fade={fade}>
      <Screen tint={TINTS.ember} level={0.95 - tw(f, B.release - 30, B.release, 0, 0.25) + tw(f, B.impact, B.impact + 40, 0, 0.25)} hotspot={[50, 45]} />

      <Layer depth={3} blend="multiply" opacity={0.7}>
        <Clouds seed={21} speed={2} y={-60} color="#a8402a" />
      </Layer>
      <Layer depth={2.2} blend="multiply" opacity={0.85}>
        <div style={{ position: "absolute", left: -300, top: 520, width: 2400, height: 875 }}>
          <Fortress color="#3a120a" />
        </div>
      </Layer>

      <Layer depth={1} blend="multiply">
        {/* rampart */}
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d="M-400 900 L900 900 L900 1400 L-400 1400 Z" fill="#2a0d08" stroke={INK} strokeWidth={4} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={-400 + i * 84} y={856} width={50} height={46} fill="#2a0d08" stroke={INK} strokeWidth={3} />
          ))}
        </svg>
        <Puppet
          look={NARAKA}
          x={420 - fall * 60}
          y={900 + fall * 120}
          h={640}
          rot={-fall * 78}
          opacity={1 - tw(f, B.impact + 40, B.impact + 70, 0, 0.35)}
          pose={{
            front: [keys(f, [[0, 30], [B.arrowOut - 10, 140], [B.arrowOut, 70], [B.impact, 60], [B.impact + 20, 160]]), 20],
            back: [-30 + fall * 60, 40],
            headTilt: -fall * 20,
            stride: 12,
          }}
        />

        {/* Garuda with Krishna and Satyabhama, mirrored to face left */}
        <div style={{ position: "absolute", left: gx, top: gy, width: 900, height: 600, scale: "-1 1", rotate: `${Math.sin(f / 13) * 2}deg` }}>
          <Garuda flap={f / 3.4}>
            <div style={{ position: "absolute", left: 240, top: 20, width: 170, height: 340 }}>
              <Figure look={SATYABHAMA} pose={{ front: [raise, 6], back: [tw(f, B.draw, B.release, 50, 80), 60 - draw * 40], stride: 30, bowDraw: draw, sticks: false }} />
            </div>
            <div style={{ position: "absolute", left: 420, top: 30, width: 160, height: 320, rotate: `${-struck * 18}deg`, transformOrigin: "50% 90%" }}>
              <Figure
                look={KRISHNA}
                pose={{
                  front: [keys(f, [[0, 40], [B.chakraOut - 6, 140], [B.chakraOut, 90], [B.arrowHit, 70], [B.arrowHit + 8, 20]]), 20],
                  back: [-20, 40],
                  stride: 30,
                  chakraSpin: f * 9,
                  headTilt: struck * 14,
                  sticks: false,
                }}
              />
            </div>
          </Garuda>
        </div>

        {/* thrown chakra (out and back) */}
        {f >= B.chakraOut && f <= B.chakraHit + 28 && (
          <svg
            viewBox="-60 -60 120 120"
            width={120}
            height={120}
            style={{
              position: "absolute",
              left: (f <= B.chakraHit ? lerp(KRI[0], NAR[0] + 80, tw(f, B.chakraOut, B.chakraHit, 0, 1, eio)) : lerp(NAR[0] + 80, KRI[0], tw(f, B.chakraHit, B.chakraHit + 28, 0, 1, eio))) - 60,
              top: (f <= B.chakraHit ? lerp(KRI[1], NAR[1] - 60, tw(f, B.chakraOut, B.chakraHit, 0, 1, eio)) : lerp(NAR[1] - 60, KRI[1], tw(f, B.chakraHit, B.chakraHit + 28, 0, 1, eio))) - 60,
              rotate: `${f * 24}deg`,
            }}
          >
            <circle r={44} fill="#e8a92a" stroke={INK} strokeWidth={4} />
            <circle r={16} fill={HOLE} stroke={INK} strokeWidth={3} />
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d="M0 -44 L7 -58 L0 -54 L-7 -58 Z" fill={INK} transform={`rotate(${i * 30})`} />
            ))}
          </svg>
        )}
      </Layer>

      {/* light: projectiles, bursts */}
      <Layer depth={1} blend="screen">
        {f >= B.chakraOut && f <= B.chakraHit + 28 && (
          <div
            style={{
              position: "absolute",
              left: (f <= B.chakraHit ? lerp(KRI[0], NAR[0] + 80, tw(f, B.chakraOut, B.chakraHit, 0, 1, eio)) : lerp(NAR[0] + 80, KRI[0], tw(f, B.chakraHit, B.chakraHit + 28, 0, 1, eio))) - 140,
              top: (f <= B.chakraHit ? lerp(KRI[1], NAR[1] - 60, tw(f, B.chakraOut, B.chakraHit, 0, 1, eio)) : lerp(NAR[1] - 60, KRI[1], tw(f, B.chakraHit, B.chakraHit + 28, 0, 1, eio))) - 140,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,230,140,0.9) 0%, rgba(255,180,60,0.3) 40%, rgba(255,160,40,0) 70%)",
            }}
          />
        )}
        <Burst f={f} at={B.chakraHit} x={NAR[0] + 80} y={NAR[1] - 60} color="255,200,90" size={0.8} />
        <Streak f={f} t0={B.arrowOut} t1={B.arrowHit} from={[NAR[0] + 90, NAR[1] - 120]} to={KRI} color="255,90,40" />
        <Burst f={f} at={B.arrowHit} x={KRI[0]} y={KRI[1]} color="255,90,40" />
        {/* Satyabhama's arrow charging with light, then flying */}
        <div
          style={{
            position: "absolute",
            left: SAT[0] - 120 - 60,
            top: SAT[1] - 120 + 20,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,250,220,0.95) 0%, rgba(255,200,90,0.5) 30%, rgba(255,160,40,0) 70%)",
            opacity: draw * (0.7 + noise(f / 2, 4) * 0.3),
            scale: String(0.4 + draw * 0.9),
          }}
        />
        <Streak f={f} t0={B.release} t1={B.impact} from={[SAT[0] - 80, SAT[1] + 20]} to={NAR} color="255,230,150" size={1.6} />
        <Burst f={f} at={B.impact} x={NAR[0]} y={NAR[1]} color="255,220,140" size={2.2} />
      </Layer>

      <Embers count={60} seed={13} color="255,130,60" rise={1.2} />
      <Embers count={40} seed={14} color="255,220,150" from={B.impact} rise={1.6} />
      <Flash at={[B.chakraHit, B.arrowHit]} strength={0.35} dur={8} />
      <Flash at={[B.impact]} strength={0.85} dur={16} color="#fff8e6" />
    </Stage>
  );
};
