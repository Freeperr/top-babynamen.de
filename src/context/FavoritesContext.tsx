'use client';

import React, { createContext, useContext, useState } from 'react';
import { BabyName } from '@/types/name';
import { BABY_NAMES } from '@/data/names';
import confetti from 'canvas-confetti';
import { Heart, X } from 'lucide-react';

interface FavoritesContextType {
  favorites: BabyName[];
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (name: BabyName, event?: React.MouseEvent) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'top_babynamen_favorites_v1';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
        // Starter favorites for a friendly first-time experience
        const initial = ['emma', 'liam'];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      } catch (e) {
        console.warn('LocalStorage error:', e);
        return ['emma', 'liam'];
      }
    }
    return ['emma', 'liam'];
  });

  const [toastMessage, setToastMessage] = useState<{ text: string; action: 'add' | 'remove' } | null>(null);

  // Save to LocalStorage whenever favoriteIds change
  const saveFavorites = (ids: string[]) => {
    setFavoriteIds(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  const isFavorite = (id: string) => {
    return favoriteIds.includes(id.toLowerCase());
  };

  const toggleFavorite = (name: BabyName, event?: React.MouseEvent) => {
    const id = name.id.toLowerCase();
    const alreadyFavorited = favoriteIds.includes(id);

    if (alreadyFavorited) {
      const updated = favoriteIds.filter((favId) => favId !== id);
      saveFavorites(updated);
      showToast(`${name.name} aus Favoriten entfernt`, 'remove');
    } else {
      const updated = [...favoriteIds, id];
      saveFavorites(updated);
      showToast(`${name.name} zu deinen Favoriten hinzugefügt`, 'add');

      // Trigger micro particle confetti
      if (typeof window !== 'undefined') {
        const x = event ? event.clientX / window.innerWidth : 0.5;
        const y = event ? event.clientY / window.innerHeight : 0.5;

        try {
          confetti({
            particleCount: 24,
            spread: 50,
            origin: { x: Math.min(Math.max(x, 0.1), 0.9), y: Math.min(Math.max(y, 0.1), 0.9) },
            colors: ['#FF6F9F', '#FF4F87', '#FFD6E3', '#FFF5F8'],
            ticks: 120,
            gravity: 1.2,
            scalar: 0.8,
            shapes: ['circle'],
          });
        } catch {
          // ignore if canvas-confetti fails
        }
      }
    }
  };

  const clearFavorites = () => {
    saveFavorites([]);
    showToast('Alle Favoriten geleert', 'remove');
  };

  const showToast = (text: string, action: 'add' | 'remove') => {
    setToastMessage({ text, action });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const favorites = BABY_NAMES.filter((name) => favoriteIds.includes(name.id.toLowerCase()));

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        favoritesCount: favoriteIds.length,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-full shadow-[0_12px_36px_rgba(255,111,159,0.22)] border border-[#FFD6E3] transition-all animate-bounce">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              toastMessage.action === 'add' ? 'bg-[#FF6F9F] text-white' : 'bg-[#FFF5F8] text-[#777777]'
            }`}
          >
            {toastMessage.action === 'add' ? <Heart className="w-4 h-4 fill-white" /> : <X className="w-4 h-4" />}
          </div>
          <span className="text-sm font-medium text-[#171717]">{toastMessage.text}</span>
        </div>
      )}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
