"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Color tokens used across the dashboards. */
export const ICON_TONE = {
  violet: {
    border: "border-l-violet-500",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  },
  fuchsia: {
    border: "border-l-fuchsia-500",
    badge: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300",
  },
  amber: {
    border: "border-l-amber-500",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  cyan: {
    border: "border-l-cyan-500",
    badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
  },
  sky: {
    border: "border-l-sky-500",
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-300",
  },
  emerald: {
    border: "border-l-emerald-500",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  primary: {
    border: "border-l-primary",
    badge: "border-primary/30 bg-primary/10 text-primary",
  },
} as const;

export type IconTone = keyof typeof ICON_TONE;

type IconBadgeProps = {
  icon: LucideIcon;
  tone?: IconTone;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Shared icon chip used across the dashboards.
 * Keeps the colored border + icon box look consistent and DRY.
 */
export function IconBadge({
  icon: Icon,
  tone = "primary",
  size = "md",
  className,
}: IconBadgeProps) {
  const t = ICON_TONE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg border",
        t.badge,
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]"} strokeWidth={1.75} />
    </span>
  );
}
