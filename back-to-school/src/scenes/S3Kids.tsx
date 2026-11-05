import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { eback, eio, eout, rand, tw } from "../anim";
import { Person } from "../components/Person";
import { KIDS, TEACHERS } from "../components/cast";
import { Bokeh, Rays } from "../components/Overlays";
import { School } from "../components/School";
import { sans, serif } from "../fonts";

const WORDS = [
  { w: "Learn.", c: "#e9573f" },
  { w: "Play.", c: "#3fb6a8" },
  { w: "Grow.", c: "#5b8def" },
  { w: "Shine.", c: "#f4a52a" },
];

const Tree: React.FC<{ x: number; s: number; tone: string }> = ({ x, s, tone }) => (
  <svg viewBox="0 0 200 320" style={{ position: "absolute", left: x, bottom: 250, width: 200 * s, height: 320 * s, overflow: "visible" }}>
    <rect x={90} y={180} width={20} height={140} rx={8} fill="#7a4b33" />
    <circle cx={100} cy={120} r={80} fill={tone} />
    <circle cx={60} cy={160} r={50} fill={tone} />
    <circle cx={140} cy={160} r={54} fill={tone} />
    <circle cx={80} cy={90} r={30} fill="#fff" opacity={0.12} />
  </svg>
);

// 9–14.5s: children run along the sunny path back to school
export const S3Kids: React.FC = () => {
  const f = useCurrentFrame();
  const pan = tw(f, 0, 165, 0, -260, eio);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #8fd0ff 0%, #c9ecff 45%, #fff3d9 100%)", overflow: "hidden" }}>
      <Rays x="85%" y="8%" opacity={0.7} />
      {/* sun */}
      <div style={{ position: "absolute", left: 1520, top: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, #fffbe6 0%, #ffe08a 45%, rgba(255,220,120,0) 70%)" }} />

      {/* clouds */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: ((200 + i * 640 + f * (0.6 + i * 0.3)) % 2200) - 200,
            top: 80 + i * 60,
            width: 260,
            height: 80,
            borderRadius: 60,
            background: "rgba(255,255,255,0.85)",
            boxShadow: "60px -30px 0 10px rgba(255,255,255,0.85), -50px -10px 0 0 rgba(255,255,255,0.85)",
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* distant school, slow parallax */}
      <div style={{ position: "absolute", left: 1150 + pan * 0.25, top: 300, width: 760, height: 380 }}>
        <School rise={1} lights={1} flag={f / 40} doorOpen={tw(f, 20, 70, 0, 1, eio)} />
      </div>

      {/* ground + path */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <path d="M0 720 Q960 660 1920 700 L1920 1080 L0 1080 Z" fill="#8cc66b" />
        <path d="M0 800 Q960 740 1920 780 L1920 1080 L0 1080 Z" fill="#76b257" />
        <path d="M-100 1080 Q700 820 1500 760 L1640 770 Q900 860 600 1080 Z" fill="#f3d7a6" />
      </svg>

      {/* mid trees */}
      <div style={{ position: "absolute", inset: 0, translate: `${pan * 0.6}px 0` }}>
        {[80, 520, 980].map((x, i) => (
          <Tree key={i} x={x} s={1 + rand(i) * 0.4} tone={i % 2 ? "#4f9a4a" : "#5fae54"} />
        ))}
      </div>

      {/* teacher waiting at the end of the path */}
      <div style={{ position: "absolute", left: 1490 + pan * 0.4, top: 470, width: 220, height: 484 }}>
        <Person id="grace-s3" {...TEACHERS.grace} armL={tw(f, 30, 55, 10, 115, eback)} armR={tw(f, 30, 55, 10, 115, eback)} />
      </div>

      {/* kids running in from the left */}
      {KIDS.map((k, i) => {
        const startX = -320 - i * 170;
        const x = startX + (f - i * 4) * (11.5 - i * 0.6);
        const cycle = (f + i * 7) / 3.1;
        const bob = Math.abs(Math.sin(cycle)) * -16;
        const y = 585 + (i % 2) * 36;
        const size = 0.92 + (i % 2) * 0.1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + bob,
              width: 200 * size,
              height: 440 * size,
              rotate: "6deg",
            }}
          >
            <Person
              id={`kid-${i}`}
              {...k}
              legSwing={Math.sin(cycle) * 30}
              armL={40 + Math.sin(cycle) * 35}
              armR={40 - Math.sin(cycle) * 35}
            />
          </div>
        );
      })}

      <Bokeh count={14} seed={13} color="255,250,220" />

      {/* kinetic words */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 90 }}>
        <div style={{ display: "flex", gap: 34 }}>
          {WORDS.map((w, i) => {
            const at = 24 + i * 22;
            const p = interpolate(f, [at, at + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eback });
            const o = interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eout });
            return (
              <div
                key={w.w}
                style={{
                  fontFamily: serif,
                  fontWeight: 900,
                  fontSize: 118,
                  color: w.c,
                  opacity: o,
                  scale: String(0.4 + 0.6 * p),
                  translate: `0 ${(1 - p) * 60}px`,
                  rotate: `${(1 - p) * (i % 2 ? 8 : -8)}deg`,
                  textShadow: "0 8px 0 rgba(255,255,255,0.9), 0 18px 40px rgba(40,60,120,0.25)",
                }}
              >
                {w.w}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 38,
            letterSpacing: "0.1em",
            color: "#2d4a6b",
            opacity: tw(f, 112, 130, 0, 1, eio),
            translate: `0 ${tw(f, 112, 134, 20, 0, eout)}px`,
          }}
        >
          Your classroom is ready for you
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
