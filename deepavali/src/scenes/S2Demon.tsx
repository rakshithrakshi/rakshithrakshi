import React from "react";
import { useCurrentFrame } from "remotion";
import { eio, eout, noise, tw } from "../anim";
import { NARAKA } from "../puppets/cast";
import { Fortress } from "../puppets/Props";
import { Puppet } from "../puppets/Puppet";
import { Embers, Flash, Layer, Screen, Stage, TINTS } from "../stage";
import { SCENES } from "../timeline";

export const LIGHTNING = [52, 58, 190];

// Dead thorn branches close to the lens
const Thorns: React.FC<{ side: "left" | "right" }> = ({ side }) => (
  <svg
    viewBox="0 0 500 1080"
    width={500}
    height={1080}
    style={{ position: "absolute", top: 0, [side]: -80, transform: side === "right" ? "scaleX(-1)" : undefined, overflow: "visible" }}
  >
    <path
      d="M0 1080 L60 760 Q90 600 40 420 Q120 520 140 400 Q160 300 260 240 Q200 340 210 420 Q300 380 380 300 Q300 430 180 520 Q150 640 120 1080 Z M140 400 L230 350 L160 380 Z M60 600 L-20 520 L70 640 Z"
      fill="#0e0402"
    />
  </svg>
);

// 0:06 — Narakasura on the ramparts of Pragjyotishapura under a blood-red sky
export const S2Demon: React.FC = () => {
  const f = useCurrentFrame();
  const D = SCENES.demon;
  const fade = Math.min(tw(f, 0, 16, 0, 1, eio), tw(f, D - 14, D, 1, 0, eio));
  const rise = tw(f, 10, 70, 220, 0, eout);
  const laugh = tw(f, 120, 140, 0, 1) * tw(f, 200, 220, 1, 0);
  const head = laugh * Math.sin(f / 2.2) * 5;
  const swordUp = tw(f, 90, 120, 20, 150, eout);

  return (
    <Stage
      cam={{ x: tw(f, 0, D, -60, 120, eio), y: tw(f, 0, D, 60, -40, eio), zoom: tw(f, 0, D, 1.0, 1.28, eio), shake: laugh * 0.25 }}
      fade={fade}
    >
      <Screen tint={TINTS.ember} level={0.95} hotspot={[56, 48]} />

      {/* far: the fortress city, painted further from the screen = softer, larger */}
      <Layer depth={2.4} blend="multiply" opacity={0.9}>
        <div style={{ position: "absolute", left: -200, top: 420, width: 2320, height: 840 }}>
          <Fortress color="#3a120a" />
        </div>
      </Layer>

      {/* screen plane: rampart + the demon king */}
      <Layer depth={1} blend="multiply">
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d="M-200 900 L2200 900 L2200 1300 L-200 1300 Z" fill="#2a0d08" stroke="#1b0c05" strokeWidth={4} />
          {Array.from({ length: 30 }, (_, i) => (
            <rect key={i} x={-200 + i * 84} y={856} width={50} height={46} fill="#2a0d08" stroke="#1b0c05" strokeWidth={3} />
          ))}
        </svg>
        <Puppet
          look={NARAKA}
          x={1060}
          y={900 + rise}
          h={720}
          rot={noise(f / 30, 2) * 2}
          pose={{ front: [swordUp, 20 - laugh * 10], back: [-20 + laugh * 10, 40], headTilt: head - laugh * 6, stride: 10 }}
        />
      </Layer>

      <Embers count={50} seed={3} color="255,120,50" />
      <Flash at={LIGHTNING} color="#ffe6d0" strength={0.7} />

      <Layer depth={0.5} blur={1.2}>
        <Thorns side="left" />
        <Thorns side="right" />
      </Layer>
    </Stage>
  );
};
