import { API_URL } from "@/lib/utils";
import { clearTokens, getAccessToken, getRefreshToken, replaceAccessToken } from "@/lib/session";

export class ApiError extends Error {
  status: number;
  retryAfter?: number;
  constructor(message: string, status: number, retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

async function parse(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

function messageFrom(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === "string") return d.detail;
    const first = Object.values(d)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  }
  return fallback;
}

export function formatApiError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof TypeError) return "Unable to reach the server. Check your connection and try again.";
  return fallback;
}

async function tryRefresh(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await parse(res);
    if (typeof data.access !== "string") return false;
    replaceAccessToken(data.access);
    return true;
  } catch {
    return false;
  }
}

/** JSON request. Sends the bearer token and transparently refreshes it once on 401. */
export async function api<T>(
  path: string,
  init: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = init;

  const send = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = auth ? getAccessToken() : null;
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  };

  let res = await send();
  if (res.status === 401 && auth && (await tryRefresh())) res = await send();

  const data = await parse(res);
  if (!res.ok) {
    if (res.status === 401 && auth) clearTokens();
    const retry = Number(res.headers.get("Retry-After")) || undefined;
    throw new ApiError(messageFrom(data, `Request failed (${res.status})`), res.status, retry);
  }
  return data as T;
}
