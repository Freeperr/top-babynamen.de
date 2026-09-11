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

// Browsers ship several German voices of wildly different quality. The
// default picked by the browser is often the oldest/most robotic one
// (e.g. "Microsoft Hedda" on Windows) even when a much clearer neural
// voice (e.g. "Google Deutsch", "Microsoft Katja Online") is available.
// This ranks the installed voices and picks the best German match.
function pickBestGermanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const german = voices.filter((v) => v.lang.toLowerCase().startsWith('de'));
  if (german.length === 0) return null;

  const score = (v: SpeechSynthesisVoice): number => {
    const name = v.name.toLowerCase();
    let s = 0;
    if (name.includes('online') || name.includes('natural') || name.includes('neural')) s += 5;
    if (name.includes('google')) s += 4;
    if (name.includes('katja') || name.includes('conrad') || name.includes('vicki')) s += 2;
    if (v.lang.toLowerCase() === 'de-de') s += 1;
    if (!v.localService) s += 1; // cloud voices tend to sound better than the offline ones
    return s;
  };

  return [...german].sort((a, b) => score(b) - score(a))[0];
}

export async function speakName(
  text: string,
  onEnd?: () => void,
  onError?: () => void
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const voices = cachedVoices.length > 0 ? cachedVoices : await loadVoices();
  const voice = pickBestGermanVoice(voices);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang || 'de-DE';
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 1;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => onError?.();

  window.speechSynthesis.speak(utterance);
}
