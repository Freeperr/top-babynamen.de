'use client';

import React from 'react';
import Link from 'next/link';
import { Swords, Compass, Sparkles, ArrowRight } from 'lucide-react';

export default function GamesTeaser() {
  const games = [
    {
      id: 'swipe',
      title: 'Swipe deinen Favoriten',
      desc: 'Gefällt dir ein Name? Nach rechts. Nicht dein Ding? Nach links.',
      icon: Compass,
      tag: 'Swipe',
      href: '/spiele?tab=swipe',
    },
    {
      id: 'battle',
      title: 'Name Battle',
      desc: 'Zwei Namen stehen sich gegenüber. Du entscheidest, wer weiterzieht.',
      icon: Swords,
      tag: 'Duell',
      href: '/spiele?tab=battle',
    },
    {
      id: 'roulette',
      title: 'Name Roulette',
      desc: 'Drehe das Rad und lass dich von einer zufälligen Namensidee überraschen.',
      icon: Sparkles,
      tag: 'Glücksrad',
      href: '/spiele?tab=roulette',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-[#FFF5F8]/40 border-t border-[#F0E4E7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#171717] tracking-tight">
              Spielerisch zum Favoriten
            </h2>
            <p className="text-[#777777] text-sm mt-1">
              Finde neue Ideen durch einfache Duelle oder schnelles Swipen.
            </p>
          </div>

          <Link
            href="/spiele"
            className="text-xs font-semibold text-[#FF4F87] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Alle 5 Spiele ansehen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Focused Games */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                href={game.href}
                className="group bg-white p-6 rounded-[22px] border border-[#F0E4E7] hover:border-[#FF6F9F] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF5F8] border border-[#F0E4E7] flex items-center justify-center text-[#FF4F87]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FFF5F8] text-[#FF4F87] border border-[#FFD6E3]">
                      {game.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#171717] group-hover:text-[#FF4F87] transition-colors mb-1.5">
                    {game.title}
                  </h3>
                  <p className="text-xs text-[#777777] leading-relaxed">
                    {game.desc}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#F0E4E7] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#171717] group-hover:text-[#FF4F87] transition-colors">
                    Starten
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#FF4F87] transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
