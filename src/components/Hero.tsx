'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
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
    <section className="pt-14 sm:pt-20 pb-10 sm:pb-12">
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-editorial text-[2.4rem] leading-[1.12] sm:text-6xl text-ink"
          variants={fadeUp}
        >
          Finde einen Namen,
          <br />
          der zu euch gehört.
        </motion.h1>

        <motion.p
          className="mt-5 text-ink-soft max-w-xl text-[1rem]"
          variants={fadeUp}
        >
          Beliebte Namen, zeitlose Klassiker und seltene Entdeckungen – mit
          Herkunft, Bedeutung und ein wenig Zeit zum Stöbern.
        </motion.p>

        {/* Suche */}
        <motion.form
          onSubmit={handleSearchSubmit}
          className="mt-8 flex items-stretch gap-2 max-w-xl"
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

        <motion.nav
          className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2"
          aria-label="Namenslisten"
          variants={fadeUp}
        >
          <Link
            href="/maedchennamen"
            className="text-sm text-fade hover:text-ink transition-colors underline underline-offset-[6px] decoration-line-strong hover:decoration-blue"
          >
            Mädchennamen
          </Link>
          <Link
            href="/jungennamen"
            className="text-sm text-fade hover:text-ink transition-colors underline underline-offset-[6px] decoration-line-strong hover:decoration-blue"
          >
            Jungennamen
          </Link>
          <Link
            href="/babynamen"
            className="text-sm text-fade hover:text-ink transition-colors underline underline-offset-[6px] decoration-line-strong hover:decoration-blue"
          >
            Alle Namen
          </Link>
        </motion.nav>
      </motion.div>
    </section>
  );
}