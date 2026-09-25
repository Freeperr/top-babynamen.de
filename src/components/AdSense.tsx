'use client';

import { useEffect, useState } from 'react';
import { ADSENSE_CLIENT, CONSENT_EVENT, getActiveConsent } from '@/lib/consent';

interface AdSenseProps {
  slot: string;
  format?: string;
  className?: string;
}

export default function AdSense({ slot, format = 'auto', className = '' }: AdSenseProps) {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const updateConsent = () => {
      setConsent(getActiveConsent() === 'all');
    };

    updateConsent();
    window.addEventListener(CONSENT_EVENT, updateConsent);
    return () => window.removeEventListener(CONSENT_EVENT, updateConsent);
  }, []);

  if (!ADSENSE_CLIENT || !consent || !slot) {
    return null;
  }

  return (
    <>
      {slot && (
        <ins
          className={`adsbygoogle block overflow-hidden ${className}`}
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
      <AdInitializer />
    </>
  );
}

function AdInitializer() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense can be blocked by browser extensions or content blockers.
    }
  }, []);

  return null;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
