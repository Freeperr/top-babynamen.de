'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

interface StatusCheck {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
}

interface TestData {
  ok: boolean;
  model: string;
  reply: string | null;
  checks: StatusCheck[];
  checkedAt: string;
  sentAt?: string;
  lastDailyUpdate: string | null;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE');
}

export default function GeminiStatusCard() {
  const [data, setData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini-test', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData((await res.json()) as TestData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="max-w-md mx-auto bg-surface border border-line py-6 my-8">
      {loading && (
        <div className="px-6 text-center">
          <p className="text-sm text-ink-soft">Prüfe Verbindung …</p>
        </div>
      )}

      {!loading && (error || !data) && (
        <div className="px-6 text-center">
          <p className="text-sm font-medium text-ink mb-1">Verbindungscheck fehlgeschlagen</p>
          <p className="text-xs text-ink-soft mb-4">{error ?? 'Keine Antwort erhalten.'}</p>
          <button onClick={() => void load()} className="btn btn-secondary text-sm">
            <RefreshCw className="w-3.5 h-3.5" />
            Erneut prüfen
          </button>
        </div>
      )}

      {!loading && data && (
        <>
          {/* AI reply */}
          <div className="px-6 pb-4 border-b border-line flex items-start gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                data.ok ? 'bg-blue-soft text-blue-deep' : 'bg-warn/15 text-warn'
              }`}
            >
              {data.ok ? <ShieldCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-ink">
                {data.ok ? 'KI ist verbunden' : 'KI nicht verbunden'}
              </p>
              <p className="text-xs text-ink-soft">Modell: {data.model}</p>
            </div>
          </div>

          {data.reply && (
            <div className="mx-6 mt-4 px-4 py-3 bg-blue-pale border border-line">
              <p className="text-xs text-blue-deep mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Antwort der KI (test):
              </p>
              <p className="font-editorial text-lg text-ink leading-snug">&bdquo;{data.reply}&ldquo;</p>
              {data.sentAt && (
                <p className="text-[11px] text-ink-soft mt-2">
                  Gesendet vom Server: {data.sentAt} Uhr
                </p>
              )}
            </div>
          )}

          {/* Checks */}
          <ul className="px-6 pt-4 space-y-3">
            {data.checks.map((check) => (
              <li key={check.key} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    check.ok ? 'bg-go' : 'bg-warn'
                  }`}
                />
                <div>
                  <p className="text-sm text-ink">{check.label}</p>
                  <p className="text-xs text-ink-soft">{check.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Last update info */}
          <div className="mx-6 mt-4 px-4 py-3 bg-panel border border-line text-xs text-ink-soft space-y-1">
            <p className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
              <span>Zuletzt geprüft:</span>
              <span className="tabular-nums text-ink">
                {formatDate(data.checkedAt)}, {formatTime(data.checkedAt)} Uhr
              </span>
            </p>
            <p className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
              <span>„Heute im Trend“ aktualisiert:</span>
              <span className="tabular-nums text-ink">
                {data.lastDailyUpdate
                  ? `${formatDate(data.lastDailyUpdate)}, ${formatTime(data.lastDailyUpdate)} Uhr`
                  : 'Noch nicht geladen'}
              </span>
            </p>
          </div>

          {/* Refresh button */}
          <div className="px-6 pt-4 mt-4 border-t border-line flex justify-end">
            <button onClick={() => void load()} className="btn btn-secondary text-sm">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Erneut testen
            </button>
          </div>
        </>
      )}
    </div>
  );
}