import {motion} from "motion/react";

const projects = [{
  title: 'Admin Portal + Campaign System',
  description: 'Built advanced features and dashboards for internal users using React and PHP. Integrated with Amazon marketplace APIs to fetch product listings for sellers.',
  tech: ['React', 'PHP', 'Amazon Seller API'],
}, {
  title: 'Multilingual Web App',
  description: 'Developed a scalable web app with multilingual support and backend service layer for cross-market deployments.',
  tech: ['React', 'Codeigniter', 'MVC PHP'],
}, {
  title: 'Custom UI Library',
  description: 'Created a reusable UI component library to increase productivity across multiple teams.',
  tech: ['React', 'TypeScript', 'Fintech', 'Redux', "TailwindCSS", "Nodejs"],
}, {
  title: 'CRM Integrations',
  description: 'Integrated Dropbox, Google Drive, and Box with ConvergeHub CRM, plus built a Zapier app and API documentation with Swagger UI.',
  tech: ['PHP', 'Swagger', 'Zapier'],
},];

const Projects = () => {
  return (<section className="mb-24" id="projects">
      <motion.div
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{duration: 0.6}}
      >
        <h3 className="text-2xl font-semibold mb-8">Projects</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (<motion.div
              key={index}
              className="bg-white/70 backdrop-blur-md dark:bg-white/10 p-6 rounded-xl shadow-sm"
              whileHover={{scale: 1.03}}
              transition={{duration: 0.3}}
            >
              <h4 className="text-xl font-bold mb-2">{project.title}</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (<span
                    key={i}
                    className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full"
                  >
                        {tech}
                      </span>))}
              </div>
            </motion.div>))}
        </div>
      </motion.div>
    </section>)
}

export default Projects;