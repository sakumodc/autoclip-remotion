import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const wordSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

export const facelessShortSchema = z.object({
  audioFile: z.string(),
  topicHeader: z.string(),
  accentColor: z.string().default("#990000"),
  watermark: z.string().default("MENSIUS"),
  words: z.array(wordSchema),
});

export type FacelessShortProps = z.infer<typeof facelessShortSchema>;

export const FacelessShort: React.FC<FacelessShortProps> = ({
  audioFile,
  topicHeader,
  accentColor,
  watermark,
  words,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentTime = frame / fps;

  // Animasi ambient background (pulse halus & pergeseran grid)
  const pulse = Math.sin(frame / 25) * 0.15 + 0.85;
  const gridOffset = (frame * 0.4) % 80;
  const glowY = interpolate(
    frame,
    [0, durationInFrames],
    [35, 65],
    { extrapolateRight: "clamp" }
  );

  // Progress bar bawah
  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  // Kelompokkan kata per 3 kata untuk chunk subtitle dinamis
  const CHUNK_SIZE = 3;
  const activeIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );
  const fallbackIndex =
    activeIndex !== -1
      ? activeIndex
      : words.reduce(
          (acc, w, idx) => (currentTime >= w.start ? idx : acc),
          0
        );

  const chunkStart = Math.floor(fallbackIndex / CHUNK_SIZE) * CHUNK_SIZE;
  const currentChunk = words.slice(chunkStart, chunkStart + CHUNK_SIZE);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#09090B",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        color: "#F4F4F5",
        overflow: "hidden",
      }}
    >
      {/* Audio Voiceover */}
      <Audio src={staticFile(audioFile)} />

      {/* Layer 1: Subtle Architectural Grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `${gridOffset}px ${gridOffset}px`,
        }}
      />

      {/* Layer 2: Ambient Crimson Radial Glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${glowY}%, ${accentColor}40 0%, rgba(9,9,11,0) 65%)`,
          opacity: pulse,
        }}
      />

      {/* Layer 3: Vignette Border */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 160px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      />

      {/* Top Topic Header Pill */}
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 64px",
        }}
      >
        <div
          style={{
            borderLeft: `5px solid ${accentColor}`,
            backgroundColor: "rgba(24, 24, 27, 0.85)",
            padding: "16px 32px",
            borderRadius: "4px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: 30,
            fontWeight: 800,
            color: "#FAFAFA",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          {topicHeader}
        </div>
      </div>

      {/* Center Dynamic Word-by-Word Subtitle */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          transform: "translateY(-50%)",
          width: "100%",
          padding: "0 72px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        {currentChunk.map((w, idx) => {
          const isCurrent =
            currentTime >= w.start && currentTime <= w.end + 0.08;
          const scale = isCurrent
            ? spring({
                frame: Math.max(0, frame - Math.floor(w.start * fps)),
                fps,
                config: { damping: 14, stiffness: 220 },
              }) *
                0.08 +
              1
            : 1;

          return (
            <span
              key={`${chunkStart}-${idx}`}
              style={{
                fontSize: 68,
                fontWeight: 900,
                lineHeight: 1.2,
                textTransform: "uppercase",
                color: isCurrent ? "#FFFFFF" : "rgba(244, 244, 245, 0.45)",
                backgroundColor: isCurrent ? accentColor : "transparent",
                padding: isCurrent ? "4px 18px" : "4px 6px",
                borderRadius: "8px",
                transform: `scale(${scale})`,
                textShadow: "0 6px 24px rgba(0,0,0,0.85)",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>

      {/* Bottom Watermark & Progress Line */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.28em",
            color: "rgba(244, 244, 245, 0.45)",
          }}
        >
          {watermark}
        </div>
        <div
          style={{
            width: 360,
            height: 4,
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
