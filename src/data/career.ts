// Relative import only: vite.config.ts also loads this file, and the "@" alias does not exist there.
import { JOBS } from "./jobs";

export const CAREER_START = Math.min(...JOBS.map((job) => Number(job.from)));

const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty",
];

export function yearsOfExperience(now: Date = new Date()): number {
  return now.getFullYear() - CAREER_START;
}

/** "Eleven", "Twelve", ... spelled out for prose; falls back to digits past twenty. */
export function yearsOfExperienceInWords(now: Date = new Date()): string {
  const years = yearsOfExperience(now);
  const word = NUMBER_WORDS[years] ?? String(years);
  return word.charAt(0).toUpperCase() + word.slice(1);
}
