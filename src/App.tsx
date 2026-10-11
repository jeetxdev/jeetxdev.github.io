import { useState } from "react";
import { Footer } from "@/components/Footer";
import { MenuBar } from "@/components/MenuBar";
import { PageView } from "@/components/page/PageView";
import { Terminal } from "@/components/terminal/Terminal";
import { useDisableContextMenu } from "@/hooks/useDisableContextMenu";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/hooks/useTheme";
import type { View } from "@/lib/view";

export function App() {
  useDisableContextMenu();
  const reduceMotion = useReducedMotion();
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<View>("terminal");

  const switchView = (next: View) => {
    window.scrollTo(0, 0);
    setView(next);
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <MenuBar
        view={view}
        theme={theme}
        onSwitchView={switchView}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      {/* Both views stay mounted, so the terminal session survives a round trip. */}
      <main id="main" className="mx-auto max-w-page px-5 sm:px-8">
        <Terminal active={view === "terminal"} setTheme={setTheme} />
        <PageView active={view === "page"} reduceMotion={reduceMotion} />
      </main>
      {view === "page" ? <Footer /> : null}
    </>
  );
}
