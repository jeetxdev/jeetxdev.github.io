import { motion } from "motion/react";
import PropTypes from "prop-types";
export default function SectionHeading({ title }) {
  return (
    <div className={"flex items-center mb-4 overflow-hidden"}>
      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", duration: 2, ease: "circOut" }}
        className={"border border-zinc-800 h-0 grow"}
      ></motion.div>
      <motion.div
        className={"px-4 font-semibold italic font-serif text-2xl"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "tween", duration: 5, ease: "easeOut" }}
      >
        {title}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "tween", duration: 2, ease: "circOut" }}
        className={"border border-zinc-800 h-0 grow"}
      ></motion.div>
    </div>
  );
}
SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
};
