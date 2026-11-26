import React from "react";
import { Composition } from "remotion";
import { FacelessShort, facelessShortSchema } from "./FacelessShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FacelessShort"
        component={FacelessShort}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        schema={facelessShortSchema}
        defaultProps={{
          audioFile: "voice.mp3",
          topicHeader: "PRINSIP NEGOSIASI",
          accentColor: "#990000",
          watermark: "MENSIUS",
          words: [
            { text: "Contoh", start: 0.0, end: 0.4 },
            { text: "teks", start: 0.4, end: 0.8 },
          ],
        }}
        calculateMetadata={({ props }) => {
          const fps = 30;
          const lastWordEnd =
            props.words.length > 0
              ? props.words[props.words.length - 1].end
              : 10;
          return {
            durationInFrames: Math.ceil((lastWordEnd + 1.0) * fps),
          };
        }}
      />
    </>
  );
};
