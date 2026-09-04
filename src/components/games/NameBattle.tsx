'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Sparkles, RotateCcw, Heart, ArrowRight } from 'lucide-react';
import { BABY_NAMES } from '@/data/names';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';
import confetti from 'canvas-confetti';

const TOTAL_ROUNDS = 5;

export default function NameBattle() {
  const [round, setRound] = useState(1);
  const [candidateA, setCandidateA] = useState<BabyName>(BABY_NAMES[4]); // Mila
  const [candidateB, setCandidateB] = useState<BabyName>(BABY_NAMES[3]); // Lina
  const [chosenWinner, setChosenWinner] = useState<'A' | 'B' | null>(null);
  const [historyWins, setHistoryWins] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [champion, setChampion] = useState<BabyName | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const getNextPair = (winner: BabyName) => {
    // Pick another random name that is not the winner and not the other
    const remaining = BABY_NAMES.filter((n) => n.id !== winner.id);
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const challenger = remaining[randomIndex];

    return {
      keep: winner,
      challenger,
    };
  };

  const handleVote = (selected: 'A' | 'B') => {
    if (chosenWinner !== null) return; // already in transition

    setChosenWinner(selected);
    const winnerName = selected === 'A' ? candidateA : candidateB;

    // Record win in history
    const updatedWins = {
      ...historyWins,
      [winnerName.name]: (historyWins[winnerName.name] || 0) + 1,
    };
    setHistoryWins(updatedWins);

    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        // Find champion with highest wins
        let topName = winnerName;
        let maxVotes = 0;
        for (const [nameStr, count] of Object.entries(updatedWins)) {
          if (count > maxVotes) {
            maxVotes = count;
            const found = BABY_NAMES.find((n) => n.name === nameStr);
            if (found) topName = found;
          }
        }
        setChampion(topName);
        setIsFinished(true);

        try {
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FF6F9F', '#FF4F87', '#FFD6E3'],
          });
        } catch {}
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
    setCandidateA(BABY_NAMES[4]); // Mila
    setCandidateB(BABY_NAMES[3]); // Lina
    setChosenWinner(null);
    setHistoryWins({});
    setIsFinished(false);
    setChampion(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!isFinished ? (
        <div>
          {/* Battle Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#FFD6E3]/60">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87]">
                <Swords className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold text-[#171717]">
                Duell-Runde {round} von {TOTAL_ROUNDS}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-2 rounded-full transition-all ${
                    i < round ? 'bg-[#FF4F87]' : 'bg-[#FFD6E3]'
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-[#777777] mb-6">
            Klicke auf den Namen, der dir besser gefällt!
          </p>

          {/* 2 Combatant Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative items-center">
            {/* VS Badge */}
            <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border-2 border-[#FF6F9F] items-center justify-center font-black text-xs text-[#FF4F87] shadow-lg">
              VS
            </div>

            {/* Fighter A */}
            <motion.div
              animate={{
                scale: chosenWinner === 'A' ? 1.05 : chosenWinner === 'B' ? 0.95 : 1,
                opacity: chosenWinner === 'B' ? 0.3 : 1,
                boxShadow:
                  chosenWinner === 'A'
                    ? '0 0 35px rgba(255, 79, 135, 0.3)'
                    : '0 4px 20px rgba(23, 23, 23, 0.04)',
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handleVote('A')}
              className="baby-card p-6 sm:p-8 text-center cursor-pointer border-2 hover:border-[#FF4F87] transition-all relative select-none group bg-white"
            >
              <span className="text-[11px] font-medium text-[#777777] uppercase tracking-wider block mb-1">
                Option A
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-normal text-[#171717] group-hover:text-[#FF4F87] transition-colors mb-2">
                {candidateA.name}
              </h3>
              <span
                className={`text-xs font-medium inline-block mb-3 ${
                  candidateA.gender === 'girl'
                    ? 'text-[#FF4F87]'
                    : 'text-blue-700'
                }`}
              >
                {candidateA.gender === 'girl' ? 'Mädchen' : 'Junge'} · {candidateA.length} Buchstaben
              </span>
              <p className="text-xs text-[#777777] line-clamp-2">
                &bdquo;{candidateA.meaning}&ldquo;
              </p>

              <button className="mt-5 w-full py-2.5 rounded-full bg-[#FFF5F8] group-hover:bg-[#FF4F87] group-hover:text-white text-[#FF4F87] text-xs font-semibold transition-colors">
                Diesen Namen wählen
              </button>
            </motion.div>

            {/* Fighter B */}
            <motion.div
              animate={{
                scale: chosenWinner === 'B' ? 1.05 : chosenWinner === 'A' ? 0.95 : 1,
                opacity: chosenWinner === 'A' ? 0.3 : 1,
                boxShadow:
                  chosenWinner === 'B'
                    ? '0 0 35px rgba(255, 79, 135, 0.3)'
                    : '0 4px 20px rgba(23, 23, 23, 0.04)',
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handleVote('B')}
              className="baby-card p-6 sm:p-8 text-center cursor-pointer border-2 hover:border-[#FF4F87] transition-all relative select-none group bg-white"
            >
              <span className="text-[11px] font-medium text-[#777777] uppercase tracking-wider block mb-1">
                Option B
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-normal text-[#171717] group-hover:text-[#FF4F87] transition-colors mb-2">
                {candidateB.name}
              </h3>
              <span
                className={`text-xs font-medium inline-block mb-3 ${
                  candidateB.gender === 'girl'
                    ? 'text-[#FF4F87]'
                    : 'text-blue-600'
                }`}
              >
                {candidateB.gender === 'girl' ? 'Mädchen' : 'Junge'} · {candidateB.length} Buchstaben
              </span>
              <p className="text-xs text-[#777777] line-clamp-2">
                &bdquo;{candidateB.meaning}&ldquo;
              </p>

              <button className="mt-5 w-full py-2.5 rounded-full bg-[#FFF5F8] group-hover:bg-[#FF4F87] group-hover:text-white text-[#FF4F87] text-xs font-bold transition-colors">
                Diesen Namen wählen
              </button>
            </motion.div>
          </div>
        </div>
      ) : (
        /* Winner Announcement */
        champion && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[28px] border-2 border-[#FFD6E3] p-8 sm:p-12 text-center shadow-[0_20px_60px_rgba(255,111,159,0.18)]"
          >
            <div className="w-20 h-20 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] mx-auto mb-4 shadow-sm">
              <Trophy className="w-10 h-10 text-[#FF4F87]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6F9F]">
              Turniersieger
            </span>
            <h3 className="text-2xl font-bold text-[#777777] mt-1 mb-2">
              Dein Gewinner:
            </h3>

            <div className="my-6">
              <h4 className="font-editorial text-5xl sm:text-6xl font-normal text-[#171717] tracking-tight mb-2">
                {champion.name}
              </h4>
              <p className="text-sm text-[#FF4F87] font-semibold">
                Herkunft: {champion.origin}
              </p>
              <p className="text-base text-[#171717]/80 mt-2 max-w-sm mx-auto">
                &bdquo;{champion.meaning}&ldquo;
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap pt-4 border-t border-[#F2E3E8]">
              <button
                onClick={() => toggleFavorite(champion)}
                className={`btn-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 ${
                  isFavorite(champion.id) ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite(champion.id) ? 'fill-white' : ''}`} />
                <span>
                  {isFavorite(champion.id) ? 'In Favoriten gespeichert' : 'Als Favorit speichern'}
                </span>
              </button>

              <Link
                href={`/name/${champion.id}`}
                className="px-6 py-3 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] text-[#171717] hover:text-[#FF4F87] text-sm font-semibold inline-flex items-center gap-1.5"
              >
                <span>Namensdetails</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleRestart}
                className="px-5 py-3 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Neues Battle</span>
              </button>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
