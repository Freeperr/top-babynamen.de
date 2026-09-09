'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFavorites } from '@/context/FavoritesContext';
import { BabyName } from '@/types/name';
import { originPhrase } from '@/lib/format';
import FavoriteButton from '@/components/FavoriteButton';
import { fadeUp, viewportOnce } from '@/lib/motion';

export default function NameRow({ name }: { name: BabyName }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(name.id);

  return (
    <motion.div
      className="flex items-start gap-3 sm:gap-5 py-4 border-b border-line group hover:bg-blue-pale transition-colors px-2 -mx-2"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/name/${name.id}`} className="flex-1 min-w-0">
        <span className="block font-editorial text-[1.4rem] sm:text-[1.6rem] leading-tight text-ink group-hover:text-blue-deep transition-colors">
          {name.name}
        </span>
        <span className="mt-0.5 block text-sm text-ink-soft">
          {originPhrase(name.origin, name.gender)}
        </span>
        <span className="mt-0.5 block text-sm text-fade truncate">
          &bdquo;{name.meaning}&ldquo;
        </span>
      </Link>

      <FavoriteButton
        name={name}
        favorited={favorited}
        onToggle={(e) => toggleFavorite(name, e)}
        className="mt-0.5"
      />
    </motion.div>
  );
}