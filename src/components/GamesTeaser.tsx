'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface Game {
  title: string;
  desc: string;
  href: string;
  cta: string;
}

const GAMES: Game[] = [
  {
    title: 'Swipe',
    desc: 'Gefällt dir ein Name? Nach rechts. Nicht dein Ding? Nach links. Du entscheidest in einem kurzen Durchgang.',
    href: '/spiele?tab=swipe',
    cta: 'Swipe starten',
  },
  {
    title: 'Welcher Name Passt Besser',
    desc: 'Zwei Namen, eine Entscheidung: Du bestimmst, wer aus dem Battle als Favorit hervorgeht.',
    href: '/spiele?tab=battle',
    cta: 'Battle spielen',
  },
  {
    title: 'Generator',
    desc: 'Keine Idee mehr? Lass dir einfach einen Namen vorschlagen.',
    href: '/spiele?tab=generator',
    cta: 'Namen ziehen',
  },
];

export default function GamesTeaser() {
  return (
    <section className="py-14 sm:py-20">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9"
          variants={fadeUp}
        >
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-ink">
              Namen spielerisch finden
            </h2>
          </div>

          <Link
            href="/spiele"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-blue-deep transition-colors"
          >
            Alle Spiele ansehen
            <ArrowRight className="w-3.5 h-3.5 link-arrow" />
          </Link>
        </motion.div>

        <motion.ol
          className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-line bg-line"
          variants={fadeUp}
        >
          {GAMES.map((game) => {
            const featured = game.title === 'Swipe';
            return (
              <li
                key={game.title}
                className={`bg-paper group ${
                  featured ? 'sm:col-span-2' : ''
                }`}
              >
                <Link href={game.href} className="block px-6 sm:px-8 py-7">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-editorial text-gold text-xl tabular-nums leading-none">
                      {String(GAMES.indexOf(game) + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="text-sm opacity-70 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-ink-soft"
                      aria-hidden="true"
                    >
                      {game.cta}
                      <ArrowRight className="w-3.5 h-3.5 link-arrow" />
                    </span>
                  </span>
                  <h3
                    className={`mt-3 font-editorial text-ink group-hover:text-blue-deep transition-colors ${
                      featured ? 'text-2xl sm:text-3xl' : 'text-2xl'
                    }`}
                  >
                    {game.title}
                  </h3>
                  <p
                    className={`mt-1.5 text-sm text-ink-soft ${
                      featured ? 'max-w-xl' : ''
                    }`}
                  >
                    {game.desc}
                  </p>
                </Link>
              </li>
            );
          })}
        </motion.ol>
      </motion.div>
    </section>
  );
}