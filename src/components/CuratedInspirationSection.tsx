'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRareNames } from '@/lib/nameService';
import { useFavorites } from '@/context/FavoritesContext';

const genderLabel = (gender: string) =>
  gender === 'girl' ? 'Mädchen' : gender === 'boy' ? 'Junge' : 'Unisex';

export default function CuratedInspirationSection() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const names = getRareNames(4);

  return (
    <section className="py-12 sm:py-16 border-y border-line bg-paper-warm/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 grid gap-10 md:grid-cols-[2fr_3fr] md:gap-14">
        {/* Editorial intro column */}
        <div>
          <p className="eyebrow mb-3">Vorschläge der Redaktion</p>
          <h2 className="font-editorial text-3xl sm:text-4xl text-ink">
            Namen, die nicht{' '}
            <em className="italic text-accent">jeder kennt.</em>
          </h2>
          <p className="mt-4 text-ink-soft text-[0.95rem]">
            Nicht ganz so häufig, aber mit viel Charakter. Wir stellen dir jeden
            Monat vier Namen vor, die uns aufgefallen sind.
          </p>
          <Link
            href="/babynamen?style=rare"
            className="inline-flex items-center gap-1.5 mt-6 text-sm text-ink-soft hover:text-accent-deep transition-colors"
          >
            Seltene Namen entdecken
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Name rows */}
        <ol className="border-t border-line">
          {names.map((name) => {
            const favorited = isFavorite(name.id);
            return (
              <li
                key={name.id}
                className="flex items-center gap-4 border-b border-line py-4 group hover:bg-accent-pale transition-colors px-2 -mx-2 rounded-lg"
              >
                <Link
                  href={`/name/${name.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="font-editorial text-[1.5rem] leading-tight text-ink group-hover:text-accent-deep transition-colors">
                      {name.name}
                    </span>
                    <span className="text-sm text-ink-soft">
                      {genderLabel(name.gender)} · {name.origin}
                    </span>
                  </div>
                  <p className="text-sm text-fade truncate mt-0.5">
                    &bdquo;{name.meaning}&ldquo;
                  </p>
                </Link>

                <button
                  onClick={(e) => toggleFavorite(name, e)}
                  className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full border transition-colors active:scale-90 ${
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
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}