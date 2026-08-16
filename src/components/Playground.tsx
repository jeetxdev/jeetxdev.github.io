import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { tokenizeLine } from "@/lib/tokenize";
import { PAYLOADS, ROUTES, type Route } from "@/data/payloads";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionLabel } from "./SectionLabel";

const STREAM_CHARS_PER_TICK = 7;
const STREAM_TICK_MS = 16;
const REDUCED_MOTION_MS = 28;

export function Playground() {
  const reducedMotion = useReducedMotion();
  const [route, setRoute] = useState<Route>("/whoami");
  const [shown, setShown] = useState(0);
  const [ms, setMs] = useState(0);
  const startedRef = useRef(0);

  useEffect(() => {
    const total = PAYLOADS[route].length;

    if (reducedMotion) {
      setShown(total);
      setMs(REDUCED_MOTION_MS);
      return;
    }

    setShown(0);
    setMs(0);
    startedRef.current = performance.now();

    const interval = setInterval(() => {
      setShown((prev) => {
        const next = Math.min(total, prev + STREAM_CHARS_PER_TICK);
        if (next >= total) clearInterval(interval);
        return next;
      });
      setMs(Math.round(performance.now() - startedRef.current));
    }, STREAM_TICK_MS);

    return () => clearInterval(interval);
  }, [route, reducedMotion]);

  const payload = PAYLOADS[route];
  const visible = payload.slice(0, shown);
  const done = shown >= payload.length;
  const lines = visible.split("\n");
  const status = done ? "200 OK" : "streaming…";

  const pick = (next: Route) => {
    if (next === route) return;
    setRoute(next);
  };

  return (
    <section id="playground" className="pt-[104px]">
      <SectionLabel>The short version, as an API</SectionLabel>

      <div data-reveal className="glass-panel mt-[22px] overflow-hidden rounded-[18px]">
        <div
          data-routes
          className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] bg-white/[0.025] px-4 py-[14px]"
        >
          <span className="rounded-md bg-success/10 px-2 py-1 font-mono text-[12px] text-success">
            GET
          </span>

          {ROUTES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => pick(r)}
              className={cn(
                "cursor-pointer rounded-lg px-[11px] py-[6px] font-mono text-[12.5px] transition-colors duration-200 max-[421px]:text-[11.5px]",
                r === route
                  ? "border border-accent/50 bg-accent/[0.14] text-[#d6f4fd]"
                  : "border border-white/10 bg-transparent text-text-dim hover:border-white/[0.24] hover:text-ink",
              )}
            >
              {r}
            </button>
          ))}

          <span
            data-meta
            className="ml-auto flex items-center gap-2 font-mono text-[11.5px] text-text-dimmer max-[421px]:ml-0 max-[421px]:w-full"
          >
            <span>{status}</span>
            <span>·</span>
            <span>{ms} ms</span>
          </span>
        </div>

        <div
          data-code-wrap
          className="overflow-x-auto px-[22px] pt-5 pb-6 max-[721px]:px-[14px] max-[721px]:pt-4 max-[721px]:pb-5"
        >
          <div
            data-code
            className="min-h-[236px] font-mono text-[13.5px] leading-[1.55] max-[721px]:text-[12px]"
          >
            {lines.map((line, li) => (
              <div key={li} className="min-h-[1.55em] whitespace-pre">
                {tokenizeLine(line).map((token, ti) => (
                  <span key={ti} style={{ color: token.color }}>
                    {token.text}
                  </span>
                ))}
                {!done && li === lines.length - 1 ? (
                  <span aria-hidden="true" className="caret" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p data-reveal className="mt-[14px] font-mono text-[12px] text-text-faint">
        Yes, it&rsquo;s really streaming — the whole panel is ~60 lines of vanilla JS.
      </p>
    </section>
  );
}
