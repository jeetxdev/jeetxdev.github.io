import type { ReactNode } from "react";
import {
  EMAIL,
  GITHUB_URL,
  INTERESTS,
  LINKEDIN_URL,
  NAME,
  RESUME_LINK_PROPS,
} from "@/data/profile";
import { CONTACT_ID } from "@/lib/sections";

const PROJECT_NAME = "jeetm.dev";
const SHEET_NUMBER = "1 of 1";

const EXTERNAL_LINKS = [
  { href: GITHUB_URL, label: "GitHub" },
  { href: LINKEDIN_URL, label: "LinkedIn" },
];

/** The contact section, drawn as the title block in a drawing's bottom corner. */
export function TitleBlock() {
  return (
    <footer
      id={CONTACT_ID}
      aria-labelledby="contact-heading"
      className="flex scroll-mt-24 flex-wrap items-end justify-between gap-x-12 gap-y-6 border-t border-rule py-12"
    >
      <div className="min-w-0">
        <h2
          id="contact-heading"
          className="font-display text-[clamp(2.25rem,4.6vw,3.5rem)] leading-none font-semibold uppercase"
        >
          Got something to build?
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          className="sheet-link mt-4 inline-block font-mono text-[1.0625rem] break-all"
        >
          {EMAIL}
        </a>
        <p className="mt-4 max-w-measure font-mono text-xs text-muted uppercase">
          Talk to me about: {INTERESTS.join(" · ")}
        </p>
      </div>

      <table className="min-w-[18.75rem] border-collapse font-mono text-xs">
        <caption className="sr-only">Title block</caption>
        <tbody>
          <TitleRow label="Project">{PROJECT_NAME}</TitleRow>
          <TitleRow label="Drawn by">{NAME}</TitleRow>
          <TitleRow label="Links">
            {EXTERNAL_LINKS.map(({ href, label }) => (
              <span key={href}>
                <a className="sheet-link" href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {" · "}
              </span>
            ))}
            <a className="sheet-link" {...RESUME_LINK_PROPS}>
              Résumé
            </a>
          </TitleRow>
          <TitleRow label="Sheet">
            {SHEET_NUMBER} · Rev {new Date().getFullYear()}
          </TitleRow>
        </tbody>
      </table>
    </footer>
  );
}

function TitleRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr>
      <th
        scope="row"
        className="border-[1.5px] border-ink px-3 py-2 text-left font-normal text-muted uppercase"
      >
        {label}
      </th>
      <td className="border-[1.5px] border-ink px-3 py-2">{children}</td>
    </tr>
  );
}
