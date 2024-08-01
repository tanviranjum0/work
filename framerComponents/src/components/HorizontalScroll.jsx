"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
// import pic1 from "../public/imgs/abstract/1.png";
// import pic2 from "../public/imgs/abstract/2.png";
// import pic3 from "../public/imgs/abstract/3.png";
// import pic4 from "../public/imgs/abstract/4.png";
// import pic5 from "../public/imgs/abstract/5.png";
// import pic6 from "../public/imgs/abstract/6.png";
// import pic7 from "../public/imgs/abstract/7.png";
const HorizontalScroll = () => {
  return (
    <div className="bg-neutral-800">
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Scroll down
        </span>
      </div>
      <HorizontalScrollCarousel />
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Scroll up
        </span>
      </div>
    </div>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const cards = [
    {
      title: "Title 1",
      id: 1,
    },
    {
      title: "Title 2",
      id: 2,
    },
    {
      title: "Title 3",
      id: 3,
    },
    {
      title: "Title 4",
      id: 4,
    },
    {
      title: "Title 5",
      id: 5,
    },
    {
      title: "Title 6",
      id: 6,
    },
    {
      title: "Title 7",
      id: 7,
    },
  ];

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url("../public/imgs/abstract/3.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
          {card.title}
        </p>
      </div>
    </div>
  );
};

export default HorizontalScroll;
