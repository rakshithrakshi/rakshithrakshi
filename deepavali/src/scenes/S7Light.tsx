import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { eio, eout, tw } from "../anim";
import { CHILD, PRINCESS } from "../puppets/cast";
import { INK } from "../puppets/Figure";
import { Bars, Burst, DiyaBowls, Flames, Home, Rangoli } from "../puppets/Props";
import { Puppet } from "../puppets/Puppet";
import { Embers, Layer, Screen, Stage, TINTS, Thoranam } from "../stage";
import { SCENES } from "../timeline";

// The child walks at a constant pace; each diya lights as the child's hand reaches it.
// (scripts/make-audio.py derives the lighting ticks from these numbers.)
export const LIGHT = { cut: 130, walkFrom: 140, walkTo: 320, x0: 380, x1: 1420, hand: 172 };

const ROW = Array.from({ length: 9 }, (_, i) => ({ x: 560 + i * 100, y: 870 }));

// 0:58 — the captives walk free at dawn; then a Karnataka home today, a child lighting diyas.
export const S7Light: React.FC = () => {
  const f = useCurrentFrame();
  const D = SCENES.light;
  const fade = Math.min(tw(f, 0, 14, 0, 1, eio), tw(f, D - 14, D, 1, 0, eio));
  const home = f >= LIGHT.cut;
  const dip = home ? tw(f, LIGHT.cut, LIGHT.cut + 14, 0, 1, eio) : tw(f, LIGHT.cut - 12, LIGHT.cut, 1, 0, eio);

  if (!home) {
    const dawn = tw(f, 0, 110, 0, 1, eio);
    return (
      <Stage cam={{ x: tw(f, 0, LIGHT.cut, -40, 120), y: tw(f, 0, LIGHT.cut, 30, -20), zoom: tw(f, 0, LIGHT.cut, 1.12, 1.0, eio) }} fade={fade * dip}>
        <Screen tint={TINTS.night} level={0.7} />
        <AbsoluteFill style={{ opacity: dawn }}>
          <Screen tint={TINTS.amber} level={1} hotspot={[70, 40]} />
        </AbsoluteFill>
        {/* rising sun, far away */}
        <Layer depth={2.5} blend="screen">
          <div
            style={{
              position: "absolute",
              left: 1380 - 260,
              top: tw(f, 0, 120, 760, 220, eout) - 260,
              width: 520,
              height: 520,
              borderRadius: "50%",
              background: "radial-gradient(circle, #fffbe8 0%, #ffd27a 25%, rgba(255,160,60,0.4) 45%, rgba(255,140,40,0) 70%)",
              opacity: dawn,
            }}
          />
        </Layer>
        <Layer depth={1} blend="multiply">
          {[0, 1, 2, 3, 4].map((i) => {
            const walk = tw(f, 50 + i * 6, 130, 0, 1, eio);
            return (
              <Puppet
                key={i}
                look={PRINCESS}
                x={560 + i * 200 + walk * 700}
                y={900}
                h={380}
                facing={1}
                hop={walk > 0 && walk < 1 ? Math.abs(Math.sin(f / 4 + i)) * 14 : 0}
                pose={{ front: [20 + walk * 30, 30], back: [-10, 30], headTilt: 14 - tw(f, 20, 60, 0, 22, eio), stride: walk > 0 && walk < 1 ? Math.sin(f / 4 + i) * 14 : 2, sticks: false }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 360, top: 330, width: 1200, height: 600 }}>
            <Bars dissolve={tw(f, 10, 70, 0, 1, eio)} />
          </div>
        </Layer>
        <Embers count={50} seed={31} color="255,230,160" from={10} rise={1.3} />
      </Stage>
    );
  }

  const lf = f - LIGHT.cut;
  const childX = interpolate(f, [LIGHT.walkFrom, LIGHT.walkTo], [LIGHT.x0, LIGHT.x1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hop = Math.abs(Math.sin(f / 5)) * 8;
  const handX = childX + LIGHT.hand;
  const handY = 641 - hop;
  const pts = ROW.map((p) => ({ ...p, s: 0.9, on: eout(Math.min(1, Math.max(0, (handX - (p.x + 40)) / 30))) }));

  return (
    <Stage cam={{ x: tw(lf, 0, D - LIGHT.cut, -60, 60), y: 20, zoom: tw(lf, 0, D - LIGHT.cut, 1.08, 1.0, eio) }} fade={fade * dip}>
      <Screen tint={TINTS.dusk} level={0.95} hotspot={[40, 58]} />
      {/* fireworks far behind */}
      <Layer depth={2.8} blend="screen">
        <Burst at={LIGHT.cut + 30} x={400} y={180} color="#ffd36a" seed={1} />
        <Burst at={LIGHT.cut + 70} x={1500} y={140} color="#ff8a5a" seed={2} />
        <Burst at={LIGHT.cut + 110} x={900} y={110} color="#9ad0ff" seed={3} />
        <Burst at={LIGHT.cut + 140} x={1250} y={220} color="#ffe6a0" seed={4} />
      </Layer>
      <Layer depth={1.6} blend="multiply" opacity={0.7}>
        <div style={{ position: "absolute", left: 1000, top: 300, width: 900, height: 573 }}>
          <Home />
        </div>
      </Layer>
      <Layer depth={1} blend="multiply">
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d="M-300 890 L2300 890 L2300 1400 L-300 1400 Z" fill="#5a3418" stroke={INK} strokeWidth={4} />
        </svg>
        <div style={{ position: "absolute", left: 960 - 260, top: 960 - 110, width: 520, height: 220, scale: "1 0.42" }}>
          <Rangoli reveal={tw(lf, 0, 60, 0, 1, eout)} />
        </div>
        <DiyaBowls pts={pts} />
        <Puppet
          look={CHILD}
          x={childX}
          y={890}
          h={520}
          hop={hop}
          pose={{ front: [55, 30], back: [-20, 30], stride: Math.sin(f / 5) * 12, headTilt: 16 }}
        />
      </Layer>
      <Layer depth={1} blend="screen">
        <Flames pts={pts} />
        {/* the child's own diya */}
        <Flames pts={[{ x: handX - 35, y: handY + 16, s: 0.8 }]} seed={9} />
      </Layer>
      <Layer depth={0.55} blur={0.9}>
        <Thoranam y={-70} />
      </Layer>
    </Stage>
  );
};
