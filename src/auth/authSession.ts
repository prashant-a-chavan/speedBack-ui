import { AuthSession } from '../types';

const AUTH_SESSION_STORAGE_KEY = 'speedback.auth.session';

let currentSession: AuthSession | null = null;
let unauthorizedHandler: (() => void) | null = null;

const canUseStorage = (): boolean => typeof window !== 'undefined' && !!window.sessionStorage;

const parseStoredSession = (rawSession: string | null): AuthSession | null => {
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as Partial<AuthSession>;
    if (typeof parsed.accessToken === 'string' && parsed.accessToken.length > 0) {
      return parsed as AuthSession;
    }
  } catch (error) {
    console.warn('Invalid auth session in storage, clearing it.', error);
  }

  return null;
};

export const loadAuthSession = (): AuthSession | null => {
  if (currentSession) {
    return currentSession;
  }

  if (!canUseStorage()) {
    return null;
  }

  const storedSession = parseStoredSession(window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY));

  if (!storedSession) {
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }

  currentSession = storedSession;
  return currentSession;
};

export const saveAuthSession = (session: AuthSession): void => {
  currentSession = session;

  if (canUseStorage()) {
    window.sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  }
};

export const clearAuthSession = (): void => {
  currentSession = null;

  if (canUseStorage()) {
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  }
};

export const getAccessToken = (): string | null => loadAuthSession()?.accessToken ?? null;

export const registerUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

export const triggerUnauthorized = (): void => {
  if (unauthorizedHandler) {
    unauthorizedHandler();
  }
};
