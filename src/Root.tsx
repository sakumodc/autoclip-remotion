import React from "react";
import { Composition } from "remotion";
import { GameplayClip, GameplayClipProps } from "./GameplayClip";
import { FacelessShort, FacelessShortProps } from "./FacelessShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GameplayClip"
        component={GameplayClip}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoFile: "clip.mp4",
          hookTitle: "CONTOH JUDUL HOOK",
          watermark: "FRANKO STORE",
          words: [],
        } satisfies GameplayClipProps}
      />
      <Composition
        id="FacelessShort"
        component={FacelessShort}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          audioFile: "voice.mp3",
          bgVideoFile: "bg_loop.mp4",
          topicHeader: "FAKTA PSIKOLOGI GELAP",
          accentColor: "#990000",
          watermark: "FRANKO STUDIO",
          words: [],
        } satisfies FacelessShortProps}
      />
    </>
  );
};
