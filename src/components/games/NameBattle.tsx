'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Heart, ArrowRight } from 'lucide-react';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';

const TOTAL_ROUNDS = 5;

const genderLabel = (name: BabyName) =>
  name.gender === 'girl' ? 'Mädchen' : name.gender === 'boy' ? 'Junge' : 'Unisex';

function getRandomChallenger(winnerId: string): BabyName {
  const remaining = ALL_NAMES.filter((n) => n.id !== winnerId);
  return remaining[Math.floor(Math.random() * remaining.length)];
}

export default function NameBattle() {
  const [round, setRound] = useState(1);
  const [candidateA, setCandidateA] = useState<BabyName>(ALL_NAMES[4]); // Mila
  const [candidateB, setCandidateB] = useState<BabyName>(ALL_NAMES[3]); // Lina
  const [chosenWinner, setChosenWinner] = useState<'A' | 'B' | null>(null);
  const [historyWins, setHistoryWins] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [champion, setChampion] = useState<BabyName | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const getNextPair = (winner: BabyName) => ({
    keep: winner,
    challenger: getRandomChallenger(winner.id),
  });

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
    setRound(1);
    setCandidateA(ALL_NAMES[4]);
    setCandidateB(ALL_NAMES[3]);
    setChosenWinner(null);
    setHistoryWins({});
    setIsFinished(false);
    setChampion(null);
  };

  const renderFighter = (
    label: string,
    candidate: BabyName,
    winner: 'A' | 'B'
  ) => {
    const isWinning = chosenWinner === winner;
    const isLosing = chosenWinner !== null && chosenWinner !== winner;
    return (
      <motion.div
        animate={{
          scale: isWinning ? 1.03 : isLosing ? 0.97 : 1,
          opacity: isLosing ? 0.35 : 1,
          borderColor: isWinning
            ? 'var(--color-accent)'
            : isLosing
            ? 'var(--color-line)'
            : 'var(--color-line-strong)',
        }}
        transition={{ duration: 0.25 }}
        onClick={() => handleVote(winner)}
        className={`bg-surface rounded-2xl border p-5 sm:p-7 text-center cursor-pointer transition-colors select-none group ${
          chosenWinner === null ? 'hover:border-accent' : ''
        }`}
      >
        <span className="eyebrow block mb-1">{label}</span>
        <h3 className="font-editorial text-3xl sm:text-4xl text-ink group-hover:text-accent-deep transition-colors mb-2">
          {candidate.name}
        </h3>
        <span className="text-xs text-ink-soft">
          {genderLabel(candidate)} · {candidate.length} Buchstaben
        </span>
        <p className="mt-2 text-sm text-fade line-clamp-2">
          &bdquo;{candidate.meaning}&ldquo;
        </p>

        <span className="mt-4 inline-block text-xs text-accent-deep border border-line-strong rounded-full px-4 py-1.5 group-hover:bg-accent-soft transition-colors">
          Diesen Namen wählen
        </span>
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!isFinished ? (
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-line">
            <span className="text-sm text-ink">
              Duell-Runde {round} von {TOTAL_ROUNDS}
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-colors ${
                    i < round ? 'bg-accent' : 'bg-line'
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
            className="bg-surface rounded-2xl border border-line p-8 sm:p-12 text-center shadow-sm rise"
          >
            <div className="w-14 h-14 rounded-full bg-accent-soft border border-line flex items-center justify-center text-accent-deep mx-auto mb-4">
              <Trophy className="w-6 h-6" />
            </div>

            <p className="eyebrow mb-1">Dein Favorit nach fünf Runden</p>
            <h4 className="font-editorial text-4xl sm:text-5xl text-ink mb-2">
              {champion.name}
            </h4>
            <p className="text-sm text-ink-soft">
              {champion.origin} · {genderLabel(champion)}
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