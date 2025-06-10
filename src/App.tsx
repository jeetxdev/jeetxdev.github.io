import { Button } from "@/components/ui/button";
import { FileTextIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/useTheme";
import { motion } from "motion/react";
import Hero from "./Hero";
import About from "@/About.tsx";
import Experience from "@/Experience.tsx";
import Skills from "@/Skills.tsx";
import { useMemo } from "react";

export default function App() {
  const { setTheme, theme } = useTheme();
  const currentTheme = useMemo(() => {
    if (theme === "light" || theme === "dark") {
      return theme;
    } else {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  }, [theme]);
  const toggleTheme = () => {
    if (currentTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  console.log(currentTheme);
  return (
    <main className="relative min-h-screen  px-4 md:px-12 lg:px-24 py-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full absolute bg-gradient-to-br from-green-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full absolute object-cover opacity-10"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative">
        <div className="flex gap-4 justify-end">
          <motion.div layout transition={{ duration: 1 }}>
            <Button variant={"ghost"} onClick={toggleTheme}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </motion.div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Button variant="outline" asChild>
            <a href="/Jeet_M_resume.pdf" download>
              <FileTextIcon className="w-4 h-4 mr-2" /> Resume
            </a>
          </Button>
        </div>

        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Experience Section */}
        <Experience />

        {/* Skills Section */}
        <Skills />
      </div>
    </main>
  );
}
