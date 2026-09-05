'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, Share2, Check, Swords, ArrowRight } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import NameRow from '@/components/NameRow';

type GenderFilter = 'all' | 'girl' | 'boy';

export default function FavoritenPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [filterGender, setFilterGender] = useState<GenderFilter>('all');
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

  const counts = {
    all: favorites.length,
    girl: favorites.filter((f) => f.gender === 'girl' || f.gender === 'unisex').length,
    boy: favorites.filter((f) => f.gender === 'boy' || f.gender === 'unisex').length,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow mb-3">Deine Auswahl</p>
        <h1 className="font-editorial text-[clamp(1.9rem,4vw,3rem)] leading-tight text-ink">
          Meine Namen
        </h1>
        <p className="mt-3 text-ink-soft text-[0.95rem]">
          Alles, was dir gefallen hat, an einem Ort.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-5 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all' as const, label: 'Alle', count: counts.all },
                { id: 'girl' as const, label: 'Mädchen', count: counts.girl },
                { id: 'boy' as const, label: 'Jungen', count: counts.boy },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setFilterGender(g.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    filterGender === g.id
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface text-ink-soft border-line-strong hover:border-accent hover:text-accent-deep'
                  }`}
                >
                  {g.label} ({g.count})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleShare}
                className="btn btn-secondary text-xs px-3 py-1.5"
                title="Liste kopieren"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-go" />
                    <span className="text-go">Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Liste teilen</span>
                  </>
                )}
              </button>

              <Link href="/spiele?tab=battle" className="btn btn-primary text-xs px-3 py-1.5">
                <Swords className="w-3.5 h-3.5" />
                Battle spielen
              </Link>

              <button
                onClick={clearFavorites}
                className="btn btn-ghost text-xs px-2 py-1.5"
                title="Alle Favoriten leeren"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          {filteredFavorites.length > 0 ? (
            <div className="border-t border-line">
              {filteredFavorites.map((name) => (
                <NameRow key={name.id} name={name} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-fade">
              Für diese Auswahl gibt es gerade keine Namen.
            </p>
          )}
        </div>
      ) : (
        /* Empty state */
        <div className="max-w-md mx-auto bg-surface border border-line rounded-2xl p-10 sm:p-12 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-accent-soft text-accent-deep flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-2xl text-ink mb-2">
            Noch keine Namen gespeichert.
          </h3>
          <p className="text-sm text-ink-soft mb-8">
            Stöbere durch die Namenslisten und tippe auf das Herz, um Namen zu
            sammeln.
          </p>
          <Link href="/babynamen" className="btn btn-primary px-6 py-2.5">
            Namen entdecken
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}