import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { eback, eio, eout, tw } from "../anim";
import { Person } from "../components/Person";
import { TEACHERS } from "../components/cast";
import { Balloons, Bubble, Bunting } from "../components/Decor";
import { Bokeh } from "../components/Overlays";
import { RiseText } from "../components/Text";
import { hand, sans, serif } from "../fonts";

// 4–9.5s: three teachers step into the warm doorway and wave the children in
export const S2Teachers: React.FC = () => {
  const f = useCurrentFrame();
  const cam = tw(f, 0, 165, 1.06, 1.0, eio);
  const doorLight = tw(f, 0, 50, 0.2, 1, eio);

  const enter = (at: number) => ({
    y: tw(f, at, at + 28, 260, 0, eout),
    o: tw(f, at, at + 16, 0, 1, eio),
  });
  // Waving: arm swings up, then oscillates with a smooth sine
  const wave = (at: number, phase = 0) => {
    const up = tw(f, at, at + 18, 0, 1, eback);
    return up * 150 + up * Math.sin((f - at) / 4.2 + phase) * 16;
  };
  const blink = (offset: number) => (f + offset) % 70 < 3;

  const t1 = enter(14);
  const t2 = enter(6);
  const t3 = enter(22);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffe6c2 0%, #ffd29a 60%, #e9b07a 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(cam), transformOrigin: "50% 55%" }}>
        {/* back wall with tiles */}
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="door-light" cx="0.5" cy="0.55" r="0.55">
              <stop offset="0" stopColor="#fffaf0" />
              <stop offset="0.6" stopColor="#ffe3a6" />
              <stop offset="1" stopColor="#ffc46b" />
            </radialGradient>
          </defs>
          <rect x={0} y={0} width={1920} height={820} fill="#f7dcb4" />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={i * 170 - 20} y={690} width={150} height={120} rx={8} fill="#efc995" opacity={0.6} />
          ))}
          {/* doorway */}
          <rect x={560} y={150} width={800} height={680} rx={30} fill="#9c5b3c" />
          <rect x={590} y={180} width={740} height={650} rx={20} fill="url(#door-light)" opacity={doorLight} />
          {/* hallway hints */}
          <rect x={640} y={260} width={120} height={220} rx={10} fill="#ffcf7e" opacity={0.35 * doorLight} />
          <rect x={1160} y={260} width={120} height={220} rx={10} fill="#ffcf7e" opacity={0.35 * doorLight} />
          <rect x={0} y={820} width={1920} height={260} fill="#d9a06e" />
          <rect x={0} y={820} width={1920} height={14} fill="#c48858" />
        </svg>
        {/* light spilling out of the door */}
        <div
          style={{
            position: "absolute",
            left: 460,
            top: 780,
            width: 1000,
            height: 300,
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,245,210,0.85) 0%, rgba(255,220,150,0) 70%)",
            opacity: doorLight,
          }}
        />

        <Bunting drop={tw(f, 0, 40, 0, 1, eout)} y={40} sag={70} />

        {/* teachers */}
        <div style={{ position: "absolute", left: 470, top: 380 + t1.y, width: 300, height: 660, opacity: t1.o }}>
          <Person id="maya" {...TEACHERS.maya} armL={wave(40, 0)} armR={12} blink={blink(5)} headTilt={Math.sin(f / 30) * 3} />
        </div>
        <div style={{ position: "absolute", left: 1150, top: 380 + t3.y, width: 300, height: 660, opacity: t3.o }}>
          <Person id="grace" {...TEACHERS.grace} armL={10} armR={wave(52, 1.3)} blink={blink(31)} headTilt={-Math.sin(f / 28) * 3} />
        </div>
        <div style={{ position: "absolute", left: 790, top: 330 + t2.y, width: 340, height: 740, opacity: t2.o }}>
          <Person
            id="arjun"
            {...TEACHERS.arjun}
            armL={tw(f, 30, 56, 8, 112, eback) + Math.sin(f / 9) * 4}
            armR={tw(f, 30, 56, 8, 112, eback) + Math.sin(f / 9 + 1) * 4}
            blink={blink(50)}
          />
        </div>

        <Bubble text="Welcome back!" at={62} x={300} y={300} font={hand} tail="right" />
        <Bubble text="We missed you!" at={78} x={1240} y={290} font={hand} color="#fff3d1" tail="left" />
        <Bubble text="Come on in!" at={94} x={800} y={200} font={hand} color="#e3f6f2" tail="left" />
      </AbsoluteFill>

      <Balloons start={20} seed={4} />
      <Bokeh count={18} seed={8} />

      {/* caption */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 34 }}>
        <div
          style={{
            background: "rgba(43,22,12,0.55)",
            backdropFilter: "blur(14px)",
            borderRadius: 28,
            padding: "22px 56px 18px",
            opacity: tw(f, 100, 118, 0, 1, eio),
            translate: `0 ${tw(f, 100, 124, 40, 0, eout)}px`,
          }}
        >
          <RiseText
            text="Your teachers are waiting"
            at={104}
            stagger={1}
            style={{ fontFamily: serif, fontWeight: 600, fontSize: 74, color: "#fff6e6" }}
            letterStyle={(i) => (i >= 18 ? { fontStyle: "italic", color: "#ffc857" } : {})}
          />
          <div
            style={{
              fontFamily: sans,
              fontSize: 34,
              color: "#ffe6c4",
              textAlign: "center",
              letterSpacing: "0.08em",
              opacity: tw(f, 122, 140, 0, 1, eio),
            }}
          >
            with open arms and big smiles
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
