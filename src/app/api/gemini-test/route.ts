import { NextResponse } from 'next/server';
import { getLastDailyUpdateAt } from '@/lib/gemini';

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
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
  const checkedAt = new Date().toISOString();
  const checks: StatusCheck[] = [];
  let reply: string | null = null;
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const prompt = `Du bist ein Verbindungstest für die Website "top-babynamen.de".

Antworte NUR mit genau diesem Satz (ohne weitere Erklärung, ohne Markdown), wobei du die aktuelle Uhrzeit (Format HH:MM:SS) und das heutige Datum (Format TT.MM.JJJJ) einsetzt:

Hallo, ich bin da. Uhrzeit: HH:MM:SS, Datum: TT.MM.JJJJ`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'text/plain',
            temperature: 0,
          },
        }),
        cache: 'no-store',
      });

      if (res.ok) {
        const body = await res.json();
        const text = body?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text === 'string' && text.trim().length > 0) {
          reply = text.trim().replace(/```/g, '');
          generated = true;
          checks.push({
            key: 'api',
            label: 'KI-Antwort',
            ok: true,
            detail: 'Gemini hat geantwortet.',
          });
        } else {
          checks.push({
            key: 'api',
            label: 'KI-Antwort',
            ok: false,
            detail: 'Antwort war leer oder unerwartet.',
          });
        }
      } else {
        checks.push({
          key: 'api',
          label: 'KI-Antwort',
          ok: false,
          detail: `Fehler (HTTP ${res.status}) – ${bodySummary(res)}`,
        });
      }
    } catch (e) {
      checks.push({
        key: 'api',
        label: 'KI-Antwort',
        ok: false,
        detail: `Netzwerkfehler: ${e instanceof Error ? e.message : 'unbekannt'}.`,
      });
    }
  }

  const lastDailyUpdateAt = getLastDailyUpdateAt();

  return NextResponse.json({
    ok: generated,
    model,
    reply,
    checks,
    checkedAt,
    lastDailyUpdate: lastDailyUpdateAt ? new Date(lastDailyUpdateAt).toISOString() : null,
  });
}

async function bodySummary(res: Response): Promise<string> {
  try {
    const body = await res.text();
    const clean = body.replace(/\s+/g, ' ').trim();
    return clean.length > 120 ? `${clean.slice(0, 120)}…` : clean;
  } catch {
    return 'keine Details';
  }
}