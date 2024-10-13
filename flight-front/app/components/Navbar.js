import Image from "next/image";
// import { motion } from "framer-motion";
import logo from "../../public/logo2.png";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="flex">
      <div className="flex navbar-left-animation pt-10 select-none">
        <Link href={"/"} className="h-10 w-auto ml-10">
          <Image
            src={logo}
            width={100}
            height={100}
            className="h-20 w-20 md:h-auto md:w-auto"
            alt="Picture of the author"
          />
        </Link>
        <div className="text-xl md:text-2xl mt-4 italic ml-[-8px]">
          MoveSeeks
        </div>
      </div>
      <button className="px-5 navbar-right-animation mt-10 py-3 text-lg text-white bg-orange-700 hover:border-2 border-2 border-orange-700 hover:border-orange-700 hover:bg-orange-100 hover:text-orange-700 transition-colors duration-300 rounded-lg absolute right-[3rem]">
        Sign in
      </button>
    </div>
  );
};

export default Navbar;
