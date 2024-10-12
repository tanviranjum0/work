import ProjectsCard from "../components/ProjectsCard";
import img1 from "../public/estate.jpg";
import img2 from "../public/ticket.jpg";
import img3 from "../public/flight.jpg";
import ProjectPageHeader from "../components/ProjectPageHeader";
const projectsArray = [
  {
    name: "MernEstate",
    link: "https://rt-estate.vercel.app/",
    shortDescription:
      "Discover your dream home with us. At MernEstate, we offer a curated selection of premium properties tailored to meet your unique lifestyle needs.",
    description:
      "Discover your dream home with us. At MernEstate, we offer a curated selection of premium properties tailored to meet your unique lifestyle needs. Whether you’re looking for a cozy apartment, a spacious family home, or a luxurious estate, our expert team is here to guide you every step of the way. ",
    tags: ["ReactJS", "Express", "MongoDB", "Cloudinary"],
    img: img1,
  },
  {
    name: "RockGaan",
    link: "https://flight-wine.vercel.app/",
    shortDescription:
      "Experience the thrill of live music with ease. At [Your Concert Ticket Website], we bring you the best seats to the hottest concerts.",
    description:
      "Experience the thrill of live music with ease. At RockGaan, we bring you the best seats to the hottest concerts. Discover upcoming events, secure your tickets, and get ready for unforgettable performances by your favorite artists. Your next great concert experience starts here!",
    tags: ["Framer", "Express", "MongoDB", "Redux"],

    img: img2,
  },
  {
    name: "MoveSeeks",
    link: "https://flight-wine.vercel.app/",
    shortDescription: "Find and book the best flights at unbeatable prices.",
    description:
      "Find and book the best flights at unbeatable prices. At MoveSeeks, we compare deals from hundreds of airlines and travel agents to bring you the cheapest, fastest, and most convenient options for your next trip. Start your journey with us and fly smarter!",
    tags: ["Framer", "Express", "MongoDB", "Redux"],
    img: img3,
  },
];
const page = () => {
  return (
    <div className="relative mx-auto w-[calc(100%-10rem)] md:w-[calc(100%-5rem)]  md:left-20 bg-[#111] top-24">
      <ProjectPageHeader />
      <div className="grid gap-5 grid-cols-1 justify-around items-center md:grid-cols-2">
        {projectsArray.map((projects, key) => {
          return <ProjectsCard key={`${key} nonai`} projects={projects} />;
        })}
      </div>
    </div>
  );
};
export default page;
