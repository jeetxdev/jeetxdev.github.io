export const NAME = "Jeet Mukherjee";
export const EMAIL = "jeetmukherjee100@gmail.com";
export const GITHUB_URL = "https://github.com/jeetxdev";
export const GITHUB_LABEL = "github/jeetxdev";
export const LINKEDIN_URL = "https://www.linkedin.com/in/jeetm";
export const LINKEDIN_LABEL = "linkedin/jeetm";
export const RESUME_URL = "/resume.pdf";
export const RESUME_FILE_NAME = "Jeet-Mukherjee-Resume.pdf";

/**
 * Every résumé link downloads the file. A browser that ignores `download`
 * follows `target` instead and opens the PDF in a new tab.
 */
export const RESUME_LINK_PROPS = {
  href: RESUME_URL,
  download: RESUME_FILE_NAME,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export const AVAILABILITY = "available · senior roles & select freelance";

export const INTERESTS = [
  "scalable web apps",
  "microservices",
  "mentoring",
  "open source",
];

export type StackLayer = {
  layer: string;
  tools: string[];
};

export const STACK: StackLayer[] = [
  {
    layer: "frontend",
    tools: ["React.js", "Next.js", "Redux", "TypeScript", "Tailwind CSS", "SCSS", "Vite"],
  },
  {
    layer: "backend",
    tools: ["Node.js", "Express.js", "PHP", "Laravel", "CodeIgniter"],
  },
  { layer: "data", tools: ["PostgreSQL", "MySQL"] },
  {
    layer: "craft",
    tools: ["REST API design", "component architecture", "performance", "CI/CD", "containerization"],
  },
];
