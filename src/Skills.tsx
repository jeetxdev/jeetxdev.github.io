import {motion} from "motion/react";
import {CodeIcon, DatabaseIcon, GitBranchIcon} from "lucide-react";

const skills = [
  {name: 'React', icon: <CodeIcon/>},
  {name: 'Node.js', icon: <CodeIcon/>},
  {name: 'PHP', icon: <CodeIcon/>},
  {name: 'TypeScript', icon: <CodeIcon/>},
  {name: 'MySQL', icon: <DatabaseIcon/>},
  {name: 'Git', icon: <GitBranchIcon/>}
];
const Skills = () => {
  return (<section className="mb-24" id="skills">
    <motion.div
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      transition={{duration: 0.6}}
    >
      <h3 className="text-2xl font-semibold mb-8">Skills</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {skills.map((skill, index) => (<motion.div
          key={index}
          className="flex items-center space-x-3 p-4 bg-white/70 backdrop-blur-md dark:bg-white/10 rounded-xl shadow-sm"
          whileHover={{scale: 1.05}}
          transition={{type: 'spring', stiffness: 300}}
        >
          <div className="text-green-600">{skill.icon}</div>
          <div className="text-lg font-medium">{skill.name}</div>
        </motion.div>))}
      </div>
    </motion.div>
  </section>)
}

export default Skills