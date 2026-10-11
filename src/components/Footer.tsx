import { PROMPT_USER } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-wrap justify-between gap-3 px-5 py-6 font-mono text-[12px] text-muted sm:px-8">
        <span>
          {PROMPT_USER}:~$ exit
          <span className="caret" aria-hidden="true" />
        </span>
        <span>built by hand, deployed with nerve · {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
