import { unstable_cache, revalidateTag } from 'next/cache';
import { catalogPrompt, catalogVersion, getAiNameCatalog, resolveCatalogName } from '@/lib/aiNameCatalog';
import type { BabyName } from '@/types/name';

export interface DailyName {
  id: string;
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
const DAILY_CACHE_TAG = `daily-groq-catalog-v3-${catalogVersion}`;
let lastDailyUpdateAt: number | null = null;

export function getLastDailyUpdateAt(): number | null {
  return lastDailyUpdateAt;
}

function today(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date());
}

function normalize(raw: unknown, catalog: BabyName[]): DailyName[] {
  if (!raw || typeof raw !== 'object') return [];
  const list = (raw as { names?: unknown[] }).names;
  if (!Array.isArray(list)) return [];
  return list
    .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
    .slice(0, NAMES_WANTED)
    .flatMap((x, i): DailyName[] => {
      const match = resolveCatalogName(x, catalog);
      if (!match) return [];
      return [{
        id: match.id,
        name: match.name,
        gender: match.gender,
        rank: Number.isFinite(Number(x.rank)) ? Number(x.rank) : i + 1,
        change: typeof x.change === 'string' ? x.change : '→',
        reason: typeof x.reason === 'string' ? x.reason : '',
      }];
    });
}

// Legacy module/env names stay compatible; all inference now uses Groq.
const MODEL_CANDIDATES = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b'];

export function modelCandidates(): string[] {
  const env = process.env.GEMINI_MODEL?.trim();
  // A previous Gemini model setting must not require another deployment change.
  if (!env || /^(?:models\/)?gemini-/i.test(env)) return MODEL_CANDIDATES;
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

  let lastResult: GeminiCallResult = {
    ok: false, text: null, model: candidates[0], status: null, error: 'Kein verfügbares Groq-Modell gefunden.',
  };
  for (const model of candidates) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: opts.temperature ?? 0.5,
          max_completion_tokens: 4096,
          ...(model.startsWith('openai/gpt-oss-') ? { reasoning_effort: 'low' } : {}),
          ...(opts.responseMimeType === 'application/json' ? { response_format: { type: 'json_object' } } : {}),
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
      });
      const body = await res.json().catch(() => null) as {
        choices?: { message?: { content?: unknown }; finish_reason?: string }[];
        error?: { code?: string };
      } | null;
      if (res.ok) {
        const choice = body?.choices?.[0];
        const text = choice?.message?.content;
        if (typeof text !== 'string' || !text.trim() || choice?.finish_reason === 'length') {
          return { ok: false, text: null, model, status: res.status, error: 'Groq hat keine vollständige Antwort geliefert.' };
        }
        workingModel = model;
        return { ok: true, text, model, status: res.status, error: '' };
      }
      lastResult = {
        ok: false, text: null, model, status: res.status,
        error: res.status === 401
          ? 'Groq-Key ungültig. Bitte den Groq-Key in GEMINI_API_KEY hinterlegen.'
          : res.status === 429 ? 'Groq-Anfragelimit erreicht. Bitte später erneut versuchen.'
            : `Groq-Anfrage fehlgeschlagen (HTTP ${res.status}).`,
      };
      const modelUnavailable = ['model_not_found', 'model_decommissioned', 'model_permission_blocked'].includes(body?.error?.code ?? '');
      if (res.status !== 404 && res.status !== 429 && res.status !== 503 && !modelUnavailable) return lastResult;
    } catch {
      return { ok: false, text: null, model, status: null, error: 'Groq ist gerade nicht erreichbar oder die Anfrage hat zu lange gedauert.' };
    }
  }
  return lastResult;
}

async function fetchFromGroq(): Promise<DailyName[] | null> {
  const catalog = getAiNameCatalog(today());
  const prompt = `Heute ist ${today()}. Du bist der tägliche Namens-Redakteur der Website "babynamen.me" für deutsche Babynamen.

Wähle genau ${NAMES_WANTED} verschiedene Babynamen ausschließlich aus dem folgenden Website-Katalog. Mische bekannte Favoriten mit interessanten Entdeckungen und achte auf Vielfalt (Mädchen und Jungen, kurze und lange Namen).

Erlaubter Katalog: ${catalogPrompt(catalog)}

Antworte NUR mit einem gültigen JSON-Objekt und ohne weitere Erklärung. Format:
{"names":[{"id":"${catalog[0].id}","rank":1,"change":"→","reason":"in einem kurzen deutschen Satz, warum dieser Name heute passt"}]}

Verwende ausschließlich IDs aus dem erlaubten Katalog. Erfinde keine Namen oder IDs.
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
    return normalize(parsed, catalog);
  } catch {
    return null;
  }
}

async function generateDailyTopNames(): Promise<DailyTopNames> {
  const ai = await fetchFromGroq();
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
