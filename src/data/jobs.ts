export type Job = {
  role: string;
  company: string;
  from: string;
  to: string;
  place: string;
  tech: string[];
  points: string[];
};

export const JOBS: Job[] = [
  {
    role: "Assoc, Frontend Engineer",
    company: "Standard Chartered",
    from: "2025",
    to: "— now",
    place: "Bangalore, IN",
    tech: ["React.js", "Redux", "CSS", "SCSS", "CI/CD", "Vite"],
    points: [
      "Built a responsive React web application integrated into native iOS/Android WebViews, leveraging custom bridges for native device capabilities, with automated deployment handled entirely via Azure pipelines.",
    ],
  },
  {
    role: "Senior Technical Specialist",
    company: "DigitalAPICraft Private Limited",
    from: "2022",
    to: "— 2025",
    place: "Bangalore, IN",
    tech: [
      "React.js",
      "Redux",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Styled Components",
    ],
    points: [
      "Built and maintained React fintech dashboards inside the Fiserv AppMarket, used daily by enterprise banking partners.",
      "Shipped an embedded API explorer that lets clients visualise and test APIs right in the browser.",
      "Wrapped API products in developer-friendly UIs with product and API teams, cutting partner onboarding time.",
      "Raised maintainability and performance with reusable component patterns, lazy loading and sane state management.",
      "Contributed to internal API-documentation tooling, trimming manual testing and tightening release cycles.",
    ],
  },
  {
    role: "IT Application Developer",
    company: "i-Link Research Solutions",
    from: "2018",
    to: "— 2022",
    place: "Bangalore, IN",
    tech: ["React.js", "PHP", "MySQL", "jQuery", "CodeIgniter", "REST API"],
    points: [
      "Owned requirements through delivery for applications across several company websites.",
      "Added multilingual support and prepared the web-services framework for cross-market launches.",
      "Extended the in-house admin portal and campaign management system — PHP MVC back end, React front end.",
      "Built REST APIs on CodeIgniter and MySQL for the mobile apps.",
    ],
  },
  {
    role: "Software Developer",
    company: "Techno Exponent",
    from: "2017",
    to: "— 2018",
    place: "Kolkata, IN",
    tech: ["JavaScript", "PHP", "MySQL", "Laravel", "Bootstrap", "REST API"],
    points: [
      "Designed a merchant portal end to end, from login flow to financial report generation.",
      "Built an e-commerce site with a team of five, pulling per-seller listings via the Amazon Marketplace API.",
      "Turned mock-ups into HTML, JavaScript, AJAX and JSON; kept it working across Chrome, Firefox and Safari.",
    ],
  },
  {
    role: "Program Analyst",
    company: "Corelynx Solutions",
    from: "2015",
    to: "— 2017",
    place: "Kolkata, IN",
    tech: ["JavaScript", "PHP", "MySQL", "jQuery", "CodeIgniter", "Git"],
    points: [
      "Researched and prototyped new technology for ConvergeHub CRM.",
      "Implemented back-end APIs for the Android and iOS apps, plus a Swagger UI documentation site.",
      "Added Dropbox-style storage with sync to Dropbox, Google Drive and Box.",
      "Built a Zapier app for the CRM and a Mailchimp-powered campaign management system.",
    ],
  },
];
