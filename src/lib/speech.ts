let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      cachedVoices = voices;
      resolve(voices);
      return;
    }
    // Most browsers load voices asynchronously on first use.
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      voicesLoaded = true;
      resolve(cachedVoices);
    };
    // Fallback in case onvoiceschanged never fires (some browsers).
    setTimeout(() => {
      if (!voicesLoaded) resolve(window.speechSynthesis.getVoices());
    }, 300);
  });
}

// A name's meaning/description records its origin as a German label, e.g.
// "Italienisch / Griechisch" or "Altnordisch". A German voice reads a name
// like "Giulia" or "Siobhan" with German letter rules and gets it wrong.
// If the browser has a voice installed for the name's actual language of
// origin, that voice is a much better bet than forcing everything through
// German. Only origins with a language commonly shipped as a system/browser
// voice are mapped; anything else (Altnordisch, Keltisch, Sanskrit, ...)
// falls back to German, which is still the right default for this site.
const ORIGIN_LANG_HINTS: [pattern: RegExp, lang: string][] = [
  [/französisch|altfranzösisch/i, 'fr'],
  [/italienisch/i, 'it'],
  [/spanisch/i, 'es'],
  [/portugiesisch/i, 'pt'],
  [/englisch|altenglisch/i, 'en'],
  [/russisch/i, 'ru'],
  [/ukrainisch/i, 'uk'],
  [/polnisch/i, 'pl'],
  [/tschechisch/i, 'cs'],
  [/ungarisch/i, 'hu'],
  [/niederländisch/i, 'nl'],
  [/schwedisch/i, 'sv'],
  [/dänisch/i, 'da'],
  [/finnisch/i, 'fi'],
  [/griechisch/i, 'el'],
  [/hebräisch/i, 'he'],
  [/arabisch/i, 'ar'],
  [/türkisch/i, 'tr'],
  [/persisch/i, 'fa'],
  [/japanisch/i, 'ja'],
  [/chinesisch/i, 'zh'],
  [/koreanisch/i, 'ko'],
  [/vietnamesisch/i, 'vi'],
  [/swahili/i, 'sw'],
  [/deutsch|germanisch|althochdeutsch|niederdeutsch/i, 'de'],
];

function langHintFromOrigin(origin?: string): string | null {
  if (!origin) return null;
  // Compound origins ("Deutsch / Italienisch") list the dominant one first.
  const primary = origin.split('/')[0].trim();
  for (const [pattern, lang] of ORIGIN_LANG_HINTS) {
    if (pattern.test(primary)) return lang;
  }
  return null;
}

// Browsers ship several voices of wildly different quality per language. The
// default picked by the browser is often the oldest/most robotic one
// (e.g. "Microsoft Hedda" on Windows) even when a much clearer neural
// voice (e.g. "Google Deutsch", "Microsoft Katja Online") is available.
// This ranks the installed voices for a language and picks the best match.
function pickBestVoice(
  voices: SpeechSynthesisVoice[],
  lang: string
): SpeechSynthesisVoice | null {
  const matches = voices.filter((v) => v.lang.toLowerCase().startsWith(lang));
  if (matches.length === 0) return null;

  const score = (v: SpeechSynthesisVoice): number => {
    const name = v.name.toLowerCase();
    let s = 0;
    if (name.includes('online') || name.includes('natural') || name.includes('neural')) s += 5;
    if (name.includes('google')) s += 4;
    if (name.includes('katja') || name.includes('conrad') || name.includes('vicki')) s += 2;
    if (v.lang.toLowerCase() === `${lang}-${lang}`) s += 1;
    if (!v.localService) s += 1; // cloud voices tend to sound better than the offline ones
    return s;
  };

  return [...matches].sort((a, b) => score(b) - score(a))[0];
}

export async function speakName(
  text: string,
  origin?: string,
  onEnd?: () => void,
  onError?: () => void
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const voices = cachedVoices.length > 0 ? cachedVoices : await loadVoices();

  const originLang = langHintFromOrigin(origin);
  const voice =
    (originLang && pickBestVoice(voices, originLang)) || pickBestVoice(voices, 'de');

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang || originLang || 'de-DE';
  if (voice) utterance.voice = voice;
  utterance.rate = 0.88;
  utterance.pitch = 1;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => onError?.();

  window.speechSynthesis.speak(utterance);
}
