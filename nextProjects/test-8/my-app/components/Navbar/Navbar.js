import Link from "next/link";
import logo from "../assets/logo.png";
import Image from "next/image";
import { IoCart } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
const Navbar = () => {
  return (
    <div className="flex opacity-80 text-white border-b-2 border-slate-500 justify-center ">
      <div className=" flex   justify-between  w-10/12">
        <div className="">
          <Link href={"/"}>
            <Image
              unoptimized
              src={logo}
              alt="logo image"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <div className="links items-center flex gap-8 font-bold text-center">
          <Link className="hover:border-b-4 border-slate-500" href={"/"}>
            Home
          </Link>
          <Link className="hover:border-b-4 border-slate-500" href={"/"}>
            Collection
          </Link>
          <Link className="hover:border-b-4 border-slate-500" href={"/"}>
            Company
          </Link>
          <Link className="hover:border-b-4 border-slate-500" href={"/"}>
            About
          </Link>
        </div>
        <div className="icons flex items-center text-2xl gap-6">
          <IoSearchSharp />
          <TbWorld />
          <IoCart />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
