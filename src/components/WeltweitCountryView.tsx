'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WorldCountry } from '@/data/worldNames';
import { fadeUp, staggerContainer } from '@/lib/motion';

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 ${
        isTop3 ? 'bg-gold/15 text-gold' : 'bg-panel text-fade'
      }`}
    >
      {rank}
    </span>
  );
}

export default function WeltweitCountryView({ country }: { country: WorldCountry }) {
  const availableYears = Object.keys(country.years)
    .map(Number)
    .sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  const yearData = country.years[selectedYear];

  return (
    <>
      {/* Year tabs */}
      {availableYears.length > 1 && (
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedYear === year
                  ? 'bg-ink text-paper'
                  : 'bg-surface text-ink-soft border border-line hover:border-ink/30 hover:text-ink'
              }`}
            >
              {year}
            </button>
          ))}
        </motion.div>
      )}

      {/* Tables */}
      {yearData && (
        <motion.div
          key={selectedYear}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Girls */}
          <motion.section variants={fadeUp}>
            <div className="bg-surface rounded-xl border border-line overflow-hidden">
              <div className="px-5 py-3.5 border-b border-line bg-blue-pale/50">
                <h2 className="text-sm font-semibold text-ink">Mädchennamen</h2>
              </div>
              <ul className="divide-y divide-line/60">
                {yearData.girls.map((entry) => (
                  <li
                    key={entry.rank}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-panel/50 transition-colors"
                  >
                    <RankBadge rank={entry.rank} />
                    <Link
                      href={`/name/${entry.slug}`}
                      className="text-[0.95rem] text-ink font-medium hover:text-blue-deep hover:underline underline-offset-4 transition-colors"
                    >
                      {entry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Boys */}
          <motion.section variants={fadeUp}>
            <div className="bg-surface rounded-xl border border-line overflow-hidden">
              <div className="px-5 py-3.5 border-b border-line bg-blue-pale/50">
                <h2 className="text-sm font-semibold text-ink">Jungennamen</h2>
              </div>
              <ul className="divide-y divide-line/60">
                {yearData.boys.map((entry) => (
                  <li
                    key={entry.rank}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-panel/50 transition-colors"
                  >
                    <RankBadge rank={entry.rank} />
                    <Link
                      href={`/name/${entry.slug}`}
                      className="text-[0.95rem] text-ink font-medium hover:text-blue-deep hover:underline underline-offset-4 transition-colors"
                    >
                      {entry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        </motion.div>
      )}
    </>
  );
}
