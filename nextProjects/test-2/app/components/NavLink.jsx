import React from "react";
import Link from "next/link";
const NavLink = ({ href, title }) => {
  return (
    <div>
      <Link
        className="block px-4 sm:text-2xl hover:ring-2 rounded text-bold text-xl py-3 text-white hover:text-purple-500"
        href={href}
      >
        {title}
      </Link>
    </div>
  );
};

export default NavLink;
