'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { BabyName, Gender } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import confetti from 'canvas-confetti';

export default function SwipeGame() {
  const [selectedGender, setSelectedGender] = useState<'all' | Gender>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedLikes, setSwipedLikes] = useState<BabyName[]>([]);
  const [swipedPasses, setSwipedPasses] = useState<BabyName[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredDeck = BABY_NAMES.filter(
    (n) => selectedGender === 'all' || n.gender === selectedGender || n.gender === 'unisex'
  );

  const currentName = filteredDeck[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentName) return;

    if (direction === 'right') {
      // Like
      setSwipedLikes((prev) => [currentName, ...prev]);
      if (!isFavorite(currentName.id)) {
        toggleFavorite(currentName);
      }
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { x: 0.7, y: 0.6 },
          colors: ['#FF6F9F', '#FF4F87'],
        });
      } catch {}
    } else {
      // Pass
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
      {/* Gender Filter Pills */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => {
            setSelectedGender('all');
            setCurrentIndex(0);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            selectedGender === 'all'
              ? 'bg-[#FF4F87] text-white border-[#FF4F87] shadow-xs'
              : 'bg-white text-[#777777] border-[#FFD6E3] hover:border-[#FF6F9F]'
          }`}
        >
          Alle
        </button>
        <button
          onClick={() => {
            setSelectedGender('girl');
            setCurrentIndex(0);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            selectedGender === 'girl'
              ? 'bg-[#FF4F87] text-white border-[#FF4F87] shadow-xs'
              : 'bg-white text-[#777777] border-[#FFD6E3] hover:border-[#FF6F9F]'
          }`}
        >
          Mädchen
        </button>
        <button
          onClick={() => {
            setSelectedGender('boy');
            setCurrentIndex(0);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            selectedGender === 'boy'
              ? 'bg-[#FF4F87] text-white border-[#FF4F87] shadow-xs'
              : 'bg-white text-[#777777] border-[#FFD6E3] hover:border-[#FF6F9F]'
          }`}
        >
          Jungen
        </button>
      </div>

      {/* Swipe Deck Container */}
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
              className="absolute inset-0 bg-white rounded-[28px] border-2 border-[#FFD6E3] p-7 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(255,111,159,0.15)] cursor-grab active:cursor-grabbing select-none"
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    currentName.gender === 'girl'
                      ? 'bg-[#FFF5F8] text-[#FF4F87] border-[#FFD6E3]'
                      : currentName.gender === 'boy'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : 'bg-purple-50 text-purple-600 border-purple-100'
                  }`}
                >
                  {currentName.gender === 'girl' ? 'Mädchen' : currentName.gender === 'boy' ? 'Junge' : 'Unisex'}
                </span>
                <span className="text-xs text-[#777777] font-medium">
                  #{currentName.popularityRank} · {currentName.origin}
                </span>
              </div>

              {/* Center Name Content */}
              <div className="text-center my-auto py-4">
                <h3 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171717] tracking-tight mb-2">
                  {currentName.name}
                </h3>
                {currentName.pronunciation && (
                  <p className="text-xs text-[#777777] font-mono mb-3">
                    {currentName.pronunciation}
                  </p>
                )}
                <div className="p-4 bg-[#FFF5F8]/70 rounded-[18px] border border-[#F0E4E7] max-w-sm mx-auto">
                  <p className="text-[11px] font-semibold text-[#FF6F9F] uppercase tracking-wider mb-1">
                    Bedeutung
                  </p>
                  <p className="text-sm text-[#171717]">
                    &bdquo;{currentName.meaning}&ldquo;
                  </p>
                </div>
              </div>

              {/* Card Footer tags */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F2E3E8] text-xs text-[#777777]">
                <div className="flex items-center gap-1.5">
                  {currentName.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-[#FFF5F8] border border-[#FFD6E3]/60 text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/name/${currentName.id}`}
                  className="font-semibold text-[#FF4F87] hover:underline inline-flex items-center gap-0.5"
                >
                  Profil <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Empty Deck State */
          <div className="bg-white rounded-[28px] border border-[#FFD6E3] p-8 text-center flex flex-col items-center justify-center h-full w-full shadow-md">
            <div className="w-16 h-16 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#171717] mb-2">Alle Karten durchgespielt!</h3>
            <p className="text-sm text-[#777777] max-w-xs mb-6">
              Du hast alle Namen dieser Kategorie durchgesehen. Du hast {swipedLikes.length} Favoriten ausgewählt.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="btn-primary px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nochmal von vorn</span>
              </button>
              <Link
                href="/favoriten"
                className="px-5 py-2.5 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] text-[#FF4F87] font-semibold text-sm hover:bg-[#FFD6E3]/50"
              >
                Zu den Favoriten
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Action Buttons */}
      {currentName && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white border-2 border-[#F2E3E8] hover:border-gray-400 text-gray-400 hover:text-gray-700 hover:shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90"
            title="Nicht mein Ding (Nach links)"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] text-[#777777] hover:text-[#FF4F87] transition-colors"
            title="Zurücksetzen"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-white border-2 border-[#FF6F9F] text-[#FF4F87] hover:bg-[#FF4F87] hover:text-white hover:shadow-[0_8px_25px_rgba(255,79,135,0.4)] flex items-center justify-center transition-all duration-200 active:scale-90"
            title="Gefällt mir! (Nach rechts)"
          >
            <Heart className="w-8 h-8 fill-current" />
          </button>
        </div>
      )}

      {/* Mini counter summary */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-[#777777]">
        <span>Geliked: <strong className="text-[#FF4F87]">{swipedLikes.length}</strong></span>
        <span>Übersprungen: <strong>{swipedPasses.length}</strong></span>
        <span>Verbleibend: <strong>{Math.max(0, filteredDeck.length - currentIndex)}</strong></span>
      </div>
    </div>
  );
}
