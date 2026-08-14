import { Background, ProgressRail } from "@/components/Background";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Playground } from "@/components/Playground";
import { Work } from "@/components/Work";
import { Contact } from "@/components/Contact";
import { useReveal } from "@/hooks/useReveal";

export function App() {
  useReveal();

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      <Background />
      <ProgressRail />

      <div className="relative z-[1] px-7 max-[721px]:px-[18px]">
        <div className="mx-auto max-w-[1060px]">
          <Header />
          <Hero />
          <Playground />
          <Work />
          <Contact />
        </div>
      </div>
    </div>
  );
}
