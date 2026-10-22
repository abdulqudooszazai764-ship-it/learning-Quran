"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { homeFor, safeNextPath } from "@/lib/redirect";

/** For /login: someone already signed in goes straight to their dashboard. */
export function usePublicOnlyRoute() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next");

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace(safeNextPath(next, homeFor(user?.role)));
  }, [isLoading, isAuthenticated, user, next, router]);

  return { isLoading, isAuthenticated };
}
