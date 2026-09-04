'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { getTopNames } from '@/lib/nameService';
import { Gender } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';

export default function TopNamesSection() {
  const [activeTab, setActiveTab] = useState<'all' | Gender>('all');
  const { isFavorite, toggleFavorite } = useFavorites();

  const names = getTopNames(5, activeTab === 'all' ? undefined : activeTab);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#F0E4E7]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#171717] tracking-tight">
              Aktuell besonders beliebt
            </h2>
            <p className="text-[#777777] text-sm mt-1">
              Die beliebtesten Namen, die gerade entdeckt werden.
            </p>
          </div>

          {/* Simple Clean Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#FFF5F8] rounded-full border border-[#F0E4E7] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-[#FF4F87] shadow-2xs'
                  : 'text-[#777777] hover:text-[#171717]'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => setActiveTab('girl')}
              className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all ${
                activeTab === 'girl'
                  ? 'bg-white text-[#FF4F87] shadow-2xs'
                  : 'text-[#777777] hover:text-[#171717]'
              }`}
            >
              Mädchen
            </button>
            <button
              onClick={() => setActiveTab('boy')}
              className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all ${
                activeTab === 'boy'
                  ? 'bg-white text-[#FF4F87] shadow-2xs'
                  : 'text-[#777777] hover:text-[#171717]'
              }`}
            >
              Jungen
            </button>
          </div>
        </div>

        {/* Clean, quiet row list */}
        <div className="divide-y divide-[#F0E4E7]/70">
          {names.map((name, index) => {
            const favorited = isFavorite(name.id);
            const rank = index + 1;
            const rankStr = rank < 10 ? `0${rank}` : `${rank}`;

            return (
              <div
                key={name.id}
                className="py-4 flex items-center justify-between gap-4 group hover:bg-[#FFF5F8]/40 px-3 rounded-xl transition-colors"
              >
                {/* Left: Rank & Name */}
                <Link
                  href={`/name/${name.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="font-mono text-xs font-semibold text-[#FF6F9F] w-5 shrink-0">
                    {rankStr}
                  </span>

                  <div className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-editorial text-xl sm:text-2xl font-normal text-[#171717] group-hover:text-[#FF4F87] transition-colors">
                      {name.name}
                    </span>
                    <span className="text-xs text-[#777777] truncate">
                      {name.origin} · &bdquo;{name.meaning}&ldquo;
                    </span>
                  </div>
                </Link>

                {/* Right: Trend & Favorite */}
                <div className="flex items-center gap-3 shrink-0">
                  {name.weeklyChange && (
                    <span className="text-xs font-medium text-emerald-700 hidden sm:inline">
                      {name.weeklyChange}
                    </span>
                  )}

                  <button
                    onClick={(e) => toggleFavorite(name, e)}
                    className={`p-2 rounded-full border transition-all active:scale-90 ${
                      favorited
                        ? 'bg-[#FFF5F8] border-[#FF6F9F] text-[#FF4F87]'
                        : 'bg-white border-[#F0E4E7] text-[#777777] hover:text-[#FF4F87] hover:border-[#FFD6E3]'
                    }`}
                    title="Favorisieren"
                  >
                    <Heart
                      className={`w-4 h-4 ${favorited ? 'fill-[#FF4F87]' : ''}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiet Footer Link */}
        <div className="mt-6 pt-4 flex items-center justify-between text-xs text-[#777777]">
          <span>Basierend auf aktuellen Auswertungen.</span>
          <Link
            href="/babynamen"
            className="font-medium text-[#FF4F87] hover:underline inline-flex items-center gap-1"
          >
            <span>Alle beliebten Namen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
