import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaEnvelope, FaMapMarkerAlt, FaDownload } from "react-icons/fa";

const Contact = () => {
  const contactInfo = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: "jeetmukherjee100@gmail.com",
      href: "mailto:jeetmukherjee100@gmail.com",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Location",
      value: "Bangalore, India",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
          <Separator className="w-24 mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I&apos;m always open to discussing new opportunities, interesting
            projects, or just having a chat about technology and development.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-6">Let&apos;s Connect</h3>
            <p className="text-muted-foreground mb-8">
              Whether you have a project in mind, want to discuss potential
              collaborations or just want to say hello, I&apos;d love to hear
              from you. I&apos;m particularly interested in opportunities that
              involve:
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">
                  Building scalable web applications
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">
                  Architecting microservices solutions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">
                  Mentoring and team leadership
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">
                  Open source contributions
                </span>
              </li>
            </ul>

            <div className="space-y-4">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <info.icon className="text-blue-600" />
                  <div>
                    <div className="font-medium">{info.label}</div>
                    <div>{info.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-card border rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Download Resume</h3>

              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Download my resume to learn more about my experience and
                  skills
                </p>
                <Button asChild className="w-full">
                  <a href="/resume.pdf" download>
                    <FaDownload className="mr-2" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
