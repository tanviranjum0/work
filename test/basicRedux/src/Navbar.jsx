import { useSelector } from "react-redux";
const Navbar = () => {
  const counter = useSelector((state) => state.counter.value);
  return (
    <div className="text-center h3 mt-3">
      I am a Navbar and Counter is {counter}
    </div>
  );
};

export default Navbar;
