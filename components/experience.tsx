import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { FaBuilding, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";

const Experience = () => {
  const experiences = [
    {
      company: "DigitalAPICraft Private Limited",
      position: "Senior Technical Specialist",
      duration: "2022 - Present",
      location: "Bangalore, India",
      achievements: [
        "Developed and maintained React-based fintech dashboards within the Fiserv AppMarket ecosystem, enhancing user experience for enterprise banking partners.",
        "Built and optimized embedded API explorer tools that allow clients to visualize and test APIs in-browser.",
        "Collaborated with cross-functional teams to integrate API products into developer-friendly UIs, streamlining onboarding for partner banks and fintech users.",
        "Improved codebase maintainability and performance by implementing reusable component patterns, lazy loading, and state management best practices.",
        "Contributed to internal tooling for API documentation, reducing manual testing efforts and improving release cycles.",
      ],
      tech: [
        "React.js",
        "Redux",
        "Next.js",
        "Tailwind CSS",
        "Styled Components",
        "TypeScript",
        "Git",
        "HTML",
        "CSS",
      ],
    },
    {
      company: "i-Link Research Solutions",
      position: "IT Application Developer",
      duration: "2018 - 2022",
      location: "Bangalore, India",
      achievements: [
        "Analyzed requirements and designed, developed, and implemented software applications for multiple websites.",
        "Enabled multilingual support and prepared existing web services framework for cross-market launches.",
        "Brought up additional features to in-house Administration Portal and Campaign Management System using PHP in MVC architecture and React JS for front end.",
        "Created REST API using Code-Igniter and MYSQL for mobile apps.",
        "Designed, implemented, and monitored web pages and sites for continuous improvement.",
        "Worked on product enhancements and bug fixes following Agile methodology, with Git version control.",
      ],
      tech: [
        "React.js",
        "PHP",
        "MySql",
        "jQuery",
        "HTML",
        "CSS",
        "CodeIgniter",
        "Git",
        "REST API",
      ],
    },
    {
      company: "Techno Exponent (T-Web Exponent Services Pvt. Ltd)",
      position: "Software Developer",
      duration: "2017 - 2018",
      location: "Kolkata, India",
      achievements: [
        "Designed sites to be compatible with top browsers, including Firefox, Chrome, and Safari.",
        "Designed web interface for Portal for Merchants, from login flow to financial reports generation.",
        "Worked in a team of more than 5 members to create an e-commerce site, also used to fetch Amazon product listings for each individual seller, using Amazon Marketplace API.",
        "Converted mock-ups into HTML, JavaScript, AJAX and JSON.",
        "Represented a web team at meetings with executives and discussed project goals and milestones.",
      ],
      tech: [
        "JavaScript",
        "PHP",
        "MySql",
        "jQuery",
        "HTML",
        "CSS",
        "Bootstrap",
        "CodeIgniter",
        "Laravel",
        "Git",
        "REST API",
      ],
    },
    {
      company: "Corelynx Solutions Pvt.Ltd.",
      position: "Program Analyst",
      duration: "2015 - 2017",
      location: "Kolkata, India",
      achievements: [
        "Researched and developed new technology designs for the company's product CONVERGE HUB CRM.",
        "Implemented back-end API for Android and iOS apps.",
        "Created API documentation website using SWAGGER UI.",
        "Implemented drop-box style data storage functionality in ConvergeHub CRM and provided an option to sync its data to Dropbox, Google Drive, Box apps.",
        "Created Zapier App for CRM so that users can automate some of the basic but important functionality.",
        "Implemented campaign management system using Mail-chimp APIs.",
        "Developed code collaboratively with Agile squads to produce best results.",
      ],
      tech: [
        "JavaScript",
        "PHP",
        "MySql",
        "jQuery",
        "HTML",
        "CSS",
        "CodeIgniter",
        "Git",
      ],
    },
  ];

  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Work Experience
          </h2>
          <Separator className="w-24 mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A decade of professional experience building innovative solutions
            and leading development teams across various industries.
          </p>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="bg-card border rounded-lg p-6 h-fit">
                    <div className="flex items-center gap-2 mb-3">
                      <FaBuilding className="text-blue-600" />
                      <h3 className="text-xl font-semibold">{exp.company}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                      <FaCalendar className="text-sm" />
                      <span className="text-sm">{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                      <FaMapMarkerAlt className="text-sm" />
                      <span className="text-sm">{exp.location}</span>
                    </div>
                    <h4 className="text-lg font-medium text-blue-600 mb-3">
                      {exp.position}
                    </h4>
                    {/* <p className="text-muted-foreground text-sm mb-4">
                      {exp.description}
                    </p> */}
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 border border-dashed border-blue-300 text-blue-800 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="bg-card border rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">
                      Key Achievements
                    </h4>
                    <ul className="space-y-3">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {index < experiences.length - 1 && (
                <div className="hidden md:block absolute left-1/2 top-full w-0.5 h-12 bg-border transform -translate-x-1/2"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
