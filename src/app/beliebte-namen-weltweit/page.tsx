import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import { WORLD_COUNTRIES } from '@/data/worldNames';

export const metadata: Metadata = {
  title: 'Beliebte Babynamen weltweit | babynamen.me',
  description:
    'Die beliebtesten Mädchennamen und Jungennamen in neun Ländern, von Deutschland bis in die USA, mit Herkunft und Bedeutung zu jedem Namen.',
};

export default function BeliebteNamenWeltweitPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-blue-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Zurück zur Startseite
        </Link>
      </div>

      <header className="mb-10">
        <p className="kicker mb-3">Weltweit</p>
        <h1 className="font-editorial text-[clamp(2rem,5vw,3rem)] leading-tight text-ink">
          Die 10 beliebtesten Babynamen
        </h1>
        <p className="mt-3 text-ink-soft text-[0.95rem] leading-relaxed max-w-xl">
          Eine Übersicht über die zehn beliebtesten Mädchennamen und Jungennamen
          in verschiedenen Ländern und Jahren. Wähle ein Land, um die aktuelle
          Rangliste zu sehen.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {WORLD_COUNTRIES.map((country) => {
          const latestYear = Math.max(...Object.keys(country.years).map(Number));
          return (
            <li key={country.code}>
              <Link
                href={`/beliebte-namen-weltweit/${country.slug}`}
                className="group flex items-center justify-between gap-3 px-5 py-4 rounded-xl border border-line bg-surface hover:border-blue/40 transition-colors"
              >
                <span>
                  <span className="block text-[0.95rem] font-medium text-ink group-hover:text-blue-deep transition-colors">
                    {country.name}
                  </span>
                  <span className="block text-xs text-fade mt-0.5">
                    Top 10 · {latestYear}
                  </span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-fade group-hover:text-blue-deep link-arrow shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Sources */}
      <div className="mt-12 pt-6 border-t border-line">
        <p className="text-xs text-fade leading-relaxed">
          <strong className="text-ink-soft">Quellen:</strong>{' '}
          {WORLD_COUNTRIES.map((c) => `${c.name}: ${c.source}`).join('; ')}.
        </p>
      </div>
    </article>
  );
}
