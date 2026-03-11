'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useTranslations } from 'next-intl';

const FRAME_COUNT = 12;
const FRAME_PATHS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/images/scroll/frame-${String(i + 1).padStart(2, '0')}.png`
);

const TEXT_RANGES: { start: number; end: number; key: string }[] = [
  { start: 0, end: 3, key: 'text1' },
  { start: 3, end: 6, key: 'text2' },
  { start: 6, end: 9, key: 'text3' },
  { start: 9, end: 12, key: 'text4' },
];

function getTextOpacity(frameIndex: number, rangeStart: number, rangeEnd: number): number {
  const mid = (rangeStart + rangeEnd) / 2;
  const halfSpan = (rangeEnd - rangeStart) / 2;
  const dist = Math.abs(frameIndex - mid);
  if (dist >= halfSpan) return 0;
  // Smooth fade: full opacity at center, 0 at edges
  return Math.cos((dist / halfSpan) * (Math.PI / 2));
}

export function ScrollSequence() {
  const t = useTranslations('Landing.scrollSequence');
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track current frame based on scroll progress
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const frame = Math.min(
      FRAME_COUNT - 1,
      Math.floor(progress * FRAME_COUNT)
    );
    setCurrentFrame(frame);
  });

  // Preload all images
  useEffect(() => {
    let loaded = 0;
    FRAME_PATHS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === FRAME_COUNT) setImagesLoaded(true);
      };
    });
  }, []);

  // Smooth frame index as a continuous value for text fading
  const smoothFrame = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);
  const [smoothFrameValue, setSmoothFrameValue] = useState(0);
  useMotionValueEvent(smoothFrame, 'change', (v) => setSmoothFrameValue(v));

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] md:h-[350vh]"
      style={{ backgroundColor: '#090604' }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Frame images */}
        <div className="relative w-full h-full">
          {FRAME_PATHS.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: i === currentFrame ? 1 : 0,
                transition: 'opacity 0.15s ease-out',
                zIndex: i === currentFrame ? 2 : 1,
              }}
            >
              <Image
                src={src}
                alt={`FoodTracks scroll frame ${i + 1}`}
                width={1408}
                height={768}
                className="w-full h-full object-contain md:object-cover"
                priority={i < 3}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Text overlays */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-24 pointer-events-none z-10">
          {TEXT_RANGES.map(({ start, end, key }) => {
            const opacity = getTextOpacity(smoothFrameValue, start, end);
            return (
              <div
                key={key}
                className="absolute bottom-16 md:bottom-24 left-0 right-0 text-center px-6"
                style={{
                  opacity,
                  transform: `translateY(${(1 - opacity) * 20}px)`,
                  transition: 'transform 0.1s ease-out',
                  pointerEvents: 'none',
                }}
              >
                <div
                  className="inline-block px-6 py-4 md:px-10 md:py-6 rounded-2xl"
                  style={{
                    backgroundColor: 'rgba(9, 6, 4, 0.7)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <p className="text-white text-lg md:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight">
                    {t(key)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading indicator */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#090604]">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
}
