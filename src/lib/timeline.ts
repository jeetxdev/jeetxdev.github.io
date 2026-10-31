import { CAREER_START } from "@/data/career";
import { JOBS, type Job } from "@/data/jobs";

const CURRENT_MARKER = "now";
/** A job that starts and ends in the same year still gets a visible bar. */
const MIN_SPAN_YEARS = 1;

export type TimelineBar = {
  job: Job;
  spanYears: number;
  isCurrent: boolean;
};

export function endYear(job: Job, now: Date = new Date()): number {
  return job.to === CURRENT_MARKER ? now.getFullYear() : Number(job.to);
}

export function timelineYears(now: Date = new Date()): number {
  return now.getFullYear() - CAREER_START;
}

/** Oldest first, so the bars read left to right like the dimension line above them. */
export function timelineBars(now: Date = new Date()): TimelineBar[] {
  return [...JOBS].reverse().map((job) => ({
    job,
    spanYears: Math.max(MIN_SPAN_YEARS, endYear(job, now) - Number(job.from)),
    isCurrent: job.to === CURRENT_MARKER,
  }));
}
