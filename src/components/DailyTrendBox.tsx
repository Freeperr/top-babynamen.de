'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import type { DailyTopNames } from '@/lib/gemini';
import { fadeUp, staggerContainer } from '@/lib/motion';

const genderLabel = (gender: string) =>
  gender === 'girl' ? 'Mädchen' : gender === 'boy' ? 'Junge' : 'Unisex';

export default function DailyTrendBox() {
  const [data, setData] = useState<DailyTopNames | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/daily-names')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('failed'))))
      .then((d: DailyTopNames) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <section className="pb-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl border border-line bg-paper-warm h-64 animate-pulse"
            aria-hidden="true"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="pb-2">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="rounded-2xl border border-line bg-surface shadow-[0_1px_0_0_#f0e9e1] overflow-hidden">
          <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-line bg-paper-warm/60 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent fill-accent" aria-hidden="true" />
              <span className="font-editorial text-2xl text-accent-deep leading-none">
                Heute im Trend
              </span>
            </p>
            {data.generated && (
              <span className="inline-flex items-center gap-1 text-xs text-fade">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                täglich frisch zusammengestellt
              </span>
            )}
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
                  className="flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-3.5 border-b border-line last:border-b-0 transition-colors hover:bg-accent-pale"
                >
                  <Heart
                    className="w-3 h-3 text-accent fill-accent shrink-0"
                    aria-hidden="true"
                  />

                  <Link
                    href={`/babynamen?q=${encodeURIComponent(item.name)}`}
                    className="flex-1 min-w-0 py-1"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="font-editorial text-xl leading-tight text-ink group-hover:text-accent-deep">
                        {item.name}
                      </span>
                      <span className="text-xs text-fade truncate">
                        {genderLabel(item.gender)} · {item.rank}. Rang
                      </span>
                    </span>
                    {item.reason && (
                      <span className="block text-sm text-ink-soft truncate">
                        {item.reason}
                      </span>
                    )}
                  </Link>

                  <span className={`text-xs shrink-0 ${changeColor}`}>
                    {item.change}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>

          <div className="px-5 sm:px-7 py-3.5">
            <Link
              href="/babynamen"
              className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent-deep transition-colors"
            >
              Heute weiter stöbern
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}