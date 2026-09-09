'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wand2, Heart, ArrowRight } from 'lucide-react';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName, Gender, NameStyle } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import { originPhrase } from '@/lib/format';

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

    let candidates = ALL_NAMES.filter((n) => {
      const matchGender =
        selectedGender === 'all' || n.gender === selectedGender || n.gender === 'unisex';
      const matchStyle =
        selectedStyle === 'all' ||
        n.styles.includes(selectedStyle as NameStyle) ||
        n.tags.some((t) => t.toLowerCase() === selectedStyle.toLowerCase());
      return matchGender && matchStyle;
    });

    if (candidates.length === 0) {
      candidates = ALL_NAMES;
    }

    const winner = candidates[Math.floor(Math.random() * candidates.length)];

    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * ALL_NAMES.length);
      setDisplayedName(ALL_NAMES[randomIdx].name);
      count++;

      if (count > 14) {
        clearInterval(interval);
        setDisplayedName(winner.name);
        setGeneratedResult(winner);
        setIsGenerating(false);
      }
    }, 90);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Options */}
      <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 mb-6">
        <h3 className="font-editorial text-xl text-ink mb-5 text-center inline-flex items-center justify-center gap-2 w-full">
          <Wand2 className="w-5 h-5 text-blue" />
          Lass dir einen Namen vorschlagen
        </h3>

        <div className="mb-5">
          <label className="label block mb-2">Geschlecht</label>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { id: 'all' as const, label: 'Egal' },
                { id: 'girl' as const, label: 'Mädchen' },
                { id: 'boy' as const, label: 'Junge' },
                { id: 'unisex' as const, label: 'Unisex' },
              ]
            ).map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGender(g.id)}
                className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                  selectedGender === g.id
                    ? 'bg-blue text-white border-blue'
                    : 'bg-surface text-ink-soft border-line-strong hover:border-blue hover:text-blue-deep'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="label block mb-2">Stil</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              [
                { id: 'all', label: 'Alle' },
                { id: 'modern', label: 'Modern' },
                { id: 'rare', label: 'Selten' },
                { id: 'classic', label: 'Klassisch' },
                { id: 'international', label: 'International' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                  selectedStyle === s.id
                    ? 'bg-blue text-white border-blue'
                    : 'bg-surface text-ink-soft border-line-strong hover:border-blue hover:text-blue-deep'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn btn-primary w-full py-3 disabled:opacity-60"
        >
          {isGenerating ? 'Mische Ideen …' : 'Namen vorschlagen'}
        </button>
      </div>

      {/* Result */}
      <div className="bg-panel border border-line p-8 sm:p-12 text-center">
        <span className="kicker">Vorschlag</span>

        <div className="my-6 min-h-[70px] flex items-center justify-center">
          <motion.h4
            key={displayedName}
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-editorial text-4xl sm:text-6xl tracking-tight break-words ${
              isGenerating ? 'text-blue' : 'text-ink'
            }`}
          >
            {displayedName}
          </motion.h4>
        </div>

        {generatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-line pt-6"
          >
            <p className="text-sm text-ink-soft mb-1">
              {originPhrase(generatedResult.origin, generatedResult.gender)}
            </p>
            <p className="text-sm text-ink-soft max-w-sm mx-auto mb-6">
              &bdquo;{generatedResult.meaning}&ldquo;
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => toggleFavorite(generatedResult)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isFavorite(generatedResult.id) ? 'fill-current' : ''}`} />
                {isFavorite(generatedResult.id) ? 'Gespeichert' : 'Favorisieren'}
              </button>

              <Link href={`/name/${generatedResult.id}`} className="btn btn-secondary">
                Namensprofil
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}