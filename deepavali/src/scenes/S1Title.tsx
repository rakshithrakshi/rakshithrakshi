import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { eio, eout, tw } from "../anim";
import { display, sans } from "../fonts";
import { DiyaBowls, Flames, Rangoli } from "../puppets/Props";
import { Layer, LampStand, Screen, Stage, TINTS, Thoranam } from "../stage";
import { GoldTitle } from "../text";
import { SCENES } from "../timeline";

// Rings of diyas around a rangoli, lighting outward from the centre
const ring = (n: number, r: number, cx: number, cy: number, s: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.42, s, a };
  });

export const S1Title: React.FC = () => {
  const f = useCurrentFrame();
  const D = SCENES.title;
  const lamp = tw(f, 8, 70, 0.04, 1, eio);
  const fade = tw(f, D - 14, D, 1, 0, eio);

  // first diya at centre, then two rings lighting in sequence
  const pts = [
    { x: 960, y: 800, s: 1.5, at: 10 },
    ...ring(10, 360, 960, 800, 0.95).map((p, i) => ({ ...p, at: 40 + i * 3 })),
    ...ring(16, 640, 960, 800, 0.8).map((p, i) => ({ ...p, at: 64 + i * 2 })),
  ].map((p) => ({ ...p, on: tw(f, p.at, p.at + 10, 0, 1, eout) }));

  return (
    <Stage cam={{ x: tw(f, 0, D, 0, 30), y: tw(f, 0, D, 40, -10), zoom: tw(f, 0, D, 1.12, 1.0, eio) }} fade={fade}>
      <Screen tint={TINTS.amber} level={lamp} hotspot={[50, 64]} />

      {/* rangoli on the screen plane */}
      <Layer depth={1} blend="multiply">
        <div style={{ position: "absolute", left: 960 - 330, top: 800 - 140, width: 660, height: 280, scale: "1 0.42", opacity: tw(f, 30, 70, 0, 1) }}>
          <Rangoli reveal={tw(f, 30, 100, 0, 1, eout)} />
        </div>
        <DiyaBowls pts={pts} />
      </Layer>
      <Layer depth={1} blend="screen">
        <Flames pts={pts} />
      </Layer>

      {/* title */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 170 }}>
        <GoldTitle text="ದೀಪಾವಳಿ" at={72} size={230} font={display} />
        <div
          style={{
            marginTop: -10,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 50,
            letterSpacing: "0.03em",
            color: "#ffe9c2",
            textShadow: "0 0 18px rgba(255,160,60,0.8), 0 2px 4px rgba(0,0,0,0.6)",
            opacity: tw(f, 100, 124, 0, 1, eio),
            translate: `0 ${tw(f, 100, 128, 20, 0, eout)}px`,
          }}
        >
          ಬೆಳಕಿನ ಹಬ್ಬದ ಕಥೆ
        </div>
      </AbsoluteFill>

      {/* foreground, near the lens */}
      <Layer depth={0.55} blur={0.9}>
        <Thoranam y={-60} />
        <LampStand side="left" />
        <LampStand side="right" />
      </Layer>
    </Stage>
  );
};
