// const images = [
//   "https://business.adobe.com/blog/basics/media_1344a5a68032785bf8eb18e748f92b1078812f729.png?width=2000&format=webply&optimize=medium",
//   "https://business.adobe.com/blog/basics/media_14e35529cffcb7d5fe9d68dc1fbcf3662196be3f3.png?width=2000&format=webply&optimize=medium",
//   "https://business.adobe.com/blog/basics/media_191d4264f4b2a54c2cc964c335309b8cbdb066087.png?width=2000&format=webply&optimize=medium",
//   "https://business.adobe.com/blog/basics/media_1bc0275f4fc0ef95aedef70cfaa71e62c9e01473d.png?width=2000&format=webply&optimize=medium",
//   "https://business.adobe.com/blog/basics/media_10739d296019a74991795ffe17ee73afc8447df67.png?width=2000&format=webply&optimize=medium",
// ];

"use client";
import React from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

export default function StickyImageScroll() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const images = [
    "https://business.adobe.com/blog/basics/media_1344a5a68032785bf8eb18e748f92b1078812f729.png?width=2000&format=webply&optimize=medium",
    "https://business.adobe.com/blog/basics/media_14e35529cffcb7d5fe9d68dc1fbcf3662196be3f3.png?width=2000&format=webply&optimize=medium",
    "https://business.adobe.com/blog/basics/media_191d4264f4b2a54c2cc964c335309b8cbdb066087.png?width=2000&format=webply&optimize=medium",
    "https://business.adobe.com/blog/basics/media_1bc0275f4fc0ef95aedef70cfaa71e62c9e01473d.png?width=2000&format=webply&optimize=medium",
    "https://business.adobe.com/blog/basics/media_10739d296019a74991795ffe17ee73afc8447df67.png?width=2000&format=webply&optimize=medium",
  ];

  return (
    <div className="w-full  min-h-screen flex items-center justify-center">
      <section
        ref={containerRef}
        className="relative w-full inset-0 -my-0 min-h-[500vh] bg-gradient-to-br from-gray-50 to-gray-200"
      >
        {/* Right sticky image showcase */}
        <div className="sticky right-0 top-0 w-full h-screen flex items-center justify-center">
          <div className="relative w-full m-32 h-full">
            {images.map((src, i) => {
              const start = i / images.length;
              const end = (i + 1) / images.length;
              const opacity = useTransform(
                scrollYProgress,
                [start, end],
                [0, 1]
              );
              const scale = useTransform(
                scrollYProgress,
                [start, end],
                [0.95, 1]
              );

              return (
                <motion.img
                  key={i}
                  src={src}
                  alt={`Scenery ${i + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white`}
                  style={{
                    opacity,
                    scale,
                    zIndex: i + 1,
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
