import React from 'react';
import { Composition } from 'remotion';
import { AutoClip, AutoClipSchema } from './AutoClip';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AutoClip"
        component={AutoClip}
        durationInFrames={150}
        fps={FPS}
        width={1080}
        height={1920}
        schema={AutoClipSchema}
        defaultProps={{
          videoSrc: 'sample.mp4',
          hookTitle: 'Momen Paling Gila di Match Ini!',
          durationInSeconds: 5,
          highlightColor: '#FFE600',
          words: [
            { word: 'LIHAT', start: 0.2, end: 0.6 },
            { word: 'PERGERAKAN', start: 0.65, end: 1.3 },
            { word: 'INI', start: 1.35, end: 1.7 },
            { word: 'SAMPAI', start: 1.8, end: 2.3 },
            { word: 'HABIS', start: 2.35, end: 2.9 },
          ],
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: Math.max(
              1,
              Math.ceil(props.durationInSeconds * FPS)
            ),
          };
        }}
      />
    </>
  );
};
