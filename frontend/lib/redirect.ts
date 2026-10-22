import type { Role } from "@/lib/auth";

/**
 * Only same-origin paths may be used as a post-login destination, or
 * `?next=https://evil.example` becomes an open redirect.
 */
export function safeNextPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}

export function homeFor(role: Role | undefined | null): string {
  if (role === "admin") return "/dashboard/admin";
  if (role === "teacher") return "/dashboard/teacher";
  if (role === "family") return "/dashboard/family";
  return "/login";
}
