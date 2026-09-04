'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Compass, Swords, Sparkles, Timer, Wand2, Gamepad2 } from 'lucide-react';
import SwipeGame from '@/components/games/SwipeGame';
import NameBattle from '@/components/games/NameBattle';
import NameRoulette from '@/components/games/NameRoulette';
import SpeedChallenge from '@/components/games/SpeedChallenge';
import NameGenerator from '@/components/games/NameGenerator';

type GameTab = 'swipe' | 'battle' | 'roulette' | 'challenge' | 'generator';

function SpieleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') as GameTab;
  const activeTab: GameTab =
    tabParam && ['swipe', 'battle', 'roulette', 'challenge', 'generator'].includes(tabParam)
      ? tabParam
      : 'swipe';

  const handleTabChange = (tab: GameTab) => {
    router.replace(`/spiele?tab=${tab}`, { scroll: false });
  };

  const tabs = [
    { id: 'swipe', label: 'Swipe Deck', icon: Compass, badge: 'Tinder-Modus' },
    { id: 'battle', label: 'Name Battle', icon: Swords, badge: 'Duell' },
    { id: 'roulette', label: 'Roulette', icon: Sparkles, badge: 'Glücksrad' },
    { id: 'challenge', label: '10s Challenge', icon: Timer, badge: 'Speed-Quiz' },
    { id: 'generator', label: 'Generator', icon: Wand2, badge: 'Smart' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] text-[#FF4F87] text-xs font-bold mb-3 shadow-2xs">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Interaktive Spiele & Inspiration</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] tracking-tight mb-3">
          Spielerisch zum perfekten Namen
        </h1>
        <p className="text-base sm:text-lg text-[#777777]">
          Keine Lust auf endlose Namenslisten? Dann spiel dich zu deinem Favoriten.
        </p>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1.5 bg-[#FFF5F8] rounded-full border border-[#FFD6E3] shadow-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as GameTab)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF4F87] text-white shadow-sm'
                    : 'text-[#777777] hover:text-[#171717] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF6F9F]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Game Display Area */}
      <div className="bg-white rounded-[32px] border border-[#F2E3E8] p-6 sm:p-12 shadow-[0_12px_45px_rgba(255,111,159,0.06)] min-h-[550px]">
        {activeTab === 'swipe' && <SwipeGame />}
        {activeTab === 'battle' && <NameBattle />}
        {activeTab === 'roulette' && <NameRoulette />}
        {activeTab === 'challenge' && <SpeedChallenge />}
        {activeTab === 'generator' && <NameGenerator />}
      </div>
    </div>
  );
}

export default function SpielePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#777777]">Lade Spiele...</div>}>
      <SpieleContent />
    </Suspense>
  );
}
