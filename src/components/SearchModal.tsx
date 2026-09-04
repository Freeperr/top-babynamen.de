'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
        else {
          // handled in parent or navbar
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results: BabyName[] = query.trim()
    ? BABY_NAMES.filter(
        (n) =>
          n.name.toLowerCase().includes(query.toLowerCase()) ||
          n.meaning.toLowerCase().includes(query.toLowerCase()) ||
          n.origin.toLowerCase().includes(query.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : BABY_NAMES.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 bg-black/30 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-2xl bg-white rounded-[24px] border border-[#FFD6E3] shadow-[0_20px_50px_rgba(255,111,159,0.2)] overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-6 py-4 border-b border-[#F4E5EA]">
          <Search className="w-5 h-5 text-[#FF6F9F] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Namen, Bedeutung, Herkunft (z.B. Emma, Licht, Irisch)..."
            className="w-full bg-transparent text-[#171717] placeholder:text-[#777777] text-base sm:text-lg focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-full hover:bg-[#FFF5F8] text-[#777777] hover:text-[#171717] transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 bg-[#FFF5F8] text-[#FF4F87] rounded-md border border-[#FFD6E3] hover:bg-[#FFD6E3]/50 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestions / Filter chips */}
        <div className="px-6 py-2.5 bg-[#FFF5F8]/60 flex items-center gap-2 overflow-x-auto text-xs text-[#777777]">
          <span className="font-medium text-[#171717] shrink-0">Schnellfilter:</span>
          {['Mädchen', 'Jungen', 'Kurz', 'Selten', 'Modern'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full bg-white border border-[#FFD6E3] hover:border-[#FF6F9F] text-[#171717] hover:text-[#FF4F87] transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F4E5EA]/60 p-2">
          {results.length > 0 ? (
            results.map((name) => {
              const favorited = isFavorite(name.id);
              return (
                <div
                  key={name.id}
                  className="flex items-center justify-between p-3.5 hover:bg-[#FFF5F8] rounded-[16px] transition-colors group"
                >
                  <Link
                    href={`/name/${name.id}`}
                    onClick={onClose}
                    className="flex-1 flex items-center gap-4 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center font-semibold text-[#FF4F87] group-hover:scale-105 transition-transform shrink-0">
                      {name.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#171717] text-base group-hover:text-[#FF4F87] transition-colors">
                          {name.name}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            name.gender === 'girl'
                              ? 'bg-[#FFF5F8] text-[#FF4F87] border border-[#FFD6E3]'
                              : name.gender === 'boy'
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}
                        >
                          {name.gender === 'girl' ? 'Mädchen' : name.gender === 'boy' ? 'Junge' : 'Unisex'}
                        </span>
                        <span className="text-xs text-[#777777] hidden sm:inline">
                          · {name.origin}
                        </span>
                      </div>
                      <p className="text-xs text-[#777777] truncate mt-0.5">{name.meaning}</p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(name, e);
                      }}
                      className="p-2 rounded-full hover:bg-white border border-transparent hover:border-[#FFD6E3] transition-all"
                      title="Zu Favoriten hinzufügen"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          favorited ? 'fill-[#FF4F87] text-[#FF4F87]' : 'text-[#777777] hover:text-[#FF4F87]'
                        }`}
                      />
                    </button>
                    <Link
                      href={`/name/${name.id}`}
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-white border border-transparent hover:border-[#FFD6E3] text-[#777777] group-hover:text-[#FF4F87] transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-[#777777]">
              <Sparkles className="w-8 h-8 text-[#FF6F9F] mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium">Keine Namen für &quot;{query}&quot; gefunden.</p>
              <p className="text-xs mt-1 text-[#777777]">Probiere einen anderen Begriff oder stöbere in den Kategorien.</p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-[#FFF5F8]/70 border-t border-[#F4E5EA] flex items-center justify-between text-xs text-[#777777]">
          <Link
            href={`/babynamen?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="text-[#FF4F87] font-medium hover:underline flex items-center gap-1"
          >
            Alle Suchergebnisse ansehen <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="hidden sm:inline">Tipp: Mit ESC schließen</span>
        </div>
      </div>
    </div>
  );
}
