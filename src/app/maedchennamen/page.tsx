'use client';

import React, { Suspense } from 'react';
import NameDirectory from '@/components/NameDirectory';

function MaedchennamenContent() {
  return (
    <NameDirectory
      title="Die schönsten Mädchennamen"
      description="Sanft, melodisch und voller Bedeutung: beliebte Klassiker wie Emma und Emilia oder besondere Tipps wie Elara und Juno."
      fixedGender="girl"
    />
  );
}

export default function MaedchennamenPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-6 py-16 text-center text-ink-soft">
          Lade Mädchennamen …
        </div>
      }
    >
      <MaedchennamenContent />
    </Suspense>
  );
}