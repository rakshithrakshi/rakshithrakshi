import { Composition, Folder } from "remotion";
import "./fonts";
import { BackToSchool } from "./BackToSchool";
import { FPS, HEIGHT, S1, S2, S3, S4, TOTAL, WIDTH } from "./timeline";
import { S1Sunrise } from "./scenes/S1Sunrise";
import { S2Teachers } from "./scenes/S2Teachers";
import { S3Kids } from "./scenes/S3Kids";
import { S4Finale } from "./scenes/S4Finale";

const base = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="BackToSchool" component={BackToSchool} durationInFrames={TOTAL} {...base} />
      <Folder name="Scenes">
        <Composition id="Sunrise" component={S1Sunrise} durationInFrames={S1} {...base} />
        <Composition id="Teachers" component={S2Teachers} durationInFrames={S2} {...base} />
        <Composition id="Kids" component={S3Kids} durationInFrames={S3} {...base} />
        <Composition id="Finale" component={S4Finale} durationInFrames={S4} {...base} />
      </Folder>
    </>
  );
};
