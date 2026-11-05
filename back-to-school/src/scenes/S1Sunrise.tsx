import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { eio, eout, tw } from "../anim";
import { School } from "../components/School";
import { Bokeh, Rays } from "../components/Overlays";
import { Label, RiseText } from "../components/Text";
import { sans, serif } from "../fonts";

// 0–4.5s: dawn breaks, the school rises, its windows light up
export const S1Sunrise: React.FC = () => {
  const f = useCurrentFrame();
  const dawn = tw(f, 0, 80, 0, 1, eio);
  const top = interpolateColors(dawn, [0, 1], ["#1b1d4a", "#ffb37a"]);
  const mid = interpolateColors(dawn, [0, 1], ["#4b3a78", "#ffd9a0"]);
  const low = interpolateColors(dawn, [0, 1], ["#a0577e", "#fff1d6"]);
  const sunY = tw(f, 0, 90, 900, 330, eout);
  const push = tw(f, 0, 135, 1.0, 1.1, eio);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${mid} 55%, ${low} 100%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "50% 60%" }}>
        {/* sun + glow */}
        <div
          style={{
            position: "absolute",
            left: 960 - 520,
            top: sunY - 520,
            width: 1040,
            height: 1040,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,240,200,0.95) 0%, rgba(255,200,120,0.5) 18%, rgba(255,160,90,0) 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 960 - 95,
            top: sunY - 95,
            width: 190,
            height: 190,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, #fffbe8, #ffd36b)",
            boxShadow: "0 0 120px 40px rgba(255,210,120,0.7)",
          }}
        />
        <Rays x="50%" y={`${(sunY / 1080) * 100}%`} opacity={dawn * 0.9} />

        {/* far hills */}
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, translate: `${tw(f, 0, 135, 0, -40)}px 0` }}>
          <path d="M-100 760 Q300 640 700 720 T1500 690 T2100 740 L2100 1080 L-100 1080 Z" fill={interpolateColors(dawn, [0, 1], ["#3a2f5e", "#f2b98a"])} />
        </svg>
        {/* school */}
        <div style={{ position: "absolute", left: 960 - 520, top: 400, width: 1040, height: 520 }}>
          <School rise={tw(f, 15, 70, 0, 1, eout)} lights={tw(f, 45, 100, 0, 1, eio)} flag={f / 40} />
        </div>
        {/* near hills */}
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, translate: `${tw(f, 0, 135, 0, -90)}px 0` }}>
          <path d="M-200 900 Q400 820 960 860 T2200 870 L2200 1080 L-200 1080 Z" fill={interpolateColors(dawn, [0, 1], ["#24304a", "#7fb069"])} />
          <path d="M-200 960 Q500 910 1100 950 T2200 940 L2200 1080 L-200 1080 Z" fill={interpolateColors(dawn, [0, 1], ["#1a2438", "#5e9450"])} />
        </svg>
      </AbsoluteFill>

      <Bokeh count={22} seed={2} />

      {/* title */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 92 }}>
        <Label text="A new academic year" at={52} color="#5a2e1e" font={sans} size={30} />
        <RiseText
          text="The bell rings again"
          at={62}
          stagger={1.4}
          outAt={118}
          style={{
            fontFamily: serif,
            fontWeight: 700,
            fontSize: 112,
            color: "#3a1d14",
            marginTop: 18,
            textShadow: "0 6px 30px rgba(255,230,190,0.6)",
          }}
          letterStyle={(i) => (i >= 9 && i <= 13 ? { fontStyle: "italic", color: "#c2412a" } : {})}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
