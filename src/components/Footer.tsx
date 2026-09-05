'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-editorial text-xl text-ink">
              Top-Babynamen<span className="text-accent">.de</span>
            </p>
            <p className="text-sm text-fade mt-1">
              Namen mit Herkunft, Bedeutung und ein wenig Zeit zum Stöbern.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
            <Link href="/babynamen" className="hover:text-ink transition-colors">
              Babynamen
            </Link>
            <Link href="/maedchennamen" className="hover:text-ink transition-colors">
              Mädchennamen
            </Link>
            <Link href="/jungennamen" className="hover:text-ink transition-colors">
              Jungennamen
            </Link>
            <Link href="/spiele" className="hover:text-ink transition-colors">
              Namensspiele
            </Link>
            <Link href="/favoriten" className="hover:text-ink transition-colors">
              Favoriten
            </Link>
            <Link href="/datenschutz" className="hover:text-ink transition-colors">
              Datenschutz
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-5 border-t border-line/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fade">
          <p className="flex items-center gap-3">
            © {new Date().getFullYear()} top-babynamen.de
            <Link
              href="/impressum"
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-line-strong text-xs text-ink-soft hover:border-accent hover:text-accent-deep transition-colors"
            >
              Impressum
            </Link>
          </p>
          <p className="flex items-center gap-1.5"></p>
        </div>
      </div>
    </footer>
  );
}