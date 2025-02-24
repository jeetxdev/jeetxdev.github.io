import "./App.css";
import Intro from "./sections/intro.jsx";
import Tools from "./sections/tools.jsx";
import { motion } from "motion/react";
import Experience from "./sections/experience.jsx";
import Resume from "./sections/resume.jsx";
import Footer from "./sections/footer.jsx";

function App() {
  return (
    <div>
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={"w-4/5 m-auto"}
        >
          <Intro />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={"w-4/5 mx-auto mt-16"}
        >
          <Tools />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={"w-4/5 mx-auto mt-16"}
        >
          <Experience />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={"w-4/5 mx-auto my-4 "}
        >
          <Resume />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={"w-4/5 mx-auto mb-4 mt-24"}
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
