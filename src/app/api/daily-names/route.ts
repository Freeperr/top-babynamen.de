import { NextResponse } from 'next/server';
import { getDailyTopNames } from '@/lib/gemini';
import { resolveCatalogName } from '@/lib/aiNameCatalog';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const freshRead = new URL(request.url).searchParams.get('refresh') === '1';
    const data = await getDailyTopNames(freshRead);
    const names = data.names.flatMap((entry) => {
      const match = resolveCatalogName(entry);
      return match
        ? [{ ...entry, id: match.id, name: match.name, gender: match.gender }]
        : [];
    });
    if (names.length !== 5 || new Set(names.map((name) => name.id)).size !== 5) {
      throw new Error('Die täglichen KI-Namen enthalten ungültige Katalogeinträge.');
    }
    return NextResponse.json({ ...data, names }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Die täglichen KI-Namen sind gerade nicht verfügbar. Bitte erneut versuchen.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
