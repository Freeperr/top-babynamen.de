import { NextResponse } from 'next/server';
import { callGemini, getLastDailyUpdateAt } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface StatusCheck {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const checkedAt = new Date().toISOString();
  const checks: StatusCheck[] = [];
  let reply: string | null = null;
  let modelUsed = '';
  let generated = false;

  if (!apiKey) {
    checks.push({
      key: 'env',
      label: 'GEMINI_API_KEY',
      ok: false,
      detail: 'Nicht gesetzt – bitte in .env.local hinterlegen.',
    });
  } else {
    checks.push({
      key: 'env',
      label: 'GEMINI_API_KEY',
      ok: true,
      detail: `Gesetzt (${apiKey.length} Zeichen).`,
    });

    const prompt = `Du bist ein Verbindungstest für die Website "top-babynamen.de".

Antworte NUR mit genau diesem Satz (ohne weitere Erklärung, ohne Markdown), wobei du die aktuelle Uhrzeit (Format HH:MM:SS) und das heutige Datum (Format TT.MM.JJJJ) einsetzt:

Hallo, ich bin da. Uhrzeit: HH:MM:SS, Datum: TT.MM.JJJJ`;

    const result = await callGemini(prompt, { temperature: 0 });
    modelUsed = result.model;

    if (result.ok && typeof result.text === 'string' && result.text.trim().length > 0) {
      reply = result.text.trim().replace(/```/g, '');
      generated = true;
      checks.push({
        key: 'api',
        label: 'KI-Antwort',
        ok: true,
        detail: `Modell „${result.model}“ hat geantwortet.`,
      });
    } else {
      checks.push({
        key: 'api',
        label: 'KI-Antwort',
        ok: false,
        detail:
          result.status !== null
            ? `Fehler (HTTP ${result.status}) – ${result.error || 'keine Details'}`
            : result.error || 'Keine Antwort erhalten.',
      });
    }
  }

  const lastDailyUpdateAt = getLastDailyUpdateAt();

  return NextResponse.json({
    ok: generated,
    model: modelUsed,
    reply,
    checks,
    checkedAt,
    lastDailyUpdate: lastDailyUpdateAt ? new Date(lastDailyUpdateAt).toISOString() : null,
  });
}