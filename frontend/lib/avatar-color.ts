/**
 * Deterministic per-person avatar color, WhatsApp-style: the same seed
 * (user id, falling back to email) always maps to the same color for
 * that person, without storing anything — pure function of the seed.
 */
import type { CSSProperties } from "react";

// Chosen for contrast with white initials and to work in both light and
// dark mode without a separate dark-mode palette.
const PALETTE = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD",
  "#7986CB", "#64B5F6", "#4FC3F7", "#4DD0E1",
  "#4DB6AC", "#81C784", "#AED581", "#DCE775",
  "#FFD54F", "#FFB74D", "#FF8A65", "#A1887F",
] as const;

function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  return Math.abs(hash);
}

/** Hex color for this seed's avatar background. */
export function avatarColorFor(seed: string | null | undefined): string {
  const key = seed?.trim() || "?";
  return PALETTE[hashString(key) % PALETTE.length];
}

/**
 * Inline style for an AvatarFallback. The component's default className
 * applies a `bg-linear-to-br` (a background-image), which would sit on
 * top of and fully hide a plain backgroundColor — so this explicitly
 * clears backgroundImage too, not just sets a color.
 */
export function avatarStyleFor(seed: string | null | undefined): CSSProperties {
  return { backgroundColor: avatarColorFor(seed), backgroundImage: "none", color: "#fff" };
}
