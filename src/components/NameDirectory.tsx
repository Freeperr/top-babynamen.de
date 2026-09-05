'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ALL_NAMES } from '@/data/namesExtended';
import { filterNames } from '@/lib/nameService';
import { Gender, NameFilters } from '@/types/name';
import NameRow from './NameRow';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type LengthFilterType = 'all' | 'short' | 'medium' | 'long';
type SortFilterType = 'popularity' | 'alphabetical' | 'trend' | 'length';

interface NameDirectoryProps {
  title: string;
  description: string;
  fixedGender?: Gender;
}

export default function NameDirectory({ title, description, fixedGender }: NameDirectoryProps) {
  const searchParams = useSearchParams();

  const initialStyle = searchParams.get('style') || 'all';
  const rawLength = searchParams.get('length') as LengthFilterType;
  const initialLength: LengthFilterType = ['all', 'short', 'medium', 'long'].includes(rawLength)
    ? rawLength
    : 'all';
  const rawGender = searchParams.get('gender') as Gender | 'all';

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>(
    fixedGender ??
      (rawGender && ['all', 'girl', 'boy', 'unisex'].includes(rawGender) ? rawGender : 'all')
  );
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [selectedLength, setSelectedLength] = useState<LengthFilterType>(initialLength);
  const [selectedStyle, setSelectedStyle] = useState<string>(initialStyle);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortFilterType>('popularity');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const origins = useMemo(() => {
    const set = new Set<string>();
    ALL_NAMES.forEach((n) => {
      n.origin.split('/').forEach((part) => set.add(part.trim()));
    });
    return Array.from(set).sort();
  }, []);

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
    setSelectedLetter('all');
    setSelectedLength('all');
    setSelectedStyle('all');
    setSelectedOrigin('all');
    setSortBy('popularity');
    if (!fixedGender) setSelectedGender('all');
  };

  const hasActiveFilters =
    query !== '' ||
    selectedLetter !== 'all' ||
    selectedLength !== 'all' ||
    selectedStyle !== 'all' ||
    selectedOrigin !== 'all' ||
    sortBy !== 'popularity' ||
    (!fixedGender && selectedGender !== 'all');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <p className="eyebrow mb-3">Namenssuche</p>
        <h1 className="font-editorial text-[clamp(1.9rem,4vw,3rem)] leading-tight text-ink">
          {title}
        </h1>
        <p className="mt-3 text-ink-soft text-[0.95rem]">{description}</p>
      </div>

      {/* Search bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search className="w-4 h-4 text-fade absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, Bedeutung oder Herkunft suchen …"
            className="input pl-10"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-fade hover:text-ink transition-colors"
            >
              Löschen
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-surface border border-line rounded-2xl p-5 mb-8">
        {/* Row 1: gender + actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {!fixedGender && (
              <>
                <span className="eyebrow mr-1">Geschlecht</span>
                {[
                  { id: 'all' as const, label: 'Alle' },
                  { id: 'girl' as const, label: 'Mädchen' },
                  { id: 'boy' as const, label: 'Jungen' },
                  { id: 'unisex' as const, label: 'Unisex' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      selectedGender === g.id
                        ? 'bg-accent text-white border-accent'
                        : 'bg-surface text-ink-soft border-line-strong hover:border-accent hover:text-accent-deep'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn btn-secondary text-xs px-3 py-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvancedFilters ? 'Weniger Filter' : 'Mehr Filter'}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="btn btn-ghost text-xs px-3 py-1.5 gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Zurücksetzen</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: alphabet */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-4 mt-3 border-t border-line scrollbar-none">
          <button
            onClick={() => setSelectedLetter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition-colors ${
              selectedLetter === 'all'
                ? 'bg-ink text-paper'
                : 'text-fade hover:text-ink hover:bg-paper-warm'
            }`}
          >
            A–Z
          </button>
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-8 h-8 rounded-md text-xs font-medium shrink-0 flex items-center justify-center transition-colors ${
                selectedLetter === letter
                  ? 'bg-ink text-paper'
                  : 'text-fade hover:text-ink hover:bg-paper-warm'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Row 3: advanced filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-3 border-t border-line rise">
            <div>
              <label htmlFor={`length-${title}`} className="eyebrow block mb-1.5">
                Namenslänge
              </label>
              <select
                id={`length-${title}`}
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value as LengthFilterType)}
                className="input"
              >
                <option value="all">Beliebige Länge</option>
                <option value="short">Kurz (bis 4 Buchstaben)</option>
                <option value="medium">Mittel (5–6 Buchstaben)</option>
                <option value="long">Lang (ab 7 Buchstaben)</option>
              </select>
            </div>

            <div>
              <label htmlFor={`style-${title}`} className="eyebrow block mb-1.5">
                Stil &amp; Kategorie
              </label>
              <select
                id={`style-${title}`}
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="input"
              >
                <option value="all">Alle Stile</option>
                <option value="modern">Modern &amp; Frisch</option>
                <option value="classic">Klassisch &amp; Zeitlos</option>
                <option value="rare">Selten &amp; Besonders</option>
                <option value="international">International</option>
              </select>
            </div>

            <div>
              <label htmlFor={`origin-${title}`} className="eyebrow block mb-1.5">
                Herkunft / Wurzeln
              </label>
              <select
                id={`origin-${title}`}
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="input"
              >
                <option value="all">Alle Herkünfte</option>
                {origins.map((orig) => (
                  <option key={orig} value={orig}>
                    {orig}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`sort-${title}`} className="eyebrow block mb-1.5">
                Sortieren nach
              </label>
              <select
                id={`sort-${title}`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortFilterType)}
                className="input"
              >
                <option value="popularity">Beliebtheit (Rank)</option>
                <option value="trend">Höchster Trend (%)</option>
                <option value="alphabetical">Alphabetisch (A–Z)</option>
                <option value="length">Länge (Kürzeste zuerst)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {filtered.length} {filtered.length === 1 ? 'Name gefunden' : 'Namen gefunden'}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="border-t border-line">
          {filtered.map((name) => (
            <NameRow key={name.id} name={name} />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-surface border border-line rounded-2xl p-10 text-center my-8">
          <h3 className="text-xl text-ink mb-2">Keine Namen gefunden</h3>
          <p className="text-sm text-ink-soft mb-6">
            Für diese Kombination gibt es gerade keine Treffer. Versuche, die
            Suche anzupassen oder die Filter zurückzusetzen.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary">
            <RotateCcw className="w-3.5 h-3.5" />
            Filter zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
}