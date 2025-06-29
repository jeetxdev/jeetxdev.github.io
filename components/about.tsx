import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { FaCode, FaServer, FaDatabase, FaCloud, FaGit } from "react-icons/fa";

const About = () => {
  const skills = [
    { name: "JavaScript", icon: FaCode },
    { name: "TypeScript", icon: FaCode },
    { name: "React.js", icon: FaCode },
    { name: "Next.js", icon: FaCode },
    { name: "Redux", icon: FaCode },
    { name: "Node.js", icon: FaServer },
    { name: "Express.js", icon: FaServer },
    { name: "PostgreSQL", icon: FaDatabase },
    { name: "REST API", icon: FaCode },
    { name: "HTML", icon: FaCode },
    { name: "CSS", icon: FaCode },
    { name: "Tailwind CSS", icon: FaCode },
    { name: "Docker", icon: FaCloud },
    { name: "CI/CD", icon: FaCloud },
    { name: "Git", icon: FaGit },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical Expertise
          </h2>
          <Separator className="w-24 mx-auto mb-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:shadow-md transition-shadow"
              >
                <skill.icon className="text-blue-600 text-lg" />
                <span className="font-medium text-sm">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
