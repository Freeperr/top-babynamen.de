'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Trash2, Share2, Swords, ArrowRight, Check } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import NameCard from '@/components/NameCard';

export default function FavoritenPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [filterGender, setFilterGender] = useState<'all' | 'girl' | 'boy'>('all');
  const [copied, setCopied] = useState(false);

  const filteredFavorites = favorites.filter((n) => {
    if (filterGender === 'all') return true;
    return n.gender === filterGender || n.gender === 'unisex';
  });

  const handleShare = () => {
    const list = favorites.map((f) => f.name).join(', ');
    const textToCopy = `Meine Lieblings-Babynamen von top-babynamen.de: ${list}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="w-14 h-14 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] mx-auto mb-3 shadow-2xs">
          <Heart className="w-7 h-7 fill-[#FF4F87]" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] tracking-tight mb-2">
          Meine Namen
        </h1>
        <p className="text-base sm:text-lg text-[#777777]">
          Deine gespeicherten Favoriten.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div>
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[22px] bg-[#FFF5F8] border border-[#FFD6E3] mb-8">
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-xs font-bold text-[#777777] mr-1">Filter:</span>
              <button
                onClick={() => setFilterGender('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  filterGender === 'all'
                    ? 'bg-[#FF4F87] text-white'
                    : 'bg-white text-[#171717] border border-[#FFD6E3]'
                }`}
              >
                Alle ({favorites.length})
              </button>
              <button
                onClick={() => setFilterGender('girl')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  filterGender === 'girl'
                    ? 'bg-[#FF4F87] text-white'
                    : 'bg-white text-[#171717] border border-[#FFD6E3]'
                }`}
              >
                Mädchen
              </button>
              <button
                onClick={() => setFilterGender('boy')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  filterGender === 'boy'
                    ? 'bg-[#FF4F87] text-white'
                    : 'bg-white text-[#171717] border border-[#FFD6E3]'
                }`}
              >
                Jungen
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#FFD6E3] hover:border-[#FF6F9F] text-xs font-semibold text-[#171717] flex items-center gap-1.5 transition-colors"
                title="Liste kopieren"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#FF6F9F]" />
                    <span>Liste teilen</span>
                  </>
                )}
              </button>

              <Link
                href="/spiele?tab=battle"
                className="px-3.5 py-1.5 rounded-full bg-[#FF4F87] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#e63d74] transition-colors"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Battle spielen</span>
              </Link>

              <button
                onClick={clearFavorites}
                className="p-1.5 rounded-full hover:bg-white text-[#777777] hover:text-red-500 transition-colors"
                title="Alle Favoriten leeren"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredFavorites.map((name) => (
              <NameCard key={name.id} name={name} showTrend />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-md mx-auto bg-white rounded-[28px] border border-[#FFD6E3] p-10 sm:p-14 text-center shadow-sm my-6">
          <div className="w-16 h-16 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] mx-auto mb-4">
            <Heart className="w-8 h-8 text-[#FF6F9F]" />
          </div>
          <h3 className="text-2xl font-bold text-[#171717] mb-2">
            Noch keine Namen gespeichert.
          </h3>
          <p className="text-sm text-[#777777] mb-8 leading-relaxed">
            Entdecke jetzt Namen und speichere deine Favoriten mit einem Klick auf das kleine Herz.
          </p>
          <Link
            href="/babynamen"
            className="btn-primary px-8 py-3 text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
          >
            <span>Namen entdecken</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
