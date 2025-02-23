import { FaDownload } from "react-icons/fa6";

export default function Resume() {
  return (
    <div className="flex justify-center mt-4">
      <a href="/JEET_MUKHERJEE_-_Senior_Technical_Specialist.pdf" download>
        <button className="bg-zinc-500 dark:bg-zinc-800 text-white font-semibold rounded-lg px-4 py-2 shadow-md cursor-pointer">
          Download Resume <FaDownload className="size-4 inline ml-2" />
        </button>
      </a>
    </div>
  );
}
