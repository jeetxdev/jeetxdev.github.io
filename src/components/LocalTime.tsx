import { useEffect, useMemo, useState } from "react";

const HOME_ZONE = "Asia/Kolkata";
const HOME_LABEL = "bangalore";

const TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: HOME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const PARTS_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: HOME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Minutes that Bangalore sits ahead of (or behind) the visitor's own clock. */
function homeLagMinutes(date: Date) {
  const parts = PARTS_FORMAT.formatToParts(date);
  const at = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const homeAsUtc = Date.UTC(
    at("year"),
    at("month") - 1,
    at("day"),
    at("hour"),
    at("minute"),
    at("second"),
  );
  const homeOffset = Math.round(
    (homeAsUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000,
  );

  return homeOffset + date.getTimezoneOffset();
}

function formatLag(minutes: number) {
  if (minutes === 0) return "the same clock as you";
  const hours = Math.floor(Math.abs(minutes) / 60);
  const rest = Math.abs(minutes) % 60;
  const span = !hours
    ? `${rest}m`
    : rest
      ? `${hours}h${String(rest).padStart(2, "0")}`
      : `${hours}h`;
  return `${span} ${minutes > 0 ? "ahead of" : "behind"} you`;
}

/**
 * A live local clock for the person about to write the email - it answers
 * when the message lands and how far off your day is from theirs.
 */
export function LocalTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { hours, minutes, lag } = useMemo(() => {
    const [h, m] = TIME_FORMAT.format(now).split(":");
    return { hours: h, minutes: m, lag: formatLag(homeLagMinutes(now)) };
  }, [now]);

  return (
    <p className="mt-[14px] flex flex-wrap items-center gap-[7px] font-mono text-[12px] text-text-faint">
      <span
        aria-hidden="true"
        className="h-[6px] w-[6px] shrink-0 rounded-full bg-success"
      />
      <span className="tabular-nums text-text-dim">
        {hours}
        <span className="mx-[1px] animate-[time-pulse_1.6s_ease-in-out_infinite]">
          :
        </span>
        {minutes}
      </span>
      <span>
        in {HOME_LABEL} - {lag}
      </span>
    </p>
  );
}
