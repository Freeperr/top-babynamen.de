'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Search, Menu, X } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beliebte Namen', href: '/' },
    { name: 'Namen finden', href: '/babynamen' },
    { name: 'Mädchennamen', href: '/maedchennamen' },
    { name: 'Jungennamen', href: '/jungennamen' },
    { name: 'Namensspiele', href: '/spiele' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-paper/95 border-b border-line'
            : 'bg-paper'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Wordmark */}
          <Link href="/" className="shrink-0 whitespace-nowrap">
            <span className="font-editorial text-[1.25rem] text-ink leading-none">
              babynamen
              <span className="font-caveat text-blue text-[1.15rem] font-bold">.me</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors py-1 border-b-2 ${
                  isActive(link.href)
                    ? 'text-ink border-blue font-medium'
                    : 'text-ink-soft border-transparent hover:text-ink'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-ink-soft hover:text-ink transition-colors"
              title="Suche öffnen (Ctrl/⌘ + K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Suchen</span>
            </button>

            <Link
              href="/favoriten"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isActive('/favoriten')
                  ? 'text-blue-deep'
                  : 'text-ink-soft hover:text-ink'
              }`}
              aria-label="Favoriten ansehen"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-blue text-blue' : ''}`} />
              {favoritesCount > 0 && (
                <span className="text-xs text-fade">{favoritesCount}</span>
              )}
              <span className="hidden sm:inline">Favoriten</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -mr-1 rounded-lg text-ink-soft hover:text-ink hover:bg-panel transition-colors"
              aria-label="Menü umschalten"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-line bg-paper">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 text-base border-b border-line/60 ${
                    i === navLinks.length - 1 ? 'border-b-0' : ''
                  } ${
                    isActive(link.href)
                      ? 'text-blue-deep font-medium'
                      : 'text-ink hover:text-ink-soft'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/favoriten"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-base text-ink hover:text-ink-soft flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-blue text-blue' : ''}`} />
                Favoriten
                {favoritesCount > 0 && (
                  <span className="text-xs text-fade">{favoritesCount}</span>
                )}
              </Link>
            </div>
          </nav>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}