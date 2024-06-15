import Link from "next/link";
const MenuOverlay = ({ setNavbarOpen }) => {
  return (
    <div>
      <ul
        onClick={() => setNavbarOpen(false)}
        className="flex top-0 flex-col overflow-y-hidden w-full h-screen text-center mx-auto gap-4 font-medium py-8 list-unstyled "
      >
        <li>
          {" "}
          <Link href="/">HOME</Link>
        </li>
        <li>
          {" "}
          <Link href="/#about">ABOUT</Link>
        </li>
        <li>
          {" "}
          <Link href="/#work">WORK</Link>
        </li>
        <li>
          {" "}
          <Link href="/#contact">CONTACT</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuOverlay;
