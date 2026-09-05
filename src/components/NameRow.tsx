'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFavorites } from '@/context/FavoritesContext';
import { BabyName, Gender } from '@/types/name';
import { fadeUp, viewportOnce } from '@/lib/motion';

const genderLabel = (gender: Gender) =>
  gender === 'girl' ? 'Mädchen' : gender === 'boy' ? 'Junge' : 'Unisex';

export default function NameRow({ name }: { name: BabyName }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(name.id);

  return (
    <motion.div
      className="flex items-center gap-3 sm:gap-5 py-4 border-b border-line group hover:bg-accent-pale transition-colors px-2 -mx-2"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/name/${name.id}`} className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="font-editorial text-[1.4rem] sm:text-[1.6rem] leading-tight text-ink group-hover:text-accent-deep transition-colors">
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
    </motion.div>
  );
}