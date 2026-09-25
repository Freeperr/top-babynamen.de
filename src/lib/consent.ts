export type ConsentChoice = 'all' | 'essential';

export const CONSENT_KEY = 'top_babynamen_cookie_consent_v1';

// Publisher-ID aus ads.txt (pub-5816871570097122) bzw. überschrieben per Env
const configuredClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.trim() || 'ca-pub-5816871570097122';
export const ADSENSE_CLIENT = configuredClient.startsWith('pub-')
  ? `ca-${configuredClient}` : configuredClient;
export const CONSENT_EVENT = 'cookie-consent-changed';
let activeConsent: ConsentChoice | null = null;

const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

interface ConsentWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

function consentParams(allowed: boolean): Record<string, string> {
  return {
    ad_storage: allowed ? 'granted' : 'denied',
    ad_user_data: allowed ? 'granted' : 'denied',
    ad_personalization: allowed ? 'granted' : 'denied',
    analytics_storage: 'denied',
  };
}

export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'all' || value === 'essential' ? value : null;
  } catch {
    return null;
  }
}

export function storeConsent(choice: ConsentChoice): void {
  activeConsent = choice;
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* localStorage unavailable */
  }
}

export function clearConsent(): void {
  activeConsent = null;
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* localStorage unavailable */
  }
}

function gtag(...args: unknown[]): void {
  const w = window as ConsentWindow;
  if (typeof w.gtag === 'function') {
    w.gtag(...args);
    return;
  }
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(args);
}

export function updateConsentMode(choice: ConsentChoice): void {
  gtag('consent', 'update', consentParams(choice === 'all'));
}

function injectAdsense(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('adsense-script')) return;
  const script = document.createElement('script');
  script.id = 'adsense-script';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = ADSENSE_SRC;
  document.head.appendChild(script);
}

function removeAdsense(): void {
  if (typeof document === 'undefined') return;
  const script = document.getElementById('adsense-script');
  if (script && script.parentNode) script.parentNode.removeChild(script);
}

export function getActiveConsent(): ConsentChoice | null {
  return activeConsent ?? getStoredConsent();
}

// Removing a script element does not stop code already executed by AdSense.
// Reload after withdrawal to discard its timers, listeners and injected frames.
export function applyConsent(choice: ConsentChoice): void {
  activeConsent = choice;
  updateConsentMode(choice);
  if (choice === 'all') {
    injectAdsense();
  } else {
    const wasLoaded = Boolean(document.getElementById('adsense-script'));
    removeAdsense();
    if (wasLoaded) window.location.reload();
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// Widerruf / erneutes Öffnen des Banners: zurück auf "denied", AdSense entfernen.
export function revokeConsent(): void {
  clearConsent();
  applyConsent('essential');
}
