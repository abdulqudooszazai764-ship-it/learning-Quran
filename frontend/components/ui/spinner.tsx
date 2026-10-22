import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
};

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

/**
 * Modern inline spinner. Prefer Skeleton for page/section loading;
 * use Spinner for buttons, overlays, and short async actions.
 */
export function Spinner({ className, size = "md", label }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className={cn("inline-flex items-center justify-center gap-2", className)}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  );
}
