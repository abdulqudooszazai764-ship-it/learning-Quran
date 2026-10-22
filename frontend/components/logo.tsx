import { BookOpen } from "lucide-react";

import { cn } from "@/lib/utils";

/** Single source of truth for the Haseen Academy mark. */
export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/75 text-primary-foreground shadow-elevation-sm",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <BookOpen style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2} />
    </span>
  );
}

export function LogoLockup({
  className,
  markSize = 28,
  textClassName,
}: {
  className?: string;
  markSize?: number;
  textClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark size={markSize} />
      <span className={cn("font-heading text-lg font-semibold tracking-tight", textClassName)}>
        Haseen <span className="text-primary">Academy</span>
      </span>
    </span>
  );
}
