import img from "../../assets/heroimg.png";
import GetTicket from "../atoms/GetTicket";
const AboutSection = () => {
  return (
    <div className="grid w-full mx-auto md:w-[90%] mt-32 md:grid-cols-2 gap-5">
      <div className="p-10 w-full relative ">
        <img src={img} />
      </div>
      <div className="p-10 pt-10">
        <div className="text-6xl text-yellow-400 font-mono">
          New Era of BBMFC
        </div>
        <div className="text-xl pt-5">
          Get Set Rock is an initiative by BBMFC to utilize the community and
          provide more to the industry from a professional aspect. Get Set Rock
          looks forward to engaging in the community directly and bringing
          exciting amenities for anyone involved in the Band Music Scene of
          Bangladesh.
        </div>
        <div className="py-5 text-xl">
          We believe in your enthusiasm, expectation and hope for Bangladeshi
          Band Music Industry. And we promise you, the best musical journey you
          ever had starts here.
        </div>
        <GetTicket />
      </div>
    </div>
  );
};

export default AboutSection;
