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
  RESUME_LINK_PROPS,
  STACK,
} from "@/data/profile";
import type { Theme } from "@/lib/theme";
import { Bio } from "../Bio";
import { RunLink, TermLink } from "./TerminalBits";

/** Returned instead of output when the command empties the screen. */
export const CLEAR = "clear";

export type CommandResult = ReactNode[] | typeof CLEAR;

export type CommandContext = {
  setTheme: (theme: Theme) => void;
};

type Command = {
  describe: string;
  /** What `help` runs when its name is clicked, when the bare name needs an argument. */
  example?: string;
  run: (args: string[], context: CommandContext) => CommandResult;
};

const PROSE_CLASS = "max-w-[60ch] font-sans text-[16px] leading-relaxed";
const NEXT_ROW_CLASS = "flex flex-wrap gap-x-4 pt-2 text-muted";
const THEME_NAMES: Record<string, Theme> = { day: "light", night: "dark" };

const COMMANDS: Record<string, Command> = {
  help: { describe: "list commands", run: showHelp },
  whoami: { describe: "who is this", run: showWhoami },
  ls: { describe: "list files", example: "ls work/", run: listFiles },
  cat: { describe: "print a file, e.g. cat stack.json", example: "cat stack.json", run: catFile },
  contact: { describe: "email and links", run: showContact },
  resume: { describe: "download resume.pdf", run: showResume },
  theme: { describe: "theme day | theme night", example: "theme night", run: setTheme },
  clear: { describe: "clear the screen", run: () => CLEAR },
};

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
    <div className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-0.5 sm:grid-cols-[9rem_1fr]">
      {Object.entries(COMMANDS).map(([name, command]) => [
        <div key={`${name}-run`}>
          <RunLink command={command.example ?? name}>{name}</RunLink>
        </div>,
        <div key={`${name}-describe`} className="text-muted">
          {command.describe}
        </div>,
      ])}
    </div>,
    muted("Tab completes. → accepts the faded suggestion. ↑ and ↓ walk your history."),
  ];
}

function profile(): ReactNode {
  return (
    <div className="pt-1">
      <div className="font-bold">{NAME}</div>
      <div>senior full-stack developer · Bangalore, India</div>
      <div className="text-muted">11 yrs · fintech, banking, developer platforms</div>
      <div className="mt-2">
        <span className="text-accent">●</span> {AVAILABILITY}
      </div>
    </div>
  );
}

function showWhoami(): CommandResult {
  return [
    profile(),
    <p className={PROSE_CLASS}>
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
  const name = parts[0].toLowerCase();
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
  return entry.run(parts.slice(1), context);
}
