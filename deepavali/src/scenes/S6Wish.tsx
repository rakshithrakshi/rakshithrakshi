import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { eio, keys, rand, tw } from "../anim";
import { KRISHNA, NARAKA, SATYABHAMA } from "../puppets/cast";
import { INK } from "../puppets/Figure";
import { Puppet } from "../puppets/Puppet";
import { Layer, Screen, Stage, TINTS } from "../stage";
import { SCENES } from "../timeline";

// Gold dust lifting off the fallen king's armour
const Dust: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => (
  <>
    {Array.from({ length: 36 }, (_, i) => {
      const life = 70 + rand(i) * 60;
      const t = ((f + rand(i + 9) * life) % life) / life;
      const a = Math.sin(t * Math.PI);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + (rand(i + 3) - 0.5) * 260 + Math.sin(f / 20 + i) * 20,
            top: y - t * 380 + rand(i + 5) * 80,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: `rgba(255,214,140,${a})`,
            boxShadow: `0 0 12px rgba(255,200,120,${a})`,
          }}
        />
      );
    })}
  </>
);

// 0:48 — the red sky softens. Naraka asks forgiveness; Krishna grants his wish.
export const S6Wish: React.FC = () => {
  const f = useCurrentFrame();
  const D = SCENES.wish;
  const fade = Math.min(tw(f, 0, 16, 0, 1, eio), tw(f, D - 14, D, 1, 0, eio));
  const soften = tw(f, 0, 200, 0, 1, eio);
  const blessing = tw(f, 222, 246, 0, 1, eio);

  const cx = keys(f, [[0, -644], [110, -500], [170, 247], [225, 710], [300, 560]]);
  const cy = keys(f, [[0, 84], [110, 70], [170, 26], [225, -29], [300, -10]]);
  const zoom = keys(f, [[0, 1.4], [110, 1.45], [170, 1.3], [225, 1.45], [300, 1.3]]);

  return (
    <Stage cam={{ x: cx, y: cy, zoom }} fade={fade}>
      <Screen tint={TINTS.ember} level={0.9} hotspot={[45, 50]} />
      <AbsoluteFill style={{ opacity: soften }}>
        <Screen tint={TINTS.dusk} level={0.95} hotspot={[62, 46]} />
      </AbsoluteFill>

      <Layer depth={1} blend="multiply">
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d="M-600 900 Q960 870 2500 900 L2500 1500 L-600 1500 Z" fill="#3a1a14" stroke={INK} strokeWidth={4} />
        </svg>
        {/* fallen Naraka, propped on one arm, reaching up */}
        <Puppet
          look={{ ...NARAKA, weapon: "none" }}
          x={520}
          y={960}
          h={600}
          rot={-34}
          pose={{ front: [tw(f, 30, 80, 20, 70, eio) + Math.sin(f / 20) * 3, 30], back: [-60, 20], headTilt: -18 + tw(f, 160, 200, 0, 10), stride: 30, sticks: true }}
        />
        <Puppet
          look={SATYABHAMA}
          x={1160}
          y={900}
          h={620}
          facing={-1}
          rot={Math.sin(f / 30) * 1}
          pose={{ front: [tw(f, 60, 110, 30, 8, eio), 30], back: [-10, 40], headTilt: tw(f, 40, 100, 0, 10), stride: 6 }}
        />
        <Puppet
          look={KRISHNA}
          x={1460}
          y={900}
          h={660}
          facing={-1}
          pose={{ front: [tw(f, 218, 240, 15, 38, eio), tw(f, 218, 240, 30, 128, eio)], back: [-10, 50], chakraSpin: f * 3, headTilt: Math.sin(f / 30) * 2 }}
        />
      </Layer>

      <Layer depth={1} blend="screen">
        <Dust f={f} x={520} y={760} />
        {/* blessing halo behind Krishna on "ತಥಾಸ್ತು" */}
        <div
          style={{
            position: "absolute",
            left: 1460 - 420,
            top: 380 - 420,
            width: 840,
            height: 840,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,245,210,0.9) 0%, rgba(255,200,110,0.45) 25%, rgba(255,170,80,0) 62%)",
            opacity: blessing,
            scale: String(0.6 + blessing * 0.5),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 1460 - 600,
            top: 380 - 600,
            width: 1200,
            height: 1200,
            opacity: blessing * 0.7,
            background: `conic-gradient(from ${f * 0.4}deg, ${Array.from({ length: 16 }, (_, i) => `rgba(255,230,170,0.35) ${i * 22.5}deg, rgba(255,230,170,0) ${i * 22.5 + 7}deg, rgba(255,230,170,0) ${i * 22.5 + 22.5}deg`).join(",")})`,
            maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
          }}
        />
      </Layer>
    </Stage>
  );
};
