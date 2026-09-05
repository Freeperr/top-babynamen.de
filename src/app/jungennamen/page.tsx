'use client';

import React, { Suspense } from 'react';
import NameDirectory from '@/components/NameDirectory';

function JungennamenContent() {
  return (
    <NameDirectory
      title="Die schönsten Jungennamen"
      description="Klangvoll, charakterstark und modern: von Klassikern wie Noah und Matteo bis zu nordischen Lieblingen wie Fiete, Mats und Theo."
      fixedGender="boy"
    />
  );
}

export default function JungennamenPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-6 py-16 text-center text-ink-soft">
          Lade Jungennamen …
        </div>
      }
    >
      <JungennamenContent />
    </Suspense>
  );
}