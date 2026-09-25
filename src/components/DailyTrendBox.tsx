'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ALL_NAMES } from '@/data/namesExtended';
import { genderNoun } from '@/lib/format';
import { useFavorites } from '@/context/FavoritesContext';
import FavoriteButton from '@/components/FavoriteButton';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { getDailyNamesSnapshot, getDailyNamesServerSnapshot, subscribeDailyNames, loadDailyNames } from '@/lib/dailyNamesClient';

export default function DailyTrendBox() {
  const { data, loading, error } = useSyncExternalStore(
    subscribeDailyNames, getDailyNamesSnapshot, getDailyNamesServerSnapshot,
  );
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    void loadDailyNames().catch(() => { /* Error is rendered below. */ });
  }, []);

  return (
    <section className="pb-2">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="border border-line bg-panel">
          <div className="px-5 sm:px-8 py-5 flex flex-wrap items-end gap-2 border-b border-line">
            <h2 className="font-editorial text-2xl sm:text-3xl text-ink">
              Heute im Trend
            </h2>
          </div>

          {!data && loading && (
            <p className="px-5 sm:px-8 py-6 text-sm text-ink-soft" role="status">
              Die heutigen Namen werden geladen …
            </p>
          )}
          {error && (
            <div className="px-5 sm:px-8 py-4 text-sm text-ink-soft" role="status">
              <p>{data ? 'Aktualisierung gerade nicht möglich. Die letzte KI-Auswahl bleibt sichtbar.' : error}</p>
              <button type="button" className="btn btn-secondary mt-2" disabled={loading}
                onClick={() => void loadDailyNames(true).catch(() => {})}>
                Erneut versuchen
              </button>
            </div>
          )}
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {data?.names.map((item, index) => {
              const match = ALL_NAMES.find((name) => name.name.toLowerCase() === item.name.toLowerCase() && name.gender === item.gender);
              const reason = item.reason;
              return (
                <motion.li
                  key={`${item.name}-${index}`}
                  variants={fadeUp}
                  className="flex items-start gap-4 sm:gap-6 px-5 sm:px-8 py-4 border-b border-line last:border-b-0 transition-colors hover:bg-blue-pale"
                >
                  <span className="font-editorial text-gold text-xl tabular-nums leading-none pt-1 w-7 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <Link
                    href={`/babynamen?q=${encodeURIComponent(item.name)}`}
                    className="flex-1 min-w-0"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="font-editorial text-xl leading-tight text-ink hover:text-blue-deep transition-colors">
                        {item.name}
                      </span>
                      <span className="text-xs text-ink-soft">
                        {genderNoun(item.gender)}
                      </span>
                    </span>
                    {reason && (
                      <span className="block text-sm text-ink-soft truncate">
                        {reason}
                      </span>
                    )}
                  </Link>

                  {match && (
                    <FavoriteButton
                      name={match}
                      favorited={isFavorite(match.id)}
                      onToggle={(e) => toggleFavorite(match, e)}
                      className="mt-1"
                    />
                  )}
                </motion.li>
              );
            })}
          </motion.ul>

          <div className="px-5 sm:px-8 py-4">
            <Link
              href="/babynamen"
              className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-blue-deep transition-colors"
            >
              Alle Namen der Woche
              <span aria-hidden="true" className="link-arrow">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
