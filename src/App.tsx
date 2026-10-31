import { SiteHeader } from "@/components/SiteHeader";
import { TitleBlock } from "@/components/TitleBlock";
import { PageView } from "@/components/page/PageView";

export function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="px-4 py-6 sm:px-6">
        {/* The drawing border: everything on the page sits inside one sheet. */}
        <div className="mx-auto max-w-sheet border-2 border-ink px-5 sm:px-10">
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
