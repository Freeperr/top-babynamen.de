'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getStoredConsent,
  storeConsent,
  revokeConsent,
  applyConsent,
  CONSENT_KEY,
  type ConsentChoice,
} from '@/lib/consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const promptTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const open = () => {
      if (promptTimer.current) clearTimeout(promptTimer.current);
      revokeConsent();
      setShowDetails(false);
      setVisible(true);
    };

    window.addEventListener('open-cookie-consent', open);
    const sync = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return;
      const choice = getStoredConsent();
      applyConsent(choice ?? 'essential');
      setVisible(choice === null);
    };
    window.addEventListener('storage', sync);

    const stored = getStoredConsent();
    if (stored) {
      applyConsent(stored);
      return () => {
        window.removeEventListener('open-cookie-consent', open);
        window.removeEventListener('storage', sync);
      };
    }

    promptTimer.current = setTimeout(() => setVisible(true), 1200);
    return () => {
      if (promptTimer.current) clearTimeout(promptTimer.current);
      window.removeEventListener('open-cookie-consent', open);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const save = (value: ConsentChoice) => {
    if (promptTimer.current) clearTimeout(promptTimer.current);
    storeConsent(value);
    applyConsent(value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 bg-paper/95 border-t border-line backdrop-blur-sm"
          role="dialog"
          aria-label="Cookie-Einstellungen"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink font-medium">
                  Wir respektieren deine Privatsphäre.
                </p>
                <p className="text-sm text-ink-soft mt-0.5">
                  Wir speichern deine Auswahl lokal in deinem Browser. Mit deiner
                  Zustimmung setzen wir zusätzlich Cookies von Google (z.&nbsp;B.
                  für Google Ads), um dir passende Anzeigen zu zeigen.
                </p>
                {showDetails && (
                  <p className="text-sm text-ink-soft mt-1">
                    Informationen zur Datenverarbeitung findest du in unserer{' '}
                    <Link
                      href="/datenschutz"
                      className="underline underline-offset-2 hover:text-blue-deep"
                    >
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <button
                  onClick={() => save('all')}
                  className="btn btn-secondary"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={() => save('essential')}
                  className="btn btn-secondary"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  aria-expanded={showDetails}
                  className="btn btn-ghost text-sm"
                >
                  {showDetails ? 'Weniger' : 'Details'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
