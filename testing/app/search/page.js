import Navbar from "../components/Navbar";
import HomeSearch from "../components/HomeSearch";
import Flights from "../components/Flights";
import Footer from "../components/Footer";

const page = () => {
  return (
    <div>
      <div className="h-[90vh] main-bg text-sky-800">
        {" "}
        <Navbar />
        <HomeSearch modify={true} />
      </div>
      <Flights />
      <Footer />
    </div>
  );
};

export default page;
