import { NextResponse } from 'next/server';
import { getDailyTopNames } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const freshRead = new URL(request.url).searchParams.get('refresh') === '1';
    const data = await getDailyTopNames(freshRead);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Die täglichen KI-Namen sind gerade nicht verfügbar. Bitte erneut versuchen.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
