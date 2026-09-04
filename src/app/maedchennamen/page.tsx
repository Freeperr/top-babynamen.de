'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { NameStyle } from '@/types/name';
import NameCard from '@/components/NameCard';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function MaedchennamenPage() {
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');

  const girlNames = BABY_NAMES.filter((n) => n.gender === 'girl' || n.gender === 'unisex');

  const filtered = girlNames.filter((n) => {
    const matchLetter = selectedLetter === 'all' || n.firstLetter.toUpperCase() === selectedLetter;
    const matchStyle =
      styleFilter === 'all' ||
      n.styles.includes(styleFilter as NameStyle) ||
      (styleFilter === 'short' && n.length <= 4);
    return matchLetter && matchStyle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF4F87] inline-block mb-3">
          Mädchennamen Kollektion
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] tracking-tight mb-3">
          Die schönsten Mädchennamen
        </h1>
        <p className="text-base sm:text-lg text-[#777777] leading-relaxed">
          Sanft, melodisch und voller Bedeutung: Entdecke beliebte Klassiker wie Emma &amp; Emilia oder bezaubernde Geheimtipps wie Elara und Juno.
        </p>
      </div>

      {/* Quick Category Tabs */}
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        {[
          { id: 'all', label: 'Alle Mädchennamen' },
          { id: 'classic', label: 'Klassisch & Zeitlos' },
          { id: 'short', label: 'Kurze Namen (3–4 Buchstaben)' },
          { id: 'rare', label: 'Seltene Schätze' },
          { id: 'modern', label: 'Moderne Trendnamen' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStyleFilter(tab.id)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              styleFilter === tab.id
                ? 'bg-[#FF4F87] text-white border-[#FF4F87] shadow-2xs'
                : 'bg-[#FFF5F8] text-[#171717] border-[#FFD6E3] hover:border-[#FF6F9F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alphabet Scroll Ribbon */}
      <div className="bg-[#FFF5F8]/70 p-3 rounded-[20px] border border-[#FFD6E3] mb-8 flex items-center gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSelectedLetter('all')}
          className={`px-3 py-1 text-xs font-bold rounded-md shrink-0 transition-all ${
            selectedLetter === 'all'
              ? 'bg-[#FF4F87] text-white'
              : 'text-[#777777] hover:text-[#171717] hover:bg-white'
          }`}
        >
          Alle
        </button>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-7 h-7 rounded-md text-xs font-bold shrink-0 flex items-center justify-center transition-all ${
              selectedLetter === letter
                ? 'bg-[#FF4F87] text-white shadow-2xs'
                : 'text-[#777777] hover:text-[#171717] hover:bg-white'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Grid of Names */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#171717]">
          {filtered.length} Mädchennamen gefunden
        </span>
        <Link
          href="/spiele"
          className="text-xs font-semibold text-[#FF4F87] hover:underline flex items-center gap-1"
        >
          <span>Spiele für Mädchennamen</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((name) => (
          <NameCard key={name.id} name={name} showTrend />
        ))}
      </div>
    </div>
  );
}
