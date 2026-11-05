import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { eio, eout, rand, tw } from "../anim";
import { display, sans, serif } from "../fonts";
import { DiyaBowls, Flames } from "../puppets/Props";
import { Embers, Layer, LightLeak, Screen, Stage, TINTS } from "../stage";
import { GoldTitle } from "../text";
import { SCENES } from "../timeline";

// Small diyas tracing the outline of one giant diya: the bowl and its flame
const RIM = 760;
const shape = (() => {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    const a = Math.PI * t;
    pts.push({ x: 960 - Math.cos(a) * 470, y: RIM + Math.sin(a) * 190 }); // bowl
  }
  for (let i = 1; i < 18; i++) pts.push({ x: 490 + (i / 18) * 940, y: RIM }); // rim
  for (let i = 0; i < 26; i++) {
    // teardrop flame: pointed tip at the top, round at the base
    const t = (i / 26) * Math.PI * 2;
    pts.push({ x: 960 + Math.sin(t) * Math.sin(t / 2) * 150, y: RIM - 240 - Math.cos(t) * 200 });
  }
  return pts;
})();

// 1:08 — thousands of diyas; the camera pulls back and they form one great diya.
export const S8Message: React.FC = () => {
  const f = useCurrentFrame();
  const D = SCENES.message;
  const fade = Math.min(tw(f, 0, 16, 0, 1, eio), tw(f, D - 18, D, 1, 0, eio));
  const zoom = tw(f, 0, 170, 2.3, 1.0, eio);

  const form = shape.map((p, i) => ({ ...p, s: 0.42, on: tw(f, 6 + (i % 23) * 2.2, 18 + (i % 23) * 2.2, 0, 1, eout) }));
  const field = (seed: number, n: number, s: number) =>
    Array.from({ length: n }, (_, i) => ({
      x: rand(seed + i) * 2600 - 340,
      y: 200 + rand(seed + i + 500) * 1000,
      s,
      on: tw(f, 4 + rand(seed + i + 900) * 60, 16 + rand(seed + i + 900) * 60, 0, 1, eout),
    })).filter((p) => !(Math.abs(p.x - 960) < 560 && p.y > 420 && p.y < 1010));
  const far = field(100, 70, 0.3);
  const near = field(300, 14, 1.4);

  return (
    <Stage cam={{ x: 0, y: tw(f, 0, 170, 120, 0, eio), zoom }} fade={fade}>
      <Screen tint={TINTS.night} level={0.55} hotspot={[50, 60]} />
      <Layer depth={2.4} blend="multiply" opacity={0.8}>
        <DiyaBowls pts={far} />
      </Layer>
      <Layer depth={2.4} blend="screen">
        <Flames pts={far} seed={3} />
      </Layer>
      <Layer depth={1} blend="multiply">
        <DiyaBowls pts={form} />
      </Layer>
      <Layer depth={1} blend="screen">
        {/* the giant diya's glow */}
        <div
          style={{
            position: "absolute",
            left: 960 - 700,
            top: RIM - 260 - 700,
            width: 1400,
            height: 1400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,200,100,0.55) 0%, rgba(255,150,60,0.18) 35%, rgba(255,120,40,0) 65%)",
            opacity: tw(f, 60, 150, 0, 1, eio),
          }}
        />
        <Flames pts={form} />
      </Layer>
      <Layer depth={0.6} blend="screen" blur={1.4}>
        <Flames pts={near} seed={7} />
      </Layer>

      <Embers count={40} seed={41} color="255,210,130" rise={1.1} />
      <LightLeak start={150} dur={44} />

      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 70 }}>
        <GoldTitle text="ತಮಸೋ ಮಾ ಜ್ಯೋತಿರ್ಗಮಯ" at={20} size={104} font={serif} weight={700} stagger={10} out={168} />
        <div
          style={{
            marginTop: 4,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 44,
            color: "#ffe9c2",
            letterSpacing: "0.04em",
            textShadow: "0 0 16px rgba(255,160,60,0.8), 0 2px 4px rgba(0,0,0,0.7)",
            opacity: tw(f, 70, 92, 0, 1, eio) * tw(f, 166, 180, 1, 0, eio),
            translate: `0 ${tw(f, 70, 96, 16, 0, eout)}px`,
          }}
        >
          ಕತ್ತಲಿನಿಂದ ಬೆಳಕಿನೆಡೆಗೆ… ಅಹಂಕಾರದಿಂದ ಧರ್ಮದೆಡೆಗೆ
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 80 }}>
        <GoldTitle text="ನಿಮ್ಮೆಲ್ಲರಿಗೂ ದೀಪಾವಳಿಯ" at={186} size={92} font={display} stagger={8} />
        <GoldTitle text="ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು" at={200} size={92} font={display} stagger={8} />
      </AbsoluteFill>
    </Stage>
  );
};
