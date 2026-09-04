'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Volume2,
  Share2,
  TrendingUp,
  ArrowLeft,
  Users,
  Compass,
  Check,
} from 'lucide-react';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import NameCard from '@/components/NameCard';

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

  const genderStr =
    name.gender === 'girl' ? 'Mädchenname' : name.gender === 'boy' ? 'Jungenname' : 'Unisex-Name';

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
            stroke="#F0E4E7"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#F0E4E7"
            strokeDasharray="4 4"
          />

          <polygon
            points={`${getX(0)},${height - padding} ${points} ${getX(data.length - 1)},${height - padding}`}
            fill="url(#pinkGradient)"
            opacity="0.25"
          />

          <defs>
            <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4F87" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFF5F8" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polyline
            fill="none"
            stroke="#FF4F87"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.rank);
            return (
              <g key={d.year} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="4.5"
                  fill="#FFFFFF"
                  stroke="#FF4F87"
                  strokeWidth="2.5"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill="#171717"
                  fontSize="11"
                  fontWeight="600"
                >
                  #{d.rank}
                </text>
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#777777"
                  fontSize="11"
                  fontWeight="400"
                >
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/babynamen"
          className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#FF4F87] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zurück zur Übersicht</span>
        </Link>
      </div>

      {/* Hero Name Card */}
      <div className="bg-white rounded-[26px] border border-[#F0E4E7] p-8 sm:p-12 shadow-xs mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`text-xs font-medium ${
                  name.gender === 'girl'
                    ? 'text-[#FF4F87]'
                    : name.gender === 'boy'
                    ? 'text-blue-700'
                    : 'text-purple-700'
                }`}
              >
                {genderStr}
              </span>
              <span className="text-xs text-[#777777]">
                {name.length} Buchstaben · {name.syllables} {name.syllables === 1 ? 'Silbe' : 'Silben'}
              </span>
              <span className="text-xs font-semibold text-[#FF6F9F]">
                Aktuell Rang #{name.popularityRank}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <h1 className="font-editorial text-5xl sm:text-7xl font-normal text-[#171717] tracking-tight">
                {name.name}
              </h1>

              <button
                onClick={handleSpeech}
                className="p-3 rounded-full bg-[#FFF5F8] border border-[#F0E4E7] hover:border-[#FFD6E3] text-[#FF4F87] transition-all hover:scale-105 active:scale-95 shadow-2xs"
                title="Aussprache anhören"
              >
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              </button>
            </div>
            {name.pronunciation && (
              <p className="text-xs text-[#777777] font-mono mt-1">
                Lautschrift: {name.pronunciation}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white border border-[#F0E4E7] hover:border-[#FF6F9F] text-[#777777] hover:text-[#FF4F87] transition-colors"
              title="Link kopieren"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => toggleFavorite(name, e)}
              className={`flex-1 sm:flex-initial btn-primary px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                favorited ? 'bg-emerald-600 hover:bg-emerald-700' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
              <span>{favorited ? 'In Favoriten gespeichert' : '♡ Zu meinen Favoriten'}</span>
            </button>
          </div>
        </div>

        {/* Meaning Highlight Box */}
        <div className="bg-[#FFF5F8] rounded-[20px] border border-[#F0E4E7] p-6 mb-8">
          <span className="text-[11px] font-semibold text-[#FF4F87] uppercase tracking-wider block mb-1">
            Bedeutung
          </span>
          <p className="font-editorial text-2xl sm:text-3xl text-[#171717] leading-snug">
            &bdquo;{name.meaning}&ldquo;
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-[#171717] mb-2">
            Über den Namen {name.name}
          </h3>
          <p className="text-base text-[#171717]/80 leading-relaxed font-normal">
            {name.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-[#F0E4E7]">
          <span className="text-xs text-[#777777]">Kategorien:</span>
          {name.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[#777777]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Grid: Herkunft & Passt zu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-[24px] border border-[#F0E4E7] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#FFF5F8] border border-[#F0E4E7] flex items-center justify-center text-[#FF4F87] mb-4">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#171717] mb-1">
              Herkunft
            </h3>
            <p className="text-sm font-medium text-[#FF4F87] mb-2">
              {name.origin}
            </p>
            <p className="text-sm text-[#777777] leading-relaxed">
              Der Name {name.name} ist historisch tief im {name.origin}en Sprachraum verwurzelt und trägt eine lange Tradition.
            </p>
          </div>

          {name.funFact && (
            <div className="mt-6 pt-4 border-t border-[#F0E4E7] text-xs text-[#777777]">
              <strong className="text-[#171717]">Schon gewusst?</strong> {name.funFact}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[24px] border border-[#F0E4E7] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#FFF5F8] border border-[#F0E4E7] flex items-center justify-center text-[#FF4F87] mb-4">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#171717] mb-1">
              Passt zu
            </h3>
            <p className="text-xs text-[#777777] mb-4">
              Harmonische Kombinationen für Geschwister oder Zweitnamen:
            </p>

            <div className="space-y-2">
              {name.compatiblePairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF5F8] border border-[#F0E4E7]"
                >
                  <span className="font-editorial text-base font-normal text-[#171717]">
                    {name.name} &amp; {pair.name}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-[#FF4F87] border border-[#F0E4E7]">
                    {pair.relation}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F0E4E7] text-xs text-[#777777]">
            Harmonisch abgestimmt nach Rhythmus und Sprachklang.
          </div>
        </div>
      </div>

      {/* Popularity Trend Graph */}
      <div className="bg-white rounded-[26px] border border-[#F0E4E7] p-6 sm:p-8 mb-10 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-[#171717]">
              Beliebtheit über die Jahre
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Aktuell #{name.popularityRank}</span>
          </div>
        </div>

        <p className="text-xs text-[#777777] mb-6">
          Rang-Entwicklung in den deutschen Namensstatistiken (2018–2024).
        </p>

        {renderPopularityChart()}
      </div>

      {/* Ähnliche Namen */}
      {similarNames.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-[#171717] mb-6 tracking-tight">
            Ähnliche Namen wie {name.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarNames.map((sim) => (
              <NameCard key={sim.id} name={sim} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
