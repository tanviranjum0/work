import "./Header.css";
const Header = () => {
  return (
    <div className="header text-white">
      <div className="flex ">
        <div className="header-contents basis-1/4 p-10 ">
          <h2 className="text-slate-100 text-3xl py-6">
            <i>Luxury</i> in Blood
          </h2>
          <p className="text-slate-100 m-3">
            Discover the new watches which embody the brand’s uncompromising
            approach to craftsmanship.
          </p>
          <button className="bg-[#ece8e4] py-2 mt-4 transition-all text-black hover:scale-105 hover:text-slate-900 hover:bg-slate-500  px-4 rounded">
            View Collections
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
