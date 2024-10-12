"use client";
import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import ProjectDetailsShow from "./ProjectDetailsShow";
import Image from "next/image";
import { handleProjectDetailsShow } from "../handlers/handlers";

const Example = ({ projects }) => {
  return (
    <div className=" text-slate-900">
      <ProjectDetailsShow projects={projects} />
      <TiltCard projects={projects} />
    </div>
  );
};

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard = ({ projects }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onClick={() => handleProjectDetailsShow(projects.name)}
      // onClick={() => window.open(`${projects.link}`)}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-72 md:max-w-96  bg-green-400"
    >
      <div
        style={{
          transform: "translateZ(25px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-1 grid place-content-center  bg-white shadow-lg"
      >
        <Image
          src={projects.img}
          loading="lazy"
          placeholder="blur"
          fill="true"
          style={{
            backgroundPosition: "center",
            backgroundSize: "cover",
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          quality={100}
          alt="Project Photo"
        />
      </div>
    </motion.div>
  );
};

export default Example;
