'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react';

interface StatusCheck {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
}

interface StatusData {
  ok: boolean;
  checks: StatusCheck[];
  checkedAt: string;
}

export default function GeminiStatusCard() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini-status', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData((await res.json()) as StatusData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-surface border border-line rounded-2xl p-6 my-8 text-center">
        <p className="text-sm text-ink-soft">Prüfe Verbindung …</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto bg-surface border border-line rounded-2xl p-6 my-8 text-center">
        <p className="text-sm font-medium text-ink mb-1">Verbindungscheck fehlgeschlagen</p>
        <p className="text-xs text-ink-soft mb-4">{error ?? 'Keine Antwort erhalten.'}</p>
        <button onClick={() => void load()} className="btn btn-secondary text-sm">
          <RefreshCw className="w-3.5 h-3.5" />
          Erneut prüfen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-surface border border-line rounded-2xl py-6 my-8">
      <div className="flex items-start gap-3 px-6 pb-4 border-b border-line">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            data.ok ? 'bg-accent-soft text-accent-deep' : 'bg-warn/15 text-warn'
          }`}
        >
          {data.ok ? (
            <ShieldCheck className="w-4 h-4" />
          ) : (
            <ShieldAlert className="w-4 h-4" />
          )}
        </span>
        <div>
          <p className="font-medium text-ink">
            {data.ok ? 'Alles verbunden' : 'Nicht vollständig verbunden'}
          </p>
          <p className="text-xs text-ink-soft">
            {new Date(data.checkedAt).toLocaleString('de-DE')}
          </p>
        </div>
      </div>

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

      <div className="px-6 pt-4 mt-4 border-t border-line flex justify-end">
        <button onClick={() => void load()} className="btn btn-ghost text-sm">
          <RefreshCw className="w-3.5 h-3.5" />
          Erneut prüfen
        </button>
      </div>
    </div>
  );
}