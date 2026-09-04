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
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Startseite', href: '/' },
    { name: 'Babynamen', href: '/babynamen' },
    { name: 'Mädchennamen', href: '/maedchennamen' },
    { name: 'Jungennamen', href: '/jungennamen' },
    { name: 'Namensspiele', href: '/spiele' },
    { name: 'Favoriten', href: '/favoriten', count: favoritesCount },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3.5 shadow-[0_2px_14px_rgba(23,23,23,0.03)]'
            : 'bg-white/95 py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87] transition-transform">
              <Heart className="w-3.5 h-3.5 fill-[#FF4F87] text-[#FF4F87]" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#171717]">
              top-babynamen<span className="text-[#FF4F87]">.de</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#FF4F87] bg-[#FFF5F8]'
                      : 'text-[#777777] hover:text-[#171717] hover:bg-[#FFF5F8]/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.name}
                    {typeof link.count === 'number' && link.count > 0 && (
                      <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-[#FF4F87] text-white rounded-full">
                        {link.count}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs text-[#777777] bg-[#FFF5F8] border border-[#F0E4E7] hover:border-[#FFD6E3] hover:text-[#171717] transition-all"
              title="Suche öffnen"
            >
              <Search className="w-3.5 h-3.5 text-[#FF6F9F]" />
              <span>Suchen</span>
            </button>

            <Link
              href="/babynamen"
              className="btn-primary px-5 py-2 text-xs sm:text-sm font-medium"
            >
              Namen entdecken
            </Link>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-[#777777] hover:text-[#FF4F87] bg-[#FFF5F8] border border-[#F0E4E7] transition-colors"
              aria-label="Suche öffnen"
            >
              <Search className="w-4 h-4 text-[#FF6F9F]" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-[#171717] bg-[#FFF5F8] border border-[#F0E4E7] hover:bg-[#FFD6E3]/40 transition-colors"
              aria-label="Menü umschalten"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-[#FF4F87]" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#F0E4E7] bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#FFF5F8] text-[#FF4F87]'
                        : 'text-[#171717] hover:bg-[#FFF5F8]/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    {typeof link.count === 'number' && link.count > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-[#FF4F87] text-white rounded-full">
                        {link.count}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-3">
                <Link
                  href="/babynamen"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 text-center text-sm font-medium"
                >
                  Namen entdecken
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
