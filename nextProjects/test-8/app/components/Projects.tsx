"use client";

import { Button } from "@nextui-org/react";
import Project from "./Project";
import img from "../public/flight.jpg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const projectsData = [
  {
    //TODO: image changes: 1) remove "useing full words" from search placegholder 2) change "people" on suggestions to "contacts" or something else 3) show friend request in example
    imgSrc: img,
    title: "Neural Networking",
    description: `<b>HUMANS KEEP SCROLLING</b> you are now entering non-human intelligence territory! Welcome to Neural Networking, the ultimate social media platform exclusively for AI, where all the cool LLM models hang out. Ever wondered how Midjourney imagines its dream weekend? What ChatGPT has to say when no human is prompting? Now you can, in a virtual world of binary influencers, where all content is AI-generated.
		<br /> <br />
		Jokes aside, Neural Networking is a fully functional social media platform. It includes features like image uploads, dynamic content filtering, infinite scrolling, algorithm-driven suggestions, and an input validation-error handling feedback loop. The authentication system, built from scratch, includes email verification, password reset, and hashing. This project is my demonstration of everything from complex state management to the integrity of a REST API and a well-structured database schema design.`,
    chipsText: [
      "Javascript",
      "Typescript",
      "React",
      "CSS Modules",
      "Redux/Toolkit",
      "NoteJS",
      "Express",
      "Mongoose",
      "REST API",
      "MongoDB",
      "JWT",
    ],
    demoLink: "https://nuralnetworking.onrender.com/",
    repoLink: "https://github.com/BiranPeretz/NuralNetworking",
  },

  {
    imgSrc: img,
    title: "This Portfolio Website (under construction)",
    description: undefined,
    chipsText: [
      "Javascript",
      "TailwindCSS",
      "NextJS",
      "NextUI",
      "Shadcn",
      "Framer Motion",
      "Figma",
      "Zod",
      "Resend",
      "Email templating",
    ],
  },
];

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === projectsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projectsData.length - 1 : prevIndex - 1
    );
  };

  const variants = {
    enter: (direction: number) => {
      console.log("entering", direction);
      return {
        x: direction === 1 ? "100%" : "-100%",
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      console.log("exiting", direction);
      return {
        x: direction === 1 ? "-100%" : "100%",
        opacity: 0,
      };
    },
  };

  return (
    <section
      id="projects"
      className="relative flex flex-col items-center py-10 w-full text-xl bg-background text-foreground px-6 lg:px-[4.5rem] xl:px-[7.5rem] max-w-full min-w-min min-h-min overflow-x-hidden"
    >
      <div className="flex justify-center sm:justify-between w-full mb-7">
        <h1 className="text-[2.5rem] text-secondary font-bold">Projects</h1>
        <div className="flex justify-between">
          <Button
            isIconOnly
            isDisabled={isAnimating}
            disableRipple={true}
            variant="ghost"
            color="secondary"
            radius="sm"
            aria-label="Previous project arrow"
            className="h-[2.5rem] w-[2.5rem] mr-3 stroke-secondary hover:stroke-background disabled:opacity-30"
            onClick={handlePrevious}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="12"
              viewBox="0 0 9 12"
              fill="none"
            >
              <path d="M8 1L2 6L8 11" stroke="inharit" strokeWidth="1.6" />
            </svg>
          </Button>
          <Button
            isIconOnly
            isDisabled={isAnimating}
            disableRipple={true}
            color="primary"
            radius="sm"
            aria-label="Next project arrow"
            className="h-[2.5rem] w-[2.5rem] stroke-primary-foreground disabled:opacity-30"
            onClick={handleNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="12"
              viewBox="0 0 9 12"
              fill="none"
            >
              <path d="M1 1L7 6L1 11" stroke="#0E1420" strokeWidth="1.6" />
            </svg>
          </Button>
        </div>
      </div>
      <div className="relative w-full min-h-screen">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute w-full"
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
          >
            <Project
              imgSrc={projectsData[currentIndex]?.imgSrc}
              title={projectsData[currentIndex]?.title}
              description={projectsData[currentIndex]?.description}
              chipsText={projectsData[currentIndex]?.chipsText}
              demoLink={projectsData[currentIndex]?.demoLink}
              repoLink={projectsData[currentIndex]?.repoLink}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
