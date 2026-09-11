import { NextResponse } from 'next/server';
import { getDailyTopNames } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  const data = await getDailyTopNames();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'private, max-age=3600' },
  });
}