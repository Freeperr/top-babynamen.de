export type Gender = 'girl' | 'boy' | 'unisex';

export type TrendDirection = 'up' | 'down' | 'neutral' | 'new' | 'comeback';

export type NameStyle = 'modern' | 'classic' | 'rare' | 'international' | 'short' | 'timeless';

export interface PopularityHistoryPoint {
  year: number;
  rank: number;
}

export interface CompatiblePair {
  name: string;
  relation: 'Geschwister' | 'Zweitname';
}

export interface BabyName {
  id: string; // url slug, e.g. "emma"
  name: string;
  gender: Gender;
  origin: string; // e.g. "Germanisch", "Nordisch", "Hebräisch"
  meaning: string; // e.g. "Die Allumfassende, die Große"
  popularityRank: number; // 1 to 100+
  trendPercentage: number; // e.g. +12, -4, 0
  trendDirection: TrendDirection;
  weeklyChange?: string; // e.g. "+12%", "-3%", "→"
  length: number;
  syllables: number;
  firstLetter: string;
  styles: NameStyle[];
  tags: string[];
  description: string;
  similarNames: string[]; // slugs or names e.g. ["emilia", "ella", "mia"]
  compatiblePairs: CompatiblePair[];
  popularityHistory: PopularityHistoryPoint[];
  pronunciation?: string; // e.g. "[ˈʔɛma]"
  funFact?: string;
  famousNamesakes?: string[];
}

export interface NameFilters {
  query?: string;
  gender?: Gender | 'all';
  firstLetter?: string;
  minLength?: number;
  maxLength?: number;
  lengthCategory?: 'all' | 'short' | 'medium' | 'long'; // short: <=4, medium: 5-6, long: >=7
  origin?: string;
  style?: string;
  isRare?: boolean;
  sortBy?: 'popularity' | 'alphabetical' | 'trend' | 'length';
}
