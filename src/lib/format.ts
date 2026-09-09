import type { Gender } from '@/types/name';

export function genderLabel(gender: Gender): string {
  return gender === 'girl' ? 'Mädchen' : gender === 'boy' ? 'Junge' : 'Unisex';
}

export function genderNoun(gender: Gender): string {
  return gender === 'girl'
    ? 'Mädchenname'
    : gender === 'boy'
      ? 'Jungenname'
      : 'Unisex-Name';
}

// "Nordisch" → "dem Nordischen", "Hebräisch" → "dem Hebräischen",
// "Sanskrit" → "dem Sanskrit"
function dativeOrigin(part: string): string {
  const p = part.trim();
  if (p.endsWith('sch')) return `dem ${p}en`;
  return `dem ${p}`;
}

// "Mädchenname aus dem Hebräischen oder Skandinavischen"
export function originPhrase(origin: string | null | undefined, gender: Gender): string {
  const parts = (origin ?? '')
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 0) return genderNoun(gender);

  const demParts = parts.map(dativeOrigin);
  if (demParts.length === 1) return `${genderNoun(gender)} aus ${demParts[0]}`;

  const beforeLast = demParts.slice(0, -1).join(', ');
  return `${genderNoun(gender)} aus ${beforeLast} oder ${demParts[demParts.length - 1]}`;
}