import { Sheet } from "@/components/Sheet";
import { SiteHeader } from "@/components/SiteHeader";
import { TitleBlock } from "@/components/TitleBlock";
import { PageView } from "@/components/page/PageView";
import { HOME_LINKS, HOME_SECTION_IDS, PROJECTS_URL } from "@/lib/sections";

export function App() {
  return (
    <Sheet
      header={<SiteHeader title="Portfolio" links={HOME_LINKS} sectionIds={HOME_SECTION_IDS} />}
      footer={
        <TitleBlock
          project="jeetm.dev"
          sheet="1 of 2"
          otherSheet={{ href: PROJECTS_URL, label: "Side projects (sheet 2)" }}
        />
      }
    >
      <PageView />
    </Sheet>
  );
}
