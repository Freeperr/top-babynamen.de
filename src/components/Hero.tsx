'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Heart } from 'lucide-react';
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
    <section className="pt-12 sm:pt-16 pb-10 sm:pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="eyebrow mb-4">Namen zum Stöbern</p>

        <h1 className="font-editorial text-[2rem] leading-[1.15] sm:text-5xl text-ink">
          Ein Name, der sich{' '}
          <em className="text-accent italic">richtig anfühlt.</em>
        </h1>

        <p className="font-hand text-xl sm:text-2xl text-accent mt-1.5">
          – ganz gleich, ob klassisch oder besonders.
        </p>

        <p className="mt-4 text-ink-soft max-w-md mx-auto text-[0.95rem]">
          Beliebte Namen, schöne Klassiker und besondere Entdeckungen –
          ganz einfach zum Durchstöbern.
        </p>

        {/* Suche */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 flex items-stretch gap-2 max-w-md mx-auto"
          role="search"
        >
          <label className="sr-only" htmlFor="hero-search">
            Namen suchen
          </label>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-fade absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="hero-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nach einem Namen suchen …"
              className="input pl-10"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-primary px-5">
            Suchen
          </button>
        </form>

        <p className="mt-6 text-sm text-fade flex items-center justify-center gap-x-2 gap-y-1 flex-wrap">
          <Link href="/maedchennamen" className="hover:text-ink transition-colors">
            Mädchennamen
          </Link>
          <Heart className="w-3 h-3 text-accent fill-accent" aria-hidden="true" />
          <Link href="/jungennamen" className="hover:text-ink transition-colors">
            Jungennamen
          </Link>
          <Heart className="w-3 h-3 text-accent fill-accent" aria-hidden="true" />
          <Link href="/babynamen" className="hover:text-ink transition-colors">
            Alle Namen
          </Link>
        </p>
      </div>
    </section>
  );
}