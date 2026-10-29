import { SessionRecord, AppSettings } from '../types';

const SESSIONS_STORAGE_KEY = 'generation_gap_sessions_v1';
const SETTINGS_STORAGE_KEY = 'generation_gap_settings_v1';

export const defaultSettings: AppSettings = {
  fontSize: 'normal',
  reducedMotion: false,
  soundEffects: true,
  highContrast: false,
};

export function getSavedSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read saved sessions:', e);
    return [];
  }
}

export function saveSession(session: SessionRecord): void {
  try {
    const existing = getSavedSessions();
    const updated = [session, ...existing.filter((s) => s.id !== session.id)];
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function updateSessionTitle(sessionId: string, newTitle: string): void {
  try {
    const existing = getSavedSessions();
    const updated = existing.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s));
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update session title:', e);
  }
}

export function deleteSession(sessionId: string): void {
  try {
    const existing = getSavedSessions();
    const updated = existing.filter((s) => s.id !== sessionId);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete session:', e);
  }
}

export function clearAllSessions(): void {
  try {
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear sessions:', e);
  }
}

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    return defaultSettings;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save app settings:', e);
  }
}
