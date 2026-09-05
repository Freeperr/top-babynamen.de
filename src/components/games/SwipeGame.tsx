'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, RotateCcw, ArrowRight } from 'lucide-react';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName, Gender } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';

const genderLabel = (gender: string) =>
  gender === 'girl' ? 'Mädchen' : gender === 'boy' ? 'Junge' : 'Unisex';

export default function SwipeGame() {
  const [selectedGender, setSelectedGender] = useState<'all' | Gender>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedLikes, setSwipedLikes] = useState<BabyName[]>([]);
  const [swipedPasses, setSwipedPasses] = useState<BabyName[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredDeck = ALL_NAMES.filter(
    (n) => selectedGender === 'all' || n.gender === selectedGender || n.gender === 'unisex'
  );

  const currentName = filteredDeck[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentName) return;

    if (direction === 'right') {
      setSwipedLikes((prev) => [currentName, ...prev]);
      if (!isFavorite(currentName.id)) {
        toggleFavorite(currentName);
      }
    } else {
      setSwipedPasses((prev) => [currentName, ...prev]);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSwipedLikes([]);
    setSwipedPasses([]);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Gender filter */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {(
          [
            { id: 'all', label: 'Alle' },
            { id: 'girl', label: 'Mädchen' },
            { id: 'boy', label: 'Jungen' },
          ] as const
        ).map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setSelectedGender(g.id);
              setCurrentIndex(0);
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              selectedGender === g.id
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-ink-soft border-line-strong hover:border-accent hover:text-accent-deep'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Swipe deck */}
      <div className="relative h-[420px] sm:h-[460px] w-full flex items-center justify-center">
        {currentName ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentName.id}
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x;
                if (swipe > 100 || velocity.x > 500) {
                  handleSwipe('right');
                } else if (swipe < -100 || velocity.x < -500) {
                  handleSwipe('left');
                }
              }}
              className="absolute inset-0 bg-surface rounded-2xl border border-line-strong p-6 sm:p-8 flex flex-col justify-between shadow-sm cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">{genderLabel(currentName.gender)}</span>
                <span className="text-fade">#{currentName.popularityRank} · {currentName.origin}</span>
              </div>

              <div className="text-center my-auto py-4">
                <h3 className="font-editorial text-4xl sm:text-5xl text-ink mb-2 px-2 break-words">
                  {currentName.name}
                </h3>
                {currentName.pronunciation && (
                  <p className="text-xs text-fade font-mono mb-3">{currentName.pronunciation}</p>
                )}
                <div className="p-4 bg-paper-warm rounded-xl border border-line max-w-sm mx-auto">
                  <p className="text-[11px] eyebrow mb-1">Bedeutung</p>
                  <p className="text-sm text-ink-soft">&bdquo;{currentName.meaning}&ldquo;</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-line text-sm text-ink-soft">
                <span className="text-xs">
                  {currentName.tags.slice(0, 3).join(' · ')}
                </span>
                <Link
                  href={`/name/${currentName.id}`}
                  className="inline-flex items-center gap-0.5 text-ink hover:text-accent-deep transition-colors"
                >
                  Profil <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="bg-surface rounded-2xl border border-line p-8 text-center flex flex-col items-center justify-center h-full w-full shadow-sm">
            <h3 className="font-editorial text-2xl text-ink mb-2">
              Alle Karten durchgespielt!
            </h3>
            <p className="text-sm text-ink-soft max-w-xs mb-6">
              Du hast {swipedLikes.length} Namen als Favoriten gespeichert.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={handleReset}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Nochmal von vorn
              </button>
              <Link href="/favoriten" className="btn btn-secondary">
                Zu den Favoriten
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {currentName && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-surface border border-line-strong text-fade hover:text-ink hover:border-ink flex items-center justify-center transition-colors active:scale-90"
            title="Nicht mein Ding (nach links)"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 text-fade hover:text-ink transition-colors"
            title="Zurücksetzen"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full bg-accent text-white hover:bg-accent-deep flex items-center justify-center transition-colors active:scale-90"
            title="Gefällt mir! (nach rechts)"
          >
            <Heart className="w-6 h-6 fill-current" />
          </button>
        </div>
      )}

      {/* Counter */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-fade">
        <span>
          Gefällt mir: <strong className="text-ink">{swipedLikes.length}</strong>
        </span>
        <span>
          Übersprungen: <strong className="text-ink">{swipedPasses.length}</strong>
        </span>
        <span>
          Verbleibend: <strong className="text-ink">{Math.max(0, filteredDeck.length - currentIndex)}</strong>
        </span>
      </div>
    </div>
  );
}