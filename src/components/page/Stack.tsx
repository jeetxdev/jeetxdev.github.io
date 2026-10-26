import { STACK } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";

export function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="reveal grid scroll-mt-20 grid-cols-12 gap-x-4 gap-y-6 border-t border-rule pt-12 pb-16 md:gap-x-8"
    >
      <SectionHeading
        id="stack-heading"
        command="$ cat "
        path="~/stack"
        className="col-span-12 md:col-span-3"
      />
      <dl className="col-span-12 space-y-4 font-mono text-xs md:col-span-9">
        {STACK.map(({ layer, tools }) => (
          <div key={layer} className="grid grid-cols-1 gap-x-8 sm:grid-cols-[8rem_1fr]">
            <dt className="font-bold text-accent">{layer}</dt>
            <dd className="font-medium">{tools.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
