import { useEffect, type ReactNode } from "react";
import {
  EMAIL,
  GITHUB_URL,
  INTERESTS,
  LINKEDIN_URL,
  NAME,
  RESUME_LINK_PROPS,
} from "@/data/profile";
import { SectionRule } from "@/components/SectionRule";
import { useScene } from "@/hooks/useScene";
import { CONTACT_ID } from "@/lib/sections";

/** Added for one flash whenever a link to the contact section is clicked. */
const FLASH_CLASS = "contact-flash";

const EXTERNAL_LINKS = [
  { href: GITHUB_URL, label: "GitHub" },
  { href: LINKEDIN_URL, label: "LinkedIn" },
];

type TitleBlockProps = {
  /** The address of this sheet, e.g. "jeetm.dev". */
  project: string;
  /** e.g. "1 of 2". */
  sheet: string;
  /** The link to the site's other sheet. */
  otherSheet: { href: string; label: string };
};

/** The contact section, drawn as the title block in a drawing's bottom corner. */
export function TitleBlock({ project, sheet, otherSheet }: TitleBlockProps) {
  const { sceneRef } = useScene<HTMLElement>();

  // The title block ends the page, so a jump to it can move the page only a little or not at
  // all. A flash shows the reader where the link took them.
  useEffect(() => {
    const footer = sceneRef.current;
    if (!footer) return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest(`a[href="#${CONTACT_ID}"]`)) return;
      footer.classList.remove(FLASH_CLASS);
      // Reading the layout restarts the animation when the link is clicked again.
      void footer.offsetWidth;
      footer.classList.add(FLASH_CLASS);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [sceneRef]);

  return (
    <footer
      ref={sceneRef}
      id={CONTACT_ID}
      aria-labelledby="contact-heading"
      className="scene relative flex scroll-mt-24 flex-wrap items-end justify-between gap-x-12 gap-y-6 py-12"
    >
      <SectionRule />
      <div className="min-w-0">
        <h2
          id="contact-heading"
          className="scene-fade font-display text-[clamp(2.25rem,4.6vw,3.5rem)] leading-none font-bold uppercase"
        >
          Got something to build?
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          className="sheet-link scene-fade fade-step-1 mt-4 inline-block font-mono text-[1.0625rem] break-all"
        >
          {EMAIL}
        </a>
        <p className="scene-fade fade-step-2 mt-4 max-w-measure font-mono text-xs text-muted uppercase">
          Talk to me about: {INTERESTS.join(" · ")}
        </p>
      </div>

      <table className="scene-fade fade-step-3 min-w-[18.75rem] border-collapse font-mono text-xs">
        <caption className="sr-only">Title block</caption>
        <tbody>
          <TitleRow label="Project">{project}</TitleRow>
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
          <TitleRow label="See also">
            <a className="sheet-link" href={otherSheet.href}>
              {otherSheet.label}
            </a>
          </TitleRow>
          <TitleRow label="Sheet">
            {sheet} · Rev {new Date().getFullYear()}
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
