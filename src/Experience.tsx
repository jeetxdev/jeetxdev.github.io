import { motion } from "motion/react";

const experience = [
  {
    role: "Senior Technical Specialist",
    company: "DigitalAPICraft Private Limited",
    companyWebsite:
      "https://www.linkedin.com/company/digitalapi/posts/?feedView=all",
    location: "Bengaluru, India",
    period: "Mar 2022 - Present",
    points: [
      "Built SPAs using React, Redux & TypeScript",
      "Created custom UI library to boost dev productivity",
      "Mentored junior devs and led code reviews",
    ],
  },
  {
    role: "Senior Developer",
    company: "i-link Research Solutions",
    companyWebsite:
      "https://www.linkedin.com/company/i-link-research-solutions/posts/?feedView=all",
    location: "Bengaluru, India",
    period: "Jul 2018 – Mar 2022",
    points: [
      "Designed multilingual apps with React & PHP",
      "Built REST APIs with CodeIgniter & MySQL",
      "Enhanced admin portals and campaign tools",
    ],
  },
  {
    role: "Web Developer",
    company: "T-Web Exponent",
    companyWebsite: "https://www.linkedin.com/company/techno-exponent/",
    location: "Kolkata, India",
    period: "Sep 2017 – Jun 2018",
    points: [
      "Built responsive UIs and fetched Amazon listings via API",
      "Optimized cross-browser compatibility",
    ],
  },
  {
    role: "Programmer Analyst",
    company: "Corelynx Solutions Private Limited",
    companyWebsite:
      "https://www.linkedin.com/company/corelynx/posts/?feedView=all",
    location: "Kolkata, India",
    period: "Jun 2015 – Sep 2017",
    points: [
      "Integrated Dropbox/Google Drive with ConvergeHub CRM",
      "Built Zapier app, API docs using Swagger",
      "Automated marketing using Mailchimp APIs",
    ],
  },
];
const Experience = () => {
  return (
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
              className="bg-white/30 dark:bg-white/10 backdrop-filter backdrop-blur-md backdrop-opacity-50 p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <h4 className="text-xl font-bold">{job.role}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <a target="_blank" href={job.companyWebsite}>
                  {job.company}
                </a>
                , {job.location} — <span className="italic">{job.period}</span>
              </p>
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
  );
};
export default Experience;
