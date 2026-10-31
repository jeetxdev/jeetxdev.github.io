import { useReveal } from "@/hooks/useReveal";
import { Details } from "./Details";
import { Hero } from "./Hero";
import { Timeline } from "./Timeline";

export function PageView() {
  useReveal();

  return (
    <>
      <Hero />
      <Timeline />
      <Details />
    </>
  );
}
