import LogoBox from "./LogoBox";

const Sidebar = () => {
  return (
    <div className="fixed w-20 h-screen bg-black z-50 top-0">
      <LogoBox />
      <div className="flex rotate-90 mt-5 ">
        {" "}
        <div className="px-8 py-7 transition-all duration-300 hover:text-green-400  md:text-xl ">
          Home
        </div>
        <div className="px-8 py-7 transition-all duration-300 hover:text-green-400  md:text-xl ">
          Contact
        </div>
        <div className="px-8 py-7 transition-all duration-300 hover:text-green-400  md:text-xl ">
          Projects
        </div>
        <div className="px-8 py-7 transition-all duration-300 hover:text-green-400  md:text-xl ">
          Exp..
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
