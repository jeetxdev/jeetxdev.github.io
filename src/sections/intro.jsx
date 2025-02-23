import profileImg from "/profile.jpeg";
import clsx from "clsx";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Intro() {
  return (
    <>
      <div className="border-zinc-400 rounded-lg p-8 bg-zinc-50 dark:bg-zinc-800 shadow-md mt-12">
        <div className="md:flex md:gap-16 md:items-center my-4">
          <div className="md:size-42 aspect-square max">
            <img
              src={profileImg}
              alt="Portfolio image"
              className="rounded-full size-42 object-cover max-md:m-auto"
            />
          </div>
          <div className="max-md:text-center">
            <div className="mb-2">Hello! I am</div>
            <div className="text-5xl max-md:text-3xl font-bold font-serif tracking-wide">
              Jeet Mukherjee
            </div>
            <div className="mt-2">
              {`I am a developer passionate about building smooth, high-performing web experiences. I love crafting intuitive, scalable solutions that bring ideas to life. Let's create something amazing together!`}
            </div>
            <div className="flex gap-6 mt-4 max-md:justify-center">
              <a href="https://github.com/jeetxdev" target="_blank">
                <FaGithub
                  className={clsx(
                    "size-6",
                    "cursor-pointer",
                    "opacity-60",
                    "max-md:opacity-100",
                    "hover:opacity-100",
                  )}
                />
              </a>
              <a href="https://www.linkedin.com/in/jeetm" target="_blank">
                <FaLinkedin
                  className={clsx(
                    "size-6",
                    "cursor-pointer",
                    "opacity-60",
                    "max-md:opacity-100",
                    "hover:opacity-100",
                  )}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
