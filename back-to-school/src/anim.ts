import { Easing, interpolate } from "remotion";
import { EASE_IO, EASE_OUT } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const eio = Easing.bezier(...EASE_IO);
export const eout = Easing.bezier(...EASE_OUT);
// Gentle overshoot for "pop" moments
export const eback = Easing.bezier(0.34, 1.56, 0.64, 1);

// Eased tween from a to b between two frames
export const tw = (
  frame: number,
  from: number,
  to: number,
  a: number,
  b: number,
  easing = eio,
) => interpolate(frame, [from, to], [a, b], { ...clamp, easing });

// Deterministic pseudo-random in [0, 1)
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
