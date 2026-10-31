import { SiteHeader } from "@/components/SiteHeader";
import { TitleBlock } from "@/components/TitleBlock";
import { PageView } from "@/components/page/PageView";

export function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="p-4 sm:p-6">
        {/* The drawing border: everything on the page sits inside one sheet. */}
        <div className="mx-auto max-w-sheet border-2 border-ink px-6 sm:px-12">
          <SiteHeader />
          <main id="main">
            <PageView />
          </main>
          <TitleBlock />
        </div>
      </div>
    </>
  );
}
