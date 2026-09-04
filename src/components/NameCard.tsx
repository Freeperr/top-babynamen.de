'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';
import { BabyName } from '@/types/name';
import { useFavorites } from '@/context/FavoritesContext';

interface NameCardProps {
  name: BabyName;
  rankBadge?: number;
  showTrend?: boolean;
}

export default function NameCard({ name, rankBadge, showTrend }: NameCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(name.id);

  const getGenderLabel = () => {
    switch (name.gender) {
      case 'girl':
        return 'Mädchen';
      case 'boy':
        return 'Junge';
      default:
        return 'Unisex';
    }
  };

  return (
    <div className="group relative bg-white p-6 rounded-2xl border border-[#EFE8EA] hover:border-[#FFD6E3] hover:shadow-xs transition-all flex flex-col justify-between h-full">
      <div>
        {/* Top meta row: clean editorial text without bubble pills */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="text-xs text-[#888888] flex items-center gap-1.5 flex-wrap">
            {rankBadge !== undefined && (
              <span className="font-mono font-semibold text-[#171717] mr-0.5">
                #{rankBadge}
              </span>
            )}
            <span className="font-medium text-[#FF4F87]">
              {getGenderLabel()}
            </span>
            <span>·</span>
            <span>{name.origin}</span>
            <span>·</span>
            <span>{name.length} Bst.</span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(name, e);
            }}
            className="p-1.5 text-[#888888] hover:text-[#FF4F87] transition-colors"
            aria-label={favorited ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                favorited ? 'fill-[#FF4F87] text-[#FF4F87] scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Name Title with soft editorial serif font */}
        <Link href={`/name/${name.id}`} className="block">
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#171717] group-hover:text-[#FF4F87] transition-colors tracking-tight">
              {name.name}
            </h3>
            {showTrend && name.weeklyChange && (
              <span
                className={`text-xs font-medium ${
                  name.trendDirection === 'up'
                    ? 'text-emerald-700'
                    : name.trendDirection === 'down'
                    ? 'text-amber-700'
                    : 'text-[#888888]'
                }`}
              >
                {name.weeklyChange}
              </span>
            )}
          </div>
        </Link>

        {/* Meaning */}
        <p className="text-sm text-[#171717]/80 line-clamp-2 leading-relaxed mb-4">
          &bdquo;{name.meaning}&ldquo;
        </p>
      </div>

      {/* Bottom row: Clean text tags without bubble pills */}
      <div className="pt-3 border-t border-[#F2EBED] flex items-center justify-between gap-2 mt-auto text-xs">
        <div className="text-[#888888] truncate">
          {name.tags.slice(0, 2).join(' · ')}
        </div>

        <Link
          href={`/name/${name.id}`}
          className="font-medium text-[#171717] group-hover:text-[#FF4F87] flex items-center gap-0.5 shrink-0 transition-colors"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
