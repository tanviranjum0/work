import TiltCard from "./TiltCard";
import { MdLiveTv } from "react-icons/md";
// import { FaGithub } from "react-icons/fa";
const ProjectsCard = ({ projects }) => {
  return (
    <div className="flex flex-col">
      <TiltCard projects={projects} />
      <div className="md:max-w-96 relative -top-1  h-fit p-5 ">
        <div className="flex">
          {" "}
          <div className="text-xl font-bold">{projects.name}</div>
          <div className=" relative bottom-3 mx-4 border-b w-full"></div>
          <a
            href={projects.link}
            target="_blank"
            className="border cursor-pointer flex mx-2 transition-all duration-300 hover:border-none hover:rounded hover:bg-green-400 hover:text-[#111] p-1"
          >
            <div className="text-sm font-bold ">Live</div>

            <MdLiveTv className="p-1 active:hidden transition-all duration-300 text-xl" />
          </a>
        </div>
        <div className="pr-3 py-4">
          {projects.tags.map((tag, key) => {
            return (
              <span
                key={`${key} ${tag}`}
                className="px-1 text-sm sm:text-base text-green-300 font-mono"
              >
                {tag}
              </span>
            );
          })}
        </div>
        <div className="leading-5 font-light">
          {projects.shortDescription}
          <span className="text-green-300">Learn More.</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCard;
