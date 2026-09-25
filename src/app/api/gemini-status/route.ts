import { NextResponse } from 'next/server';
import { modelCandidates } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface StatusCheck {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
}

interface GroqModel {
  id?: string;
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const candidates = modelCandidates();
  const checks: StatusCheck[] = [];

  if (!apiKey) {
    checks.push({
      key: 'env',
      label: 'GEMINI_API_KEY',
      ok: false,
      detail: 'Nicht gesetzt – bitte den Groq-Key als GEMINI_API_KEY hinterlegen.',
    });
  } else {
    checks.push({
      key: 'env',
      label: 'GEMINI_API_KEY',
      ok: true,
      detail: 'Groq-Key unter GEMINI_API_KEY gesetzt.',
    });

    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      });

      if (res.ok) {
        checks.push({
          key: 'api',
          label: 'API-Verbindung',
          ok: true,
          detail: `Groq erreichbar (HTTP ${res.status}).`,
        });

        const body = (await res.json().catch(() => null)) as { data?: GroqModel[] } | null;
        const modelNames = (body?.data ?? []).map((m) => m.id ?? '');
        const available = candidates.filter((c) => modelNames.includes(c));
        checks.push({
          key: 'model',
          label: 'Verfügbare Modelle',
          ok: available.length > 0,
          detail:
            available.length > 0
              ? `Gefunden: ${available.join(', ')}.`
              : `Keine der Kandidaten (${candidates.join(', ')}) gefunden – z. B. verfügbar: ${modelNames.slice(0, 3).join(', ') || 'keine Angabe'}.`,
        });
      } else {
        checks.push({
          key: 'api',
          label: 'API-Verbindung',
          ok: false,
          detail: `Fehler (HTTP ${res.status}) – der API-Key ist evtl. ungültig.`,
        });
      }
    } catch (e) {
      checks.push({
        key: 'api',
        label: 'API-Verbindung',
        ok: false,
        detail: `Netzwerkfehler: ${e instanceof Error ? e.message : 'unbekannt'}.`,
      });
    }
  }

  return NextResponse.json({
    ok: checks.every((c) => c.ok),
    checks,
    checkedAt: new Date().toISOString(),
  });
}