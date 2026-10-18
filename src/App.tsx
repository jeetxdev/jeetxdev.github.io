import { CharField } from "@/components/CharField";
import { Footer } from "@/components/Footer";
import { MenuBar } from "@/components/MenuBar";
import { PageView } from "@/components/page/PageView";
import { useDisableContextMenu } from "@/hooks/useDisableContextMenu";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/hooks/useTheme";

export function App() {
  useDisableContextMenu();
  const reduceMotion = useReducedMotion();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <MenuBar theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <CharField theme={theme} reduceMotion={reduceMotion} />
      <main id="main" className="mx-auto max-w-page px-5 sm:px-8">
        <PageView reduceMotion={reduceMotion} />
      </main>
      <Footer />
    </>
  );
}
