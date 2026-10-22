"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";

import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/hooks/use-auth";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, gcTime: 15 * 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    // attribute="data-theme" keeps the public site's [data-theme="dark"] CSS working.
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="haseen-theme">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
