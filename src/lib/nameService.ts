import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName, Gender, NameFilters, NameStyle } from '@/types/name';

export function getAllNames(): BabyName[] {
  return [...ALL_NAMES];
}

export function getNameById(id: string): BabyName | undefined {
  const cleanId = id.toLowerCase().trim();
  return ALL_NAMES.find(
    (n) => n.id.toLowerCase() === cleanId || n.name.toLowerCase() === cleanId
  );
}

export function getTopNames(limit = 10, gender?: Gender): BabyName[] {
  let list = [...ALL_NAMES];
  if (gender) {
    list = list.filter((n) => n.gender === gender || n.gender === 'unisex');
  }
  return list.sort((a, b) => a.popularityRank - b.popularityRank).slice(0, limit);
}

export function getTrendingNames(category: 'rising' | 'falling' | 'new' | 'comeback'): BabyName[] {
  switch (category) {
    case 'rising':
      return ALL_NAMES.filter((n) => n.trendDirection === 'up' && n.trendPercentage >= 10).sort(
        (a, b) => b.trendPercentage - a.trendPercentage
      );
    case 'falling':
      return ALL_NAMES.filter((n) => n.trendDirection === 'down' || n.trendPercentage <= 0).sort(
        (a, b) => a.trendPercentage - b.trendPercentage
      );
    case 'new':
      return ALL_NAMES.filter((n) => n.trendDirection === 'new' || n.styles.includes('rare')).slice(0, 6);
    case 'comeback':
      return ALL_NAMES.filter((n) => n.trendDirection === 'comeback' || n.tags.includes('Comeback')).slice(0, 6);
    default:
      return ALL_NAMES.slice(0, 6);
  }
}

export function getRareNames(limit = 6): BabyName[] {
  return ALL_NAMES.filter((n) => n.styles.includes('rare') || n.popularityRank > 50).slice(0, limit);
}

export function getSimilarNames(nameId: string): BabyName[] {
  const current = getNameById(nameId);
  if (!current) return [];

  return ALL_NAMES.filter(
    (n) =>
      n.id !== current.id &&
      (current.similarNames.includes(n.id) ||
        (n.gender === current.gender && Math.abs(n.length - current.length) <= 1) ||
        n.origin === current.origin)
  ).slice(0, 4);
}

export function getRandomNames(count = 2, gender?: Gender | 'all'): BabyName[] {
  let pool = [...ALL_NAMES];
  if (gender && gender !== 'all') {
    pool = pool.filter((n) => n.gender === gender || n.gender === 'unisex');
  }
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function filterNames(filters: NameFilters): BabyName[] {
  let result = [...ALL_NAMES];

  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    result = result.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.origin.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.gender && filters.gender !== 'all') {
    result = result.filter((n) => n.gender === filters.gender || n.gender === 'unisex');
  }

  if (filters.firstLetter && filters.firstLetter !== 'all') {
    const letter = filters.firstLetter.toUpperCase();
    result = result.filter((n) => n.firstLetter.toUpperCase() === letter);
  }

  if (filters.lengthCategory && filters.lengthCategory !== 'all') {
    if (filters.lengthCategory === 'short') {
      result = result.filter((n) => n.length <= 4);
    } else if (filters.lengthCategory === 'medium') {
      result = result.filter((n) => n.length >= 5 && n.length <= 6);
    } else if (filters.lengthCategory === 'long') {
      result = result.filter((n) => n.length >= 7);
    }
  }

  if (filters.origin && filters.origin !== 'all') {
    result = result.filter((n) => n.origin.toLowerCase().includes(filters.origin!.toLowerCase()));
  }

  if (filters.style && filters.style !== 'all') {
    result = result.filter(
      (n) =>
        n.styles.includes(filters.style as NameStyle) ||
        n.tags.some((t) => t.toLowerCase() === filters.style!.toLowerCase())
    );
  }

  if (filters.isRare) {
    result = result.filter((n) => n.styles.includes('rare') || n.popularityRank > 50);
  }

  // Sort
  if (filters.sortBy === 'alphabetical') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sortBy === 'trend') {
    result.sort((a, b) => b.trendPercentage - a.trendPercentage);
  } else if (filters.sortBy === 'length') {
    result.sort((a, b) => a.length - b.length);
  } else {
    // default popularity
    result.sort((a, b) => a.popularityRank - b.popularityRank);
  }

  return result;
}
