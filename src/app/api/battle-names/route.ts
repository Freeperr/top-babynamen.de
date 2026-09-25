import { NextResponse } from 'next/server';
import { callGemini, getDailyTopNames } from '@/lib/gemini';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName, Gender } from '@/types/name';
import { catalogPrompt, getAiNameCatalog, resolveCatalogName } from '@/lib/aiNameCatalog';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface BattleNameResponse {
  name: string;
  gender: Gender;
  origin: string;
  meaning: string;
  length: number;
  id: string;
}

function randomFromPool(gender: Gender | 'all'): BabyName {
  const pool = ALL_NAMES.filter((n) =>
    gender === 'all' ? true : n.gender === gender || n.gender === 'unisex'
  );
  return pool[Math.floor(Math.random() * pool.length)];
}

function toBattleResponse(name: BabyName): BattleNameResponse {
  return {
    name: name.name,
    gender: name.gender,
    origin: name.origin,
    meaning: name.meaning,
    length: name.length,
    id: name.id,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedGender = searchParams.get('gender') || 'all';
  if (!['all', 'girl', 'boy', 'unisex'].includes(requestedGender)) {
    return NextResponse.json({ error: 'Ungültiger Geschlechtsfilter.' }, { status: 400 });
  }
  const gender = requestedGender as Gender | 'all';
  const source = searchParams.get('source');

  // Täglich frisch zusammengestellte Namensliste (per KI, gecacht für 24h)
  if (source === 'daily') {
    const daily = await getDailyTopNames().catch(() => null);
    if (!daily) {
      return NextResponse.json({ error: 'Die täglichen KI-Namen sind gerade nicht verfügbar.' }, { status: 503 });
    }
    const matching = daily.names.filter(
      (n) => gender === 'all' || n.gender === gender || n.gender === 'unisex'
    );

    const resolved: BattleNameResponse[] = matching.flatMap((entry) => {
      const existing = resolveCatalogName(entry);
      return existing ? [toBattleResponse(existing)] : [];
    });

    while (resolved.length < 2) {
      const fb = randomFromPool(gender);
      resolved.push(toBattleResponse(fb));
    }

    return NextResponse.json({
      ok: true,
      generated: daily.generated,
      date: daily.date,
      names: resolved.slice(0, 5),
    });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    const pair = [randomFromPool(gender), randomFromPool(gender)];
    return NextResponse.json({
      ok: false,
      generated: false,
      names: pair.map(toBattleResponse),
      error: 'GEMINI_API_KEY ist nicht gesetzt',
    });
  }

  const genderHint =
    gender === 'girl'
      ? 'Mädchennamen'
      : gender === 'boy'
        ? 'Jungennamen'
        : 'Jungen- und Mädchennamen';

  const catalog = getAiNameCatalog(String(Date.now()), gender);
  const prompt = `Du bist ein Babynamen-Experte für die Website "babynamen.me".
Wähle 2 verschiedene Namen (${genderHint}) ausschließlich aus diesem Website-Katalog:
${catalogPrompt(catalog)}
Achte auf Vielfalt: unterschiedliche Buchstabenzahlen, verschiedene Herkünfte, positive Bedeutungen.
Der erste Name soll modern/trendig sein, der zweite klassisch/zeitlos.

Antworte NUR mit einem gültigen JSON-Objekt und ohne weitere Erklärung. Format:
{"names":[{"id":"${catalog[0].id}"},{"id":"${catalog[1].id}"}]}

Verwende ausschließlich die IDs aus dem Katalog. Erfinde keine Namen oder IDs.`;

  const result = await callGemini(prompt, {
    responseMimeType: 'application/json',
    temperature: 0.7,
  });

  if (!result.ok || typeof result.text !== 'string') {
    const pair = [randomFromPool(gender), randomFromPool(gender)];
    return NextResponse.json({
      ok: false,
      generated: false,
      names: pair.map(toBattleResponse),
      error: result.error || 'KI-Antwort konnte nicht verarbeitet werden.',
    });
  }

  const jsonText = result.text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/g, '')
    .trim();

  try {
    const parsed = JSON.parse(jsonText) as { names?: unknown };
    if (!Array.isArray(parsed.names)) throw new Error('Ungültige Namensliste');
    const selected = parsed.names.map((entry) => resolveCatalogName(entry, catalog))
      .filter((entry): entry is BabyName => Boolean(entry));
    const unique = selected.filter((entry, index) => selected.findIndex((other) => other.id === entry.id) === index);
    if (unique.length !== 2 || parsed.names.length !== 2) throw new Error('Namen fehlen im Katalog oder sind doppelt');
    const resolved = unique.map(toBattleResponse);

    return NextResponse.json({
      ok: true,
      generated: true,
      names: resolved,
      model: result.model,
    });
  } catch {
    const pair = [randomFromPool(gender), randomFromPool(gender)];
    return NextResponse.json({
      ok: false,
      generated: false,
      names: pair.map(toBattleResponse),
      error: 'Die KI hat keine zwei verschiedenen Namen aus dem Website-Katalog geliefert.',
    });
  }
}
