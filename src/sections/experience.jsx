import SectionHeading from "./sectionHeading";
const companies = [
  {
    name: "DigitalAPICraft Private Limited",
    duration: "March 2022 - Present",
    location: "Bangalore, India",
    position: "Senior Technical Specialist",
  },
  {
    name: "i-Link Research Solutions",
    duration: "July 2018 - March 2022",
    location: "Bangalore, India",
    position: "Senior Developer",
  },
  {
    name: "T-Web Exponent Services Private Limited",
    duration: "September 2017 — June 2018",
    location: "Kolkata, India",
    position: "Web Developer",
  },
  {
    name: "Corelynx Solutions Private Limited",
    duration: "Jun 2015 — Sep 2017",
    location: "Kolkata, India",
    position: "Programmer Analyst",
  },
];
export default function Experience() {
  return (
    <>
      <SectionHeading title={"Experience"} />
      <div className="p-4 relative">
        <div className="min-h-full w-0.5 bg-gradient-to-b from-zinc-800 dark:from-zinc-400 to-zinc-200 dark:to-zinc-900 absolute left-0"></div>
        <ul className="">
          {companies.map((company, index) => (
            <li
              key={index}
              className={
                "flex flex-col gap-2 pb-4 mb-4 border p-4 rounded-lg border-zinc-400 dark:border-zinc-800 shadow-md bg-zinc-50 dark:bg-zinc-800 relative"
              }
            >
              <div className="absolute w-2 h-2 rounded-full bg-zinc-800 dark:bg-zinc-300 -left-5 top-7"></div>
              <div className={"md:flex md:items-center md:justify-between"}>
                <div className={"font-semibold text-lg"}>{company.name}</div>
                <div className={"text-sm max-md:mt-4"}>{company.duration}</div>
              </div>
              <div className={"text-sm"}>{company.position}</div>
              <div className={"text-sm"}>{company.location}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
