import {motion} from "motion/react";
import {Button} from "@/components/ui/button.js";
import {LinkedinIcon, MailIcon} from "lucide-react";

const Hero = () => {
  return (
    <section className="mb-24">
      <motion.div
        initial={{opacity: 0, y: -40}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Jeet Mukherjee</h1>
        <h2 className="text-xl md:text-2xl font-medium text-green-600 mb-6">Senior Technical Specialist</h2>
        <p className="max-w-2xl text-lg">
          Web Developer with {Math.floor(new Date().getFullYear() - 2015)} years of experience in building responsive,
          high-performance web apps. Skilled in
          React, Node.js, PHP, and mentoring teams.
        </p>
        <div className="mt-6 flex gap-4">
          <Button asChild variant={"ghost"}>
            <a
              href="mailto:jeetmukherjee100@gmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-tr from-green-500 to-lime-400 text-white font-semibold px-5 py-3 hover:scale-105 transition-transform shadow-lg"
            >
              <MailIcon className="w-4 h-4 mr-2"/> Email Me
            </a>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <a href="https://www.linkedin.com/in/jeetm/" target="_blank" rel="noopener noreferrer">
              <LinkedinIcon className="w-4 h-4 mr-2"/> LinkedIn
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
export default Hero;