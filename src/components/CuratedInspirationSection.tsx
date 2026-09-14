'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getRareNames } from '@/lib/nameService';
import { useFavorites } from '@/context/FavoritesContext';
import { originPhrase } from '@/lib/format';
import FavoriteButton from '@/components/FavoriteButton';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

export default function CuratedInspirationSection() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const names = getRareNames(4);

  return (
    <section className="py-14 sm:py-20 border-y border-line bg-panel/60">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 gap-10 md:grid-cols-[2fr_3fr] md:gap-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {/* Editorial intro column */}
        <motion.div variants={fadeUp}>
          <h2 className="font-editorial text-3xl sm:text-4xl text-ink leading-tight">
            Vier Namen,
            <br />
            die uns aufgefallen sind.
          </h2>
          <p className="mt-4 text-ink-soft text-[0.95rem]">
            Nicht ganz so häufig, aber mit viel Charakter. Wir stellen dir jeden
            Monat vier Namen vor, die uns überrascht haben.
          </p>
          <Link
            href="/babynamen?style=rare"
            className="inline-flex items-center gap-1.5 mt-6 text-sm text-ink-soft hover:text-blue-deep transition-colors"
          >
            Seltene Namen entdecken
            <ArrowRight className="w-3.5 h-3.5 link-arrow" />
          </Link>
        </motion.div>

        {/* Name rows */}
        <motion.ol className="border-t border-line" variants={fadeUp}>
          {names.map((name) => {
            const favorited = isFavorite(name.id);
            return (
              <li
                key={name.id}
                className="flex items-start gap-4 border-b border-line py-5 group hover:bg-blue-pale transition-colors px-2 -mx-2"
              >
                <Link href={`/name/${name.id}`} className="flex-1 min-w-0">
                  <span className="block break-words font-editorial text-[1.5rem] leading-tight text-ink group-hover:text-blue-deep transition-colors">
                    {name.name}
                  </span>
                  <span className="mt-1 block break-words text-sm text-ink-soft">
                    {originPhrase(name.origin, name.gender)}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-fade">
                    &bdquo;{name.meaning}&ldquo;
                  </span>
                </Link>

                <FavoriteButton
                  name={name}
                  favorited={favorited}
                  onToggle={(e) => toggleFavorite(name, e)}
                  className="mt-1"
                />
              </li>
            );
          })}
        </motion.ol>
      </motion.div>
    </section>
  );
}