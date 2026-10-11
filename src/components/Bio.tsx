type BioProps = {
  paragraphClassName?: string;
};

/** Written once, printed by both the about section and `cat about.txt`. */
export function Bio({ paragraphClassName }: BioProps) {
  return (
    <>
      <p className={paragraphClassName}>
        Mostly I build the parts users touch - lately the banking interfaces at{" "}
        <strong className="font-semibold">Standard Chartered</strong>, where a
        dropdown that misbehaves is a customer who gives up{" "}
        <span className="hl">three steps in</span>.
      </p>
      <p className={paragraphClassName}>
        I&rsquo;ve spent enough time behind the API (Node, Express, Postgres,
        PHP) to know whose fault usually is.
      </p>
      <p className={paragraphClassName}>
        I like well-named variables, problems that touch real users, and the
        small thrill of{" "}
        <span className="font-serif text-[1.15em] italic">deleting code</span>.
      </p>
    </>
  );
}
