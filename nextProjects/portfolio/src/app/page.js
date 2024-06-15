import HeroSection from "./components/HeroSection";
import About from "./components/About";
import Footer from "./components/Footer";
// import MenuOverlay from "./components/MenuOverlay";
import Navbar from "./components/Navbar";

const page = () => {
  return (
    <div className="bg-[#d7f7f5] dark:text-white  dark:bg-[#263859]">
      <Navbar />
      <HeroSection />
      <About />
      <Footer />
      {/* <MenuOverlay /> */}
    </div>
  );
};

export default page;
