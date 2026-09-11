'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, ArrowRight } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import confetti from 'canvas-confetti';

// 8 segments for high visual clarity and beauty on the wheel
const WHEEL_NAMES = [
  BABY_NAMES[0], // Emma
  BABY_NAMES[1], // Emilia
  BABY_NAMES[8], // Noah
  BABY_NAMES[4], // Mila
  BABY_NAMES[11], // Liam
  BABY_NAMES[9], // Elara
  BABY_NAMES[12], // Theo
  BABY_NAMES[10], // Juno
];

const SEGMENT_ANGLE = 360 / WHEEL_NAMES.length; // 45 degrees

export default function NameRoulette() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedName, setSelectedName] = useState<BabyName | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedName(null);

    // Pick a random target index
    const targetIndex = Math.floor(Math.random() * WHEEL_NAMES.length);
    const targetName = WHEEL_NAMES[targetIndex];

    // Calculate rotation: at least 5-7 full spins (1800-2520 deg) + angle alignment to the top needle (270 deg or 0 deg offset)
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    // Pointer is at the top (270 deg or -90 deg). Segment index center angle:
    const targetAngle = 360 - targetIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2;
    const finalRotation = rotation + extraSpins + (targetAngle - (rotation % 360));

    setRotation(finalRotation);

    // After animation finishes (approx 4.5s)
    setTimeout(() => {
      setSelectedName(targetName);
      setIsSpinning(false);

      try {
        confetti({
          particleCount: 60,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#FF6F9F', '#FF4F87', '#FFD6E3', '#FFF5F8'],
        });
      } catch {}
    }, 4500);
  };

  // Wheel colors (alternating soft white & very soft pink with pink borders)
  const segmentColors = [
    '#FFFFFF',
    '#FFF5F8',
    '#FFFFFF',
    '#FFF5F8',
    '#FFFFFF',
    '#FFF5F8',
    '#FFFFFF',
    '#FFF5F8',
  ];

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center text-center">
      <p className="text-sm text-[#777777] mb-8">
        Lass das Schicksal entscheiden! Klicke auf &bdquo;Drehen&ldquo; und finde deinen Überraschungsnamen.
      </p>

      {/* Wheel Container */}
      <div className="relative w-[min(280px,88vw)] h-[min(280px,88vw)] sm:w-[380px] sm:h-[380px] flex items-center justify-center select-none">
        {/* Needle / Indicator at top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none drop-shadow-md">
          <div className="w-5 h-7 bg-[#FF4F87] rounded-b-md clip-polygon" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
          <div className="w-4 h-4 rounded-full bg-[#171717] -mt-5 border-2 border-white" />
        </div>

        {/* Outer Ring Decoration */}
        <div className="absolute inset-0 rounded-full border-8 border-[#FFD6E3] shadow-[0_12px_40px_rgba(255,111,159,0.2)] pointer-events-none" />

        {/* Rotating SVG Wheel */}
        <div
          className="w-full h-full rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? 'transform 4.5s cubic-bezier(0.12, 0.8, 0.15, 1.02)'
              : 'none',
          }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {WHEEL_NAMES.map((name, i) => {
              const startAngle = (i * SEGMENT_ANGLE * Math.PI) / 180;
              const endAngle = ((i + 1) * SEGMENT_ANGLE * Math.PI) / 180;
              const x1 = 200 + 200 * Math.cos(startAngle);
              const y1 = 200 + 200 * Math.sin(startAngle);
              const x2 = 200 + 200 * Math.cos(endAngle);
              const y2 = 200 + 200 * Math.sin(endAngle);

              const pathData = `M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`;
              const midAngle = (i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);

              return (
                <g key={name.id}>
                  <path
                    d={pathData}
                    fill={segmentColors[i]}
                    stroke="#FFD6E3"
                    strokeWidth="2"
                  />
                  {/* Name Text */}
                  <text
                    x="200"
                    y="70"
                    transform={`rotate(${midAngle + 90}, 200, 200)`}
                    textAnchor="middle"
                    fill="#171717"
                    fontSize={name.name.length > 7 ? '11' : name.name.length > 5 ? '13' : '15'}
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    {name.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Center Hub Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="absolute z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-[#FF4F87] shadow-[0_4px_20px_rgba(255,79,135,0.3)] flex flex-col items-center justify-center hover:scale-105 active:scale-95 disabled:hover:scale-100 transition-transform cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-[#FF4F87] mb-0.5" />
          <span className="text-xs sm:text-sm font-extrabold text-[#171717] tracking-tight">
            {isSpinning ? 'Dreht...' : 'Drehen'}
          </span>
        </button>
      </div>

      {/* Result Display Box */}
      <div className="mt-8 w-full max-w-md min-h-[140px] flex items-center justify-center">
        {selectedName ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-white p-6 rounded-[22px] border border-[#FFD6E3] shadow-xs"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF4F87]">
              Dein Roulette-Ergebnis
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-normal text-[#171717] mt-1 mb-1">
              {selectedName.name}
            </h3>
            <p className="text-xs text-[#777777] mb-4">
              {selectedName.origin} · &bdquo;{selectedName.meaning}&ldquo;
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => toggleFavorite(selectedName)}
                className={`btn-primary px-5 py-2 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 ${
                  isFavorite(selectedName.id) ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isFavorite(selectedName.id) ? 'fill-white' : ''}`}
                />
                <span>
                  {isFavorite(selectedName.id) ? 'Gespeichert' : 'Zu Favoriten'}
                </span>
              </button>

              <Link
                href={`/name/${selectedName.id}`}
                className="px-4 py-2 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] text-[#171717] hover:text-[#FF4F87] text-xs sm:text-sm font-semibold inline-flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <p className="text-xs text-[#777777] italic">
            Klicke auf &bdquo;Drehen&ldquo;, um das Rad in Bewegung zu setzen.
          </p>
        )}
      </div>
    </div>
  );
}
