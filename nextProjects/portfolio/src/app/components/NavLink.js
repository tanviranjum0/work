import Link from "next/link";

const NavLink = ({ href, title }) => {
  return (
    <Link href={href} className="">
      {title}
    </Link>
  );
};

export default NavLink;
