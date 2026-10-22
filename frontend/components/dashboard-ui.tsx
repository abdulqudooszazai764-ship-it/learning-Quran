"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { IconBadge, ICON_TONE, type IconTone } from "@/components/icon-badge";
import { LogoMark } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

/** Welcome hero: avatar-mark, greeting, optional chip and a row of stats. */
export function Hero({
  eyebrow,
  title,
  chip,
  stats,
}: {
  eyebrow: string;
  title: string;
  chip?: { icon: LucideIcon; label: string };
  stats: { label: string; value: string | number | undefined }[];
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/12 via-transparent to-secondary/10" />
      <div className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/80 shadow-glow ring-1 ring-primary/20">
            <LogoMark size={40} />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">{eyebrow}</p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
            {chip && (
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                  <chip.icon className="h-3 w-3" />
                  {chip.label}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stat({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="min-w-[5.5rem] rounded-xl border border-border/80 bg-background/70 px-3.5 py-2.5 backdrop-blur">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-heading text-lg font-semibold tracking-tight">{value ?? "—"}</p>
    </div>
  );
}

export function QuickLink({
  href,
  icon,
  label,
  hint,
  tone = "primary",
  external,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  hint: string;
  tone?: IconTone;
  external?: boolean;
}) {
  const cls = cn(
    "group flex items-center gap-3 rounded-2xl border border-border/80 border-s-4 bg-card/80 p-3.5 shadow-elevation-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-elevation-md",
    ICON_TONE[tone].border.replace("border-l-", "border-s-")
  );
  const body = (
    <>
      <IconBadge icon={icon} tone={tone} size="md" />
      <span className="min-w-0 leading-tight">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{hint}</span>
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
}

/** Rounded card with an uppercase caption and optional right-hand link. */
export function Panel({
  title,
  action,
  className,
  children,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border border-border/80 bg-card p-5 shadow-sm", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function LoadError({ error }: { error: unknown }) {
  const { tr } = useLanguage();
  if (!error) return null;
  const detail = error instanceof Error ? error.message : "";
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {tr("loadFailed")} {detail && <span className="opacity-80">({detail})</span>}
    </div>
  );
}

/** Loading skeleton, empty note, or the list itself — shared by every dashboard list. */
export function PanelBody({
  loading,
  empty,
  rows,
  children,
}: {
  loading: boolean;
  empty: boolean;
  rows?: number;
  children: ReactNode;
}) {
  const { tr } = useLanguage();
  if (loading) return <PanelSkeleton rows={rows} />;
  if (empty) return <EmptyNote>{tr("noUpcoming")}</EmptyNote>;
  return <>{children}</>;
}

export function PanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 rounded-xl" />
      ))}
    </div>
  );
}

/** One row in a class / student / question list. */
export function ListRow({
  icon: Icon,
  title,
  meta,
  tone = "primary",
}: {
  icon: LucideIcon;
  title: string;
  meta?: string;
  tone?: IconTone;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/50 px-4 py-3">
      <IconBadge icon={Icon} tone={tone} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{title}</p>
        {meta && <p className="truncate text-[11px] text-muted-foreground">{meta}</p>}
      </div>
    </div>
  );
}

export function useFormatDate() {
  const { lang } = useLanguage();
  return (iso: string) => {
    try {
      return new Date(iso).toLocaleString(lang, { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso;
    }
  };
}
