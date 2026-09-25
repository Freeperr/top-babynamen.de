import { unstable_cache, revalidateTag } from 'next/cache';

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
  updatedAt?: string;
  names: DailyName[];
}

const NAMES_WANTED = 5;
const DAILY_CACHE_TAG = 'daily-ai-names-v2';
let lastDailyUpdateAt: number | null = null;

export function getLastDailyUpdateAt(): number | null {
  return lastDailyUpdateAt;
}

function today(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date());
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
        name: typeof x.name === 'string' ? x.name.trim() : '',
        gender: gender === 'girl' || gender === 'boy' ? gender : 'unisex',
        rank: Number.isFinite(Number(x.rank)) ? Number(x.rank) : i + 1,
        change: typeof x.change === 'string' ? x.change : '→',
        reason: typeof x.reason === 'string' ? x.reason : '',
      };
    })
    .filter((x) => x.name.length > 0);
}

const MODEL_CANDIDATES = ['gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];

export function modelCandidates(): string[] {
  const env = process.env.GEMINI_MODEL?.trim();
  if (!env) return MODEL_CANDIDATES;
  return Array.from(new Set([env, ...MODEL_CANDIDATES]));
}

let workingModel: string | null = null;

export interface GeminiCallResult {
  ok: boolean;
  text: string | null;
  model: string;
  status: number | null;
  error: string;
}

export async function callGemini(
  prompt: string,
  opts: { temperature?: number; responseMimeType?: string } = {}
): Promise<GeminiCallResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      text: null,
      model: modelCandidates()[0],
      status: null,
      error: 'GEMINI_API_KEY ist nicht gesetzt',
    };
  }

  const candidates = workingModel
    ? [workingModel, ...modelCandidates().filter((m) => m !== workingModel)]
    : modelCandidates();

  for (const model of candidates) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: opts.responseMimeType ?? 'text/plain',
            temperature: opts.temperature ?? 0.5,
          },
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
      });

      const raw = await res.text();

      if (res.ok) {
        workingModel = model;
        let body: { candidates?: { content?: { parts?: { text?: unknown }[] } }[] } | null = null;
        try {
          body = JSON.parse(raw);
        } catch {
          body = null;
        }
        const text = body?.candidates?.[0]?.content?.parts?.[0]?.text;
        return {
          ok: true,
          text: typeof text === 'string' ? text : null,
          model,
          status: res.status,
          error: '',
        };
      }

      if (res.status !== 404) {
        return {
          ok: false,
          text: null,
          model,
          status: res.status,
          error: truncateBody(raw),
        };
      }
    } catch (e) {
      return {
        ok: false,
        text: null,
        model,
        status: null,
        error: e instanceof Error ? e.message : 'unbekannt',
      };
    }
  }

  return {
    ok: false,
    text: null,
    model: candidates[candidates.length - 1],
    status: 404,
    error: 'Kein verfügbares Modell gefunden',
  };
}

function truncateBody(raw: string): string {
  const clean = raw.replace(/\s+/g, ' ').trim();
  return clean.length > 150 ? `${clean.slice(0, 150)}…` : clean;
}

async function fetchFromGemini(): Promise<DailyName[] | null> {
  const prompt = `Heute ist ${today()}. Du bist der tägliche Namens-Redakteur der Website "babynamen.me" für deutsche Babynamen.

Wähle die ${NAMES_WANTED} besten Babynamen für diesen Tag aus dem deutschsprachigen Raum. Mische bekannte Favoriten mit interessanten Entdeckungen, achte auf Vielfalt (Mädchen und Jungen, kurze und lange Namen), aktuelle Trends und eine positive Bedeutung.

Antworte NUR mit einem gültigen JSON-Objekt und ohne weitere Erklärung. Format:
{"names":[{"name":"Lina","gender":"girl","rank":1,"change":"+6%","reason":"in einem kurzen deutschen Satz, warum dieser Name heute passt"}]}

Verwende echte, verbreitete deutschsprachige Vornamen.
- gender: nur "girl", "boy" oder "unisex"
- rank: die Platzierung von 1 bis ${NAMES_WANTED}
- change: Trend als Prozentwert mit Vorzeichen (z. B. "+6%" oder "-2%")`;

  const result = await callGemini(prompt, {
    responseMimeType: 'application/json',
    temperature: 0.5,
  });
  if (!result.ok || typeof result.text !== 'string') return null;

  const jsonText = result.text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/g, '')
    .trim();

  try {
    const parsed = JSON.parse(jsonText);
    return normalize(parsed);
  } catch {
    return null;
  }
}

async function generateDailyTopNames(): Promise<DailyTopNames> {
  const ai = await fetchFromGemini();
  const names = ai?.filter((entry, index, entries) =>
    entries.findIndex((other) => other.name.toLowerCase() === entry.name.toLowerCase()) === index
  );
  // Throw instead of caching standard names. Next keeps successful stale data
  // when an automatic background revalidation fails.
  if (!names || names.length !== NAMES_WANTED) {
    throw new Error('Die täglichen KI-Namen konnten nicht aktualisiert werden. Bitte erneut versuchen.');
  }
  return {
    date: today(),
    generated: true,
    updatedAt: new Date().toISOString(),
    names: names.map((name, index) => ({ ...name, rank: index + 1 })),
  };
}

// Data Cache is shared by route handlers and persists across server restarts
// on Next.js/Vercel. No fallback list is ever written into this cache.
// Keep unstable_cache here until this project enables Cache Components.
const readDailyNames = unstable_cache(generateDailyTopNames, [DAILY_CACHE_TAG], {
  revalidate: 24 * 60 * 60,
  tags: [DAILY_CACHE_TAG],
});
let pendingDailyNames: Promise<DailyTopNames> | null = null;

export async function getDailyTopNames(freshRead = false): Promise<DailyTopNames> {
  if (freshRead || !pendingDailyNames) {
    const request = readDailyNames().then((data) => {
      lastDailyUpdateAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
      return data;
    }).finally(() => {
      if (pendingDailyNames === request) pendingDailyNames = null;
    });
    pendingDailyNames = request;
  }
  return pendingDailyNames;
}

/** Invalidation is committed when this route responds; read in the NEXT request. */
export function invalidateDailyTopNames(): void {
  revalidateTag(DAILY_CACHE_TAG, { expire: 0 });
}
