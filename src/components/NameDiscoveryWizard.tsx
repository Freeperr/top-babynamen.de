'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Heart,
} from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import confetti from 'canvas-confetti';

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
      subtitle: 'Wähle das Geschlecht aus',
      options: [
        { label: 'Ein kleines Mädchen', value: 'girl', hint: 'Sanft, klangvoll & feminin' },
        { label: 'Einen kleinen Jungen', value: 'boy', hint: 'Kräftig, modern & herzlich' },
        { label: 'Egal / Überraschung', value: 'any', hint: 'Mädchen, Jungen & Unisex-Namen' },
      ],
    },
    {
      id: 'style',
      title: 'Welcher Stil entspricht eurem Geschmack?',
      subtitle: 'Klassisch oder eher zeitgemäß modern?',
      options: [
        { label: 'Modern & trendbewusst', value: 'modern', hint: 'Aktuell im Trend, frisch' },
        { label: 'Klassisch & zeitlos', value: 'classic', hint: 'Traditionsreich, edel' },
        { label: 'International & weltoffen', value: 'international', hint: 'Leicht weltweit auszusprechen' },
      ],
    },
    {
      id: 'length',
      title: 'Wie lang soll der Name sein?',
      subtitle: 'Kurz und knackig oder klangvoll lang?',
      options: [
        { label: 'Kurz (3–4 Buchstaben)', value: 'short', hint: 'z.B. Emma, Noah, Mia, Mats' },
        { label: 'Mittellang (5–6 Buchstaben)', value: 'medium', hint: 'z.B. Emilia, Elias, Clara' },
        { label: 'Ganz egal wie lang', value: 'any', hint: 'Der Klang ist das Wichtigste' },
      ],
    },
    {
      id: 'popularity',
      title: 'Wie bekannt soll der Name sein?',
      subtitle: 'Ein beliebter Liebling oder ein seltener Geheimtipp?',
      options: [
        { label: 'Sehr beliebt & bekannt', value: 'popular', hint: 'Bewährt in den Top-Listen' },
        { label: 'Selten & besonders', value: 'rare', hint: 'Einzigartig, nicht auf jedem Spielplatz' },
        { label: 'Ausgewogen', value: 'balanced', hint: 'Bekannt, aber nicht überlaufen' },
      ],
    },
    {
      id: 'vibe',
      title: 'Welche Stimmung soll der Name haben?',
      subtitle: 'Was soll man fühlen, wenn man ihn hört?',
      options: [
        { label: 'Sanft & melodisch', value: 'gentle', hint: 'Warme Vokale, fließend' },
        { label: 'Kraftvoll & mutig', value: 'strong', hint: 'Charakterstark, markant' },
        { label: 'Naturverbunden & lichtvoll', value: 'nature', hint: 'Licht, Frühling, Meer' },
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
    const scored = BABY_NAMES.map((name) => {
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

      const normalizedScore = Math.min(Math.max(score, 65), 99);
      return { name, score: normalizedScore };
    });

    scored.sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 4));
    setCurrentStep(questions.length);

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF6F9F', '#FF4F87', '#FFD6E3'],
      });
    } catch {}
  };

  const handleReset = () => {
    setAnswers(INITIAL_ANSWERS);
    setCurrentStep(0);
    setResults([]);
  };

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Container Card */}
        <div className="bg-[#FFF5F8]/70 rounded-[28px] border border-[#F0E4E7] p-8 sm:p-14 shadow-xs">
          {!isOpen ? (
            /* Intro State */
            <div className="text-center max-w-xl mx-auto py-4">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight mb-3">
                Noch keinen Namen gefunden?
              </h2>
              <p className="text-base text-[#777777] mb-8 leading-relaxed">
                Beantworte ein paar Fragen und wir finden Namen, die zu dir passen.
              </p>
              <button
                onClick={() => setIsOpen(true)}
                className="btn-primary px-8 py-3.5 text-base font-medium inline-flex items-center gap-2"
              >
                <span>Namen für mich finden</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : currentStep < questions.length ? (
            /* Active Wizard Question */
            <div>
              {/* Header & step counter */}
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#F0E4E7]">
                <span className="text-xs font-semibold text-[#FF4F87]">
                  Frage {currentStep + 1} von {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="p-1.5 rounded-full hover:bg-white text-[#777777] hover:text-[#171717] transition-colors"
                      title="Zurück"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="text-xs text-[#777777] hover:text-[#FF4F87] px-2.5 py-1 rounded-full hover:bg-white transition-colors"
                  >
                    Zurücksetzen
                  </button>
                </div>
              </div>

              {/* Step indicator bar */}
              <div className="w-full bg-white h-1.5 rounded-full overflow-hidden mb-8 border border-[#F0E4E7]">
                <div
                  className="h-full bg-[#FF4F87] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="mb-8 text-center max-w-lg mx-auto">
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#171717] mb-2">
                  {questions[currentStep].title}
                </h3>
                <p className="text-sm text-[#777777]">
                  {questions[currentStep].subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto">
                {questions[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      handleSelectOption(questions[currentStep].id as keyof Answers, opt.value)
                    }
                    className="p-5 rounded-[18px] bg-white border border-[#F0E4E7] hover:border-[#FF6F9F] hover:shadow-xs text-left transition-all duration-200 group active:scale-98"
                  >
                    <div className="font-semibold text-sm text-[#171717] group-hover:text-[#FF4F87] mb-1 transition-colors">
                      {opt.label}
                    </div>
                    <p className="text-xs text-[#777777] leading-relaxed">
                      {opt.hint}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results Presentation */
            <div className="animate-in fade-in duration-300">
              <div className="text-center max-w-lg mx-auto mb-8">
                <h3 className="text-3xl font-semibold text-[#171717] mb-2">
                  Deine Namensauswahl
                </h3>
                <p className="text-sm text-[#777777]">
                  Diese Namen passen am besten zu deinen Wünschen:
                </p>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {results.map(({ name, score }) => {
                  const favorited = isFavorite(name.id);
                  return (
                    <div
                      key={name.id}
                      className="bg-white p-6 rounded-[20px] border border-[#F0E4E7] hover:border-[#FFD6E3] hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF5F8] text-[#FF4F87] border border-[#FFD6E3]">
                            {score}% Treffer
                          </span>
                          <button
                            onClick={(e) => toggleFavorite(name, e)}
                            className={`p-2 rounded-full border transition-colors ${
                              favorited
                                ? 'bg-[#FFF5F8] border-[#FF6F9F] text-[#FF4F87]'
                                : 'bg-white border-[#F0E4E7] text-[#777777] hover:text-[#FF4F87]'
                            }`}
                            title="Speichern"
                          >
                            <Heart
                              className={`w-4 h-4 ${favorited ? 'fill-[#FF4F87]' : ''}`}
                            />
                          </button>
                        </div>

                        <div className="flex items-baseline justify-between mb-1">
                          <h4 className="font-editorial text-3xl font-normal text-[#171717]">
                            {name.name}
                          </h4>
                          <span className="text-xs text-[#777777]">
                            {name.gender === 'girl'
                              ? 'Mädchen'
                              : name.gender === 'boy'
                              ? 'Junge'
                              : 'Unisex'}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-[#FF6F9F] uppercase tracking-wider mb-2">
                          Herkunft: {name.origin}
                        </p>
                        <p className="text-sm text-[#171717]/85 mb-4">
                          &bdquo;{name.meaning}&ldquo;
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#F0E4E7] flex items-center justify-between">
                        <span className="text-xs text-[#777777]">
                          Popularität: #{name.popularityRank}
                        </span>
                        <Link
                          href={`/name/${name.id}`}
                          className="btn-primary text-xs px-4 py-1.5 font-medium inline-flex items-center gap-1"
                        >
                          <span>Mehr erfahren</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-full bg-white border border-[#F0E4E7] text-[#171717] hover:text-[#FF4F87] font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 hover:bg-[#FFF5F8] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Noch einmal</span>
                </button>
                <Link
                  href="/babynamen"
                  className="btn-primary px-5 py-2 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5"
                >
                  <span>Alle Namen durchsuchen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
