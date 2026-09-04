'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { filterNames } from '@/lib/nameService';
import { Gender, NameFilters } from '@/types/name';
import NameCard from '@/components/NameCard';
import AdSense from '@/components/AdSense';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type LengthFilterType = 'all' | 'short' | 'medium' | 'long';
type SortFilterType = 'popularity' | 'alphabetical' | 'trend' | 'length';

function SearchPageContent() {
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialGender = (searchParams.get('gender') as Gender | 'all') || 'all';
  const initialStyle = searchParams.get('style') || 'all';
  const rawLength = searchParams.get('length') as LengthFilterType;
  const initialLength: LengthFilterType = ['all', 'short', 'medium', 'long'].includes(rawLength)
    ? rawLength
    : 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>(initialGender);
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [selectedLength, setSelectedLength] = useState<LengthFilterType>(initialLength);
  const [selectedStyle, setSelectedStyle] = useState<string>(initialStyle);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortFilterType>('popularity');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Extract all unique origins from dataset
  const origins = useMemo(() => {
    const set = new Set<string>();
    BABY_NAMES.forEach((n) => {
      n.origin.split('/').forEach((part) => set.add(part.trim()));
    });
    return Array.from(set).sort();
  }, []);

  // Filter and sort names
  const filtered = useMemo(() => {
    const filters: NameFilters = {
      query,
      gender: selectedGender,
      firstLetter: selectedLetter,
      lengthCategory: selectedLength,
      origin: selectedOrigin,
      style: selectedStyle,
      sortBy,
    };
    return filterNames(filters);
  }, [query, selectedGender, selectedLetter, selectedLength, selectedOrigin, selectedStyle, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedGender('all');
    setSelectedLetter('all');
    setSelectedLength('all');
    setSelectedStyle('all');
    setSelectedOrigin('all');
    setSortBy('popularity');
  };

  const hasActiveFilters =
    query !== '' ||
    selectedGender !== 'all' ||
    selectedLetter !== 'all' ||
    selectedLength !== 'all' ||
    selectedStyle !== 'all' ||
    selectedOrigin !== 'all' ||
    sortBy !== 'popularity';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF4F87] inline-block mb-3">
          Große Namensdatenbank
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] tracking-tight mb-3">
          Babynamen suchen &amp; filtern
        </h1>
        <p className="text-base sm:text-lg text-[#777777]">
          Durchstöbere beliebte, klassische und seltene Namen nach Herkunft, Anfangsbuchstabe und Klang.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative flex items-center bg-white rounded-full p-2 border-2 border-[#FFD6E3] shadow-[0_8px_30px_rgba(255,111,159,0.12)] focus-within:border-[#FF6F9F] focus-within:ring-4 focus-within:ring-[#FFD6E3]/50 transition-all">
          <Search className="w-5 h-5 text-[#FF6F9F] ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach einem Namen, Herkunft oder Bedeutung..."
            className="w-full bg-transparent px-4 py-2.5 text-base text-[#171717] placeholder:text-[#777777] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 text-xs font-semibold text-[#777777] hover:text-[#FF4F87] transition-colors mr-2"
            >
              Löschen
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFF5F8]/70 rounded-[24px] border border-[#FFD6E3] p-5 mb-8 shadow-2xs">
        {/* Row 1: Gender Pills & Quick actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#777777] mr-1">
              Geschlecht:
            </span>
            {[
              { id: 'all' as const, label: 'Alle' },
              { id: 'girl' as const, label: 'Mädchen' },
              { id: 'boy' as const, label: 'Jungen' },
              { id: 'unisex' as const, label: 'Unisex' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGender(g.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                  selectedGender === g.id
                    ? 'bg-[#FF4F87] text-white border-[#FF4F87] shadow-2xs'
                    : 'bg-white text-[#171717] border-[#FFD6E3] hover:border-[#FF6F9F]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Advanced toggle & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#FFD6E3] hover:border-[#FF6F9F] text-xs font-semibold text-[#171717] flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6F9F]" />
              <span>{showAdvancedFilters ? 'Weniger Filter' : 'Mehr Filter'}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#FF4F87] hover:bg-white transition-colors flex items-center gap-1"
                title="Filter zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Zurücksetzen</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Alphabet Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 pt-1 border-t border-[#FFD6E3]/60 scrollbar-none">
          <button
            onClick={() => setSelectedLetter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 transition-all ${
              selectedLetter === 'all'
                ? 'bg-[#FF4F87] text-white'
                : 'text-[#777777] hover:text-[#171717] hover:bg-white'
            }`}
          >
            A–Z
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

        {/* Collapsible Advanced Filters (Length, Style, Origin, Sort) */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-3 border-t border-[#FFD6E3]/60 animate-in fade-in duration-200">
            {/* Length Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block mb-1.5">
                Namenslänge
              </label>
              <select
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value as LengthFilterType)}
                className="w-full bg-white rounded-xl border border-[#FFD6E3] px-3 py-2 text-xs font-medium text-[#171717] focus:outline-none focus:border-[#FF6F9F]"
              >
                <option value="all">Beliebige Länge</option>
                <option value="short">Kurz (bis 4 Buchstaben)</option>
                <option value="medium">Mittel (5–6 Buchstaben)</option>
                <option value="long">Lang (ab 7 Buchstaben)</option>
              </select>
            </div>

            {/* Style Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block mb-1.5">
                Stil &amp; Kategorie
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-white rounded-xl border border-[#FFD6E3] px-3 py-2 text-xs font-medium text-[#171717] focus:outline-none focus:border-[#FF6F9F]"
              >
                <option value="all">Alle Stile</option>
                <option value="modern">Modern &amp; Frisch</option>
                <option value="classic">Klassisch &amp; Zeitlos</option>
                <option value="rare">Selten &amp; Besonders</option>
                <option value="international">International</option>
              </select>
            </div>

            {/* Origin Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block mb-1.5">
                Herkunft / Wurzeln
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full bg-white rounded-xl border border-[#FFD6E3] px-3 py-2 text-xs font-medium text-[#171717] focus:outline-none focus:border-[#FF6F9F]"
              >
                <option value="all">Alle Herkünfte</option>
                {origins.map((orig) => (
                  <option key={orig} value={orig}>
                    {orig}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block mb-1.5">
                Sortieren nach
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortFilterType)}
                className="w-full bg-white rounded-xl border border-[#FFD6E3] px-3 py-2 text-xs font-medium text-[#171717] focus:outline-none focus:border-[#FF6F9F]"
              >
                <option value="popularity">Beliebtheit (Rank)</option>
                <option value="trend">Höchster Trend (%)</option>
                <option value="alphabetical">Alphabetisch (A-Z)</option>
                <option value="length">Länge (Kürzeste zuerst)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Header Count */}
      <AdSense
        slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_NAMES || ''}
        className="mx-auto mb-8 min-h-[90px] max-w-3xl"
      />
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-semibold text-[#171717]">
          {filtered.length} {filtered.length === 1 ? 'Name gefunden' : 'Namen gefunden'}
        </p>

        {selectedGender !== 'all' && (
          <span className="text-xs font-medium text-[#777777]">
            Gefiltert nach:{' '}
            <strong className="text-[#FF4F87]">
              {selectedGender === 'girl' ? 'Mädchen' : selectedGender === 'boy' ? 'Jungen' : 'Unisex'}
            </strong>
          </span>
        )}
      </div>

      {/* Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((name) => (
            <NameCard key={name.id} name={name} showTrend />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[28px] border border-[#FFD6E3] p-12 text-center max-w-md mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#171717] mb-2">Keine Namen gefunden</h3>
          <p className="text-xs text-[#777777] mb-6">
            Für deine Filterkombination gibt es aktuell keine Treffer. Versuche deine Suche anzupassen oder Filter zurückzusetzen.
          </p>
          <button
            onClick={handleResetFilters}
            className="btn-primary px-6 py-2.5 text-xs font-semibold inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Filter zurücksetzen</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function BabynamenPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#777777]">Lade Namensübersicht...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
