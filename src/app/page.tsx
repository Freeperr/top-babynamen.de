import React from 'react';
import Hero from '@/components/Hero';
import TopNamesSection from '@/components/TopNamesSection';
import CuratedInspirationSection from '@/components/CuratedInspirationSection';
import NameDiscoveryWizard from '@/components/NameDiscoveryWizard';
import GamesTeaser from '@/components/GamesTeaser';
import AdSense from '@/components/AdSense';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Ruhiger, fokussierter Hero */}
      <Hero />

      <AdSense
        slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_HOME || ''}
        className="mx-auto min-h-[90px] max-w-3xl px-4"
      />

      {/* 2. Top-Namen der Woche (Kompakte 5 Einträge, viel Weißraum) */}
      <TopNamesSection />

      {/* 3. Kuratierte Entdeckungen & Schätze (4 Karten mit ruhigen Reitern) */}
      <CuratedInspirationSection />

      {/* 4. Geführter Namensfinder (Entspannt & interaktiv) */}
      <NameDiscoveryWizard />

      {/* 5. Spielerisch zum Favoriten */}
      <GamesTeaser />
    </div>
  );
}
