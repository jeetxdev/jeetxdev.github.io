import type { ReactNode } from "react";
import { JOBS } from "@/data/jobs";
import {
  AVAILABILITY,
  EMAIL,
  FAVOURITE_TOOL,
  GITHUB_LABEL,
  GITHUB_URL,
  LINKEDIN_LABEL,
  LINKEDIN_URL,
  NAME,
  PROMPT_USER,
  RESUME_LINK_PROPS,
  STACK,
} from "@/data/profile";
import { INITIALS_ASCII } from "@/data/initialsAscii";
import type { Theme } from "@/lib/theme";
import { Bio } from "../Bio";
import { RunLink, TermLink } from "./TerminalBits";

/** Returned instead of output when the command empties the screen. */
export const CLEAR = "clear";

export type CommandResult = ReactNode[] | typeof CLEAR;

export type CommandContext = {
  setTheme: (theme: Theme) => void;
};

type Command = (args: string[], context: CommandContext) => CommandResult;

const PROSE_CLASS = "max-w-[60ch] font-sans text-[16px] leading-relaxed";
const NEXT_ROW_CLASS = "flex flex-wrap gap-x-4 pt-2 text-muted";
const THEME_NAMES: Record<string, Theme> = { day: "light", night: "dark" };

/** The stack line has room for a few names, so it shows the first ones from each layer. */
const FETCH_STACK = STACK.slice(0, 3).flatMap(({ tools }) => tools.slice(0, 2));
/** The card ends with the terminal palette, as fastfetch does. These are the terminal's own colours. */
const PALETTE_CLASSES = ["text-ink", "text-muted", "text-accent", "text-danger", "text-rule", "text-surface"];
/** whoami prints a fastfetch-style card, so the real tools' names print it too. */
const ALIASES: Record<string, string> = { fastfetch: "whoami", neofetch: "whoami" };

const COMMANDS: Record<string, Command> = {
  help: showHelp,
  whoami: showWhoami,
  ls: listFiles,
  cat: catFile,
  contact: showContact,
  resume: showResume,
  theme: setTheme,
  clear: () => CLEAR,
};

/** `help` lists full commands by what they show, so visitors need not guess which file holds what. */
const HELP_ROWS = [
  { command: "whoami", describe: "who I am, at a glance" },
  { command: "cat about.txt", describe: "about me" },
  { command: "ls work/", describe: "work experience" },
  { command: "cat stack.json", describe: "tech stack" },
  { command: "contact", describe: "email and links" },
  { command: "resume", describe: "download resume" },
  { command: "theme day", describe: "light theme" },
  { command: "theme night", describe: "dark theme" },
  { command: "clear", describe: "clear screen" },
  { command: "help", describe: "show this list" },
];

/** What Tab offers on an empty prompt, as zsh lists every command. */
export const COMMAND_NAMES = Object.keys(COMMANDS);

export const COMPLETIONS = [
  "help",
  "whoami",
  "ls",
  "ls work/",
  "cat about.txt",
  "cat stack.json",
  "contact",
  "resume",
  "theme day",
  "theme night",
  "clear",
  ...JOBS.map((job) => `cat work/${job.slug}`),
];

function error(message: ReactNode): ReactNode {
  return <div className="text-danger">{message}</div>;
}

function muted(message: ReactNode, className = ""): ReactNode {
  return <div className={`text-muted ${className}`}>{message}</div>;
}

function showHelp(): CommandResult {
  return [
    <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-0.5 sm:grid-cols-[10rem_1fr]">
      {HELP_ROWS.map(({ command, describe }) => [
        <div key={`${command}-run`}>
          <RunLink command={command} />
        </div>,
        <div key={`${command}-describe`} className="text-muted">
          {describe}
        </div>,
      ])}
    </div>,
    muted("Tab completes. → accepts the faded suggestion. ↑ and ↓ walk your history."),
    muted("Esc, then Tab, leaves the terminal."),
  ];
}

function fetchRow(label: string, value: ReactNode): ReactNode {
  return (
    <div key={label} className="grid grid-cols-[5.5rem_1fr]">
      <span className="font-bold text-accent">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function showWhoami(): CommandResult {
  return [
    <div className="flex gap-8 pt-1">
      <pre
        aria-hidden="true"
        className="hidden shrink-0 pt-1 text-[1.3em] leading-[1.2] font-bold text-accent sm:block"
      >
        {INITIALS_ASCII}
      </pre>
      <div className="min-w-0">
        <div className="font-bold">
          <span className="text-accent">{PROMPT_USER.split("@")[0]}</span>@
          <span className="text-accent">{PROMPT_USER.split("@")[1]}</span>
        </div>
        <div aria-hidden="true" className="text-muted">
          {"-".repeat(PROMPT_USER.length)}
        </div>
        {fetchRow("Name", NAME)}
        {fetchRow("Role", "Senior full-stack developer")}
        {fetchRow("Location", "Bangalore, India")}
        {fetchRow("Uptime", "11 yrs · no gaps")}
        {fetchRow("Host", JOBS[0].company)}
        {fetchRow("Domain", "fintech, banking, developer platforms")}
        {fetchRow("Stack", FETCH_STACK.join(", "))}
        {fetchRow("Editor", FAVOURITE_TOOL)}
        {fetchRow(
          "Status",
          <>
            <span className="text-accent">●</span> {AVAILABILITY}
          </>,
        )}
        <div aria-hidden="true" className="pt-3 tracking-[-0.1em]">
          {PALETTE_CLASSES.map((colour) => (
            <span key={colour} className={colour}>
              ███
            </span>
          ))}
        </div>
      </div>
    </div>,
    <p className={`${PROSE_CLASS} pt-2`}>
      Mostly I build the parts users touch - lately the banking interfaces at Standard Chartered.
    </p>,
    <div className={NEXT_ROW_CLASS}>
      more: <RunLink command="cat about.txt" /> <RunLink command="ls work/" />{" "}
      <RunLink command="contact" />
    </div>,
  ];
}

function showAbout(): CommandResult {
  return [
    <Bio paragraphClassName={PROSE_CLASS} />,
    <div className={NEXT_ROW_CLASS}>
      next: <RunLink command="ls work/" /> <RunLink command="cat stack.json" />{" "}
      <RunLink command="contact" />
    </div>,
  ];
}

function listFiles(args: string[]): CommandResult {
  const target = (args[0] ?? "").replace(/\/$/, "");
  if (target === "") {
    return [
      <div className="flex flex-wrap gap-x-6">
        <RunLink command="cat about.txt">about.txt</RunLink>
        <RunLink command="cat stack.json">stack.json</RunLink>
        <RunLink command="ls work/">work/</RunLink>
      </div>,
    ];
  }
  if (target !== "work") {
    return [error(`ls: ${args[0]}: No such file or directory`)];
  }
  return [
    <div className="grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-0.5 sm:grid-cols-[7.5rem_13rem_1fr]">
      {JOBS.map((job) => [
        <div key={`${job.slug}-dates`} className="text-muted">
          {job.from} - {job.to}
        </div>,
        <div key={`${job.slug}-run`}>
          <RunLink command={`cat work/${job.slug}`}>{job.slug}/</RunLink>
        </div>,
        <div key={`${job.slug}-role`} className="col-start-2 text-muted sm:col-start-auto">
          {job.role}
        </div>,
      ])}
    </div>,
    muted("tip: click a folder, or type cat work/<name>", "pt-1"),
  ];
}

function stackJson(): ReactNode {
  return (
    <pre className="whitespace-pre-wrap">
      {"{\n"}
      {STACK.map(({ layer, tools }) => (
        <span key={layer}>
          {"  "}
          <span className="text-accent">&quot;{layer}&quot;</span>: [
          {tools.map((tool) => `"${tool}"`).join(", ")}
          {"],\n"}
        </span>
      ))}
      {"  "}
      <span className="text-accent">&quot;favourite_tool&quot;</span>
      {`: "${FAVOURITE_TOOL}"\n}`}
    </pre>
  );
}

function catFile(args: string[]): CommandResult {
  const target = args[0] ?? "";
  if (target === "") return [error("cat: missing file. Try cat stack.json")];
  if (target === "about.txt") return showAbout();
  if (target === "stack.json") return [stackJson()];

  const slug = target.replace(/^work\//, "").replace(/\/$/, "");
  const job = target.startsWith("work/") ? JOBS.find((j) => j.slug === slug) : undefined;
  if (!job) return [error(`cat: ${target}: No such file or directory`)];

  return [
    <div className="pt-1 font-bold"># {job.company}</div>,
    muted(`${job.role} · ${job.place} · ${job.from} - ${job.to}`),
    <ul className="mt-2 max-w-[64ch] space-y-1 font-sans text-[16px] leading-relaxed">
      {job.points.map((point) => (
        <li key={point}>
          <span className="font-mono text-accent">+ </span>
          {point}
        </li>
      ))}
    </ul>,
    muted(`deps: ${job.tech.join(", ")}`, "mt-2"),
  ];
}

function showContact(): CommandResult {
  return [
    <div className="grid grid-cols-[6rem_1fr] gap-y-0.5">
      <div className="text-muted">email</div>
      <div>
        <TermLink href={`mailto:${EMAIL}`}>{EMAIL}</TermLink>
      </div>
      <div className="text-muted">github</div>
      <div>
        <TermLink href={GITHUB_URL} external>
          {GITHUB_LABEL}
        </TermLink>
      </div>
      <div className="text-muted">linkedin</div>
      <div>
        <TermLink href={LINKEDIN_URL} external>
          {LINKEDIN_LABEL}
        </TermLink>
      </div>
      <div className="text-muted">resume</div>
      <div>
        <a className="ink-link" {...RESUME_LINK_PROPS}>
          resume.pdf
        </a>
      </div>
    </div>,
    muted(
      "Got something worth building? A role, a product, or an opinion about state management.",
      "pt-1",
    ),
  ];
}

function showResume(): CommandResult {
  return [
    <div>
      resume.pdf → <a className="ink-link" {...RESUME_LINK_PROPS}>download</a>
    </div>,
  ];
}

function setTheme(args: string[], context: CommandContext): CommandResult {
  const name = args[0] ?? "";
  const theme = THEME_NAMES[name];
  if (!theme) return [error("usage: theme day | theme night")];
  context.setTheme(theme);
  return [muted(`theme set to ${name}`)];
}

export function runCommand(command: string, context: CommandContext): CommandResult {
  if (command === "") return [];
  const parts = command.split(/\s+/);
  const typed = parts[0].toLowerCase();
  const name = ALIASES[typed] ?? typed;
  if (name === "sudo") {
    return [error("jeet is not in the sudoers file. This incident will be reported.")];
  }
  const entry = COMMANDS[name];
  if (!entry) {
    return [
      error(
        <>
          zsh: command not found: {parts[0]}. Type <RunLink command="help" />.
        </>,
      ),
    ];
  }
  return entry(parts.slice(1), context);
}
