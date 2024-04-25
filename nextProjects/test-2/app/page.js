import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
const page = () => {
  return (
    <div className="bg-black">
      <Navbar></Navbar>
      <div className="flex min-h-screen flex-col">
        <div className="container  px-12 py-4 bg-black mx-auto mt-24">
          <HeroSection />
          <AboutSection></AboutSection>
        </div>
      </div>
    </div>
  );
};

export default page;
