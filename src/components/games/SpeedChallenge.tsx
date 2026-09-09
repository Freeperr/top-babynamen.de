'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Timer, Heart, X, RotateCcw, ArrowRight } from 'lucide-react';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import { originPhrase } from '@/lib/format';

const CHALLENGE_DURATION = 8;
const TOTAL_NAMES = 6;

export default function SpeedChallenge() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [likedNames, setLikedNames] = useState<BabyName[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [challengePool, setChallengePool] = useState<BabyName[]>(() =>
    [...ALL_NAMES].sort(() => Math.random() - 0.5).slice(0, TOTAL_NAMES)
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
    setChallengePool([...ALL_NAMES].sort(() => Math.random() - 0.5).slice(0, TOTAL_NAMES));
    setCurrentIndex(0);
    setTimeLeft(CHALLENGE_DURATION);
    setLikedNames([]);
    setIsCompleted(false);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-xl mx-auto text-center">
      {!isPlaying && !isCompleted ? (
        <div className="bg-surface rounded-xl border border-line p-8 sm:p-12">
          <div className="w-12 h-12 rounded-full bg-blue-soft border border-line flex items-center justify-center text-blue-deep mx-auto mb-4">
            <Timer className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl text-ink mb-2">
            Welcher Name passt?
          </h3>
          <p className="text-sm text-ink-soft max-w-sm mx-auto mb-8">
            Höre auf dein erstes Bauchgefühl. Du hast {CHALLENGE_DURATION}{' '}
            Sekunden pro Name: Gefällt mir, oder weiter.
          </p>
          <button onClick={handleStart} className="btn btn-primary px-8 py-3">
            Challenge starten
          </button>
        </div>
      ) : isPlaying && currentName ? (
        <div className="bg-surface rounded-xl border border-line-strong p-6 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-fade">
              Name {currentIndex + 1} von {TOTAL_NAMES}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-ink font-medium">
              <Timer className="w-4 h-4 text-blue" />
              {Math.ceil(timeLeft)}s
            </span>
          </div>

          <div className="w-full bg-panel h-1.5 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-blue transition-all duration-100 ease-linear"
              style={{ width: `${(timeLeft / CHALLENGE_DURATION) * 100}%` }}
            />
          </div>

          <div className="py-4">
            <h4 className="font-editorial text-4xl sm:text-5xl text-ink mb-2 break-words">
              {currentName.name}
            </h4>
            <span className="text-xs text-ink-soft">
              {originPhrase(currentName.origin, currentName.gender)}
            </span>
            <p className="text-sm text-fade mt-3">
              &bdquo;{currentName.meaning}&ldquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-line">
            <button
              onClick={() => handleDecision(false)}
              className="btn btn-secondary inline-flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Gefällt mir nicht
            </button>
            <button
              onClick={() => handleDecision(true)}
              className="btn btn-primary inline-flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" />
              Gefällt mir
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-line p-8 sm:p-10 text-center rise">
          <h3 className="font-editorial text-2xl sm:text-3xl text-ink mb-2">
            Challenge abgeschlossen!
          </h3>
          <p className="text-sm text-ink-soft mb-6">
            Das sind deine Treffer in sechs schnellen Runden:
          </p>

          {likedNames.length > 0 ? (
            <div className="border-t border-line mb-7 text-left">
              {likedNames.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between gap-3 py-3 border-b border-line"
                >
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-editorial text-xl text-ink">{n.name}</span>
                    <span className="text-xs text-fade truncate">{originPhrase(n.origin, n.gender)}</span>
                  </div>
                  <Link
                    href={`/name/${n.id}`}
                    className="text-xs text-ink-soft hover:text-blue-deep inline-flex items-center gap-1 shrink-0"
                  >
                    Profil <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-soft italic mb-6">
              Kein Name hat dich spontan umgehauen? Probier gleich eine neue Runde.
            </p>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={handleStart}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Noch eine Runde
            </button>
            <Link href="/favoriten" className="btn btn-secondary">
              Zu den Favoriten
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}