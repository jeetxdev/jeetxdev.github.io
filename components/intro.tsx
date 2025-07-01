import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

const Intro = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="w-36 h-36 mx-auto mb-6 rounded-full relative overflow-hidden"
            >
              <Image
                src={"/profile.JPG"}
                alt="Jeet Mukherjee"
                width={128}
                height={128}
                className="w-full"
              />
            </motion.div>
            <h1 className="text-5xl md:text-7xl pb-2 font-bold mb-4 bg-gradient-to-r from-blue-700 dark:from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Jeet Mukherjee
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-6">
              Senior Full-Stack Developer
            </h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            I am a full-stack web developer with{" "}
            <span className="bg-gradient-to-r from-blue-700 dark:from-blue-600 to-purple-600 font-semibold bg-clip-text text-transparent">
              10 years
            </span>{" "}
            of experience working across the MERN stack. I build scalable apps
            end-to-end — clean APIs, responsive UIs, and everything in between.
            Currently, I am a Senior Technical Specialist at DigitalAPICraft,
            focused on developing enterprise platforms using modern tech. I
            enjoy writing clean code, solving real-world problems, and staying
            up-to-date with the latest tools and practices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center space-x-6"
          >
            <a
              target="_blank"
              href="https://github.com/jeetxdev"
              className="text-muted-foreground hover:text-blue-600 transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/jeetm"
              className="text-muted-foreground hover:text-blue-600 transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Intro;
