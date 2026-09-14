'use client';

import { useSyncExternalStore } from 'react';

const CONSENT_KEY = 'top-babynamen-ads-consent';

const subscribeToConsent = (onChange: () => void) => {
  window.addEventListener('ads-consent-changed', onChange);
  return () => window.removeEventListener('ads-consent-changed', onChange);
};

const getConsentPromptState = () => window.localStorage.getItem(CONSENT_KEY) === null;
const getServerConsentPromptState = () => false;

export default function AdsConsent() {
  const visible = useSyncExternalStore(
    subscribeToConsent,
    getConsentPromptState,
    getServerConsentPromptState,
  );

  const choose = (value: 'accepted' | 'rejected') => {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event('ads-consent-changed'));
  };

  if (!visible) {
    return null;
  }

  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-[#FFD6E3] bg-white p-5 shadow-[0_12px_36px_rgba(23,23,23,0.14)]">
      <p className="text-sm leading-relaxed text-[#171717]">
        Wir nutzen Google AdSense, um diese Website durch Werbung zu finanzieren. Dabei können Cookies und ähnliche Technologien eingesetzt werden.
        Mehr dazu in unserer <a href="/datenschutz" className="font-semibold text-[#FF4F87] hover:underline">Datenschutzerklärung</a>.
      </p>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => choose('rejected')}
          className="rounded-full px-4 py-2 text-xs font-semibold text-[#777777] hover:bg-[#FFF5F8]"
        >
          Ablehnen
        </button>
        <button
          type="button"
          onClick={() => choose('accepted')}
          className="btn-primary px-5 py-2 text-xs font-semibold"
        >
          Akzeptieren
        </button>
      </div>
    </aside>
  );
}
