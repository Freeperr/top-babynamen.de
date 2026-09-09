'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { DailyTopNames } from '@/lib/gemini';
import { getDailyNames } from '@/lib/nameService';
import { genderNoun } from '@/lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';

function buildDailyList(): DailyTopNames {
  const now = new Date();
  const picks = getDailyNames(now, 5);
  return {
    date: now.toISOString().slice(0, 10),
    generated: false,
    names: picks.map((n, i) => ({
      name: n.name,
      gender: n.gender,
      rank: i + 1,
      change: n.weeklyChange ?? '→',
      reason: n.meaning.split(',')[0] ?? '',
    })),
  };
}

export default function DailyTrendBox() {
  const [data] = useState<DailyTopNames>(buildDailyList);

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
            {data.names.map((item, index) => {
              const falling = item.change.startsWith('-');
              const changeColor = falling
                ? 'text-warn'
                : item.change === '→'
                  ? 'text-fade'
                  : 'text-go';
              return (
                <motion.li
                  key={`${item.name}-${index}`}
                  variants={fadeUp}
                  className="flex items-start gap-4 sm:gap-6 px-5 sm:px-8 py-4 border-b border-line last:border-b-0 transition-colors hover:bg-blue-pale"
                >
                  <span className="font-editorial text-gold text-xl tabular-nums leading-none pt-1 w-7 shrink-0">
                    {String(item.rank).padStart(2, '0')}
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
                    {item.reason && (
                      <span className="block text-sm text-ink-soft truncate">
                        {item.reason}
                      </span>
                    )}
                  </Link>

                  <span className={`text-xs shrink-0 pt-1.5 ${changeColor}`}>
                    {item.change}
                  </span>
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