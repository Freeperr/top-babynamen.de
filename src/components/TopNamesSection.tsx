'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getTopNames } from '@/lib/nameService';
import { Gender } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

type Tab = 'all' | Gender;

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'girl', label: 'Mädchen' },
  { id: 'boy', label: 'Jungen' },
];

const genderLabel = (gender: Gender) =>
  gender === 'girl' ? 'Mädchen' : gender === 'boy' ? 'Junge' : 'Unisex';

export default function TopNamesSection() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const { isFavorite, toggleFavorite } = useFavorites();

  const names = getTopNames(5, activeTab === 'all' ? undefined : activeTab);

  return (
    <section className="py-10 sm:py-14">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2"
          variants={fadeUp}
        >
          <h2 className="font-editorial text-3xl sm:text-4xl text-ink">
            Unsere beliebtesten Namen
          </h2>

          <div className="flex items-center gap-4 text-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent text-ink font-medium'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
        <motion.p
          className="font-hand text-xl sm:text-2xl text-accent-deep mb-6"
          variants={fadeUp}
        >
          Gerade viel gesehen – von Eltern wie dir.
        </motion.p>

        <motion.div className="border-t border-line" variants={fadeUp}>
          {names.map((name, index) => {
            const favorited = isFavorite(name.id);
            return (
              <div
                key={name.id}
                className="flex items-center gap-3 sm:gap-5 py-4 border-b border-line group transition-colors hover:bg-accent-pale px-2 -mx-2 rounded-lg"
              >
                <span className="font-mono text-xs text-fade w-7 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <Link
                  href={`/name/${name.id}`}
                  className="flex-1 min-w-0 flex flex-wrap items-baseline gap-x-3 gap-y-0.5"
                >
                  <span className="font-editorial text-[1.6rem] leading-tight text-ink group-hover:text-accent-deep transition-colors">
                    {name.name}
                  </span>
                  <span className="text-sm text-fade truncate">
                    {genderLabel(name.gender)} · {name.origin}
                  </span>
                </Link>

                {name.weeklyChange && (
                  <span
                    className={`text-xs hidden sm:inline shrink-0 ${
                      name.trendDirection === 'down'
                        ? 'text-warn'
                        : 'text-go'
                    }`}
                  >
                    {name.weeklyChange}
                  </span>
                )}

                <button
                  onClick={(e) => toggleFavorite(name, e)}
                  className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full border transition-colors active:scale-90 ${
                    favorited
                      ? 'bg-accent-soft border-line-strong text-accent-deep'
                      : 'border-transparent text-fade hover:text-accent-deep hover:bg-accent-soft'
                  }`}
                  aria-label={favorited ? `${name.name} von Favoriten entfernen` : `${name.name} zu Favoriten hinzufügen`}
                >
                  <HeartIcon filled={favorited} />
                </button>
              </div>
            );
          })}
        </motion.div>

        <motion.div className="mt-6 flex justify-end" variants={fadeUp}>
          <Link
            href="/babynamen"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent-deep transition-colors"
          >
            Alle Namen durchstöbern
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-4 h-4 ${filled ? 'fill-accent-deep text-accent-deep' : 'fill-none text-current'}`}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}