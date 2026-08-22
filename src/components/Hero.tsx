import { DitherPortrait } from "./DitherPortrait";
import { HeroSignals } from "./HeroSignals";

const LINK_CHIP_CLASS =
  "rounded-[10px] border border-white/[0.12] bg-white/5 px-4 py-[11px] text-ink transition-colors duration-200 hover:border-accent/[0.55] hover:text-white";

export function Hero() {
  return (
    <section id="hero" className="pt-[92px]">
      <div
        data-reveal
        className="glass-pill inline-flex items-center gap-[9px] rounded-full px-[14px] py-[7px] font-mono text-[12px] tracking-[0.02em] text-text-muted"
      >
        <span
          aria-hidden="true"
          className="h-[6px] w-[6px] rounded-full bg-success"
        />
        available · senior roles &amp; select freelance
      </div>

      <h1
        data-reveal
        className="text-gradient-hero mt-6 max-w-[17ch] font-display text-[clamp(42px,7.4vw,92px)] leading-[0.98] font-bold tracking-[-0.04em]"
      >
        Eleven years of making the whole stack behave.
      </h1>

      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] items-start gap-10 max-[901px]:gap-8">
        <div data-reveal>
          <p className="max-w-[46ch] text-[19px] leading-[1.65] text-text-soft [text-wrap:pretty]">
            Mostly I build the parts users touch - lately the banking
            interfaces at{" "}
            <strong className="font-semibold text-ink">
              Standard Chartered
            </strong>
            , where a dropdown that misbehaves is a customer who gives up{" "}
            <em className="not-italic text-accent">three steps in</em>. I&rsquo;ve
            spent enough time behind the API (Node, Express, Postgres, PHP) to
            know whose fault usually is.
          </p>
          <p className="mt-[18px] max-w-[46ch] text-[17px] leading-[1.6] text-text-dim [text-wrap:pretty]">
            I like well-named variables, problems that touch real users, and the
            small thrill of deleting code.
          </p>
          <div className="mt-7 flex flex-wrap gap-[10px] font-mono text-[13px]">
            <a
              href="https://github.com/jeetxdev"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CHIP_CLASS}
            >
              github/jeetxdev
            </a>
            <a
              href="https://www.linkedin.com/in/jeetm"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CHIP_CLASS}
            >
              linkedin/jeetm
            </a>
            <span className="rounded-[10px] border border-dashed border-white/[0.14] px-4 py-[11px] text-text-dimmer">
              Bangalore, IN
            </span>
          </div>
        </div>

        <div
          data-reveal
          className="flex items-stretch justify-self-end gap-4 max-[901px]:w-full max-[901px]:justify-self-stretch"
        >
          <DitherPortrait
            src="/profile.jpeg"
            alt="Jeet Mukherjee"
            className="min-h-[168px] w-[132px] shrink-0 self-stretch max-[721px]:min-h-[138px] max-[721px]:w-[108px]"
          />
          <HeroSignals />
        </div>
      </div>
    </section>
  );
}
