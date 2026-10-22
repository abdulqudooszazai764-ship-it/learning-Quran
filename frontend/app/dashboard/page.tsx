"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { homeFor } from "@/lib/redirect";

/** /dashboard itself just forwards to the signed-in user's own dashboard. */
export default function DashboardIndex() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace(homeFor(user.role));
  }, [user, router]);
  return null;
}
