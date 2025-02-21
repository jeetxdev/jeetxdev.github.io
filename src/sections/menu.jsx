import ExperienceIcon from "../assets/icons/ExperienceIcon";
import ResumeIcon from "../assets/icons/ResumeIcon";
import ToolIcon from "../assets/icons/ToolIcon";
import HomeIcon from "../assets/icons/HomeIcon";
import clsx from "clsx";

export default function Menu() {
  const classNames = clsx("size-6 cursor-pointer");
  const menus = {
    home: <HomeIcon className={classNames} />,
    tools: <ToolIcon className={classNames} />,
    experience: <ExperienceIcon className={classNames} />,
    resume: <ResumeIcon className={classNames} />,
  };
  return (
    <div className="fixed inset-0 w-12">
      <ul className="flex gap-8 flex-col items-center justify-center px-2 h-screen">
        {Object.keys(menus).map((key) => (
          <li className="cursor-pointer" key={key}>
            {menus[key]}
          </li>
        ))}
      </ul>
    </div>
  );
}
