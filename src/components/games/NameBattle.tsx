'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Heart, ArrowRight, Sparkles, CalendarDays } from 'lucide-react';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName, Gender } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import { genderNoun, originPhrase } from '@/lib/format';

const TOTAL_ROUNDS = 5;

interface BattleNamePayload {
  name: string;
  gender: Gender;
  origin: string;
  meaning: string;
  length: number;
  id: string;
}

function toBabyName(n: BattleNamePayload): BabyName {
  const existing = ALL_NAMES.find((x) => x.id === n.id);
  if (existing) return existing;
  return {
    name: n.name,
    gender: n.gender,
    origin: n.origin ?? '',
    meaning: n.meaning ?? '',
    length: n.length,
    id: n.id,
    popularityRank: 50,
    trendPercentage: 0,
    trendDirection: 'neutral' as const,
    styles: [],
    tags: [],
    description: '',
    similarNames: [],
    compatiblePairs: [],
    popularityHistory: [],
    syllables: 1,
    firstLetter: n.name[0] ?? 'A',
  };
}

function getRandomFromPool(gender: Gender | 'all'): BabyName {
  const pool = ALL_NAMES.filter((n) =>
    gender === 'all' ? true : n.gender === gender || n.gender === 'unisex'
  );
  return pool[Math.floor(Math.random() * pool.length)];
}

function getRandomChallenger(winnerId: string, gender: Gender | 'all'): BabyName {
  const remaining = ALL_NAMES.filter(
    (n) =>
      n.id !== winnerId &&
      (gender === 'all' ? true : n.gender === gender || n.gender === 'unisex')
  );
  if (remaining.length === 0) return getRandomFromPool(gender);
  return remaining[Math.floor(Math.random() * remaining.length)];
}

export default function NameBattle() {
  const [gender, setGender] = useState<Gender | 'all'>('all');
  const [round, setRound] = useState(1);
  const [candidateA, setCandidateA] = useState<BabyName>(() => getRandomFromPool('all'));
  const [candidateB, setCandidateB] = useState<BabyName>(() => getRandomFromPool('all'));
  const [chosenWinner, setChosenWinner] = useState<'A' | 'B' | null>(null);
  const [historyWins, setHistoryWins] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [champion, setChampion] = useState<BabyName | null>(null);
  const [secretInput, setSecretInput] = useState('');
  const [showAiButtons, setShowAiButtons] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [dailyNames, setDailyNames] = useState<BabyName[]>([]);
  const [isDailyMode, setIsDailyMode] = useState(false);
  const [dailyDate, setDailyDate] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleSecretInput = (value: string) => {
    setSecretInput(value);
    if (value.toLowerCase().includes('geminitest')) {
      setShowAiButtons(true);
    }
  };

  const startFreshBattle = useCallback(() => {
    if (isDailyMode && dailyNames.length >= 2) {
      const a = dailyNames[Math.floor(Math.random() * dailyNames.length)];
      let b = dailyNames[Math.floor(Math.random() * dailyNames.length)];
      while (b.id === a.id) b = dailyNames[Math.floor(Math.random() * dailyNames.length)];
      setCandidateA(a);
      setCandidateB(b);
    } else {
      const a = getRandomFromPool(gender);
      let b = getRandomFromPool(gender);
      while (b.id === a.id) b = getRandomFromPool(gender);
      setCandidateA(a);
      setCandidateB(b);
    }
    setChosenWinner(null);
    setHistoryWins({});
    setIsFinished(false);
    setChampion(null);
    setRound(1);
  }, [gender, isDailyMode, dailyNames]);

  const handleGenderChange = (g: Gender | 'all') => {
    setGender(g);
    setIsDailyMode(false);
    setDailyNames([]);
    setDailyDate('');
    startFreshBattle();
  };

  const handleAiUpdate = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/battle-names?gender=${gender}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.names) && data.names.length >= 2) {
        setIsDailyMode(false);
        setDailyNames([]);
        setDailyDate('');
        setCandidateA(toBabyName(data.names[0]));
        setCandidateB(toBabyName(data.names[1]));
        setChosenWinner(null);
        setRound(1);
        setHistoryWins({});
        setIsFinished(false);
        setChampion(null);
      }
    } catch {
      // silently fail, keep current names
    }
    setAiLoading(false);
  };

  const handleDailyUpdate = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/battle-names?source=daily&gender=${gender}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.names) && data.names.length >= 2) {
        const pool = data.names.map(toBabyName);
        setDailyNames(pool);
        setIsDailyMode(true);
        setDailyDate(data.date ?? '');
        setCandidateA(pool[0]);
        setCandidateB(pool[1]);
        setChosenWinner(null);
        setRound(1);
        setHistoryWins({});
        setIsFinished(false);
        setChampion(null);
      }
    } catch {
      // silently fail, keep current names
    }
    setAiLoading(false);
  };

  const getNextPair = (winner: BabyName) => {
    if (isDailyMode && dailyNames.length >= 2) {
      const usable = dailyNames.filter((n) => n.id !== winner.id);
      const challenger =
        usable.length > 0
          ? usable[Math.floor(Math.random() * usable.length)]
          : getRandomFromPool(gender);
      return { keep: winner, challenger };
    }
    return { keep: winner, challenger: getRandomChallenger(winner.id, gender) };
  };

  const handleVote = (selected: 'A' | 'B') => {
    if (chosenWinner !== null) return;

    setChosenWinner(selected);
    const winnerName = selected === 'A' ? candidateA : candidateB;

    const updatedWins = {
      ...historyWins,
      [winnerName.name]: (historyWins[winnerName.name] || 0) + 1,
    };
    setHistoryWins(updatedWins);

    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        let topName = winnerName;
        let maxVotes = 0;
        for (const [nameStr, count] of Object.entries(updatedWins)) {
          if (count > maxVotes) {
            maxVotes = count;
            const found = ALL_NAMES.find((n) => n.name === nameStr);
            if (found) topName = found;
          }
        }
        setChampion(topName);
        setIsFinished(true);
      } else {
        const next = getNextPair(winnerName);
        setCandidateA(next.keep);
        setCandidateB(next.challenger);
        setRound((prev) => prev + 1);
        setChosenWinner(null);
      }
    }, 600);
  };

  const handleRestart = () => {
    startFreshBattle();
  };

  const renderFighter = (label: string, candidate: BabyName, winner: 'A' | 'B') => {
    const isWinning = chosenWinner === winner;
    const isLosing = chosenWinner !== null && chosenWinner !== winner;
    return (
      <motion.div
        animate={{
          scale: isWinning ? 1.03 : isLosing ? 0.97 : 1,
          opacity: isLosing ? 0.35 : 1,
          borderColor: isWinning
            ? 'var(--color-blue)'
            : isLosing
            ? 'var(--color-line)'
            : 'var(--color-line-strong)',
        }}
        transition={{ duration: 0.25 }}
        onClick={() => handleVote(winner)}
        className={`bg-surface rounded-xl border p-5 sm:p-7 text-center cursor-pointer transition-colors select-none group ${
          chosenWinner === null ? 'hover:border-blue' : ''
        }`}
      >
        <span className="label block mb-1">{label}</span>
        <h3 className="font-editorial text-3xl sm:text-4xl text-ink group-hover:text-blue-deep transition-colors mb-2">
          {candidate.name}
        </h3>
        <span className="text-xs text-ink-soft">
          {genderNoun(candidate.gender)}, {candidate.length} Buchstaben
        </span>
        <p className="mt-2 text-sm text-fade line-clamp-2">
          &bdquo;{candidate.meaning}&ldquo;
        </p>

        <span className="mt-4 inline-block text-xs text-blue-deep border border-line-strong rounded-full px-4 py-1.5 group-hover:bg-blue-soft transition-colors">
          Diesen Namen wählen
        </span>
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!isFinished ? (
        <div>
          {/* Gender filter */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[
              { id: 'all' as const, label: 'Alle' },
              { id: 'girl' as const, label: 'Mädchen' },
              { id: 'boy' as const, label: 'Jungen' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => handleGenderChange(g.id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  gender === g.id
                    ? 'bg-blue text-white border-blue'
                    : 'bg-surface text-ink-soft border-line-strong hover:border-blue hover:text-blue-deep'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Secret AI trigger */}
          <div className="mb-4">
            <input
              type="text"
              value={secretInput}
              onChange={(e) => handleSecretInput(e.target.value)}
              placeholder=""
              className="w-full text-xs text-fade bg-transparent border-none outline-none text-center placeholder:text-transparent"
              aria-hidden="true"
            />
            {showAiButtons && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-1"
              >
                <button
                  onClick={handleDailyUpdate}
                  disabled={aiLoading}
                  className="btn btn-secondary text-xs gap-1.5"
                >
                  <CalendarDays className={`w-3.5 h-3.5 ${aiLoading ? 'animate-pulse' : ''}`} />
                  {aiLoading ? 'KI lädt …' : `Täglich frisch aktualisieren${dailyDate ? ` (${dailyDate})` : ''}`}
                </button>

                <button
                  onClick={handleAiUpdate}
                  disabled={aiLoading}
                  className="btn btn-secondary text-xs gap-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                  {aiLoading ? 'KI lädt neue Namen …' : 'Namen per KI aktualisieren'}
                </button>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-line">
            <span className="text-sm text-ink">
              Duell-Runde {round} von {TOTAL_ROUNDS}
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-colors ${
                    i < round ? 'bg-blue' : 'bg-line'
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-ink-soft mb-6">
            Klicke auf den Namen, der dir besser gefällt.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative items-center">
            <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-surface border border-line-strong items-center justify-center text-xs font-medium text-fade">
              VS
            </div>

            {renderFighter('Option A', candidateA, 'A')}
            {renderFighter('Option B', candidateB, 'B')}
          </div>
        </div>
      ) : (
        champion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-xl border border-line p-8 sm:p-12 text-center rise"
          >
            <div className="w-14 h-14 rounded-full bg-blue-soft border border-line flex items-center justify-center text-blue-deep mx-auto mb-4">
              <Trophy className="w-6 h-6" />
            </div>

            <p className="kicker mb-1">Dein Favorit nach fünf Runden</p>
            <h4 className="font-editorial text-4xl sm:text-5xl text-ink mb-2">
              {champion.name}
            </h4>
            <p className="text-sm text-ink-soft">
              {originPhrase(champion.origin, champion.gender)}
            </p>
            <p className="text-base text-ink-soft mt-3 max-w-sm mx-auto">
              &bdquo;{champion.meaning}&ldquo;
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap mt-7 pt-5 border-t border-line">
              <button
                onClick={() => toggleFavorite(champion)}
                className={`btn ${isFavorite(champion.id) ? 'btn-primary' : 'btn-primary'}`}
              >
                <Heart className={`w-4 h-4 ${isFavorite(champion.id) ? 'fill-white' : ''}`} />
                {isFavorite(champion.id) ? 'Gespeichert' : 'Als Favorit speichern'}
              </button>

              <Link href={`/name/${champion.id}`} className="btn btn-secondary">
                Namensdetails
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button onClick={handleRestart} className="btn btn-ghost">
                <RotateCcw className="w-3.5 h-3.5" />
                Neues Battle
              </button>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}