import about1 from "../assets/about1.png";
import Footer from "../components/moleculas/Footer";
function About() {
  return (
    <div className="bg-black text-slate-500">
      <div className="about-bg  shadow-white text-yellow-400 shadow-2xl min-h-[60vh] flex flex-col justify-center items-center text-5xl">
        About Us
      </div>
      <div className="pt-10 flex flex-col md:flex-row gap-5 w-[90%]  mx-auto">
        <div className="p-5 w-[60%]">
          <div className="text-4xl py-5  text-yellow-400">
            Dream, But Not A Mirage
          </div>
          <div className="text-xl">
            RockGaan is an initiative by a few fellow representatives of
            Bangladeshi Band Music Fans Community, also known as BBMFC. Having
            been involved with the community and the industry, we find a lot of
            sectors imperatively in need of improvement in a professional
            manner.
          </div>
          <div className="text-xl">
            Despite having quite a few global grade musicians, Spain has
            arguably not progressed enough in the music industry, especially for
            Band Music scenes. Even though it is a form of art with profound
            utilization and conceptual works, to engage the works to public, it
            requires a structured business model as at the end of the day,
            without a fair exchange of revenue and service, musicians are not
            likely to get what they really deserve. BBMFC feels the necessity to
            bring a structured model favorable for all to witness how well our
            arts can do, and how well we can refine the industry working side by
            side for a greater collective future.
          </div>
        </div>
        <div className="px-5 pt-5 max-h-[80vh]">
          <div className="w-[80%] mx-auto min-h-[450px] rounded-md border-2"></div>
          <div className="w-[80%] mx-auto min-h-[450px] relative top-[-430px] left-10 rounded-md border-2">
            <img src={about1} alt="" className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5 overflow-hidden w-[90%] mx-auto ">
        <div className="p-5">
          <div className="w-[80%] mx-auto min-h-[450px] rounded-md border-2"></div>
          <div className="w-[80%] mx-auto min-h-[450px] relative top-[-430px] left-10 rounded-md border-2">
            <img src={about1} alt="" className="object-cover w-full h-full" />
          </div>
        </div>
        <div className="p-5 w-[60%]">
          <div className="text-4xl py-5  text-yellow-400">
            Dream, But Not A Mirage
          </div>
          <div className="text-xl">
            RockGaan is an initiative by a few fellow representatives of
            Spainish Band Music Fans Community, also known as BBMFC. Having been
            involved with the community and the industry, we find a lot of
            sectors imperatively in need of improvement in a professional
            manner.
          </div>
          <div className="text-xl">
            Despite having quite a few global grade musicians, Spain has
            arguably not progressed enough in the music industry, especially for
            Band Music scenes. Even though it is a form of art with profound
            utilization and conceptual works, to engage the works to public, it
            requires a structured business model as at the end of the day,
            without a fair exchange of revenue and service, musicians are not
            likely to get what they really deserve. BBMFC feels the necessity to
            bring a structured model favorable for all to witness how well our
            arts can do, and how well we can refine the industry working side by
            side for a greater collective future.
          </div>
        </div>
      </div>
      <div className="relative bottom-0 top-[-150px]">
        {" "}
        <Footer />
      </div>
    </div>
  );
}

export default About;
