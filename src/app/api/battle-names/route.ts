import { NextResponse } from 'next/server';
import { callGemini, getDailyTopNames } from '@/lib/gemini';
import { ALL_NAMES } from '@/data/namesExtended';
import { BabyName, Gender } from '@/types/name';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface BattleNameSuggestion {
  name: string;
  gender: Gender;
  origin: string;
  meaning: string;
  length: number;
}

interface BattleNameResponse {
  name: string;
  gender: Gender;
  origin: string;
  meaning: string;
  length: number;
  id: string;
}

function findByName(name: string, gender?: Gender): BabyName | undefined {
  return ALL_NAMES.find(
    (n) => n.name.toLowerCase() === name.toLowerCase() && (!gender || n.gender === gender)
  );
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
  const gender = (searchParams.get('gender') as Gender | 'all') || 'all';
  const source = searchParams.get('source');

  // Täglich frisch zusammengestellte Namensliste (per KI, gecacht für 24h)
  if (source === 'daily') {
    const daily = await getDailyTopNames();
    const matching = daily.names.filter(
      (n) => gender === 'all' || n.gender === gender || n.gender === 'unisex'
    );

    const resolved: BattleNameResponse[] = matching.map((d) => {
      const existing = findByName(d.name, d.gender);
      if (existing) return toBattleResponse(existing);
      const g = d.gender === 'girl' || d.gender === 'boy' ? d.gender : 'unisex';
      return {
        name: d.name,
        gender: g,
        origin: '',
        meaning: d.reason || d.name,
        length: d.name.length,
        id: d.name.toLowerCase(),
      };
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

  const prompt = `Du bist ein Babynamen-Experte für die Website "babynamen.me".
Schlage 2 verschiedene, echte deutschsprachige Vornamen vor (${genderHint}).
Achte auf Vielfalt: unterschiedliche Buchstabenzahlen, verschiedene Herkünfte, positive Bedeutungen.
Der erste Name soll modern/trendig sein, der zweite klassisch/zeitlos.

Antworte NUR mit einem gültigen JSON-Objekt und ohne weitere Erklärung. Format:
{"names":[{"name":"Lina","gender":"girl","origin":"Germanisch","meaning":"die Kraftvolle","length":4},{"name":"Finn","gender":"boy","origin":"Irisch","meaning":"der Weiße","length":4}]}

- gender: nur "girl", "boy" oder "unisex"
- length: exakte Anzahl der Buchstaben
- meaning: kurze deutsche Bedeutung`;

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
    const parsed = JSON.parse(jsonText) as { names?: BattleNameSuggestion[] };
    const suggestions = (parsed.names ?? [])
      .filter((n) => typeof n.name === 'string' && n.name.length > 0)
      .slice(0, 2);

    const resolved = suggestions.map((s) => {
      const existing = findByName(s.name, s.gender);
      if (existing) return toBattleResponse(existing);
      return {
        name: s.name,
        gender: s.gender === 'girl' || s.gender === 'boy' ? s.gender : 'unisex',
        origin: s.origin ?? '',
        meaning: s.meaning ?? '',
        length: s.name.length,
        id: s.name.toLowerCase(),
      };
    });

    while (resolved.length < 2) {
      const fb = randomFromPool(gender);
      resolved.push(toBattleResponse(fb));
    }

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
      error: 'JSON-Antwort konnte nicht geparst werden.',
    });
  }
}