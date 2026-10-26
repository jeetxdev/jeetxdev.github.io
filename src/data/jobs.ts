export type Job = {
  slug: string;
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
    slug: "standard-chartered",
    role: "Assoc, Frontend Engineer",
    company: "Standard Chartered",
    from: "2025",
    to: "now",
    place: "Bangalore, IN",
    tech: ["React.js", "Redux", "CSS", "SCSS", "CI/CD", "Vite"],
    points: [
      "Built a responsive React web application integrated into native iOS/Android WebViews, leveraging custom bridges for native device capabilities, with automated deployment handled entirely via Azure pipelines.",
    ],
  },
  {
    slug: "digitalapicraft",
    role: "Senior Technical Specialist",
    company: "DigitalAPICraft Private Limited",
    from: "2022",
    to: "2025",
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
      "Wrapped API products in interfaces built for developers, working with product and API teams, which cut partner onboarding time.",
      "Raised maintainability and performance with reusable component patterns, lazy loading and sane state management.",
      "Contributed to internal tooling for API documentation, trimming manual testing and tightening release cycles.",
    ],
  },
  {
    slug: "i-link",
    role: "IT Application Developer",
    company: "i-Link Research Solutions",
    from: "2018",
    to: "2022",
    place: "Bangalore, IN",
    tech: ["React.js", "PHP", "MySQL", "jQuery", "CodeIgniter", "REST API"],
    points: [
      "Owned requirements through delivery for applications across several company websites.",
      "Added multilingual support and prepared the web services framework for launches in new markets.",
      "Extended the internal admin portal and campaign management system, with a PHP MVC back end and a React front end.",
      "Built REST APIs on CodeIgniter and MySQL for the mobile apps.",
    ],
  },
  {
    slug: "techno-exponent",
    role: "Software Developer",
    company: "Techno Exponent",
    from: "2017",
    to: "2018",
    place: "Kolkata, IN",
    tech: ["JavaScript", "PHP", "MySQL", "Laravel", "Bootstrap", "REST API"],
    points: [
      "Designed a merchant portal end to end, from login flow to financial report generation.",
      "Built an ecommerce site with a team of five, pulling each seller's listings through the Amazon Marketplace API.",
      "Turned mockups into HTML, JavaScript, AJAX and JSON, and kept the result working across Chrome, Firefox and Safari.",
    ],
  },
  {
    slug: "corelynx",
    role: "Program Analyst",
    company: "Corelynx Solutions",
    from: "2015",
    to: "2017",
    place: "Kolkata, IN",
    tech: ["JavaScript", "PHP", "MySQL", "jQuery", "CodeIgniter", "Git"],
    points: [
      "Researched and prototyped new technology for ConvergeHub CRM.",
      "Implemented backend APIs for the Android and iOS apps, plus a Swagger UI documentation site.",
      "Added file storage that syncs with Dropbox, Google Drive and Box.",
      "Built a Zapier app for the CRM and a campaign management system on top of Mailchimp.",
    ],
  },
];
