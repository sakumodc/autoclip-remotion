import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  interpolate,
  spring,
} from "remotion";

export interface WordTiming {
  text: string;
  start: number;
  end: number;
}

export interface FacelessShortProps {
  audioFile: string;
  bgVideoFile: string;
  topicHeader: string;
  accentColor: string;
  watermark: string;
  words: WordTiming[];
}

export const FacelessShort: React.FC<FacelessShortProps> = ({
  audioFile,
  bgVideoFile,
  topicHeader,
  accentColor,
  watermark,
  words,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Cari kata aktif berdasarkan waktu saat ini
  const activeIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );
  const activeWord = activeIndex !== -1 ? words[activeIndex] : null;

  // Animasi pop-in tiap kali kata berganti
  const wordStartFrame = activeWord ? Math.floor(activeWord.start * fps) : 0;
  const scale = activeWord
    ? spring({
        frame: frame - wordStartFrame,
        fps,
        config: { damping: 12, stiffness: 200 },
      })
    : 1;

  // Progress bar di bagian atas layar
  const totalDuration = words.length > 0 ? words[words.length - 1].end : 30;
  const progressWidth = interpolate(
    currentTime,
    [0, totalDuration],
    [0, 100],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Background Video (Gameplay / Dark Aesthetic Loop) */}
      <OffthreadVideo
        src={staticFile(bgVideoFile)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.45) contrast(1.1)",
        }}
      />

      {/* Audio Voiceover TTS */}
      <Audio src={staticFile(audioFile)} />

      {/* Top Progress Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 10,
          width: `${progressWidth}%`,
          backgroundColor: accentColor,
        }}
      />

      {/* Header Topik di Atas */}
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "0 50px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(15, 15, 15, 0.85)",
            borderLeft: `8px solid ${accentColor}`,
            padding: "16px 28px",
            borderRadius: 8,
            color: "#FFFFFF",
            fontSize: 36,
            fontWeight: 800,
            fontFamily: "sans-serif",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {topicHeader}
        </div>
      </div>

      {/* Kinetic Word-by-Word Center Caption */}
      {activeWord && (
        <div
          style={{
            position: "absolute",
            top: "46%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "0 40px",
            transform: `scale(${scale})`,
          }}
        >
          <span
            style={{
              color: activeIndex % 3 === 0 ? accentColor : "#FFFFFF",
              fontSize: 82,
              fontWeight: 900,
              fontFamily: "sans-serif",
              textTransform: "uppercase",
              textAlign: "center",
              textShadow:
                "0px 8px 24px rgba(0,0,0,0.95), -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000",
            }}
          >
            {activeWord.text}
          </span>
        </div>
      )}

      {/* Watermark Branding */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          width: "100%",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.65)",
          fontSize: 26,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: 3,
        }}
      >
        {watermark}
      </div>
    </AbsoluteFill>
  );
};
