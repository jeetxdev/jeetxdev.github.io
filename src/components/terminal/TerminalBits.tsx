import type { ReactNode } from "react";
import { PROMPT_USER } from "@/data/profile";

/** Name of the data attribute the terminal's delegated click handler reads. */
export const RUN_ATTRIBUTE = "data-run";

type RunLinkProps = {
  command: string;
  children?: ReactNode;
};

/** A clickable command. The terminal runs it through one delegated click handler. */
export function RunLink({ command, children }: RunLinkProps) {
  return (
    <button type="button" className="term-run" {...{ [RUN_ATTRIBUTE]: command }}>
      {children ?? command}
    </button>
  );
}

type TermLinkProps = {
  href: string;
  external?: boolean;
  children: ReactNode;
};

export function TermLink({ href, external = false, children }: TermLinkProps) {
  return (
    <a
      className="ink-link"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function Prompt({ command }: { command: string }) {
  return (
    <div className="pt-2">
      <span className="text-accent">{PROMPT_USER}</span>:~$ <span>{command}</span>
    </div>
  );
}
