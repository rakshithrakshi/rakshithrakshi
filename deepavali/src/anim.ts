import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const eio = Easing.bezier(0.65, 0, 0.35, 1); // smooth ease-in-out
export const eout = Easing.bezier(0.16, 1, 0.3, 1); // expo ease-out
export const ein = Easing.bezier(0.7, 0, 0.84, 0); // ease-in
export const eback = Easing.bezier(0.34, 1.56, 0.64, 1); // gentle overshoot

// Eased tween from a to b between two frames
export const tw = (frame: number, from: number, to: number, a: number, b: number, easing = eio) =>
  interpolate(frame, [from, to], [a, b], { ...clamp, easing });

// Multi-keyframe eased tween: keys = [[frame, value], ...]
export const keys = (frame: number, k: [number, number][], easing = eio) =>
  interpolate(
    frame,
    k.map((p) => p[0]),
    k.map((p) => p[1]),
    { ...clamp, easing },
  );

// Deterministic pseudo-random in [0, 1)
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Smooth 1D value noise in [-1, 1]
export const noise = (t: number, seed = 0) => {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);
  return (rand(i + seed * 101) * (1 - u) + rand(i + 1 + seed * 101) * u) * 2 - 1;
};

// Oil-lamp flicker multiplier around 1
export const flicker = (frame: number, seed = 0, amount = 1) =>
  1 + amount * (noise(frame / 3.3, seed) * 0.035 + noise(frame / 11, seed + 7) * 0.03);
