import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { eout } from "../anim";

// Letters rise out of a mask with a blur-to-sharp settle, staggered
export const RiseText: React.FC<{
  text: string;
  at: number;
  stagger?: number;
  dur?: number;
  style?: React.CSSProperties;
  letterStyle?: (i: number) => React.CSSProperties;
  outAt?: number;
}> = ({ text, at, stagger = 1.6, dur = 26, style, letterStyle, outAt }) => {
  const frame = useCurrentFrame();
  const out =
    outAt === undefined
      ? 0
      : interpolate(frame, [outAt, outAt + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: eout,
        });
  return (
    <div style={{ display: "flex", justifyContent: "center", overflow: "hidden", paddingBottom: "0.12em", ...style }}>
      {text.split("").map((ch, i) => {
        const s = at + i * stagger;
        const p = interpolate(frame, [s, s + dur], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: eout,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              translate: `0 ${(1 - p) * 105 - out * 40}%`,
              opacity: p * (1 - out),
              filter: `blur(${(1 - p) * 10 + out * 8}px)`,
              ...letterStyle?.(i),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// Small tracked-out label with a line drawing in on either side
export const Label: React.FC<{ text: string; at: number; color: string; font: string; size?: number }> = ({
  text,
  at,
  color,
  font,
  size = 30,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: eout,
  });
  const line = (
    <div style={{ width: 90 * p, height: 2, background: color, opacity: 0.8 }} />
  );
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
      {line}
      <div
        style={{
          fontFamily: font,
          fontWeight: 500,
          fontSize: size,
          letterSpacing: `${0.2 + (1 - p) * 0.4}em`,
          color,
          opacity: p,
          textTransform: "uppercase",
        }}
      >
        {text}
      </div>
      {line}
    </div>
  );
};
