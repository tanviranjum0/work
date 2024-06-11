import NavLink from "./components/NavLink";
const navLinks = [
  {
    title: "Home",
    path: "#home",
  },
  {
    title: "About",
    path: "#about",
  },
  {
    title: "Projects",
    path: "#projects",
  },
  {
    title: "Contact",
    path: "#contact",
  },
];
const page = () => {
  return (
    <div className="grid grid=cols-6 ">
      <h2 className="font-bold text-4xl p-3 ">Logo</h2>
      <div className="flex ">
        {" "}
        {navLinks.map((link, index) => (
          <li key={index} style={{ listStyle: "none" }}>
            <NavLink href={link.path} title={link.title} />
          </li>
        ))}
      </div>
    </div>
  );
};

export default page;
