'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#FFD6E3]/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] group-hover:scale-105 transition-transform shadow-2xs">
                <Heart className="w-4 h-4 fill-[#FF4F87] text-[#FF4F87]" />
              </div>
              <span className="text-lg font-bold text-[#171717] tracking-tight">
                top-babynamen<span className="text-[#FF4F87]">.de</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-[#171717] mb-1">
              Finde einen Namen, der bleibt.
            </p>
            <p className="text-xs text-[#777777] leading-relaxed">
              Die moderne, spielerische Baby-Namen-Plattform für inspirierte Eltern.
            </p>
          </div>

          {/* Navigation Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF4F87] mb-4">
              Namen entdecken
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/babynamen" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Alle Babynamen
                </Link>
              </li>
              <li>
                <Link href="/maedchennamen" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Mädchennamen
                </Link>
              </li>
              <li>
                <Link href="/jungennamen" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Jungennamen
                </Link>
              </li>
              <li>
                <Link href="/babynamen?gender=unisex" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Unisex-Namen
                </Link>
              </li>
              <li>
                <Link href="/babynamen?style=rare" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Seltene Babynamen
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF4F87] mb-4">
              Interaktive Spiele
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/spiele?tab=swipe" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Swipe deinen Favoriten
                </Link>
              </li>
              <li>
                <Link href="/spiele?tab=battle" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Name Battle Duell
                </Link>
              </li>
              <li>
                <Link href="/spiele?tab=roulette" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Name Roulette
                </Link>
              </li>
              <li>
                <Link href="/spiele?tab=challenge" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  10-Sekunden-Challenge
                </Link>
              </li>
              <li>
                <Link href="/spiele?tab=generator" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Namensgenerator
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF4F87] mb-4">
              Mein Bereich & Rechtliches
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/favoriten" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Meine Favoriten
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Über uns & Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-[#777777] hover:text-[#FF4F87] transition-colors">
                  Datenschutzerklärung
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F2E3E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
          <p>© {new Date().getFullYear()} top-babynamen.de – Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-1.5">
            Gestaltet mit <Heart className="w-3.5 h-3.5 fill-[#FF4F87] text-[#FF4F87]" /> für junge Familien in Deutschland, Österreich und der Schweiz.
          </p>
        </div>
      </div>
    </footer>
  );
}
