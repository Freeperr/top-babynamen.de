'use client';

import { useEffect, useState } from 'react';

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || 'ca-pub-5816871570097122';
export const ADS_CONSENT_KEY = 'top-babynamen-ads-consent';

interface AdSenseProps {
  slot: string;
  format?: string;
  className?: string;
}

export default function AdSense({ slot, format = 'auto', className = '' }: AdSenseProps) {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const updateConsent = () => {
      setConsent(window.localStorage.getItem(ADS_CONSENT_KEY) === 'accepted');
    };

    updateConsent();
    window.addEventListener('ads-consent-changed', updateConsent);
    return () => window.removeEventListener('ads-consent-changed', updateConsent);
  }, []);

  if (!ADSENSE_CLIENT || !consent) {
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
