'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';

interface Answers {
  gender: string;
  style: string;
  length: string;
  popularity: string;
  firstLetter: string;
  vibe: string;
}

const INITIAL_ANSWERS: Answers = {
  gender: '',
  style: '',
  length: '',
  popularity: '',
  firstLetter: 'egal',
  vibe: '',
};

const QUESTIONS_LENGTH = 5;

function matchLabel(score: number): string {
  if (score >= 95) return 'Sehr passend';
  if (score >= 90) return 'Passt gut';
  if (score >= 85) return 'Interessant';
  return 'Einen Blick wert';
}

export default function NameDiscoveryWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [results, setResults] = useState<{ name: BabyName; score: number }[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  const questions = [
    {
      id: 'gender',
      title: 'Für wen suchst du einen Namen?',
      options: [
        { label: 'Ein kleines Mädchen', value: 'girl', hint: 'Sanft und klangvoll' },
        { label: 'Einen kleinen Jungen', value: 'boy', hint: 'Kräftig und herzlich' },
        { label: 'Egal / Überraschung', value: 'any', hint: 'Alle Namen zeigen' },
      ],
    },
    {
      id: 'style',
      title: 'Welcher Stil gefällt euch?',
      options: [
        { label: 'Modern & frisch', value: 'modern', hint: 'Aktuell und geläufig' },
        { label: 'Klassisch & zeitlos', value: 'classic', hint: 'Bewährt seit Jahrzehnten' },
        { label: 'International', value: 'international', hint: 'Leicht auszusprechen' },
      ],
    },
    {
      id: 'length',
      title: 'Wie lang darf der Name sein?',
      options: [
        { label: 'Kurz (3–4 Buchstaben)', value: 'short', hint: 'Emma, Noah, Mia' },
        { label: 'Mittellang (5–6 Buchstaben)', value: 'medium', hint: 'Emilia, Elias, Clara' },
        { label: 'Egal', value: 'any', hint: 'Der Klang zählt' },
      ],
    },
    {
      id: 'popularity',
      title: 'Wie bekannt soll der Name sein?',
      options: [
        { label: 'Sehr beliebt', value: 'popular', hint: 'Oben auf den Listen' },
        { label: 'Selten & besonders', value: 'rare', hint: 'Nicht auf jedem Spielplatz' },
        { label: 'Ausgewogen', value: 'balanced', hint: 'Bekannt, aber nicht überlaufen' },
      ],
    },
    {
      id: 'vibe',
      title: 'Welche Stimmung soll der Name haben?',
      options: [
        { label: 'Sanft & melodisch', value: 'gentle', hint: 'Warme Vokale, fließender Klang' },
        { label: 'Kraftvoll & mutig', value: 'strong', hint: 'Markant und charakterstark' },
        { label: 'Naturverbunden', value: 'nature', hint: 'Licht, Frühling, Meer' },
      ],
    },
  ];

  const handleSelectOption = (field: keyof Answers, val: string) => {
    const updated = { ...answers, [field]: val };
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateMatches(updated);
    }
  };

  const calculateMatches = (finalAnswers: Answers) => {
    const scored = ALL_NAMES.map((name) => {
      let score = 50;

      if (finalAnswers.gender === 'girl') {
        if (name.gender === 'girl') score += 25;
        else if (name.gender === 'unisex') score += 15;
        else score -= 40;
      } else if (finalAnswers.gender === 'boy') {
        if (name.gender === 'boy') score += 25;
        else if (name.gender === 'unisex') score += 15;
        else score -= 40;
      } else {
        score += 10;
      }

      if (finalAnswers.style === 'modern' && name.styles.includes('modern')) score += 15;
      if (finalAnswers.style === 'classic' && (name.styles.includes('classic') || name.styles.includes('timeless'))) score += 15;
      if (finalAnswers.style === 'international' && name.styles.includes('international')) score += 15;

      if (finalAnswers.length === 'short' && name.length <= 4) score += 15;
      if (finalAnswers.length === 'medium' && name.length >= 5 && name.length <= 6) score += 15;

      if (finalAnswers.popularity === 'popular' && name.popularityRank <= 25) score += 15;
      if (finalAnswers.popularity === 'rare' && (name.styles.includes('rare') || name.popularityRank > 45)) score += 20;

      if (finalAnswers.vibe === 'gentle' && (name.meaning.includes('Sanft') || name.meaning.includes('Lieb') || name.tags.includes('Sanft'))) score += 12;
      if (finalAnswers.vibe === 'strong' && (name.meaning.includes('Krieger') || name.meaning.includes('Beschützer') || name.tags.includes('Stark'))) score += 12;
      if (finalAnswers.vibe === 'nature' && (name.meaning.includes('Licht') || name.meaning.includes('Blume') || name.tags.includes('Naturverbunden'))) score += 12;

      return { name, score: Math.min(Math.max(score, 65), 99) };
    });

    scored.sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 4));
    setCurrentStep(questions.length);
  };

  const handleReset = () => {
    setAnswers(INITIAL_ANSWERS);
    setCurrentStep(0);
    setResults([]);
  };

  const genderLabel = (name: BabyName) =>
    name.gender === 'girl' ? 'Mädchen' : name.gender === 'boy' ? 'Junge' : 'Unisex';

  const progress = Math.min(100, ((currentStep + 1) / questions.length) * 100);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-paper-warm border border-line rounded-2xl p-6 sm:p-10">
          {!isOpen ? (
            <div className="text-center max-w-lg mx-auto py-4">
              <p className="eyebrow mb-3">Noch unschlüssig?</p>
              <h2 className="font-editorial text-3xl sm:text-4xl text-ink mb-3">
                Fünf Fragen zur Namenswahl
              </h2>
              <p className="text-ink-soft text-[0.95rem] mb-8">
                Beantworte ein paar kurze Fragen – als Inspiration, nicht als Regel.
              </p>
              <button onClick={() => setIsOpen(true)} className="btn btn-primary px-7 py-2.5">
                Namen für mich finden
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : currentStep < questions.length ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-fade">
                  Frage {currentStep + 1} von {QUESTIONS_LENGTH}
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-fade hover:text-ink transition-colors"
                >
                  Zurücksetzen
                </button>
              </div>

              <div className="w-full bg-surface h-1 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-accent transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl text-ink mb-6 text-center">
                {questions[currentStep].title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {questions[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      handleSelectOption(questions[currentStep].id as keyof Answers, opt.value)
                    }
                    className="bg-surface border border-line-strong rounded-xl p-4 text-left hover:border-accent transition-colors group"
                  >
                    <div className="text-sm font-medium text-ink group-hover:text-accent-deep">
                      {opt.label}
                    </div>
                    <p className="mt-0.5 text-xs text-fade">{opt.hint}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rise">
              <div className="text-center max-w-lg mx-auto mb-7">
                <h3 className="font-editorial text-2xl sm:text-3xl text-ink mb-2">
                  Deine Namensauswahl
                </h3>
                <p className="text-sm text-ink-soft">
                  Das passt am besten zu deinen Antworten:
                </p>
              </div>

              <div className="border-t border-line">
                {results.map(({ name, score }) => {
                  const favorited = isFavorite(name.id);
                  return (
                    <div
                      key={name.id}
                      className={`flex items-center gap-3 sm:gap-5 py-4 border-b border-line group hover:bg-surface transition-colors px-2 -mx-2 ${
                        score >= 95 ? 'rounded-lg' : ''
                      }`}
                    >
                      <Link href={`/name/${name.id}`} className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <span className="font-editorial text-[1.4rem] sm:text-[1.6rem] leading-tight text-ink group-hover:text-accent-deep transition-colors">
                            {name.name}
                          </span>
                          <span className="text-sm text-ink-soft">
                            {genderLabel(name)} · {name.origin}
                          </span>
                        </div>
                        <p className="text-sm text-fade truncate mt-0.5">
                          &bdquo;{name.meaning}&ldquo;
                        </p>
                      </Link>

                      <span className="shrink-0 text-xs text-accent-deep bg-accent-pale border border-line rounded-full px-2.5 py-1">
                        {matchLabel(score)}
                      </span>

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
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap mt-7">
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  Noch einmal
                </button>
                <Link href="/babynamen" className="btn btn-primary">
                  Alle Namen durchsuchen
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}