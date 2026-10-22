"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/lib/auth";
import { homeFor } from "@/lib/redirect";

/** Which role owns each /dashboard/<segment>. */
const SEGMENT_ROLE: Record<string, Role> = { admin: "admin", teacher: "teacher", family: "family" };

/**
 * Guards every /dashboard/* page: signed-out visitors are sent to /login
 * (remembering where they were going); a signed-in user who opens another
 * role's area is sent to their own. Admins may also open the teacher area.
 */
export function useRoleGuard() {
  const { user, isLoading, justSignedOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const segment = pathname.split("/")[2] ?? "";
  const required = SEGMENT_ROLE[segment];
  const allowed = !!user && (!required || user.role === required || (user.role === "admin" && required === "teacher"));

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace(justSignedOut() ? "/login" : `/login?next=${encodeURIComponent(pathname)}`);
    else if (!allowed) router.replace(homeFor(user.role));
  }, [isLoading, user, allowed, pathname, router, justSignedOut]);

  return { user, isLoading, ready: !isLoading && allowed };
}
