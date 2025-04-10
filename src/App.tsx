import {motion} from "motion/react"
import {Button} from '@/components/ui/button';
import {
  LinkedinIcon, MailIcon, CodeIcon, DatabaseIcon, GitBranchIcon, FileTextIcon, Sun, Moon
} from 'lucide-react';
import { useTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const experience = [{
  role: 'Senior Technical Specialist',
  company: 'DigitalAPICraft Private Limited',
  location: 'Bengaluru',
  period: 'Mar 2022 – Present',
  points: ['Built SPAs using React, Redux & TypeScript', 'Created custom UI library to boost dev productivity', 'Mentored junior devs and led code reviews']
}, {
  role: 'Senior Developer',
  company: 'i-link Research Solutions',
  location: 'Bengaluru',
  period: 'Jul 2018 – Mar 2022',
  points: ['Designed multilingual apps with React & PHP', 'Built REST APIs with CodeIgniter & MySQL', 'Enhanced admin portals and campaign tools']
}, {
  role: 'Web Developer',
  company: 'T-Web Exponent',
  location: 'Kolkata',
  period: 'Sep 2017 – Jun 2018',
  points: ['Built responsive UIs and fetched Amazon listings via API', 'Optimized cross-browser compatibility']
}, {
  role: 'Programmer Analyst',
  company: 'Corelynx Solutions',
  location: 'Kolkata',
  period: 'Jun 2015 – Sep 2017',
  points: ['Integrated Dropbox/Google Drive with ConvergeHub CRM', 'Built Zapier app, API docs using Swagger', 'Automated marketing using Mailchimp APIs']
}];
const skills = [{name: 'React', icon: <CodeIcon/>}, {name: 'Node.js', icon: <CodeIcon/>}, {
  name: 'PHP', icon: <CodeIcon/>
}, {name: 'TypeScript', icon: <CodeIcon/>}, {name: 'MySQL', icon: <DatabaseIcon/>}, {
  name: 'Git', icon: <GitBranchIcon/>
},];
const projects = [{
  title: 'Admin Portal + Campaign System',
  description: 'Built advanced features and dashboards for internal users using React and PHP. Integrated with Amazon marketplace APIs to fetch product listings for sellers.',
  tech: ['React', 'PHP', 'Amazon API'],
}, {
  title: 'Multilingual Web App',
  description: 'Developed a scalable web app with multilingual support and backend service layer for cross-market deployments.',
  tech: ['React', 'i18n', 'MVC PHP'],
}, {
  title: 'Custom UI Library',
  description: 'Created a reusable UI component library to increase productivity across multiple teams.',
  tech: ['React', 'TypeScript', 'Storybook'],
}, {
  title: 'CRM Integrations',
  description: 'Integrated Dropbox, Google Drive, and Box with ConvergeHub CRM, plus built a Zapier app and API documentation with Swagger UI.',
  tech: ['PHP', 'Swagger', 'Zapier'],
},];

export default function App() {
  const { setTheme } = useTheme()


  return (<main
    className="relative min-h-screen  px-4 md:px-12 lg:px-24 py-16 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div
        className="w-full h-full absolute bg-gradient-to-br from-green-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
           className="w-full h-full absolute object-cover opacity-10">
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>
    </div>

    <div className="relative z-10">
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" asChild>
          <a href="/JEET_MUKHERJEE_RESUME.pdf" download>
            <FileTextIcon className="w-4 h-4 mr-2"/> Resume
          </a>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="mb-24">
        <motion.div
          initial={{opacity: 0, y: -40}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Jeet Mukherjee</h1>
          <h2 className="text-xl md:text-2xl font-medium text-green-600 mb-6">Senior Technical Specialist</h2>
          <p className="max-w-2xl text-lg">
            Web Developer with 9 years of experience in building responsive, high-performance web apps. Skilled in
            React, Node.js, PHP, and mentoring teams.
          </p>
          <div className="mt-6 flex gap-4">
            <Button asChild variant={"ghost"}>
            <a
              href="mailto:jeetmukherjee100@gmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-tr from-green-500 to-lime-400 text-white font-semibold px-5 py-3 hover:scale-105 transition-transform shadow-lg"
            >
              <MailIcon className="w-4 h-4 mr-2" /> Email Me
            </a>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="https://www.linkedin.com/in/jeetm/" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="w-4 h-4 mr-2" /> LinkedIn
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="mb-24" id="about">
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.6}}
        >
          <h3 className="text-2xl font-semibold mb-4">About Me</h3>
          <p className="text-lg max-w-3xl">
            I'm a passionate web developer who’s been in the game since 2015, thriving on clean code, snappy UIs, and
            meaningful digital experiences. Whether I’m shipping features, building a custom UI lib, or mentoring devs
            — I bring the same energy: build smart, build well.
          </p>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="mb-24" id="experience">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-8">Experience</h3>
          <div className="space-y-12">
            {experience.map((job, idx) => (
              <motion.div
                key={idx}
                className="bg-white/70 backdrop-blur-md dark:bg-white/10 p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <h4 className="text-xl font-bold">{job.role}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{job.company}, {job.location} — <span className="italic">{job.period}</span></p>
                <ul className="list-disc pl-5 space-y-1">
                  {job.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="mb-24" id="skills">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-8">Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-4 bg-white/70 backdrop-blur-md dark:bg-white/10 rounded-xl shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-green-600">{skill.icon}</div>
                <div className="text-lg font-medium">{skill.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section className="mb-24" id="projects">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-8">Projects</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-md dark:bg-white/10 p-6 rounded-xl shadow-sm"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full"
                    >
                        {tech}
                      </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  </main>);
}
