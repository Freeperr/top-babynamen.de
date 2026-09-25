import type { DailyTopNames } from '@/lib/gemini';
import { resolveCatalogName } from '@/lib/aiNameCatalog';

interface DailyNamesState {
  data: DailyTopNames | null;
  error: string | null;
  loading: boolean;
}

const initialState: DailyNamesState = { data: null, error: null, loading: true };
let state = initialState;
let requestVersion = 0;
let pending: Promise<DailyTopNames> | null = null;
const listeners = new Set<() => void>();

export const getDailyNamesSnapshot = () => state;
export const getDailyNamesServerSnapshot = () => initialState;
export function subscribeDailyNames(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function publish(next: DailyNamesState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export function isDailyNamesResponse(value: unknown): value is DailyTopNames {
  if (!value || typeof value !== 'object') return false;
  const data = value as DailyTopNames;
  if (!(data.generated === true && typeof data.date === 'string' &&
    Array.isArray(data.names) && data.names.length === 5 &&
    data.names.every((entry) => entry && typeof entry.name === 'string' &&
      entry.name.trim().length > 0 && ['girl', 'boy', 'unisex'].includes(entry.gender) &&
      typeof entry.reason === 'string') &&
    new Set(data.names.map((entry) => entry.name.trim().toLowerCase())).size === 5)) {
    return false;
  }
  const catalogNames = data.names.map((entry) => resolveCatalogName(entry));
  return catalogNames.every((name) => name !== undefined) &&
    new Set(catalogNames.map((name) => name?.id)).size === 5;
}

// Shared within this browser session: navigation does not reset successful picks.
// Versioning prevents an older request from overwriting a manual refresh.
export function loadDailyNames(force = false): Promise<DailyTopNames> {
  if (!force && pending) return pending;
  const version = ++requestVersion;
  publish({ ...state, loading: true, error: null });
  const request = (async () => {
    try {
      const response = await fetch(force ? '/api/daily-names?refresh=1' : '/api/daily-names', { cache: 'no-store' });
      const data: unknown = await response.json();
      if (!response.ok || !isDailyNamesResponse(data)) {
        throw new Error('Die täglichen KI-Namen konnten nicht geladen werden. Bitte erneut versuchen.');
      }
      if (version === requestVersion) publish({ data, loading: false, error: null });
      return data;
    } catch (error) {
      if (version === requestVersion) {
        publish({ ...state, loading: false, error: error instanceof Error ? error.message : 'Laden fehlgeschlagen.' });
      }
      throw error;
    } finally {
      if (version === requestVersion) pending = null;
    }
  })();
  pending = request;
  return request;
}
