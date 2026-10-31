import { clsx, type ClassValue } from "clsx";

/**
 * Joins class names and drops falsy ones. There is no Tailwind merge step,
 * so callers must not pass two classes that set the same property.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
