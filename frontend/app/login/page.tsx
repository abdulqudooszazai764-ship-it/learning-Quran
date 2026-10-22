"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Suspense } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoLockup } from "@/components/logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { LoginForm } from "@/features/auth/login-form";
import { usePublicOnlyRoute } from "@/hooks/use-public-only-route";

function LoginScreen() {
  const { isLoading, isAuthenticated } = usePublicOnlyRoute();
  const { tr } = useLanguage();

  // Nothing but a skeleton while the auth check resolves or a redirect is
  // about to happen — avoids flashing the form at someone already signed in.
  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      {/* Brand panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground md:flex lg:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_50%)]" />
        <Link href="/" className="relative w-fit">
          <LogoLockup markSize={36} textClassName="text-xl" />
        </Link>
        <div className="relative max-w-md space-y-4">
          <motion.blockquote
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl font-semibold leading-snug tracking-tight"
          >
            {tr("signInHero")}
          </motion.blockquote>
          <p className="text-sm opacity-70">{tr("brandTagline")}</p>
        </div>
        <p className="relative text-xs opacity-50">Haseen Quran &amp; Islamic Studies Academy</p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="absolute end-4 top-4 flex items-center gap-1 sm:end-6 sm:top-6">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8 md:hidden">
            <LogoLockup markSize={32} />
          </div>

          <Card className="border-border/80 shadow-elevation-md">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="font-heading text-2xl tracking-tight">{tr("signInTitle")}</CardTitle>
              <p className="text-sm text-muted-foreground">{tr("signInSub")}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 pt-2">
              <LoginForm />
              <p className="text-center text-sm text-muted-foreground">
                {tr("noAccount")}{" "}
                <Link
                  href="/admission"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {tr("needAccess")}
                </Link>
              </p>
            </CardContent>
          </Card>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {tr("backToSite")}
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginScreen />
    </Suspense>
  );
}
