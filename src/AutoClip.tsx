import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';
import { z } from 'zod';

// Skema validasi props agar bisa disuntikkan via CLI (--props=props.json)
export const WordSchema = z.object({
  word: z.string(),
  start: z.number(), // dalam detik (contoh: 0.45)
  end: z.number(),   // dalam detik (contoh: 0.82)
});

export const AutoClipSchema = z.object({
  videoSrc: z.string(),        // Nama file di folder public/ (contoh: "clip.mp4") atau URL
  hookTitle: z.string(),       // Teks judul pancingan di bagian atas
  durationInSeconds: z.number(),
  words: z.array(WordSchema),
  highlightColor: z.string().default('#FFE600'),
});

export type AutoClipProps = z.infer<typeof AutoClipSchema>;

export const AutoClip: React.FC<AutoClipProps> = ({
  videoSrc,
  hookTitle,
  words,
  highlightColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Mendukung URL eksternal maupun file lokal di folder public/
  const resolvedVideoSrc = videoSrc.startsWith('http')
    ? videoSrc
    : staticFile(videoSrc);

  // Kelompokkan kata per 4 kata agar tampilan subtitle rapi dan mudah dibaca
  const WORDS_PER_CHUNK = 4;
  const chunks: Array<{
    words: typeof words;
    start: number;
    end: number;
  }> = [];

  for (let i = 0; i < words.length; i += WORDS_PER_CHUNK) {
    const slice = words.slice(i, i + WORDS_PER_CHUNK);
    if (slice.length > 0) {
      chunks.push({
        words: slice,
        start: slice[0].start,
        end: slice[slice.length - 1].end,
      });
    }
  }

  // Cari potongan kalimat yang aktif pada detik saat ini
  const activeChunk = chunks.find(
    (c) => currentTime >= c.start && currentTime <= c.end + 0.15
  );

  // Animasi pop-in halus saat pergantian kelompok kata
  const chunkStartFrame = activeChunk ? activeChunk.start * fps : 0;
  const popScale = spring({
    frame: Math.max(0, frame - chunkStartFrame),
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* 1. Video Latar Belakang (Auto-Crop Tengah ke 9:16) */}
      <OffthreadVideo
        src={resolvedVideoSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Overlay gelap tipis di area atas & bawah agar teks kontras */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* 2. Teks Judul Hook di Bagian Atas (Safe Zone TikTok/Shorts) */}
      {hookTitle.trim() !== '' && (
        <div
          style={{
            position: 'absolute',
            top: 170,
            left: 60,
            right: 60,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0A0A0A',
              fontFamily: 'Inter, Arial, sans-serif',
              fontWeight: 900,
              fontSize: 44,
              lineHeight: 1.25,
              padding: '18px 32px',
              borderRadius: 18,
              textAlign: 'center',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
              textTransform: 'uppercase',
            }}
          >
            {hookTitle}
          </div>
        </div>
      )}

      {/* 3. Dynamic Word-by-Word Subtitle di Bagian Bawah */}
      {activeChunk && (
        <div
          style={{
            position: 'absolute',
            bottom: 340,
            left: 50,
            right: 50,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px',
            transform: `scale(${0.92 + popScale * 0.08})`,
          }}
        >
          {activeChunk.words.map((item, idx) => {
            const isSpoken =
              currentTime >= item.start && currentTime <= item.end + 0.05;

            return (
              <span
                key={`${item.word}-${idx}`}
                style={{
                  fontFamily: 'Inter, Arial, sans-serif',
                  fontWeight: 900,
                  fontSize: 64,
                  textTransform: 'uppercase',
                  color: isSpoken ? highlightColor : '#FFFFFF',
                  transform: isSpoken ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.06s ease-out',
                  textShadow:
                    '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 8px 18px rgba(0,0,0,0.85)',
                }}
              >
                {item.word}
              </span>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
