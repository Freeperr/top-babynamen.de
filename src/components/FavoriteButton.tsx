'use client';

import React from 'react';
import { BabyName } from '@/types/name';

interface FavoriteButtonProps {
  name: BabyName;
  favorited: boolean;
  onToggle: (e: React.MouseEvent) => void;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
}

export default function FavoriteButton({
  name,
  favorited,
  onToggle,
  tone = 'light',
  size = 'md',
  className = '',
}: FavoriteButtonProps) {
  const box = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';

  const stateClass =
    tone === 'dark'
      ? favorited
        ? 'bg-white/25 border-white/40 text-white'
        : 'border-white/30 text-white/85 hover:text-white hover:bg-white/15'
      : favorited
        ? 'bg-blue-soft border-line-strong text-blue-deep'
        : 'border-transparent text-fade hover:text-blue-deep hover:bg-blue-soft';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`shrink-0 flex items-center justify-center ${box} rounded-full border transition-colors active:scale-90 ${stateClass} ${className}`}
      aria-label={
        favorited
          ? `${name.name} von Favoriten entfernen`
          : `${name.name} zu Favoriten hinzufügen`
      }
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-4 h-4 ${favorited ? 'fill-current text-current' : 'fill-none text-current'}`}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}