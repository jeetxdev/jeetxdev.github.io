import { memo, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { tokenizeLine } from "@/lib/tokenize";
import { PAYLOADS, ROUTES, type Route } from "@/data/payloads";
import { useFrameHeartbeat } from "@/hooks/useFrameHeartbeat";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionLabel } from "./SectionLabel";

const STREAM_CHARS_PER_SECOND = 240;
const REDUCED_MOTION_MS = 28;
const NEWLINE = 10;

/** Rough stand-in for BPE: word runs, whitespace runs, single punctuation. */
const TOKEN_SPLIT_RE = /\s+|\w+|./g;
const MIN_TOKEN_CHARS = 6;
const MAX_TOKEN_CHARS = 8;
const MIN_TOKEN_GAP = 0.5;
const TOKEN_GAP_JITTER = 1.6;
const LINE_END_GAP = 0.9;

type StreamStep = { end: number; at: number };

const CodeLine = memo(function CodeLine({ line }: { line: string }) {
  return (
    <div className="min-h-[1.55em] whitespace-pre">
      {tokenizeLine(line).map((token, ti) => (
        <span key={ti} style={{ color: token.color }}>
          {token.text}
        </span>
      ))}
    </div>
  );
});

/**
 * Merges the raw pieces up to MIN_TOKEN_CHARS so gaps land either side of a
 * frame boundary. Splitting on punctuation alone yields ~2 char tokens, which
 * at this pace arrive faster than the display refreshes and collapse back into
 * a linear reveal. Line ends always close a chunk so the pause reads there.
 */
function splitTokens(payload: string): string[] {
  const tokens: string[] = [];
  let chunk = "";

  for (const piece of payload.match(TOKEN_SPLIT_RE) ?? []) {
    for (let i = 0; i < piece.length; i += MAX_TOKEN_CHARS) {
      chunk += piece.slice(i, i + MAX_TOKEN_CHARS);
      if (chunk.length >= MIN_TOKEN_CHARS || chunk.includes("\n")) {
        tokens.push(chunk);
        chunk = "";
      }
    }
  }
  if (chunk) tokens.push(chunk);

  return tokens;
}

/**
 * Arrival schedule for one payload, in token-sized chunks with uneven gaps so
 * the reveal reads like real token streaming rather than a linear typewriter.
 * Gaps are drawn in arbitrary units and then scaled to the configured overall
 * pace, so the cadence varies run to run while total duration stays fixed.
 */
function buildSchedule(payload: string): StreamStep[] {
  const steps: StreamStep[] = [];
  let at = 0;
  let end = 0;

  for (const token of splitTokens(payload)) {
    end += token.length;
    at += MIN_TOKEN_GAP + Math.random() * TOKEN_GAP_JITTER;
    if (token.includes("\n")) at += LINE_END_GAP;
    steps.push({ end, at });
  }

  const span = steps.at(-1)?.at ?? 0;
  if (span === 0) return steps;

  const scale = ((payload.length / STREAM_CHARS_PER_SECOND) * 1000) / span;
  return steps.map((s) => ({ end: s.end, at: s.at * scale }));
}

function countNewlines(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === NEWLINE) count++;
  }
  return count;
}

/**
 * Paints one line by reusing the host's existing spans instead of rebuilding
 * them. Token count is stable between most frames, so this usually degrades to
 * a single textContent write on the trailing span.
 */
function paintLine(host: HTMLElement, line: string) {
  const tokens = tokenizeLine(line);

  while (host.childElementCount > tokens.length) {
    host.lastElementChild?.remove();
  }
  while (host.childElementCount < tokens.length) {
    host.appendChild(document.createElement("span"));
  }

  tokens.forEach((token, i) => {
    const span = host.children[i];
    if (!(span instanceof HTMLElement)) return;
    if (span.textContent !== token.text) span.textContent = token.text;
    if (span.style.color !== token.color) span.style.color = token.color;
  });
}

export function Playground() {
  const reducedMotion = useReducedMotion();
  const [route, setRoute] = useState<Route>("/whoami");
  const [settled, setSettled] = useState(0);
  const [done, setDone] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const activeTextRef = useRef<HTMLSpanElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);

  useFrameHeartbeat(sectionRef, !reducedMotion);

  const payload = PAYLOADS[route];
  const payloadLines = useMemo(() => payload.split("\n"), [payload]);

  useEffect(() => {
    const msHost = msRef.current;

    if (reducedMotion) {
      setSettled(payloadLines.length);
      setDone(true);
      if (msHost) msHost.textContent = String(REDUCED_MOTION_MS);
      return;
    }

    setSettled(0);
    setDone(false);
    if (activeTextRef.current) activeTextRef.current.textContent = "";

    const schedule = buildSchedule(payload);
    const started = performance.now();
    let frame = 0;
    let arrived = 0;

    // Progress is read off the schedule by elapsed time, so the cadence holds
    // at any refresh rate and every update lands on a real frame boundary.
    const step = (now: number) => {
      const elapsed = now - started;
      if (msHost) msHost.textContent = String(Math.round(elapsed));

      const previous = arrived;
      while (
        arrived < schedule.length &&
        (schedule[arrived]?.at ?? 0) <= elapsed
      ) {
        arrived++;
      }

      if (arrived >= schedule.length) {
        setSettled(payloadLines.length);
        setDone(true);
        return;
      }

      // Tokens arrive slower than the display refreshes, so most frames have
      // nothing new to show and skip the repaint entirely.
      if (arrived !== previous) {
        // React owns the settled lines and only reconciles when one completes;
        // the in-progress line is written straight to the DOM, keeping React
        // off the per-frame path entirely.
        const visible = payload.slice(0, schedule[arrived - 1]?.end ?? 0);
        setSettled(countNewlines(visible));

        const host = activeTextRef.current;
        if (host) paintLine(host, visible.slice(visible.lastIndexOf("\n") + 1));
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [payload, payloadLines, reducedMotion]);

  const status = done ? "200 OK" : "streaming…";

  const pick = (next: Route) => {
    if (next === route) return;
    setRoute(next);
  };

  return (
    <section ref={sectionRef} id="playground" className="pt-[104px]">
      <SectionLabel>The short version, as an API</SectionLabel>

      <div
        data-reveal
        className="glass-panel mt-[22px] overflow-hidden rounded-[18px]"
      >
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
            <span>
              <span ref={msRef} /> ms
            </span>
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
            {payloadLines.slice(0, settled).map((line, li) => (
              <CodeLine key={li} line={line} />
            ))}

            {!done ? (
              <div className="min-h-[1.55em] whitespace-pre">
                <span ref={activeTextRef} />
                <span aria-hidden="true" className="caret" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <p data-reveal className="mt-[14px] font-mono text-[12px] text-text-faint">
        Yes, it&rsquo;s really streaming - the whole panel is ~60 lines of
        vanilla JS.
      </p>
    </section>
  );
}
