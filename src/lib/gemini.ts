import { getTopNames } from '@/lib/nameService';

export interface DailyName {
  name: string;
  gender: 'girl' | 'boy' | 'unisex';
  rank: number;
  change: string;
  reason: string;
}

export interface DailyTopNames {
  date: string;
  generated: boolean;
  names: DailyName[];
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const NAMES_WANTED = 5;

let cache: { at: number; data: DailyTopNames } | null = null;

export function getLastDailyUpdateAt(): number | null {
  return cache ? cache.at : null;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildFallback(): DailyTopNames {
  const top = getTopNames(NAMES_WANTED);
  return {
    date: today(),
    generated: false,
    names: top.map((name): DailyName => ({
      name: name.name,
      gender: name.gender,
      rank: name.popularityRank,
      change: name.weeklyChange ?? '→',
      reason: `${name.origin} · ${name.meaning.split(',')[0]}`,
    })),
  };
}

function normalize(raw: unknown): DailyName[] {
  if (!raw || typeof raw !== 'object') return [];
  const list = (raw as { names?: unknown[] }).names;
  if (!Array.isArray(list)) return [];
  return list
    .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
    .slice(0, NAMES_WANTED)
    .map((x, i): DailyName => {
      const gender = String(x.gender ?? '');
      return {
        name: String(x.name ?? ''),
        gender: gender === 'girl' || gender === 'boy' ? gender : 'unisex',
        rank: Number.isFinite(Number(x.rank)) ? Number(x.rank) : i + 1,
        change: typeof x.change === 'string' ? x.change : '→',
        reason: typeof x.reason === 'string' ? x.reason : '',
      };
    })
    .filter((x) => x.name.length > 0);
}

async function fetchFromGemini(): Promise<DailyName[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `Heute ist ${today()}. Du bist der tägliche Namens-Redakteur der Website "top-babynamen.de" für deutsche Babynamen.

Wähle die ${NAMES_WANTED} besten Babynamen für diesen Tag aus dem deutschsprachigen Raum. Mische bekannte Favoriten mit interessanten Entdeckungen, achte auf Vielfalt (Mädchen und Jungen, kurze und lange Namen), aktuelle Trends und eine positive Bedeutung.

Antworte NUR mit einem gültigen JSON-Objekt und ohne weitere Erklärung. Format:
{"names":[{"name":"Lina","gender":"girl","rank":1,"change":"+6%","reason":"in einem kurzen deutschen Satz, warum dieser Name heute passt"}]}

Verwende echte, verbreitete deutschsprachige Vornamen.
- gender: nur "girl", "boy" oder "unisex"
- rank: die Platzierung von 1 bis ${NAMES_WANTED}
- change: Trend als Prozentwert mit Vorzeichen (z. B. "+6%" oder "-2%")`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    }),
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const body = await res.json();
  const text = body?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== 'string') return null;

  const jsonText = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/g, '')
    .trim();
  const parsed = JSON.parse(jsonText);
  return normalize(parsed);
}

export async function getDailyTopNames(): Promise<DailyTopNames> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }

  const fallback = buildFallback();
  const ai = await fetchFromGemini().catch(() => null);

  let names = ai && ai.length > 0 ? [...ai] : [];
  for (const f of fallback.names) {
    if (names.length >= NAMES_WANTED) break;
    if (!names.some((n) => n.name.toLowerCase() === f.name.toLowerCase())) {
      names.push(f);
    }
  }
  if (names.length === 0) names = fallback.names;

  const data: DailyTopNames = {
    date: today(),
    generated: ai !== null && ai.length > 0,
    names: names.slice(0, NAMES_WANTED),
  };

  cache = { at: now, data };
  return data;
}