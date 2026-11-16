import { Details } from "./Details";
import { Hero } from "./Hero";
import { ProjectsPreview } from "./ProjectsPreview";
import { Timeline } from "./Timeline";

export function PageView() {
  return (
    <>
      <Hero />
      <Timeline />
      <Details />
      <ProjectsPreview />
    </>
  );
}
