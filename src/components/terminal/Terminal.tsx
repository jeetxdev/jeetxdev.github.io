import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { PROMPT_USER } from "@/data/profile";
import type { Theme } from "@/lib/theme";
import { CLEAR, COMMAND_NAMES, COMPLETIONS, runCommand } from "./commands";
import { Prompt, RUN_ATTRIBUTE, RunLink } from "./TerminalBits";

const TYPE_DELAY_MS = 70;
const INTRO_DELAY_MS = 700;
const INTRO_COMMAND = "whoami";
/** Space left above a command's prompt line when its output is scrolled into view. */
const PROMPT_SCROLL_OFFSET_PX = 8;

const CHIP_COMMANDS = ["whoami", "ls work/", "cat stack.json", "contact", "resume", "help"];
const CHIP_CLASS = "border border-rule bg-paper px-2.5 py-1 hover:border-accent hover:text-accent";

type Entry = {
  id: number;
  node: ReactNode;
};

/** Keys that change nothing on their own, so they keep a Tab cycle alive. Shift starts Shift+Tab. */
const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta"]);

/** A Tab cycle in progress. `index` is -1 until the second Tab fills in the first match. */
type TabCycle = { matches: string[]; index: number };

type PendingScroll = { kind: "line"; id: number } | { kind: "bottom" } | null;

function commonPrefix(words: string[]): string {
  return words.reduce((prefix, word) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === word[i]) i++;
    return prefix.slice(0, i);
  });
}

/**
 * zsh-autosuggestions style: the newest matching history entry wins, then the
 * known commands. Only a strictly longer match is worth showing.
 */
function suggestFor(input: string, past: string[]): string {
  if (input.trim() === "") return "";
  const extendsInput = (candidate: string) => candidate.length > input.length && candidate.startsWith(input);
  for (let i = past.length - 1; i >= 0; i--) {
    if (extendsInput(past[i])) return past[i];
  }
  return COMPLETIONS.find(extendsInput) ?? "";
}

function lastLoginLine(): string {
  const now = new Date();
  return `Last login: ${now.toDateString()} ${now.toTimeString().slice(0, 5)} on ttys001`;
}

type TerminalProps = {
  active: boolean;
  setTheme: (theme: Theme) => void;
};

export function Terminal({ active, setTheme }: TerminalProps) {
  const nextId = useRef(0);
  const makeEntry = (node: ReactNode): Entry => ({ id: nextId.current++, node });

  const [entries, setEntries] = useState<Entry[]>(() => [
    makeEntry(<div className="text-muted">{lastLoginLine()}</div>),
    makeEntry(
      <div className="text-muted">
        Type <RunLink command="help" />, or pick a command below.
      </div>,
    ),
  ]);
  const [input, setInput] = useState("");

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingScroll = useRef<PendingScroll>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(0);
  const introTimer = useRef<number | null>(null);
  const welcomeId = useRef<number | null>(null);
  const tabCycle = useRef<TabCycle | null>(null);
  // Tab stays inside the terminal, so Esc is the keyboard's way out. Keyboard users must never be trapped.
  const releaseFocus = useRef(false);
  const wasActive = useRef(active);

  const append = (nodes: ReactNode[]) => {
    const added = nodes.map(makeEntry);
    setEntries((prev) => [...prev, ...added]);
    return added;
  };

  // Long output stays readable from its first line. The browser clamps short output to the bottom.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    const scroll = pendingScroll.current;
    if (!body || !scroll) return;
    pendingScroll.current = null;
    const line =
      scroll.kind === "line"
        ? body.querySelector<HTMLElement>(`[data-entry="${scroll.id}"]`)
        : null;
    body.scrollTop = line ? line.offsetTop - PROMPT_SCROLL_OFFSET_PX : body.scrollHeight;
  }, [entries]);

  const execute = useCallback(
    (raw: string, keepScroll = false) => {
      const command = raw.trim();
      const prompt: Entry = { id: nextId.current++, node: <Prompt command={command} /> };
      const result = runCommand(command, { setTheme });
      if (result === CLEAR) {
        setEntries([]);
        return;
      }
      const output: Entry[] = result.map((node) => ({ id: nextId.current++, node }));
      if (!keepScroll) pendingScroll.current = { kind: "line", id: prompt.id };
      setEntries((prev) => [...prev, prompt, ...output]);
    },
    [setTheme],
  );

  const cancelIntro = () => {
    if (introTimer.current === null) return;
    window.clearTimeout(introTimer.current);
    introTimer.current = null;
    setInput("");
  };

  const submit = (command: string) => {
    cancelIntro();
    tabCycle.current = null;
    if (command.trim()) history.current.push(command.trim());
    historyIndex.current = history.current.length;
    execute(command);
  };

  // Types `whoami` once on arrival, unless the visitor prefers no motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let typed = 0;
    const typeNext = () => {
      if (typed < INTRO_COMMAND.length) {
        typed++;
        setInput(INTRO_COMMAND.slice(0, typed));
        introTimer.current = window.setTimeout(typeNext, TYPE_DELAY_MS);
        return;
      }
      introTimer.current = null;
      setInput("");
      // Keep the banner headline in view after the intro.
      execute(INTRO_COMMAND, true);
    };
    introTimer.current = window.setTimeout(typeNext, INTRO_DELAY_MS);
    return () => {
      if (introTimer.current !== null) window.clearTimeout(introTimer.current);
      introTimer.current = null;
    };
  }, [execute]);

  // Returning from the page view greets once and resumes at the bottom of the session.
  useEffect(() => {
    if (active && !wasActive.current) {
      setEntries((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].id === welcomeId.current) return prev;
        const welcome: Entry = {
          id: nextId.current++,
          node: (
            <div className="pt-2 text-muted">Welcome back. Your session is where you left it.</div>
          ),
        };
        welcomeId.current = welcome.id;
        return [...prev, welcome];
      });
      pendingScroll.current = { kind: "bottom" };
      inputRef.current?.focus({ preventScroll: true });
    }
    wasActive.current = active;
  }, [active]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input;
    setInput("");
    submit(command);
  };

  const suggestion = suggestFor(input, history.current);

  // Like zsh: the first press lists the matches, each further press fills in the next one.
  const complete = (backward: boolean) => {
    const cycle = tabCycle.current;
    if (cycle) {
      const step = backward ? -1 : 1;
      const start = cycle.index === -1 && backward ? 0 : cycle.index;
      cycle.index = (start + step + cycle.matches.length) % cycle.matches.length;
      setInput(cycle.matches[cycle.index]);
      return;
    }
    const matches =
      input.trim() === "" ? COMMAND_NAMES : COMPLETIONS.filter((c) => c.startsWith(input));
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      const prefix = commonPrefix(matches);
      tabCycle.current = { matches, index: -1 };
      setInput(prefix);
      pendingScroll.current = { kind: "bottom" };
      append([
        <Prompt command={prefix} />,
        <div className="flex flex-wrap gap-x-6 text-muted">
          {matches.map((match) => (
            <span key={match}>{match}</span>
          ))}
        </div>,
      ]);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    cancelIntro();
    const past = history.current;
    const field = event.currentTarget;
    const caretAtEnd = field.selectionStart === input.length && field.selectionEnd === input.length;
    const isArrow = event.key === "ArrowUp" || event.key === "ArrowDown";
    // With no history yet, the arrows would do nothing, so they step through commands like Tab.
    const arrowCompletes = isArrow && past.length === 0;
    if (event.key !== "Tab" && !arrowCompletes && !MODIFIER_KEYS.has(event.key)) {
      tabCycle.current = null;
      releaseFocus.current = event.key === "Escape";
    }
    if ((event.key === "ArrowRight" || event.key === "End") && suggestion && caretAtEnd) {
      event.preventDefault();
      setInput(suggestion);
    } else if (arrowCompletes) {
      event.preventDefault();
      complete(event.key === "ArrowUp");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      historyIndex.current = Math.max(0, historyIndex.current - 1);
      setInput(past[historyIndex.current]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex.current = Math.min(past.length, historyIndex.current + 1);
      setInput(past[historyIndex.current] ?? "");
    } else if (event.key === "Tab" && !releaseFocus.current) {
      event.preventDefault();
      complete(event.shiftKey);
    }
  };

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const trigger = target.closest<HTMLElement>(`[${RUN_ATTRIBUTE}]`);
    if (trigger) {
      submit(trigger.getAttribute(RUN_ATTRIBUTE) ?? "");
      return;
    }
    // Clicking empty terminal space focuses the prompt, unless the visitor is selecting text.
    if (!bodyRef.current?.contains(target)) return;
    if (target.closest("a, button") || String(window.getSelection())) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div hidden={!active}>
      <section
        aria-labelledby="hero-heading"
        className="h-[calc(100svh-2.06rem)] min-h-[28rem] pt-3 pb-5 sm:pt-5 sm:pb-6"
      >
        <div className="term-window flex h-full flex-col border border-ink bg-paper" onClick={onClick}>
          <div className="flex items-center gap-3 border-b border-ink bg-surface px-4 py-3 font-mono text-[12.5px] text-muted sm:px-5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-dot" />
            </span>
            <span className="flex-1 text-center">{PROMPT_USER}: ~</span>
            <span aria-hidden="true">zsh</span>
          </div>

          <div
            ref={bodyRef}
            className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5 font-mono text-[13.5px] leading-relaxed sm:px-8 sm:py-7 sm:text-[15px]"
          >
            {/* Login banner: the page headline lives inside the terminal. */}
            <div className="mb-4 border-b border-dashed border-rule pb-4">
              <h1
                id="hero-heading"
                tabIndex={-1}
                className="font-mono text-lg font-bold tracking-[-0.02em] sm:text-xl"
              >
                Eleven years of making the whole stack{" "}
                <em className="-ml-[0.15em] font-serif text-[1.6em] leading-[0.6] font-semibold text-accent italic">
                  behave.
                </em>
              </h1>
            </div>
            <div role="log" aria-live="polite" aria-label="Terminal output" className="space-y-1">
              {entries.map((entry) => (
                <div key={entry.id} data-entry={entry.id}>
                  {entry.node}
                </div>
              ))}
            </div>
            <form className="mt-1 flex items-center gap-2" autoComplete="off" onSubmit={onSubmit}>
              <label htmlFor="term-input" className="shrink-0">
                <span className="text-accent">{PROMPT_USER}</span>:~$
                <span className="sr-only"> Terminal command</span>
              </label>
              {/* The ghost repeats the typed text invisibly, so the suggested rest
                  starts exactly where the typed text ends. */}
              <div className="relative min-w-0 flex-1">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre"
                >
                  <span className="invisible">{input}</span>
                  <span className="text-muted opacity-60">{suggestion.slice(input.length)}</span>
                </div>
                <input
                  id="term-input"
                  ref={inputRef}
                  className="term-input relative w-full text-ink"
                  type="text"
                  spellCheck={false}
                  autoCapitalize="off"
                  aria-describedby="term-help"
                  value={input}
                  onChange={(event) => {
                    tabCycle.current = null;
                    setInput(event.target.value);
                  }}
                  onKeyDown={onKeyDown}
                  onBlur={() => {
                    releaseFocus.current = false;
                  }}
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto border-t border-ink bg-surface px-4 py-3 font-mono text-[12.5px] whitespace-nowrap sm:flex-wrap sm:overflow-visible sm:px-8">
            <span id="term-help" className="mr-1 text-muted">
              try:
              <span className="sr-only">
                {" "}
                a command below. Tab completes. Press Escape, then Tab, to leave the terminal.
              </span>
            </span>
            {CHIP_COMMANDS.map((command) => (
              <button key={command} type="button" className={CHIP_CLASS} {...{ [RUN_ATTRIBUTE]: command }}>
                {command}
              </button>
            ))}
            <button type="button" className={`${CHIP_CLASS} text-muted`} {...{ [RUN_ATTRIBUTE]: "clear" }}>
              clear
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
