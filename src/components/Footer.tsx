'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative border-t border-line mt-16">
      <Link
        href="https://fynnpetersen.de"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:inline-flex absolute bottom-6 right-6 items-center opacity-80 hover:opacity-100 transition-opacity"
      >
        <Image
          src="/fynnpetersen-logo.png"
          alt="Fynn Petersen"
          width={44}
          height={44}
          className="h-11 w-auto"
        />
      </Link>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-editorial text-xl text-ink">
              babynamen              <span className="font-caveat text-blue font-bold text-[1.15em]">.me</span>
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
            <Link href="/beliebte-namen-weltweit" className="hover:text-ink transition-colors">
              Weltweit
            </Link>
            <Link href="/favoriten" className="hover:text-ink transition-colors">
              Favoriten
            </Link>
            <Link href="/datenschutz" className="hover:text-ink transition-colors">
              Datenschutz
            </Link>
            <Link href="/impressum" className="hover:text-ink transition-colors">
              Impressum
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-cookie-consent'))}
              className="hover:text-ink transition-colors"
            >
              Einwilligung verwalten
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-5 border-t border-line/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fade">
          <p>
            © {new Date().getFullYear()} babynamen.me
          </p>
          <Link
            href="https://fynnpetersen.de"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden inline-flex items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/fynnpetersen-logo.png"
              alt="Fynn Petersen"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}