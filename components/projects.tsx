import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiMongodb, SiTypescript, SiDocker, SiAmazon } from "react-icons/si";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard. Handles 10K+ daily users with 99.9% uptime.",
      tech: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
      icons: [FaReact, FaNodeJs, FaDatabase],
      github: "#",
      live: "#",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Task Management System",
      description: "Enterprise-grade project management tool with real-time collaboration, file sharing, and advanced reporting. Used by 50+ companies worldwide.",
      tech: ["TypeScript", "Express.js", "MongoDB", "Socket.io", "AWS"],
      icons: [SiTypescript, FaNodeJs, SiMongodb],
      github: "#",
      live: "#",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Social Media Analytics",
      description: "Real-time social media monitoring and analytics platform with AI-powered sentiment analysis and predictive insights.",
      tech: ["React", "Node.js", "MongoDB", "TensorFlow", "Docker"],
      icons: [FaReact, FaNodeJs, SiDocker],
      github: "#",
      live: "#",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Microservices Architecture",
      description: "Scalable microservices platform with API gateway, service discovery, and container orchestration. Handles 1M+ API calls daily.",
      tech: ["Node.js", "Docker", "Kubernetes", "MongoDB", "AWS"],
      icons: [FaNodeJs, SiDocker, SiAmazon],
      github: "#",
      live: "#",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Real-time Chat Application",
      description: "High-performance chat application with end-to-end encryption, file sharing, and video calling capabilities.",
      tech: ["React", "Socket.io", "MongoDB", "WebRTC", "Redis"],
      icons: [FaReact, FaNodeJs, FaDatabase],
      github: "#",
      live: "#",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Data Visualization Dashboard",
      description: "Interactive dashboard for business intelligence with real-time data streaming, custom charts, and export functionality.",
      tech: ["React", "D3.js", "Node.js", "MongoDB", "WebSocket"],
      icons: [FaReact, FaNodeJs, SiMongodb],
      github: "#",
      live: "#",
      image: "/api/placeholder/400/250"
    }
  ];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <Separator className="w-24 mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my best work, demonstrating expertise in building scalable, 
            production-ready applications using modern technologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const IconComponent = project.icons[0];
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-6xl opacity-20">
                    {IconComponent && <IconComponent />}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <FaGithub className="mr-2" />
                      Code
                    </Button>
                    <Button size="sm" className="flex-1">
                      <FaExternalLinkAlt className="mr-2" />
                      Live
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline">
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 