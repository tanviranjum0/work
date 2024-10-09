import Reveal from "./Reveal";

const Hero = () => {
  return (
    <div>
      <Reveal>
        <div
          // draggable="true"
          className="text-center selection:bg-red-200 selection:text-blue-400 text-4xl p-5 bg-green-300"
        >
          Hey There How are you!
        </div>
      </Reveal>
    </div>
  );
};

export default Hero;
