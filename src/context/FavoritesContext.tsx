'use client';

import React, { createContext, useContext, useState } from 'react';
import { BabyName } from '@/types/name';
import { ALL_NAMES } from '@/data/namesExtended';
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
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<{ text: string; action: 'add' | 'remove' } | null>(null);

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

  const toggleFavorite = (name: BabyName) => {
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

  const favorites = ALL_NAMES.filter((name) => favoriteIds.includes(name.id.toLowerCase()));

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

      {toastMessage && (
        <div className="rise fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface px-5 py-3 rounded-xl border border-line shadow-sm" role="status">
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-full ${
              toastMessage.action === 'add'
                ? 'bg-blue-soft text-blue-deep'
                : 'bg-panel text-fade'
            }`}
          >
            {toastMessage.action === 'add' ? (
              <Heart className="w-3.5 h-3.5 fill-current" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
          </span>
          <span className="text-sm text-ink">{toastMessage.text}</span>
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