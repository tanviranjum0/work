import Link from "next/link";
const LogoBox = () => {
  return (
    <div className="m-2 ">
      <Link
        href="/"
        draggable="true"
        className="h-12 cursor-pointer w-12 select-none rounded-lg flex justify-center items-center bg-[#111] "
      >
        <div className="text-3xl">T</div>
        <div className="text-3xl text-green-300">.</div>
      </Link>
    </div>
  );
};

export default LogoBox;
