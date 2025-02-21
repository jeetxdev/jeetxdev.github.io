import GithubIcon from "../assets/icons/GithubIcon";
import LinkedInIcon from "../assets/icons/LinkedInIcon";
import profileImg from "/profile.jpeg";
import clsx from "clsx";

export default function Intro() {
  const socialClassNames = clsx(
    "size-5",
    "cursor-pointer",
    "opacity-60",
    "hover:opacity-100",
  );
  return (
    <>
      <div className="flex justify-center my-4 m-auto pt-16 px-24 gap-16 items-center">
        <div className="size-42 aspect-square">
          <img
            src={profileImg}
            alt="Portfolio image"
            className="rounded-full size-42 object-cover"
          />
        </div>
        <div className="w-md">
          <div className="mb-2">Hello! I am</div>
          <div className="text-5xl font-bold font-serif tracking-wide">
            Jeet Mukherjee
          </div>
          <div className="mt-2">
            {`I am a developer passionate about building smooth, high-performing web experiences. I love crafting intuitive, scalable solutions that bring ideas to life. Let's create something amazing together!`}
          </div>
        </div>
      </div>
      <div>
        <div className="px-24 m-auto flex gap-8">
          <GithubIcon className={socialClassNames} />
          <LinkedInIcon className={socialClassNames} />
        </div>
      </div>
    </>
  );
}
