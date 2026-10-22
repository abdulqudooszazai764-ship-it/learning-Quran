"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { fetchMe, logout as clearSession, type Me } from "@/lib/auth";
import { getAccessToken } from "@/lib/session";

interface AuthValue {
  user: Me | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Re-read the signed-in user from the API (call right after login). */
  refresh: () => Promise<Me | null>;
  signOut: () => void;
  /** True right after an explicit sign-out (so guards skip the ?next= param). */
  justSignedOut: () => boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [isLoading, setLoading] = useState(true);
  const signedOut = useRef(false);

  const refresh = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const me = await fetchMe();
      signedOut.current = false;
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = useCallback(() => {
    signedOut.current = true;
    clearSession();
    setUser(null);
  }, []);

  const justSignedOut = useCallback(() => signedOut.current, []);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: !!user, refresh, signOut, justSignedOut }),
    [user, isLoading, refresh, signOut, justSignedOut]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
