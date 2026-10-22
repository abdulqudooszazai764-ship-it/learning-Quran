/**
 * JWT storage. "Keep me signed in" keeps the tokens in localStorage;
 * otherwise they live in sessionStorage and disappear with the tab.
 * Every access is wrapped — storage can throw (private mode, blocked cookies).
 */
const ACCESS = "academy_access";
const REFRESH = "academy_refresh";

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export const getAccessToken = () => read(ACCESS);
export const getRefreshToken = () => read(REFRESH);

export function saveTokens(access: string, refresh: string | null, remember: boolean) {
  clearTokens();
  try {
    const store = remember ? window.localStorage : window.sessionStorage;
    store.setItem(ACCESS, access);
    if (refresh) store.setItem(REFRESH, refresh);
  } catch {
    /* storage unavailable — user simply won't stay signed in */
  }
}

/** Replace just the access token, in whichever store already holds the session. */
export function replaceAccessToken(access: string) {
  try {
    const store = window.localStorage.getItem(ACCESS) !== null ? window.localStorage : window.sessionStorage;
    store.setItem(ACCESS, access);
  } catch {
    /* ignore */
  }
}

export function clearTokens() {
  try {
    for (const store of [window.localStorage, window.sessionStorage]) {
      store.removeItem(ACCESS);
      store.removeItem(REFRESH);
    }
  } catch {
    /* ignore */
  }
}
