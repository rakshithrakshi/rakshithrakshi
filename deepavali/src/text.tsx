import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { eio, eout, tw } from "./anim";
import { LINES } from "./timeline";
import { sans } from "./fonts";

export const GOLD = "linear-gradient(180deg, #fff3c4 0%, #ffd36a 38%, #e89a22 70%, #b8640e 100%)";

// Kannada can't be split per letter (conjuncts and vowel signs would break),
// so titles reveal word by word: rise, unblur, then a light sweep across the gold.
export const GoldTitle: React.FC<{
  text: string;
  at: number;
  size: number;
  font: string;
  weight?: number;
  stagger?: number;
  out?: number;
  glow?: number;
}> = ({ text, at, size, font, weight = 800, stagger = 6, out, glow = 1 }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const o = out === undefined ? 0 : tw(frame, out, out + 16, 0, 1, eio);
  const sweep = interpolate(frame, [at + 10, at + 10 + 50], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio });
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.28}px`, position: "relative" }}>
      {words.map((w, i) => {
        const p = tw(frame, at + i * stagger, at + i * stagger + 26, 0, 1, eout);
        return (
          <span
            key={i}
            style={{
              fontFamily: font,
              fontWeight: weight,
              fontSize: size,
              lineHeight: 1.35,
              backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%), ${GOLD}`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: p * (1 - o),
              translate: `0 ${(1 - p) * size * 0.5 - o * 20}px`,
              filter: `blur(${(1 - p) * 12 + o * 8}px) drop-shadow(0 0 ${18 * glow}px rgba(255,170,60,${0.55 * glow})) drop-shadow(0 4px 2px rgba(40,10,0,0.6))`,
              display: "inline-block",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Kannada subtitles for each voice-over line, on the master timeline
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const line = LINES.find((l) => l.subtitle !== false && frame >= l.at - 4 && frame <= l.to + 8);
  if (!line) return null;
  const a = interpolate(frame, [line.at - 4, line.at + 8, line.to - 4, line.to + 8], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: eio,
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 54, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 1500,
          padding: "14px 40px 10px",
          borderRadius: 18,
          background: "linear-gradient(180deg, rgba(20,6,2,0.0), rgba(20,6,2,0.55) 30%, rgba(20,6,2,0.55) 70%, rgba(20,6,2,0.0))",
          opacity: a,
          translate: `0 ${(1 - a) * 14}px`,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 25, letterSpacing: "0.02em", color: "#f2b955", marginBottom: 2 }}>{line.who}</div>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 40, lineHeight: 1.5, color: "#fff4dc", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {line.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
