"use client";

import Navigation from "@/components/navigation";
import Intro from "@/components/intro";
import About from "@/components/about";
import Experience from "@/components/experience";
import Contact from "@/components/contact";
import BackToTop from "@/components/back-to-top";

export default function Home() {
  return (
    <>
      <Navigation />

      <main>
        <section id="home">
          <Intro />
        </section>
        <About />
        <Experience />
        <Contact />
      </main>

      <BackToTop />

      <footer className="bg-muted/30 py-8 border-t">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2025 Jeet Mukherjee.</p>
        </div>
      </footer>
    </>
  );
}
