import { LocalTime } from "./LocalTime";

const INTERESTS = [
  "scalable web apps",
  "microservices",
  "mentoring",
  "open source",
];

export function Contact() {
  return (
    <section id="contact" className="pt-[104px] pb-[120px]">
      <div
        data-reveal
        data-contact
        className="glass-contact relative overflow-hidden rounded-[24px] px-11 py-14 max-[721px]:px-[22px] max-[721px]:py-9"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-10">
          <div>
            <h2 className="m-0 font-display text-[clamp(32px,4.4vw,50px)] leading-[1.04] font-bold tracking-[-0.035em] text-ink-brightest">
              Got something worth building?
            </h2>
            <p className="mt-4 max-w-[40ch] text-[18px] leading-[1.6] text-text-muted">
              A role to fill, a product to ship, or just an opinion about state
              management - all welcome.
            </p>
            <div className="mt-[22px] flex flex-wrap gap-[7px] font-mono text-[12px] text-text-dim">
              {INTERESTS.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-line-strong px-3 py-[6px]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="justify-self-start">
            <a
              data-cta
              href="mailto:jeetmukherjee100@gmail.com"
              className="cta-gradient-accent inline-flex items-center gap-3 rounded-[14px] px-[26px] py-[18px] font-mono text-[15px] font-medium max-[721px]:px-[18px] max-[721px]:py-4 max-[721px]:text-[12.5px]"
            >
              jeetmukherjee100@gmail.com <span className="text-[18px]">→</span>
            </a>
            <LocalTime />
          </div>
        </div>
      </div>

      <footer className="mt-6 flex flex-wrap justify-between gap-4 font-mono text-[12px] text-text-faintest">
        <span>© {new Date().getFullYear()} Jeet Mukherjee</span>
        <span>built by hand, deployed with nerve</span>
      </footer>
    </section>
  );
}
