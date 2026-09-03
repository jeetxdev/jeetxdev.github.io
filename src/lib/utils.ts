import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Scales a colour's opacity by `ratio`, keeping whatever alpha the token
 * already carries. Used where a value has to fade continuously (the work
 * timeline receding with age) and a static utility class will not do.
 */
export function withAlpha(color: string, ratio: number): string {
  const percent = Math.max(0, Math.min(1, ratio)) * 100;
  return `color-mix(in srgb, ${color} ${percent.toFixed(1)}%, transparent)`;
}
