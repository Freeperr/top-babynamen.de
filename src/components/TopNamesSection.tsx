'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getTopNames } from '@/lib/nameService';
import { Gender } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import { originPhrase } from '@/lib/format';
import FavoriteButton from '@/components/FavoriteButton';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

type Tab = 'all' | Gender;

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'girl', label: 'Mädchen' },
  { id: 'boy', label: 'Jungen' },
];

export default function TopNamesSection() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const { isFavorite, toggleFavorite } = useFavorites();

  const names = getTopNames(5, activeTab === 'all' ? undefined : activeTab);

  return (
    <section className="py-12 sm:py-16">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          variants={fadeUp}
        >
          <div>
            <p className="kicker mb-2">Beliebt bei Eltern</p>
            <h2 className="font-editorial text-3xl sm:text-4xl text-ink">
              Die Top-Namen der Woche
            </h2>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue text-ink font-medium'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {names.length === 0 ? null : (
          <motion.div variants={fadeUp}>
            {/* Rang 1 – der klare Favorit als blaue Fläche */}
            <div className="bg-blue text-white">
              <div className="flex items-start justify-between gap-5 px-6 sm:px-9 py-7 sm:py-9">
                <Link href={`/name/${names[0].id}`} className="min-w-0 group">
                  <span className="font-editorial text-gold text-3xl sm:text-4xl tabular-nums leading-none">
                    01
                  </span>
                  <span className="mt-3 block font-editorial text-4xl sm:text-5xl leading-tight group-hover:underline decoration-white/70 underline-offset-4">
                    {names[0].name}
                  </span>
                  <span className="mt-2 block text-sm text-white/85">
                    {originPhrase(names[0].origin, names[0].gender)}
                  </span>
                  {names[0].weeklyChange && (
                    <span className="mt-0.5 block text-xs text-gold">
                      {names[0].weeklyChange}
                    </span>
                  )}
                  <span className="mt-2 block text-sm text-white/75">
                    &bdquo;{names[0].meaning}&ldquo;
                  </span>
                </Link>

                <FavoriteButton
                  className="mt-2"
                  name={names[0]}
                  favorited={isFavorite(names[0].id)}
                  onToggle={(e) => toggleFavorite(names[0], e)}
                  tone="dark"
                />
              </div>
            </div>

            {/* Rang 2 + 3 – mittelgroß, zweispaltig */}
            <div className="grid gap-x-12 sm:grid-cols-2 sm:divide-x divide-line">
              {names.slice(1, 3).map((name, i) => (
                <RankRow
                  key={name.id}
                  name={name}
                  rank={i + 2}
                  favorited={isFavorite(name.id)}
                  onToggle={(e) => toggleFavorite(name, e)}
                  className="py-6 border-t border-line"
                  nameSize="text-2xl sm:text-3xl"
                  rankColor="text-blue"
                  showMeaning
                />
              ))}
            </div>

            {/* Rang 4 + 5 – kompakt, zweispaltig */}
            <div className="grid gap-x-12 sm:grid-cols-2 sm:divide-x divide-line">
              {names.slice(3).map((name, i) => (
                <RankRow
                  key={name.id}
                  name={name}
                  rank={i + 4}
                  favorited={isFavorite(name.id)}
                  onToggle={(e) => toggleFavorite(name, e)}
                  className="py-4 border-t border-line"
                  nameSize="text-xl sm:text-2xl"
                  rankColor="text-fade"
                  showMeaning={false}
                />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div className="mt-8 flex justify-end" variants={fadeUp}>
          <Link
            href="/babynamen"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-blue-deep transition-colors"
          >
            Alle Namen durchstöbern
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

interface RankRowProps {
  name: ReturnType<typeof getTopNames>[number];
  rank: number;
  favorited: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
  nameSize: string;
  rankColor: string;
  showMeaning: boolean;
}

function RankRow({
  name,
  rank,
  favorited,
  onToggle,
  className = '',
  nameSize,
  rankColor,
  showMeaning,
}: RankRowProps) {
  return (
    <div className={`flex items-start gap-4 group ${className}`}>
      <span className={`font-editorial ${rankColor} tabular-nums leading-none pt-2 w-8 shrink-0`}>
        {String(rank).padStart(2, '0')}
      </span>
      <Link href={`/name/${name.id}`} className="min-w-0 flex-1">
        <span
          className={`block font-editorial ${nameSize} leading-tight text-ink group-hover:text-blue-deep transition-colors`}
        >
          {name.name}
        </span>
        <span className="mt-1 block text-sm text-ink-soft">
          {originPhrase(name.origin, name.gender)}
        </span>
        {showMeaning && (
          <span className="mt-0.5 block text-sm text-fade truncate">
            &bdquo;{name.meaning}&ldquo;
          </span>
        )}
      </Link>
      <FavoriteButton
        name={name}
        favorited={favorited}
        onToggle={onToggle}
        className="mt-1"
      />
    </div>
  );
}