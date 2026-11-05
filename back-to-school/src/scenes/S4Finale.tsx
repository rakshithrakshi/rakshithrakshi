import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { eback, eio, eout, rand, tw } from "../anim";
import { Confetti } from "../components/Decor";
import { Bokeh, Rays } from "../components/Overlays";
import { Label, RiseText } from "../components/Text";
import { hand, sans, serif } from "../fonts";

const ICONS = ["✏️", "📚", "🎒", "⭐", "🍎", "🔔", "📐", "🎨"];

// 14–20s: the hero title, confetti and a warm sign-off
export const S4Finale: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = 40; // confetti + bell moment (local frame)
  const zoom = tw(f, 0, 180, 1.08, 1.0, eio);
  const fadeOut = tw(f, 165, 180, 1, 0, eio);
  const glow = 0.6 + 0.4 * Math.sin(f / 14);
  const swoosh = tw(f, 46, 76, 0, 1, eout);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2b3a7a 0%, #161b44 55%, #0b0d26 100%)", overflow: "hidden", opacity: fadeOut }}>
      <Rays x="50%" y="46%" opacity={tw(f, 20, 60, 0, 0.8, eio)} color="255,214,130" />

      {/* floating school icons orbiting the title */}
      {ICONS.map((ic, i) => {
        const a = (i / ICONS.length) * Math.PI * 2 + f / 90;
        const rx = 800 + rand(i) * 60;
        const ry = 455 + rand(i + 9) * 30;
        const p = tw(f, 10 + i * 3, 40 + i * 3, 0, 1, eout);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + Math.cos(a) * rx * p - 45,
              top: 530 + Math.sin(a) * ry * p - 45,
              fontSize: 78,
              opacity: p * 0.95,
              rotate: `${Math.sin(f / 20 + i) * 14}deg`,
              filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))",
            }}
          >
            {ic}
          </div>
        );
      })}

      <AbsoluteFill style={{ scale: String(zoom), justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Label text="School reopens" at={6} color="#ffd98a" font={sans} size={32} />
        <RiseText
          text="Welcome"
          at={12}
          stagger={2.2}
          dur={30}
          style={{
            fontFamily: serif,
            fontWeight: 900,
            fontSize: 230,
            lineHeight: 1.0,
            // room for the glow so the mask doesn't clip it into a box
            padding: "60px 120px",
            margin: "-50px -120px -60px",
            color: "#fff7e6",
            textShadow: `0 0 ${50 * glow}px rgba(255,200,110,0.55)`,
          }}
        />
        <div style={{ position: "relative" }}>
          <RiseText
            text="Back to School"
            at={26}
            stagger={1.4}
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 132,
              lineHeight: 1.05,
            }}
            letterStyle={() => ({
              background: "linear-gradient(180deg, #ffe7a3 0%, #f6b73c 55%, #e08a1e 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            })}
          />
          {/* hand-drawn underline swoosh */}
          <svg width={900} height={70} viewBox="0 0 900 70" style={{ position: "absolute", left: "50%", marginLeft: -450, bottom: -40 }}>
            <path
              d="M20 40 Q240 10 460 34 T880 26"
              stroke="#ff7a59"
              strokeWidth={10}
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - swoosh}
            />
          </svg>
        </div>
        <div
          style={{
            marginTop: 70,
            fontFamily: hand,
            fontSize: 64,
            color: "#ffe2b8",
            opacity: tw(f, 88, 108, 0, 1, eio),
            translate: `0 ${tw(f, 88, 112, 24, 0, eout)}px`,
          }}
        >
          Doors open. Hearts open. See you in class!
        </div>
      </AbsoluteFill>

      {/* bell-ring shockwave at the reveal */}
      {[0, 8].map((d) => {
        const p = interpolate(f, [reveal + d, reveal + d + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eout });
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: 960,
              top: 520,
              width: 20 + p * 1900,
              height: 20 + p * 1900,
              borderRadius: "50%",
              border: `${4 - p * 2}px solid rgba(255,214,130,0.9)`,
              boxShadow: "0 0 40px rgba(255,214,130,0.5), inset 0 0 40px rgba(255,214,130,0.35)",
              opacity: p > 0 && p < 1 ? (1 - p) * 0.6 : 0,
              translate: "-50% -50%",
            }}
          />
        );
      })}

      <Confetti start={reveal} x={0.5} y={0.48} count={170} />
      <Confetti start={reveal + 4} x={0.12} y={0.9} count={70} seed={21} />
      <Confetti start={reveal + 4} x={0.88} y={0.9} count={70} seed={33} />
      <Bokeh count={24} seed={17} />
      <div style={{ position: "absolute", inset: 0, opacity: tw(f, reveal - 2, reveal + 10, 0, 1, eback) * tw(f, reveal + 4, reveal + 22, 1, 0, eio), background: "radial-gradient(circle at 50% 48%, rgba(255,240,200,0.55), rgba(255,240,200,0) 60%)" }} />
    </AbsoluteFill>
  );
};
