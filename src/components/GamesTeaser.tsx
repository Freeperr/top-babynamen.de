'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function GamesTeaser() {
  const games = [
    {
      id: 'swipe',
      title: 'Swipe',
      desc: 'Gefällt dir ein Name? Nach rechts. Nicht dein Ding? Nach links.',
      href: '/spiele?tab=swipe',
    },
    {
      id: 'battle',
      title: 'Welcher Name klingt besser?',
      desc: 'Zwei Namen, eine Entscheidung – du bestimmst, wer weiterkommt.',
      href: '/spiele?tab=battle',
    },
    {
      id: 'generator',
      title: 'Generator',
      desc: 'Keine Idee? Lass dir einfach einen Namen vorschlagen.',
      href: '/spiele?tab=generator',
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-3">Kleine Entscheidungshilfen</p>
            <h2 className="font-editorial text-3xl sm:text-4xl text-ink">
              Namen spielerisch finden
            </h2>
          </div>

          <Link
            href="/spiele"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent-deep transition-colors"
          >
            Alle Spiele ansehen
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ol className="grid gap-0 sm:grid-cols-3 sm:divide-x divide-line border-t border-line">
          {games.map((game, i) => (
            <li key={game.id} className="py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <Link href={game.href} className="group block">
                <span className="font-mono text-xs text-fade">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-editorial text-2xl text-ink group-hover:text-accent-deep transition-colors">
                  {game.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft">{game.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-accent-deep opacity-0 group-hover:opacity-100 transition-opacity">
                  Spielen
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}