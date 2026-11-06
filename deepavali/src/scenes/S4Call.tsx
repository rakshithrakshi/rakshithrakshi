import React from "react";
import { useCurrentFrame } from "remotion";
import { eback, eio, eout, tw } from "../anim";
import { INDRA, KRISHNA, SATYABHAMA } from "../puppets/cast";
import { Figure } from "../puppets/Figure";
import { Garuda } from "../puppets/Garuda";
import { Clouds, Palace } from "../puppets/Props";
import { Puppet } from "../puppets/Puppet";
import { Embers, Layer, Screen, Stage, TINTS, Thoranam } from "../stage";
import { SCENES } from "../timeline";

// 0:26 — Golden Dwaraka. Indra pleads, Satyabhama steps forward, and they take off on Garuda.
export const S4Call: React.FC = () => {
  const f = useCurrentFrame();
  const D = SCENES.call;
  const CUT = 205; // palace → flight
  const flight = f >= CUT;
  const lf = f - CUT;
  const dip = flight ? tw(lf, 0, 12, 0, 1, eio) : tw(f, CUT - 12, CUT, 1, 0, eio);
  const fade = Math.min(tw(f, 0, 14, 0, 1, eio), tw(f, D - 14, D, 1, 0, eio));

  if (!flight) {
    const indraX = tw(f, 0, 34, -200, 400, eout);
    const bow = tw(f, 30, 50, 0, 1, eio);
    const satX = tw(f, 118, 150, 2200, 1480, eout);
    return (
      <Stage cam={{ x: tw(f, 0, CUT, -40, 120, eio), y: 0, zoom: tw(f, 0, CUT, 1.0, 1.12, eio) }} fade={fade * dip}>
        <Screen tint={TINTS.gold} level={1} hotspot={[52, 46]} />
        <Layer depth={2.2} blend="multiply" opacity={0.85}>
          <div style={{ position: "absolute", left: -200, top: 380, width: 2320, height: 846 }}>
            <Palace />
          </div>
        </Layer>
        <Layer depth={1} blend="multiply">
          <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d="M-300 930 L2300 930 L2300 1400 L-300 1400 Z" fill="#b87a2a" stroke="#1b0c05" strokeWidth={4} />
          </svg>
          <Puppet
            look={INDRA}
            x={indraX}
            y={930}
            h={600}
            rot={bow * 14}
            hop={f < 34 ? Math.abs(Math.sin(f / 4)) * 20 : 0}
            pose={{ front: [tw(f, 36, 60, 10, 50, eback), tw(f, 36, 60, 30, 95, eback)], back: [-20, 30], headTilt: bow * 12 - tw(f, 34, 70, 0, 20) * (1 - bow), stride: 8 }}
          />
          <Puppet
            look={KRISHNA}
            x={1140}
            y={930}
            h={640}
            facing={-1}
            rot={Math.sin(f / 26) * 1.2}
            pose={{ front: [tw(f, 70, 95, 12, 22, eio), 40], back: [-10, 50], chakraSpin: f * 6, headTilt: Math.sin(f / 30) * 2 }}
          />
          <Puppet
            look={SATYABHAMA}
            x={satX}
            y={930}
            h={620}
            facing={-1}
            hop={f > 118 && f < 150 ? Math.abs(Math.sin(f / 4)) * 22 : 0}
            pose={{ front: [tw(f, 150, 175, 20, 110, eback), 20], back: [-14, 40], stride: 6 }}
          />
        </Layer>
        <Embers count={24} seed={11} color="255,220,140" />
        <Layer depth={0.55} blur={0.9}>
          <Thoranam y={-70} />
        </Layer>
      </Stage>
    );
  }

  // Garuda flight through rushing clouds
  const gx = tw(lf, 0, D - CUT, -500, 1500, eio);
  const gy = 260 + Math.sin(lf / 10) * 26;
  return (
    <Stage cam={{ x: tw(lf, 0, D - CUT, -60, 60), y: tw(lf, 0, D - CUT, 40, -40), zoom: 1.05 }} fade={fade * dip}>
      <Screen tint={TINTS.gold} level={1} hotspot={[50, 40]} />
      <Layer depth={3} blend="multiply" opacity={0.55}>
        <Clouds seed={2} speed={5} y={-100} color="#e8c48a" />
      </Layer>
      <Layer depth={1.6} blend="multiply" opacity={0.8}>
        <Clouds seed={5} speed={10} y={150} color="#e0b070" />
      </Layer>
      <Layer depth={1} blend="multiply">
        <div style={{ position: "absolute", left: gx, top: gy, width: 900, height: 600, rotate: `${Math.sin(lf / 12) * 3}deg` }}>
          <Garuda flap={lf / 3.2}>
            <div style={{ position: "absolute", left: 240, top: 20, width: 170, height: 340 }}>
              <Figure look={SATYABHAMA} pose={{ front: [40, 40], back: [10, 30], stride: 30, sticks: false }} />
            </div>
            <div style={{ position: "absolute", left: 420, top: 30, width: 160, height: 320 }}>
              <Figure look={KRISHNA} pose={{ front: [70, 20], back: [-20, 40], stride: 30, chakraSpin: lf * 8, sticks: false }} />
            </div>
          </Garuda>
        </div>
      </Layer>
      <Layer depth={0.6} blend="multiply" blur={1.2} opacity={0.9}>
        <Clouds seed={9} speed={22} y={500} color="#c8925a" />
      </Layer>
    </Stage>
  );
};
