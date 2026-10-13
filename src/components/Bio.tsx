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
        I like code that&rsquo;s easy to read, work that makes a difference to
        users, and simplifying wherever I can.
      </p>
    </>
  );
}
