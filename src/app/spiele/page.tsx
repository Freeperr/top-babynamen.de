'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SwipeGame from '@/components/games/SwipeGame';
import NameBattle from '@/components/games/NameBattle';
import SpeedChallenge from '@/components/games/SpeedChallenge';
import NameGenerator from '@/components/games/NameGenerator';

type GameTab = 'swipe' | 'battle' | 'challenge' | 'generator';

const VALID_TABS: GameTab[] = ['swipe', 'battle', 'challenge', 'generator'];

const TABS: { id: GameTab; label: string }[] = [
  { id: 'swipe', label: 'Swipe' },
  { id: 'battle', label: 'Welcher Name Passt Besser' },
  { id: 'challenge', label: '8s Challenge' },
  { id: 'generator', label: 'Generator' },
];

function SpieleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') as GameTab;
  const activeTab: GameTab =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'swipe';

  const handleTabChange = (tab: GameTab) => {
    router.replace(`/spiele?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-xl mx-auto text-center mb-10">
        <p className="kicker mb-3">Zum Spielen zwischendurch</p>
        <h1 className="font-editorial text-[clamp(1.9rem,4vw,3rem)] leading-tight text-ink">
          Namen spielerisch finden
        </h1>
        <p className="mt-3 text-ink-soft text-[0.95rem]">
          Manchmal entscheidet das Bauchgefühl. Ein paar kleine Spiele helfen dabei.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-10 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-1.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-blue text-ink font-medium'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active game */}
      <div className="bg-surface border border-line p-5 sm:p-10 min-h-[500px]">
        {activeTab === 'swipe' && <SwipeGame />}
        {activeTab === 'battle' && <NameBattle />}
        {activeTab === 'challenge' && <SpeedChallenge />}
        {activeTab === 'generator' && <NameGenerator />}
      </div>
    </div>
  );
}

export default function SpielePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-16 text-center text-ink-soft">
          Lade Spiele …
        </div>
      }
    >
      <SpieleContent />
    </Suspense>
  );
}