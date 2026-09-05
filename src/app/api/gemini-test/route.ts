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
  const nowLabel = new Date().toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
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

Antworte NUR mit exakt dem folgenden Text (unverändert, ohne weitere Erklärung, ohne Markdown, ohne zusätzliche Zeichen):

Hallo, ich bin da. ${nowLabel}`;

    const result = await callGemini(prompt, { temperature: 0 });
    modelUsed = result.model;

    const resultText = typeof result.text === 'string' ? result.text.trim().replace(/```/g, '') : null;
    const echoed = result.ok && resultText !== null && resultText.includes(nowLabel);

    if (result.ok && echoed) {
      reply = resultText;
      generated = true;
      checks.push({
        key: 'api',
        label: 'KI-Antwort',
        ok: true,
        detail: `Modell „${result.model}“ hat die Nachricht korrekt zurückgespiegelt.`,
      });
    } else if (result.ok && !echoed) {
      reply = resultText;
      checks.push({
        key: 'api',
        label: 'KI-Antwort',
        ok: false,
        detail: `Antwort war nicht exakt – erwartet: „…${nowLabel}“, bekam: „${reply ?? 'leer'}“.`,
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
    sentAt: nowLabel,
    lastDailyUpdate: lastDailyUpdateAt ? new Date(lastDailyUpdateAt).toISOString() : null,
  });
}