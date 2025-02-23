import { FaCss3, FaHtml5, FaNode, FaReact, FaGit } from "react-icons/fa6";
import { SiJavascript, SiJest, SiRedux, SiPostman } from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { TbSql, TbApi } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import { motion } from "motion/react";
import SectionHeading from "./sectionHeading";

const techStack = [
  {
    label: "Javascript",
    icon: <SiJavascript />,
  },
  {
    label: "React.js",
    icon: <FaReact />,
  },
  {
    label: "Node.js",
    icon: <FaNode />,
  },
  {
    label: "Next.js",
    icon: <RiNextjsFill />,
  },
  {
    label: "Redux",
    icon: <SiRedux />,
  },
  {
    label: "HTML",
    icon: <FaHtml5 />,
  },
  {
    label: "CSS",
    icon: <FaCss3 />,
  },
  {
    label: "Git",
    icon: <FaGit />,
  },
  {
    label: "SQL",
    icon: <TbSql />,
  },
  {
    label: "Jest",
    icon: <SiJest />,
  },
  {
    label: "API",
    icon: <TbApi />,
  },
  {
    label: "Postman",
    icon: <SiPostman />,
  },
];
export default function Tools() {
  return (
    <>
      <SectionHeading title={"Tools I use"} />
      <div className={"flex text-5xl flex-wrap"}>
        {techStack.map((tech, index) => (
          <div
            className={
              "w-1/2 md:w-1/4 flex items-center justify-center box-border mb-8"
            }
            key={index}
            data-tooltip-id={tech.label}
            data-tooltip-content={tech.label}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className={
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-800 rounded-lg p-4 shadow-md *:size-12"
              }
            >
              {tech.icon}
            </motion.div>
            <Tooltip
              style={{ fontSize: "1rem" }}
              title={tech.label}
              id={tech.label}
            ></Tooltip>
          </div>
        ))}
      </div>
    </>
  );
}
