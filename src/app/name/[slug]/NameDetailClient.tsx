'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Volume2, ArrowLeft, Check } from 'lucide-react';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import { originPhrase } from '@/lib/format';
import NameRow from '@/components/NameRow';

interface NameDetailClientProps {
  name: BabyName;
  similarNames: BabyName[];
}

export default function NameDetailClient({ name, similarNames }: NameDetailClientProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(name.id);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(name.name);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const renderPopularityChart = () => {
    if (!name.popularityHistory || name.popularityHistory.length === 0) return null;

    const data = name.popularityHistory;
    const minRank = 1;
    const maxRank = Math.max(...data.map((d) => d.rank), 25);

    const width = 600;
    const height = 180;
    const padding = 35;

    const getX = (index: number) => padding + (index * (width - 2 * padding)) / (data.length - 1);
    const getY = (rank: number) => padding + ((rank - minRank) / (maxRank - minRank)) * (height - 2 * padding);

    const points = data.map((d, i) => `${getX(i)},${getY(d.rank)}`).join(' ');

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="var(--color-line)"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="var(--color-line)"
            strokeDasharray="4 4"
          />

          <polygon
            points={`${getX(0)},${height - padding} ${points} ${getX(data.length - 1)},${height - padding}`}
            fill="var(--color-blue)"
            opacity="0.08"
          />

          <polyline
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.rank);
            return (
              <g key={d.year}>
                <circle cx={x} cy={y} r="4" fill="var(--color-surface)" stroke="var(--color-blue)" strokeWidth="2" />
                <text x={x} y={y - 10} textAnchor="middle" fill="var(--color-ink-soft)" fontSize="11">
                  #{d.rank}
                </text>
                <text x={x} y={height - 10} textAnchor="middle" fill="var(--color-fade)" fontSize="11">
                  {d.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/babynamen"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-blue-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Zurück zur Übersicht
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-line pb-8 mb-8">
        <div className="flex items-baseline gap-3 flex-wrap mb-3">
          <span className="text-sm text-ink-soft">
            {originPhrase(name.origin, name.gender)}
          </span>
          <span className="w-px h-3.5 bg-line" aria-hidden="true" />
          <span className="text-sm text-ink-soft">Rang {name.popularityRank}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h1 className="font-editorial text-[clamp(2.5rem,8vw,4.5rem)] leading-none text-ink">
            {name.name}
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeech}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-line-strong text-ink-soft hover:text-blue-deep hover:border-blue transition-colors"
              title={`Aussprache von ${name.name} anhören`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-blue' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-line-strong text-ink-soft hover:text-blue-deep hover:border-blue transition-colors"
              title="Link kopieren"
            >
              {copied ? <Check className="w-4 h-4 text-go" /> : <ShareIcon />}
            </button>

            <button
              onClick={(e) => toggleFavorite(name, e)}
              className={`btn px-5 py-2.5 ${favorited ? 'bg-blue-soft text-blue-deep border border-line-strong' : 'btn-primary'}`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-blue-deep' : 'fill-none'}`} />
              {favorited ? 'Gespeichert' : 'Als Favorit speichern'}
            </button>
          </div>
        </div>

        {name.pronunciation && (
          <p className="mt-3 text-xs text-fade font-mono">
            Aussprache: {name.pronunciation}
          </p>
        )}
      </header>

      {/* Meaning */}
      <blockquote className="mb-8">
        <p className="font-editorial text-2xl sm:text-3xl text-ink leading-snug">
          &bdquo;{name.meaning}&ldquo;
        </p>
        <p className="kicker mt-2">Bedeutung</p>
      </blockquote>

      {/* Main + aside */}
      <div className="grid gap-10 md:grid-cols-[1fr_240px] md:gap-12">
        <div className="min-w-0">
          <section className="mb-8">
            <h2 className="text-lg text-ink mb-2">Über den Namen {name.name}</h2>
            <p className="text-ink-soft text-[0.975rem] leading-relaxed">
              {name.description}
            </p>
          </section>

          {name.funFact && (
            <p className="mb-8 text-sm text-ink-soft bg-panel border border-line px-5 py-4">
              <strong className="text-ink">Schon gewusst?</strong> {name.funFact}
            </p>
          )}

          {name.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-8 text-sm">
              <span className="text-fade">Kategorien:</span>
              {name.tags.map((tag) => (
                <span key={tag} className="text-ink-soft">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {renderPopularityChart() && (
            <section>
              <h2 className="text-lg text-ink mb-1">Beliebtheit über die Jahre</h2>
              <p className="text-xs text-fade mb-4">
                Rang-Entwicklung in den deutschen Namensstatistiken.
              </p>
              {renderPopularityChart()}
            </section>
          )}
        </div>

        <aside className="md:border-l md:border-line md:pl-8">
          <h2 className="text-lg text-ink mb-4">Steckbrief</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-fade">Herkunft</dt>
              <dd className="text-ink text-right">{name.origin}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-fade">Geschlecht</dt>
              <dd className="text-ink text-right">
                {name.gender === 'girl' ? 'Mädchen' : name.gender === 'boy' ? 'Junge' : 'Unisex'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-fade">Beliebtheit</dt>
              <dd className="text-ink text-right">Rang #{name.popularityRank}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-fade">Buchstaben</dt>
              <dd className="text-ink text-right">{name.length}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-fade">Silben</dt>
              <dd className="text-ink text-right">{name.syllables}</dd>
            </div>
          </dl>

          {name.compatiblePairs.length > 0 && (
            <div className="mt-8 pt-6 border-t border-line">
              <h3 className="text-lg text-ink mb-3">Passt zu</h3>
              <ul className="space-y-2">
                {name.compatiblePairs.map((pair, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3">
                    <span className="font-editorial text-lg text-ink">
                      {name.name} &amp; {pair.name}
                    </span>
                    <span className="text-xs text-fade">{pair.relation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Similar names */}
      {similarNames.length > 0 && (
        <section className="mt-12 pt-8 border-t border-line">
          <h2 className="text-lg text-ink mb-2">Ähnliche Namen wie {name.name}</h2>
          <p className="text-sm text-fade mb-4">
            Gleiche Herkunft, ähnlicher Klang oder vergleichbare Beliebtheit.
          </p>
          <div className="border-t border-line">
            {similarNames.map((sim) => (
              <NameRow key={sim.id} name={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}