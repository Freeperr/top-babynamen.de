'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { BabyName, Gender, NameStyle } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import confetti from 'canvas-confetti';

export default function NameGenerator() {
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedName, setDisplayedName] = useState<string>('???');
  const [generatedResult, setGeneratedResult] = useState<BabyName | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleGenerate = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGeneratedResult(null);

    // Filter candidates based on selected options
    let candidates = BABY_NAMES.filter((n) => {
      const matchGender =
        selectedGender === 'all' || n.gender === selectedGender || n.gender === 'unisex';
      const matchStyle =
        selectedStyle === 'all' ||
        n.styles.includes(selectedStyle as NameStyle) ||
        n.tags.some((t) => t.toLowerCase() === selectedStyle.toLowerCase());
      return matchGender && matchStyle;
    });

    if (candidates.length === 0) {
      candidates = BABY_NAMES;
    }

    const winner = candidates[Math.floor(Math.random() * candidates.length)];

    // Slot-machine cycling effect
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * BABY_NAMES.length);
      setDisplayedName(BABY_NAMES[randomIdx].name);
      count++;

      if (count > 14) {
        clearInterval(interval);
        setDisplayedName(winner.name);
        setGeneratedResult(winner);
        setIsGenerating(false);

        try {
          confetti({
            particleCount: 35,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FF6F9F', '#FF4F87', '#FFD6E3'],
          });
        } catch {}
      }
    }, 90);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Options Panel */}
      <div className="bg-white rounded-[28px] border border-[#FFD6E3] p-6 sm:p-8 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-[#171717] mb-5 text-center flex items-center justify-center gap-2">
          <Wand2 className="w-5 h-5 text-[#FF4F87]" />
          <span>Generiere deinen Traumnamen</span>
        </h3>

        {/* Gender Choice */}
        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block mb-2">
            Geschlecht:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'all' as const, label: 'Egal' },
              { id: 'girl' as const, label: 'Mädchen' },
              { id: 'boy' as const, label: 'Junge' },
              { id: 'unisex' as const, label: 'Unisex' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGender(g.id)}
                className={`py-2 text-xs font-semibold rounded-full border transition-all ${
                  selectedGender === g.id
                    ? 'bg-[#FF4F87] text-white border-[#FF4F87] shadow-2xs'
                    : 'bg-[#FFF5F8] text-[#171717] border-[#FFD6E3] hover:border-[#FF6F9F]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style Choice */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block mb-2">
            Stil &amp; Charakter:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { id: 'all', label: 'Alle' },
              { id: 'modern', label: 'Modern' },
              { id: 'rare', label: 'Selten' },
              { id: 'classic', label: 'Klassisch' },
              { id: 'international', label: 'International' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                className={`py-2 text-xs font-semibold rounded-full border transition-all ${
                  selectedStyle === s.id
                    ? 'bg-[#FF4F87] text-white border-[#FF4F87] shadow-2xs'
                    : 'bg-[#FFF5F8] text-[#171717] border-[#FFD6E3] hover:border-[#FF6F9F]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-primary w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-75 cursor-pointer"
        >
          <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Mische Namensideen...' : 'Namen generieren'}</span>
        </button>
      </div>

      {/* Big Animated Result Card */}
      <div className="relative bg-gradient-to-br from-[#FFF5F8] to-white rounded-[28px] border-2 border-[#FFD6E3] p-8 sm:p-12 text-center shadow-[0_16px_45px_rgba(255,111,159,0.12)]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6F9F]">
          Generiertes Ergebnis
        </span>

        <div className="my-6 min-h-[70px] flex items-center justify-center">
          <motion.h4
            key={displayedName}
            initial={{ scale: 0.85, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-editorial text-5xl sm:text-6xl font-normal tracking-tight ${
              isGenerating ? 'text-[#FF4F87] blur-xs' : 'text-[#171717]'
            }`}
          >
            {displayedName}
          </motion.h4>
        </div>

        {generatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-[#FFD6E3] pt-6"
          >
            <p className="text-sm font-semibold text-[#FF4F87] mb-1">
              {generatedResult.origin} · {generatedResult.gender === 'girl' ? 'Mädchen' : generatedResult.gender === 'boy' ? 'Junge' : 'Unisex'}
            </p>
            <p className="text-sm text-[#777777] max-w-sm mx-auto mb-6">
              &bdquo;{generatedResult.meaning}&ldquo;
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => toggleFavorite(generatedResult)}
                className={`btn-primary px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2 ${
                  isFavorite(generatedResult.id) ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite(generatedResult.id) ? 'fill-white' : ''}`} />
                <span>
                  {isFavorite(generatedResult.id) ? 'Gespeichert' : 'Favorisieren'}
                </span>
              </button>

              <Link
                href={`/name/${generatedResult.id}`}
                className="px-5 py-2.5 rounded-full bg-white border border-[#FFD6E3] text-[#171717] hover:text-[#FF4F87] text-sm font-semibold inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Namensprofil</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
