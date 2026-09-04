'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/babynamen?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/babynamen');
    }
  };

  return (
    <section className="pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#171717] leading-[1.12] mb-5">
          Finde einen Namen, <br />
          <span className="font-editorial italic font-normal text-[#FF4F87]">
            den du lieben wirst.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#777777] max-w-xl mx-auto mb-9 leading-relaxed">
          Beliebte Klassiker, moderne Lieblinge und seltene Babynamen – übersichtlich und mit Ruhe kuratiert.
        </p>

        {/* Focused Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white rounded-full p-1.5 sm:p-2 border border-[#E8DDE0] shadow-[0_2px_12px_rgba(23,23,23,0.03)] focus-within:border-[#FF6F9F] focus-within:ring-3 focus-within:ring-[#FFD6E3]/30 transition-all duration-200"
          >
            <div className="pl-4 pr-2 text-[#888888] shrink-0">
              <Search className="w-4 h-4 text-[#FF6F9F]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Welchen Namen suchst du? (z.B. Emma, Noah)..."
              className="w-full bg-transparent py-2 sm:py-2.5 text-sm sm:text-base text-[#171717] placeholder:text-[#888888] focus:outline-none"
            />
            <button
              type="submit"
              className="btn-primary px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-medium shrink-0"
            >
              Suchen
            </button>
          </form>
        </div>

        {/* Clear 3 primary categories - no clutter */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
          <Link
            href="/maedchennamen"
            className="px-4 py-1.5 rounded-full bg-[#FFF5F8] border border-[#F0E4E7] text-[#171717] hover:border-[#FF6F9F] hover:text-[#FF4F87] transition-all"
          >
            Mädchennamen
          </Link>
          <Link
            href="/jungennamen"
            className="px-4 py-1.5 rounded-full bg-[#FFF5F8] border border-[#F0E4E7] text-[#171717] hover:border-[#FF6F9F] hover:text-[#FF4F87] transition-all"
          >
            Jungennamen
          </Link>
          <Link
            href="/spiele"
            className="px-4 py-1.5 rounded-full bg-[#FFF5F8] border border-[#F0E4E7] text-[#171717] hover:border-[#FF6F9F] hover:text-[#FF4F87] transition-all"
          >
            Namensspiele
          </Link>
        </div>
      </div>
    </section>
  );
}
