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
  funFact?: string;
  pronunciation?: string;
  famous?: string[];
  pairs?: CompatiblePair[];
}

function vowelGroupCount(s: string): number {
  const groups = s.toLowerCase().match(/[aeiouäöü]+/g) || [];
  return groups.length;
}

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

export function makeSeed(seed: NameSeed): BabyName {
  const name = seed.name;
  const firstLetter = name.charAt(0).toUpperCase();
  const syllables = Math.max(1, vowelGroupCount(name));

  const hash = (seed.rank * 2654435761) % 97;

  // ------------------------------------------------------------------
  // 1) Trend direction is either explicitly given or derived.
  //    The sign of trendPercentage ALWAYS matches the direction, so
  //    weeklyChange, trendPercentage and trendDirection can never
  //    contradict each other.
  // ------------------------------------------------------------------
  let trend = seed.trendDirection;
  let trendPercentage: number;

  if (!trend) {
    const h = hash % 5;
    if (h === 0) {
      trend = 'new';
      trendPercentage = 8 + (hash % 8);
    } else if (h === 1) {
      trend = 'down';
      trendPercentage = -(3 + (hash % 8));
    } else if (h === 2) {
      trend = 'neutral';
      trendPercentage = 0;
    } else {
      trend = 'up';
      trendPercentage = 2 + (hash % 10);
    }
  } else if (trend === 'down') {
    trendPercentage = -(3 + (hash % 8));
  } else if (trend === 'neutral') {
    trendPercentage = 0;
  } else {
    // 'up', 'new' and 'comeback' are all positive trends
    trendPercentage = 2 + (hash % 10);
  }

  const weeklyChange =
    trendPercentage === 0 ? '→' : `${trendPercentage > 0 ? '+' : ''}${trendPercentage}%`;

  // ------------------------------------------------------------------
  // 2) History is built towards seed.rank (the most recent year).
  //    'up'/'new'/'comeback'  -> rank shrinks over the years (rising)
  //    'down'                 -> rank grows over the years (falling)
  //    'neutral'              -> history hovers around seed.rank
  // ------------------------------------------------------------------
  let startRank = seed.rank;
  if (trend === 'down') {
    startRank = Math.max(1, seed.rank - 8 - (hash % 12));
  } else if (trend === 'neutral') {
    startRank = Math.max(1, seed.rank + ((hash % 5) - 2));
  } else {
    startRank = seed.rank + 8 + (hash % 12);
  }

  const popularityHistory = YEARS.map((year, i) => {
    const t = i / (YEARS.length - 1);
    const wobble = ((hash + i * 3) % 5) - 2;
    const rank = Math.max(1, Math.round(startRank + (seed.rank - startRank) * t) - wobble);
    return { year, rank };
  });

  return {
    id: seed.id,
    name,
    gender: seed.gender,
    origin: seed.origin,
    meaning: seed.meaning,
    popularityRank: seed.rank,
    trendPercentage,
    trendDirection: trend,
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