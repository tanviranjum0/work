import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { UserProfile } from '@aeronova/shared';
import { apiClient, ApiClientError } from '../../services/api-client';

/*
 * Session handling.
 *
 * The access token lives in sessionStorage: per tab, and gone when the tab
 * closes. A cookie would need CSRF defences for a cross-origin API, and
 * localStorage would persist the token across every tab indefinitely. Any
 * storage readable by scripts is exposed to XSS, so the app ships a strict
 * content-security policy and never renders raw HTML.
 *
 * There is no refresh token: when the token expires the traveller signs in
 * again.
 */
const STORAGE_KEY = 'aeronova.session';

interface StoredSession {
  readonly accessToken: string;
  readonly expiresAt: number;
  readonly user: UserProfile;
}

const read = (): StoredSession | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.accessToken || parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
};

const write = (session: StoredSession | null) => {
  try {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode): the session lasts for this page view only.
  }
};

export interface AuthContextValue {
  readonly user: UserProfile | null;
  readonly isSignedIn: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName?: string): Promise<void>;
  signOut(): void;
  /** Keeps the cached profile in step after a preferences change. */
  setUser(user: UserProfile): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<StoredSession | null>(read);
  const queryClient = useQueryClient();

  // Registered during render on purpose: children's effects run before the
  // parent's, so a request fired on mount would otherwise go out unauthenticated.
  // The call is idempotent — it only swaps one getter for another.
  apiClient.useTokenSource(() => session?.accessToken);

  const apply = useCallback((next: StoredSession | null) => {
    write(next);
    setSession(next);
  }, []);

  const start = useCallback(
    async (promise: Promise<{ accessToken: string; expiresInSeconds: number; user: UserProfile }>) => {
      const res = await promise;
      apply({
        accessToken: res.accessToken,
        expiresAt: Date.now() + res.expiresInSeconds * 1000,
        user: res.user,
      });
    },
    [apply],
  );

  const clearLocal = useCallback(() => {
    apply(null);
    // Drop anything fetched for the previous user.
    queryClient.removeQueries({ queryKey: ['account'] });
  }, [apply, queryClient]);

  const signOut = clearLocal;

  // Expiry only clears the local session: never an unexpected redirect away from the page.
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(clearLocal, Math.max(0, session.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [session, clearLocal]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isSignedIn: session !== null,
      signIn: (email, password) => start(apiClient.login({ email, password })),
      signUp: (email, password, displayName) =>
        start(apiClient.register({ email, password, ...(displayName ? { displayName } : {}) })),
      signOut,
      setUser: (user) => apply(session ? { ...session, user } : null),
    }),
    [session, start, signOut, apply],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

/** Turns an API failure into a message for a form, keeping field issues. */
export const authErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof ApiClientError && (err.status === 400 || err.status === 401 || err.status === 409)
    ? err.message
    : fallback;
