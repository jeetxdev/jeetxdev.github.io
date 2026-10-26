import {
  EMAIL,
  GITHUB_LABEL,
  GITHUB_URL,
  INTERESTS,
  LINKEDIN_LABEL,
  LINKEDIN_URL,
  RESUME_LINK_PROPS,
} from "@/data/profile";
import { SectionHeading } from "./SectionHeading";

const EXTERNAL_LINKS = [
  { href: GITHUB_URL, label: GITHUB_LABEL },
  { href: LINKEDIN_URL, label: LINKEDIN_LABEL },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="reveal grid grid-cols-12 gap-x-4 gap-y-6 border-t border-ink pt-20 pb-24 md:gap-x-8"
    >
      <SectionHeading
        id="contact-heading"
        command="$ "
        path="~/contact"
        className="col-span-12 md:col-span-3"
      />
      <div className="col-span-12 md:col-span-9">
        <p className="font-mono text-3xl font-bold tracking-tighter sm:text-5xl">
          Got something worth <span className="text-accent">building?</span>
        </p>
        <p className="mt-6 max-w-measure text-lg text-muted">
          A role to fill, a product to ship, or an opinion about state management. I read
          every one.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="ink-link mt-10 inline-block text-3xl font-medium tracking-tight break-all sm:text-5xl"
        >
          {EMAIL}
        </a>
        <p className="mt-8 font-mono text-xs tracking-wide text-muted">
          talk to me about: {INTERESTS.join(" · ")}
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
          {EXTERNAL_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a className="ink-link" href={href} target="_blank" rel="noopener noreferrer">
                {label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a className="ink-link" {...RESUME_LINK_PROPS}>
              Résumé
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
