import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { eio } from "./anim";
import { S1, S2, S3, S4, START, T } from "./timeline";
import { S1Sunrise } from "./scenes/S1Sunrise";
import { S2Teachers } from "./scenes/S2Teachers";
import { S3Kids } from "./scenes/S3Kids";
import { S4Finale } from "./scenes/S4Finale";
import { Grain, LightLeak, Vignette } from "./components/Overlays";

const timing = linearTiming({ durationInFrames: T, easing: eio });

export const BackToSchool: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0b0d26" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Sunrise" durationInFrames={S1}>
          <S1Sunrise />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={timing} />
        <TransitionSeries.Sequence name="Teachers" durationInFrames={S2}>
          <S2Teachers />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
        <TransitionSeries.Sequence name="Kids" durationInFrames={S3}>
          <S3Kids />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence name="Finale" durationInFrames={S4}>
          <S4Finale />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* light leaks over each cut */}
      <Sequence name="Leak 1" from={START.s2 - 10}>
        <LightLeak start={0} dur={34} />
      </Sequence>
      <Sequence name="Leak 2" from={START.s3 - 10}>
        <LightLeak start={0} dur={34} hue="255,200,120" />
      </Sequence>
      <Sequence name="Leak 3" from={START.s4 - 10}>
        <LightLeak start={0} dur={40} hue="255,150,90" />
      </Sequence>

      <Vignette />
      <Grain opacity={0.07} />

      <Audio name="Music" src={staticFile("audio/music.wav")} />
      <Audio name="SFX" src={staticFile("audio/sfx.wav")} />
    </AbsoluteFill>
  );
};
