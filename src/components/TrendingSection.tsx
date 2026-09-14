'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getTrendingNames } from '@/lib/nameService';
import { useFavorites } from '@/context/FavoritesContext';
import { Heart } from 'lucide-react';

export default function TrendingSection() {
  const [activeCategory, setActiveCategory] = useState<'rising' | 'falling' | 'new' | 'comeback'>('rising');
  const { isFavorite, toggleFavorite } = useFavorites();

  const categories = [
    { id: 'rising', label: '↑ Steigend' },
    { id: 'falling', label: '↓ Fallend' },
    { id: 'new', label: 'Neu entdeckt' },
    { id: 'comeback', label: 'Comeback' },
  ] as const;

  const names = getTrendingNames(activeCategory);

  const renderSparkline = (isUp: boolean) => {
    const points = isUp
      ? '0,22 20,20 40,15 60,13 80,8 100,2'
      : '0,4 20,8 40,12 60,17 80,19 100,24';
    const strokeColor = isUp ? '#FF4F87' : '#94a3b8';

    return (
      <svg className="w-18 h-6 overflow-visible" viewBox="0 0 100 26" fill="none">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <circle cx="100" cy={isUp ? '2' : '24'} r="2.5" fill={strokeColor} />
      </svg>
    );
  };

  return (
    <section className="py-14 sm:py-18 bg-[#FFF5F8]/40 border-y border-[#F0E4E7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
              Was gerade im Trend liegt
            </h2>
            <p className="text-[#777777] text-base mt-1">
              Entwicklungen und Aufsteiger der letzten Wochen.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-[#F0E4E7] overflow-x-auto self-start md:self-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#FF4F87] text-white shadow-2xs'
                    : 'text-[#777777] hover:text-[#171717] hover:bg-[#FFF5F8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {names.map((name) => {
            const favorited = isFavorite(name.id);
            const isPositive = name.trendDirection === 'up' || name.trendDirection === 'new' || name.trendDirection === 'comeback';

            return (
              <div
                key={name.id}
                className="bg-white p-5 rounded-[20px] border border-[#F0E4E7] hover:border-[#FFD6E3] hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <span className="text-[11px] text-[#777777]">
                        #{name.popularityRank} · {name.gender === 'girl' ? 'Mädchen' : name.gender === 'boy' ? 'Junge' : 'Unisex'}
                      </span>
                      <Link href={`/name/${name.id}`}>
                        <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#171717] group-hover:text-[#FF4F87] transition-colors mt-0.5 truncate">
                          {name.name}
                        </h3>
                      </Link>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(name, e)}
                      className={`p-2 rounded-full border transition-colors ${
                        favorited
                          ? 'bg-[#FFF5F8] border-[#FF6F9F] text-[#FF4F87]'
                          : 'bg-white border-[#F0E4E7] text-[#777777] hover:text-[#FF4F87]'
                      }`}
                      title="Speichern"
                    >
                      <Heart className={`w-4 h-4 ${favorited ? 'fill-[#FF4F87]' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs text-[#777777] line-clamp-1 mb-4">
                    {name.origin} · &bdquo;{name.meaning}&ldquo;
                  </p>
                </div>

                {/* Bottom: Sparkline + Percentage change */}
                <div className="pt-3 border-t border-[#F0E4E7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderSparkline(isPositive)}
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold flex items-center gap-0.5 justify-end ${
                        isPositive ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {name.weeklyChange}
                    </span>
                    <span className="text-[10px] text-[#777777]">vs. Vormonat</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
