'use client';

import React, { Suspense } from 'react';
import NameDirectory from '@/components/NameDirectory';

function BabynamenContent() {
  return (
    <NameDirectory
      title="Alle Babynamen"
      description="Beliebte, klassische und seltene Namen durchstöbern – nach Herkunft, Anfangsbuchstabe, Länge und Klang."
    />
  );
}

export default function BabynamenPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-6 py-16 text-center text-ink-soft">
          Lade Namensübersicht …
        </div>
      }
    >
      <BabynamenContent />
    </Suspense>
  );
}