'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Heart } from 'lucide-react';
import Link from 'next/link';
import { fadeUp, staggerContainer } from '@/lib/motion';

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
      <motion.div
        className="max-w-2xl mx-auto px-4 sm:px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="eyebrow mb-4" variants={fadeUp}>
          Namen zum Stöbern
        </motion.p>

        <motion.h1
          className="font-editorial text-[2rem] leading-[1.15] sm:text-5xl text-ink"
          variants={fadeUp}
        >
          Finde einen Namen, der <em className="text-accent italic">passt.</em>
        </motion.h1>

        <motion.p
          className="font-hand text-xl sm:text-2xl text-accent mt-1.5"
          variants={fadeUp}
        >
          – ganz gleich, ob klassisch oder besonders.
        </motion.p>

        <motion.p
          className="mt-4 text-ink-soft max-w-md mx-auto text-[0.95rem]"
          variants={fadeUp}
        >
          Entdecke beliebte Namen, zeitlose Klassiker und besondere Namen, die
          man nicht jeden Tag hört.
        </motion.p>

        {/* Suche */}
        <motion.form
          onSubmit={handleSearchSubmit}
          className="mt-8 flex items-stretch gap-2 max-w-md mx-auto"
          role="search"
          variants={fadeUp}
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
        </motion.form>

        <motion.p
          className="mt-6 text-sm text-fade flex items-center justify-center gap-x-2 gap-y-1 flex-wrap"
          variants={fadeUp}
        >
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
        </motion.p>
      </motion.div>
    </section>
  );
}