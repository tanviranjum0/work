import LogoBox from "./LogoBox";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="fixed w-16 h-[100vh] bg-black z-50 top-0">
      <LogoBox />
      <div className="flex rotate-90 sm:mt-5 ">
        {" "}
        <Link
          href="/"
          className="mx-5 cursor-pointer  hover:border-b-2 border-green-200 select-none my-4 transition-all duration-300 hover:text-green-400  md:text-xl "
        >
          Home
        </Link>
        <Link
          href="/contact"
          className="mx-5 cursor-pointer hover:border-b-2 border-green-200 select-none my-4 transition-all duration-300 hover:text-green-400  md:text-xl "
        >
          Contact
        </Link>
        <Link
          href="/projects"
          className="mx-5 cursor-pointer hover:border-b-2 border-green-200 select-none my-4 transition-all duration-300 hover:text-green-400  md:text-xl "
        >
          Projects
        </Link>
        <Link
          href="/experience"
          className="mx-5 cursor-pointer hover:border-b-2 border-green-200 select-none my-4 transition-all duration-300 hover:text-green-400  md:text-xl "
        >
          Exp..
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
