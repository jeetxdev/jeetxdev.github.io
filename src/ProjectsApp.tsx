import { Sheet } from "@/components/Sheet";
import { SiteHeader } from "@/components/SiteHeader";
import { TitleBlock } from "@/components/TitleBlock";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { HOME_URL, PROJECTS_LINKS, PROJECTS_SECTION_IDS } from "@/lib/sections";

export function ProjectsApp() {
  return (
    <Sheet
      header={
        <SiteHeader title="Side projects" links={PROJECTS_LINKS} sectionIds={PROJECTS_SECTION_IDS} />
      }
      footer={
        <TitleBlock
          project="jeetm.dev/projects"
          sheet="2 of 2"
          otherSheet={{ href: HOME_URL, label: "Portfolio (sheet 1)" }}
        />
      }
    >
      <ProjectsView />
    </Sheet>
  );
}
