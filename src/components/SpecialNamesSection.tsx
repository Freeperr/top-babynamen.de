'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { getRareNames } from '@/lib/nameService';
import { useFavorites } from '@/context/FavoritesContext';

export default function SpecialNamesSection() {
  const rareNames = getRareNames(6);
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="py-16 sm:py-22 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
            Namen, die nicht jeder kennt
          </h2>
          <p className="text-[#777777] text-base mt-2">
            Wunderschöne, klangvolle Namen mit tiefen Bedeutungen, die garantiert im Gedächtnis bleiben.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rareNames.map((name) => {
            const favorited = isFavorite(name.id);
            return (
              <div
                key={name.id}
                className="group baby-card p-6 flex flex-col justify-between bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[11px] font-medium text-[#FF4F87]">
                      Seltenheit #{name.popularityRank}
                    </span>
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

                  <Link href={`/name/${name.id}`} className="block">
                    <h3 className="font-editorial text-3xl font-normal text-[#171717] group-hover:text-[#FF4F87] transition-colors mb-1 tracking-tight">
                      {name.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] font-medium text-[#FF6F9F] uppercase tracking-wider mb-2">
                    {name.origin} · {name.gender === 'girl' ? 'Mädchen' : name.gender === 'boy' ? 'Junge' : 'Unisex'}
                  </p>
                  <p className="text-sm text-[#171717]/85 line-clamp-2 leading-relaxed">
                    &bdquo;{name.meaning}&ldquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0E4E7] flex items-center justify-between mt-4">
                  <span className="text-xs text-[#777777]">
                    {name.length} Buchstaben
                  </span>
                  <Link
                    href={`/name/${name.id}`}
                    className="text-xs font-semibold text-[#FF4F87] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Zur Namenskarte</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
