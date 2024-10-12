"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import Reveal from "./Reveal";

const TextParallaxContentExample = () => {
  return (
    <div className="relative w-[70vw] md:w-[calc(100%-5rem)]  left-20 bg-[#111] top-24">
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1467664631004-58beab1ece0d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="I'm a Full Stack Developer"
        heading="Hey, I'm Tanvir."
      >
        <ExampleContent
          left="From Curiosity to Craftsmanship."
          rightone="Ever since I was a child, I've been fascinated by technology. The first time I typed a command on a computer, a spark ignited."
          rightTwo="This early curiosity evolved into a passion for building and creating, leading me down the path of web development."
        />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Quality"
        heading="Never compromise."
      >
        <ExampleContent
          left="Strong online presence is essential for businesses."
          rightone="Modern web development services can be integrated with other technologies, such as CRM systems, marketing automation tools, and payment gateways, to streamline business operations."
          rightTwo="My mission is to leverage my skills to build high-quality, efficient, and scalable web applications that exceed client expectations. I believe in the power of technology to solve real-world problems and enhance user experiences, and I'm committed to making a positive impact through my work."
        />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://plus.unsplash.com/premium_photo-1685086785054-d047cdc0e525?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Modern"
        heading="Dress for the best."
      >
        <ExampleContent
          left="Lets Go!"
          rightone="From a curious child fascinated by computers to a professional MERN stack developer, my journey has been about growth, learning, and a relentless pursuit of excellence."
          rightTwo="I invite you to explore my portfolio and see the diverse range of projects I’ve brought to life. Let's collaborate to turn your ideas into reality! Contact me today to get started."
        />
      </TextParallaxContent>
      <button className="rounded-2xl flex gap-2 mb-44 w-40 relative left-[40%] border-2 border-green-400 bg-green-400 px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
        Projects
        <span className="text-xl hover:rotate-45">
          <FiArrowUpRight />
        </span>
      </button>
    </div>
  );
};

const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        borderRadius: "5px",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden "
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
    </motion.div>
  );
};

const ExampleContent = ({ left, rightone, rightTwo }) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    {" "}
    <h2 className="col-span-1 text-3xl  text-[#999] font-bold md:col-span-4">
      <Reveal> {left}</Reveal>
    </h2>
    <div className="col-span-1 md:col-span-8">
      <div className="mb-4 text-xl text-neutral-600 md:text-2xl">
        <Reveal>{rightone}</Reveal>
      </div>
      <div className="mb-8 text-xl text-neutral-600 md:text-2xl">
        <Reveal>{rightTwo}</Reveal>
      </div>
    </div>
  </div>
);

export default TextParallaxContentExample;
