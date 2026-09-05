'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import GeminiStatusCard from '@/components/GeminiStatusCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const genderLabel = (gender: string) =>
  gender === 'girl' ? 'Mädchen' : gender === 'boy' ? 'Junge' : 'Unisex';

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isGeminiTest = query.trim().toLowerCase() === 'geminitest';

  const results: BabyName[] = isGeminiTest
    ? []
    : query.trim()
      ? ALL_NAMES.filter(
          (n) =>
            n.name.toLowerCase().includes(query.toLowerCase()) ||
            n.meaning.toLowerCase().includes(query.toLowerCase()) ||
            n.origin.toLowerCase().includes(query.toLowerCase()) ||
            n.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 8)
      : ALL_NAMES.slice(0, 6);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6 bg-ink/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface rounded-2xl border border-line shadow-lg overflow-hidden rise"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Namen suchen"
      >
        {/* Search input */}
        <div className="relative flex items-center border-b border-line">
          <Search className="w-4 h-4 text-fade absolute left-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, Bedeutung oder Herkunft …"
            className="w-full bg-transparent pl-11 pr-11 py-4 text-base text-ink placeholder:text-fade focus:outline-none"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 mr-1 text-fade hover:text-ink transition-colors"
              aria-label="Sucheingabe löschen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick filters */}
        <div className="px-5 py-2.5 flex items-center gap-2 overflow-x-auto border-b border-line bg-paper-warm/60 scrollbar-none">
          <span className="text-xs text-fade shrink-0">Schnellfilter:</span>
          {['Mädchen', 'Jungen', 'Kurz', 'Selten', 'Modern'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-md border border-line-strong bg-surface text-sm text-ink-soft hover:border-accent hover:text-accent-deep transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto py-1">
          {isGeminiTest ? (
            <GeminiStatusCard />
          ) : results.length > 0 ? (
            results.map((name) => {
              const favorited = isFavorite(name.id);
              return (
                <div
                  key={name.id}
                  className="flex items-center gap-2 px-5 py-2.5 hover:bg-accent-pale transition-colors group"
                >
                  <Link
                    href={`/name/${name.id}`}
                    onClick={onClose}
                    className="flex-1 min-w-0 py-1"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-editorial text-xl text-ink group-hover:text-accent-deep transition-colors">
                        {name.name}
                      </span>
                      <span className="text-xs text-ink-soft">
                        {genderLabel(name.gender)} · {name.origin}
                      </span>
                    </div>
                    <p className="text-xs text-fade truncate mt-0.5">
                      &bdquo;{name.meaning}&ldquo;
                    </p>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(name, e);
                    }}
                    className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
                      favorited
                        ? 'bg-accent-soft border-line-strong text-accent-deep'
                        : 'border-transparent text-fade hover:text-accent-deep hover:bg-accent-soft'
                    }`}
                    aria-label={
                      favorited
                        ? `${name.name} von Favoriten entfernen`
                        : `${name.name} zu Favoriten hinzufügen`
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-4 h-4 ${favorited ? 'fill-accent-deep text-accent-deep' : 'fill-none text-current'}`}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-ink-soft">
                Keine Namen für &quot;{query}&quot; gefunden.
              </p>
              <p className="text-xs mt-1 text-fade">
                Versuch einen anderen Begriff oder stöbere direkt in den Listen.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-line flex items-center justify-between text-sm">
          {!isGeminiTest && (
            <Link
              href={`/babynamen?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-ink-soft hover:text-accent-deep transition-colors"
            >
              Alle Suchergebnisse ansehen
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          <span className="text-xs text-fade hidden sm:inline">Tipp: ESC schließt</span>
        </div>
      </div>
    </div>
  );
}