import Link from "next/link";
const LogoBox = () => {
  return (
    <div className="m-2">
      <Link
        href="/"
        draggable="true"
        className="h-10 w-10  cursor-pointer p-2 select-none  rounded-lg flex justify-center items-center bg-[#111] "
      >
        <div className="text-3xl">T</div>
        <div className="text-3xl  text-green-300">.</div>
      </Link>
    </div>
  );
};

export default LogoBox;
