import { NextRequest, NextResponse } from 'next/server';
import { refreshDailyTopNames } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const expected = process.env.TREND_REFRESH_PASSWORD?.trim();

  if (!expected) {
    return NextResponse.json(
      { error: 'TREND_REFRESH_PASSWORD ist auf dem Server nicht gesetzt.' },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (password !== expected) {
    return NextResponse.json({ error: 'Falsches Passwort.' }, { status: 401 });
  }

  const data = await refreshDailyTopNames();
  return NextResponse.json(data);
}
