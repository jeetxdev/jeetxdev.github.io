export type Route = "/whoami" | "/stack" | "/experience" | "/contact";

export const ROUTES: Route[] = ["/whoami", "/stack", "/experience", "/contact"];

export const PAYLOADS: Record<Route, string> = {
  "/whoami": `{
  "name": "Jeet Mukherjee",
  "role": "Senior Full-Stack Developer",
  "title": "Assoc, Frontend Engineer @ Standard Chartered Bank",
  "based": "Bangalore, India",
  "years_shipping": 11,
  "domains": ["fintech", "banking", "developer platforms"],
  "available": true
}`,
  "/stack": `{
  "frontend": ["React.js", "Next.js", "Redux", "TypeScript", "Tailwind CSS", "SCSS", "Vite"],
  "backend": ["Node.js", "Express.js", "PHP", "Laravel", "CodeIgniter"],
  "data": ["PostgreSQL", "MySQL"],
  "craft": ["REST API design", "component architecture", "performance", "CI/CD", "Docker"],
  "favourite_tool": "a well-named variable"
}`,
  "/experience": `[
  { "company": "Standard Chartered", "role": "Assoc, Frontend Engineer",    "from": 2025, "to": "now" },
  { "company": "DigitalAPICraft",    "role": "Senior Technical Specialist", "from": 2022, "to": 2025 },
  { "company": "i-Link Research",    "role": "IT Application Developer",    "from": 2018, "to": 2022 },
  { "company": "Techno Exponent",    "role": "Software Developer",          "from": 2017, "to": 2018 },
  { "company": "Corelynx Solutions", "role": "Program Analyst",             "from": 2015, "to": 2017 }
]`,
  "/contact": `{
  "email": "jeetmukherjee100@gmail.com",
  "github": "github.com/jeetxdev",
  "linkedin": "linkedin.com/in/jeetm",
  "resume": "jeetm.dev/resume.pdf",
  "open_to": ["senior roles", "select freelance work", "state management arguments"]
}`,
};
