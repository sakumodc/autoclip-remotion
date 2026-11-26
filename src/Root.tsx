import React from "react";
import { Composition } from "remotion";
import { AutoClip, AutoClipProps } from "./AutoClip";
import { FacelessShort, FacelessShortProps } from "./FacelessShort";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GameplayClip"
        component={AutoClip}
        durationInFrames={900}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          videoFile: "clip.mp4",
          hookTitle: "CONTOH JUDUL HOOK",
          watermark: "FRANKO STORE",
          words: [],
        } satisfies AutoClipProps}
        calculateMetadata={({ props }) => {
          const lastWordEnd =
            props.words.length > 0
              ? props.words[props.words.length - 1].end
              : 30;
          return {
            durationInFrames: Math.max(1, Math.ceil((lastWordEnd + 1) * FPS)),
          };
        }}
      />
      <Composition
        id="FacelessShort"
        component={FacelessShort}
        durationInFrames={900}
        fps={FPS}
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
        calculateMetadata={({ props }) => {
          const lastWordEnd =
            props.words.length > 0
              ? props.words[props.words.length - 1].end
              : 30;
          return {
            durationInFrames: Math.max(1, Math.ceil((lastWordEnd + 1) * FPS)),
          };
        }}
      />
    </>
  );
};
