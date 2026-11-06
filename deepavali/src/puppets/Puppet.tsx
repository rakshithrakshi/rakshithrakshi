import React from "react";
import { Figure, type Look, type Pose } from "./Figure";

// Positions a puppet by its feet: (x, y) is the point between the feet,
// h the puppet's height in px. Optional hop/sway give the "walked on sticks" feel.
export const Puppet: React.FC<{
  look: Look;
  pose?: Pose;
  facing?: 1 | -1;
  x: number;
  y: number;
  h: number;
  hop?: number;
  rot?: number;
  opacity?: number;
}> = ({ look, pose, facing = 1, x, y, h, hop = 0, rot = 0, opacity = 1 }) => {
  const w = h / 2;
  const feet = (775 / 800) * h;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - feet - hop,
        width: w,
        height: h,
        rotate: `${rot}deg`,
        transformOrigin: `50% ${(775 / 800) * 100}%`,
        opacity,
      }}
    >
      <Figure look={look} pose={pose} facing={facing} />
    </div>
  );
};
