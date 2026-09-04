'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Timer, Heart, X, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import confetti from 'canvas-confetti';

const CHALLENGE_DURATION = 8; // 8 seconds per card
const TOTAL_NAMES = 6;

export default function SpeedChallenge() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [likedNames, setLikedNames] = useState<BabyName[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Pick random set of names for challenge
  const [challengePool, setChallengePool] = useState<BabyName[]>(() =>
    [...BABY_NAMES].sort(() => Math.random() - 0.5).slice(0, TOTAL_NAMES)
  );

  const currentName = challengePool[currentIndex];

  const handleDecision = useCallback(
    (liked: boolean) => {
      if (liked && currentName) {
        setLikedNames((prev) => [...prev, currentName]);
        if (!isFavorite(currentName.id)) {
          toggleFavorite(currentName);
        }
      }

      if (currentIndex + 1 < challengePool.length) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(CHALLENGE_DURATION);
      } else {
        setIsCompleted(true);
        setIsPlaying(false);
        try {
          confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF6F9F', '#FF4F87', '#FFD6E3'],
          });
        } catch {}
      }
    },
    [currentName, currentIndex, challengePool.length, isFavorite, toggleFavorite]
  );

  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.15) {
          clearInterval(timer);
          setTimeout(() => handleDecision(false), 0);
          return 0;
        }
        return +(prev - 0.1).toFixed(1);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, isCompleted, handleDecision]);

  const handleStart = () => {
    setChallengePool([...BABY_NAMES].sort(() => Math.random() - 0.5).slice(0, TOTAL_NAMES));
    setCurrentIndex(0);
    setTimeLeft(CHALLENGE_DURATION);
    setLikedNames([]);
    setIsCompleted(false);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-xl mx-auto text-center">
      {!isPlaying && !isCompleted ? (
        <div className="bg-white rounded-[28px] border border-[#FFD6E3] p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] mx-auto mb-4">
            <Timer className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-extrabold text-[#171717] mb-2">
            Welcher Name passt?
          </h3>
          <p className="text-sm text-[#777777] max-w-sm mx-auto mb-8">
            Höre auf dein erstes Bauchgefühl! Du hast {CHALLENGE_DURATION} Sekunden pro Name, um zu entscheiden: Gefällt mir oder weiter.
          </p>

          <button
            onClick={handleStart}
            className="btn-primary px-8 py-3.5 text-base font-semibold inline-flex items-center gap-2 shadow-lg"
          >
            <span>Challenge starten</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      ) : isPlaying && currentName ? (
        <div className="bg-white rounded-[28px] border-2 border-[#FFD6E3] p-7 sm:p-10 shadow-[0_16px_40px_rgba(255,111,159,0.12)]">
          {/* Top Progress & Timer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#FF4F87]">
              Name {currentIndex + 1} von {TOTAL_NAMES}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#171717]">
              <Timer className="w-4 h-4 text-[#FF6F9F]" />
              <span>{Math.ceil(timeLeft)}s</span>
            </div>
          </div>

          {/* Time Bar */}
          <div className="w-full bg-[#FFF5F8] h-2 rounded-full overflow-hidden mb-8 border border-[#FFD6E3]">
            <div
              className="h-full bg-[#FF4F87] transition-all duration-100 ease-linear"
              style={{ width: `${(timeLeft / CHALLENGE_DURATION) * 100}%` }}
            />
          </div>

          {/* Name Content */}
          <div className="py-4">
            <h4 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171717] tracking-tight mb-2">
              {currentName.name}
            </h4>
            <span
              className={`text-xs font-medium inline-block mb-4 ${
                currentName.gender === 'girl'
                  ? 'text-[#FF4F87]'
                  : 'text-blue-700'
              }`}
            >
              {currentName.gender === 'girl' ? 'Mädchen' : 'Junge'} · {currentName.origin}
            </span>
            <p className="text-sm text-[#777777] italic max-w-xs mx-auto">
              &bdquo;{currentName.meaning}&ldquo;
            </p>
          </div>

          {/* Decision Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#F2E3E8]">
            <button
              onClick={() => handleDecision(false)}
              className="py-3.5 px-4 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
              <span>Gefällt mir nicht</span>
            </button>

            <button
              onClick={() => handleDecision(true)}
              className="btn-primary py-3.5 px-4 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Gefällt mir</span>
            </button>
          </div>
        </div>
      ) : (
        /* Completed Summary */
        <div className="bg-white rounded-[28px] border-2 border-[#FFD6E3] p-8 sm:p-10 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mb-2">
            Challenge abgeschlossen!
          </h3>
          <p className="text-sm text-[#777777] mb-6">
            Du hast in Sekundenschnelle entschieden. Das sind deine Treffer:
          </p>

          {likedNames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
              {likedNames.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-[18px] bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-base text-[#171717]">{n.name}</h5>
                    <p className="text-xs text-[#777777]">{n.origin}</p>
                  </div>
                  <Link
                    href={`/name/${n.id}`}
                    className="text-xs font-semibold text-[#FF4F87] hover:underline flex items-center gap-1"
                  >
                    Profil <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#777777] italic mb-6">
              Kein Name hat dich spontan umgehauen? Probier gleich eine neue Runde!
            </p>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={handleStart}
              className="btn-primary px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Noch eine Runde</span>
            </button>
            <Link
              href="/favoriten"
              className="px-5 py-2.5 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] text-[#FF4F87] font-semibold text-sm hover:bg-[#FFD6E3]/60"
            >
              Zu den Favoriten
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
