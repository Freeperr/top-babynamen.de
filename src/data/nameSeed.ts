import { BabyName, Gender, NameStyle, TrendDirection } from '@/types/name';

export interface CompatiblePair {
  name: string;
  relation: 'Geschwister' | 'Zweitname';
}

export interface NameSeed {
  id: string;
  name: string;
  gender: Gender;
  origin: string;
  meaning: string;
  description: string;
  rank: number;
  styles: NameStyle[];
  tags: string[];
  similar: string[];
  trendDirection?: TrendDirection;
  trendPercentage?: number;
  funFact?: string;
  pronunciation?: string;
  famous?: string[];
  pairs?: CompatiblePair[];
}

function vowelGroupCount(s: string): number {
  const groups = s.toLowerCase().match(/[aeiouäöü]+/g) || [];
  return groups.length;
}

export function makeSeed(seed: NameSeed): BabyName {
  const name = seed.name;
  const firstLetter = name.charAt(0).toUpperCase();
  const syllables = Math.max(1, vowelGroupCount(name));

  const hash = (seed.rank * 2654435761) % 97;

  let trend: TrendDirection = 'neutral';
  let trendPercentage = 2;
  if (hash % 11 === 0) {
    trend = 'new';
    trendPercentage = 8 + (hash % 6);
  } else if (seed.rank > 130) {
    trend = 'down';
    trendPercentage = -(2 + (hash % 5));
  } else if (seed.rank <= 35 || hash % 3 === 0) {
    trend = 'up';
    trendPercentage = 3 + (hash % 9);
  } else {
    trend = 'neutral';
    trendPercentage = 0;
  }

  const popularityHistory = [2018, 2019, 2020, 2021, 2022, 2023, 2024].map(
    (year, i) => {
      const drift = Math.round(((seed.rank + i * 7) % 9) - 4);
      return { year, rank: Math.max(1, seed.rank + drift) };
    }
  );

  const weeklyChange = `${trendPercentage >= 0 ? '+' : ''}${trendPercentage}%`;

  return {
    id: seed.id,
    name,
    gender: seed.gender,
    origin: seed.origin,
    meaning: seed.meaning,
    popularityRank: seed.rank,
    trendPercentage,
    trendDirection: seed.trendDirection ?? trend,
    weeklyChange,
    length: name.length,
    syllables,
    firstLetter,
    styles: seed.styles,
    tags: seed.tags,
    description: seed.description,
    similarNames: seed.similar,
    compatiblePairs: seed.pairs ?? [],
    popularityHistory,
    pronunciation: seed.pronunciation,
    funFact: seed.funFact,
    famousNamesakes: seed.famous,
  };
}