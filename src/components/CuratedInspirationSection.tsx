'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { useFavorites } from '@/context/FavoritesContext';

type TabKey = 'rare' | 'comeback' | 'rising';

export default function CuratedInspirationSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('rare');
  const { isFavorite, toggleFavorite } = useFavorites();

  const getNamesForTab = () => {
    switch (activeTab) {
      case 'rare':
        return BABY_NAMES.filter((n) => n.styles.includes('rare')).slice(0, 4);
      case 'comeback':
        return BABY_NAMES.filter((n) => n.tags.includes('Comeback') || n.trendDirection === 'comeback').slice(0, 4);
      case 'rising':
        return BABY_NAMES.filter((n) => n.trendDirection === 'up' && n.trendPercentage >= 14).slice(0, 4);
      default:
        return BABY_NAMES.slice(0, 4);
    }
  };

  const currentNames = getNamesForTab();

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'rare', label: 'Seltene Namen' },
    { key: 'comeback', label: 'Wiederentdeckte Klassiker' },
    { key: 'rising', label: 'Schnelle Aufsteiger' },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FFF5F8]/40 border-y border-[#F0E4E7]/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#171717] tracking-tight">
              Inspiration &amp; Schätze
            </h2>
            <p className="text-[#777777] text-sm mt-1">
              Kuratierte Namen für Eltern, die etwas Besonderes suchen.
            </p>
          </div>

          {/* Calm Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-[#F0E4E7] self-start sm:self-auto overflow-x-auto max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#FF4F87] text-white shadow-2xs'
                    : 'text-[#777777] hover:text-[#171717] hover:bg-[#FFF5F8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Clean, spacious cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentNames.map((name) => {
            const favorited = isFavorite(name.id);
            return (
              <div
                key={name.id}
                className="bg-white p-5 rounded-[20px] border border-[#F0E4E7] hover:border-[#FFD6E3] hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] text-[#777777]">
                      {name.gender === 'girl' ? 'Mädchen' : name.gender === 'boy' ? 'Junge' : 'Unisex'}
                    </span>
                    <button
                      onClick={(e) => toggleFavorite(name, e)}
                      className={`p-1.5 rounded-full border transition-colors ${
                        favorited
                          ? 'bg-[#FFF5F8] border-[#FF6F9F] text-[#FF4F87]'
                          : 'bg-white border-[#F0E4E7] text-[#777777] hover:text-[#FF4F87]'
                      }`}
                      title="Speichern"
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-[#FF4F87]' : ''}`} />
                    </button>
                  </div>

                  <Link href={`/name/${name.id}`} className="block">
                    <h3 className="font-editorial text-2xl font-normal text-[#171717] group-hover:text-[#FF4F87] transition-colors mb-1">
                      {name.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-[#FF6F9F] font-medium uppercase tracking-wider mb-2">
                    {name.origin}
                  </p>
                  <p className="text-xs text-[#171717]/80 line-clamp-2 leading-relaxed">
                    &bdquo;{name.meaning}&ldquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0E4E7] flex items-center justify-between mt-4">
                  <span className="text-[11px] text-[#777777]">
                    {name.length} Buchstaben
                  </span>
                  <Link
                    href={`/name/${name.id}`}
                    className="text-xs font-medium text-[#171717] group-hover:text-[#FF4F87] inline-flex items-center gap-0.5"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
