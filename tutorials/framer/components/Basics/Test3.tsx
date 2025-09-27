"use client";
// This is a re-implementation of Codrop's Image Trail Effects demo
// https://tympanus.net/codrops/2019/08/07/image-trail-effects/
// Using Framer Motion
// https://framer.com/motion
import img from "../../public/Nature/nature1.jpeg";
import arrow from "../../public/imageTrail/arrow.png";
import badminton from "../../public/imageTrail/badminton.png";
import basketball from "../../public/imageTrail/basketball.png";
import boxing from "../../public/imageTrail/boxing.png";
import cricket from "../../public/imageTrail/cricket.png";
import cycle from "../../public/imageTrail/cycle.png";
import football from "../../public/imageTrail/football.png";
import golf from "../../public/imageTrail/golf.png";
import gym from "../../public/imageTrail/gym.png";
import hiking from "../../public/imageTrail/hiking.png";
import run from "../../public/imageTrail/run.png";
import skete from "../../public/imageTrail/skete.png";
import * as React from "react";
import sync, { cancelSync } from "framesync";
import { createExpoIn, reversed } from "@popmotion/easing";
import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { mix, distance, wrap } from "@popmotion/popcorn";
import "./test3.css";
import Image from "next/image";

const powerOut4 = reversed(createExpoIn(4));
const useAnimationLoop = (callback) => {
  useEffect(() => {
    sync.update(callback, true);
    return () => cancelSync.update(callback);
  }, [callback]);
};
const center = (_, generated: string) => `translate(-50%, -50%) ${generated}`;
const generateNumber = (base, range) => {
  return base - range / 2 + Math.round(Math.random() * range);
};
const generateSize = () => ({
  height: generateNumber(312, 70),
  width: generateNumber(250, 50),
});
// const placeholderColors: Set<string> = new Set();

// for (let i = 0; i < 30; i++) {
//   placeholderColors.add(`hsla(${Math.round(Math.random() * 360)},100%,70%,1)`);
// }
// const images = [
//   arrow,
//   badminton,
//   basketball,
//   boxing,
//   cricket,
//   cycle,
//   football,
//   golf,
//   gym,
//   hiking,
//   run,
//   skete,
// ];
// const colors = Array.from(placeholderColors);

const ImagePlaceholder = ({ position, color }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (!position) return;
    const { xOrigin, x, yOrigin, y } = position;
    controls.start({
      x: [xOrigin, x, x],
      y: [yOrigin, y, y],
      opacity: [1, 1, 0],
      scale: [1, 1, 0.2],
      transition: {
        duration: 0.8,
        ease: ["easeOut", powerOut4, powerOut4],
        times: [0, 0.7, 1],
      },
    });
  }, [position]);

  const style = position ? position.style : {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      transformTemplate={center}
      style={{ background: color, ...style }}
      className="placeholder rounded-2xl border-2"
    >
      <Image
        src={img}
        alt="nature"
        height={100}
        width={400}
        className="h-full w-full border-2 rounded-2xl"
      />
    </motion.div>
  );
};

const TrailImages = ({ distanceThreshold = 140 }) => {
  const mouseInfo = useRef({
    now: { x: 0, y: 0 },
    prev: { x: 0, y: 0 },
    prevImage: { x: 0, y: 0 },
  }).current;

  const imagePositions = useRef([]);

  const [index, setIndex] = useState(0);

  useAnimationLoop(() => {
    const mouseDistance = distance(mouseInfo.now, mouseInfo.prevImage);

    mouseInfo.prev = {
      x: mix(mouseInfo.prev.x || mouseInfo.now.x, mouseInfo.now.x, 0.1),
      y: mix(mouseInfo.prev.y || mouseInfo.now.y, mouseInfo.now.y, 0.1),
    };

    if (mouseDistance > distanceThreshold) {
      const newIndex = index + 1;
      const imageIndex = wrap(0, colors.length - 1, newIndex);

      imagePositions.current[imageIndex] = {
        xOrigin: mouseInfo.prev.x,
        yOrigin: mouseInfo.prev.y,
        x: mouseInfo.now.x,
        y: mouseInfo.now.y,
        style: {
          ...generateSize(),
          zIndex: imageIndex,
        },
      };

      mouseInfo.prevImage = mouseInfo.now;

      setIndex(newIndex);
    }
  });

  return (
    <div
      className="absolute bg-transparent inset-0"
      onMouseMove={(e) => (mouseInfo.now = { x: e.pageX, y: e.pageY })}
    >
      {colors.map((color, i) => (
        <ImagePlaceholder
          position={imagePositions.current[i]}
          color={color}
          key={color}
        />
      ))}
    </div>
  );
};

export default TrailImages;
