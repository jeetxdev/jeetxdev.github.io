import { FaDownload } from "react-icons/fa6";
import { motion } from "motion/react";
export default function Resume() {
  return (
    <div className="flex justify-center mt-4 gap-4 max-md:flex-col">
      <a
        href="/JEET_MUKHERJEE_-_Senior_Technical_Specialist.pdf"
        download
        className="block"
      >
        <button className="bg-gradient-to-r from-teal-700 to-purple-700 text-white font-medium rounded-lg px-4 py-2 shadow-md cursor-pointer max-md:w-full">
          Download Resume <FaDownload className="size-4 inline ml-2" />
        </button>
      </a>
      <a href="mailto:jeetmukherjee100@gmail.com" className="block">
        <motion.button
          className={
            "bg-gradient-to-r from-teal-700 to-purple-700 text-white font-medium px-4 py-2 rounded-lg cursor-pointer max-md:w-full"
          }
        >
          Contact me
        </motion.button>
      </a>
    </div>
  );
}
