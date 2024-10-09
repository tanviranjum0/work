import AppleLikeAnim from "./components/AppleLikeAnim";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
const page = () => {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <AppleLikeAnim />
    </div>
  );
};

export default page;
