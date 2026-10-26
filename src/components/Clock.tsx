import { useEffect, useState } from "react";
import { HOME_ZONE } from "@/data/profile";

const CLOCK_INTERVAL_MS = 30_000;

const CLOCK_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: HOME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function formatNow(): string {
  return `${CLOCK_FORMAT.format(new Date()).replace(/,/g, "")} IST`;
}

export function Clock() {
  const [label, setLabel] = useState(formatNow);

  useEffect(() => {
    const id = window.setInterval(() => setLabel(formatNow()), CLOCK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className="hidden px-2 tabular-nums text-muted sm:inline"
      aria-label="Time in Bangalore"
    >
      {label}
    </span>
  );
}
