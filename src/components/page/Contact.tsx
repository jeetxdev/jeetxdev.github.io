import {
  EMAIL,
  GITHUB_LABEL,
  GITHUB_URL,
  INTERESTS,
  LINKEDIN_LABEL,
  LINKEDIN_URL,
  RESUME_URL,
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
      className="reveal grid scroll-mt-20 grid-cols-12 gap-x-8 gap-y-6 border-t border-ink py-20"
    >
      <SectionHeading
        id="contact-heading"
        command="$ "
        path="~/contact"
        className="col-span-12 md:col-span-3"
      />
      <div className="col-span-12 md:col-span-9">
        <p className="font-mono text-3xl leading-tight font-extrabold tracking-[-0.04em] sm:text-5xl">
          Got something worth{" "}
          <span className="font-serif font-normal tracking-normal italic">building?</span>
        </p>
        <p className="mt-5 max-w-measure text-[1.15rem] leading-relaxed text-muted">
          A role to fill, a product to ship, or just an opinion about state management - all
          welcome.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="ink-link mt-10 inline-block font-serif text-[1.9rem] leading-tight break-all italic sm:text-5xl"
        >
          {EMAIL}
        </a>
        <p className="mt-8 font-mono text-[12px] text-muted">
          talk to me about: {INTERESTS.join(" · ")}
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[14px]">
          {EXTERNAL_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a className="ink-link" href={href} target="_blank" rel="noopener noreferrer">
                {label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a className="ink-link" href={RESUME_URL}>
              resume.pdf
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
