'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getDailyNames } from '@/lib/nameService';
import { ALL_NAMES } from '@/data/namesExtended';
import { genderNoun } from '@/lib/format';
import { useFavorites } from '@/context/FavoritesContext';
import FavoriteButton from '@/components/FavoriteButton';
import { BabyName } from '@/types/name';
import { fadeUp, staggerContainer } from '@/lib/motion';

interface DailyApiName {
  name: string;
  reason?: string;
}

export default function DailyTrendBox() {
  const [picks, setPicks] = useState<BabyName[]>(() => getDailyNames(new Date(), 5));
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let cancelled = false;

    fetch('/api/daily-names', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { names?: DailyApiName[] } | null) => {
        if (cancelled || !data?.names) return;

        const resolved: BabyName[] = [];
        const reasonMap: Record<string, string> = {};

        for (const entry of data.names) {
          const match = ALL_NAMES.find(
            (n) => n.name.toLowerCase() === entry.name.toLowerCase()
          );
          if (match) {
            resolved.push(match);
            if (entry.reason) reasonMap[match.id] = entry.reason;
          }
        }

        if (resolved.length > 0) {
          setPicks(resolved);
          setReasons(reasonMap);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
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
          <div className="px-5 sm:px-8 py-5 flex flex-wrap items-end justify-between gap-2 border-b border-line">
            <p className="kicker mb-0.5">Täglich frisch zusammengestellt</p>
            <h2 className="font-editorial text-2xl sm:text-3xl text-ink">
              Heute im Trend
            </h2>
          </div>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {picks.map((item, index) => {
              const reason = reasons[item.id] ?? item.meaning.split(',')[0] ?? '';
              return (
                <motion.li
                  key={`${item.id}-${index}`}
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

                  <FavoriteButton
                    name={item}
                    favorited={isFavorite(item.id)}
                    onToggle={(e) => toggleFavorite(item, e)}
                    className="mt-1"
                  />
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
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}