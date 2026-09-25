import { ALL_NAMES } from '@/data/namesExtended';
import type { BabyName, Gender } from '@/types/name';

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) result = Math.imul(result ^ character.charCodeAt(0), 16777619);
  return result >>> 0;
}

export const catalogVersion = hash(ALL_NAMES.map((name) => `${name.id}:${name.name}:${name.gender}`).join('|')).toString(16);

// A changing shortlist keeps prompts small while allowing variety across days.
export function getAiNameCatalog(seed: string, gender: Gender | 'all' = 'all'): BabyName[] {
  return ALL_NAMES.filter((name) => gender === 'all' || name.gender === gender || name.gender === 'unisex')
    .map((name) => ({ name, order: hash(`${name.id}:${seed}`) }))
    .sort((a, b) => a.order - b.order)
    .slice(0, 100)
    .map(({ name }) => name);
}

export function catalogPrompt(names: BabyName[]): string {
  return JSON.stringify(names.map(({ id, name, gender }) => ({ id, name, gender })));
}

export function resolveCatalogName(value: unknown, catalog: BabyName[] = ALL_NAMES): BabyName | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const entry = value as Record<string, unknown>;
  if (typeof entry.id === 'string') return catalog.find((name) => name.id === entry.id);
  if (typeof entry.name !== 'string') return undefined;
  const normalized = entry.name.trim().normalize('NFC').toLowerCase();
  return catalog.find((name) => name.name.normalize('NFC').toLowerCase() === normalized);
}
