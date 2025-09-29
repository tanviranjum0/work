"use client";
import { cn } from "@/lib/utils";
import Marquee from "react-fast-marquee";
const images = [
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
];
import { createRef, ReactNode, useRef } from "react";
interface ImageMouseTrailProps {
  items: string[];
  children?: ReactNode;
  className?: string;
  imgClass?: string;
  distance?: number;
  maxNumberOfImages?: number;
  fadeAnimation?: boolean;
}
const textsMain = ["React", "Node.js", "Framer Motion", "Tailwind"];

function ImageMouseTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = "w-40 h-48",
  distance = 20,
  fadeAnimation = false,
}: ImageMouseTrailProps) {
  const containerRef = useRef(null);
  const refs = useRef(items.map(() => createRef<HTMLImageElement>()));
  const currentZIndexRef = useRef(1);

  let globalIndex = 0;
  let last = { x: 0, y: 0 };

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const relativeX = x - containerRect.left;
    const relativeY = y - containerRect.top;
    image.style.left = `${relativeX}px`;
    image.style.top = `${relativeY}px`;
    console.log(refs.current[refs.current?.length - 1]);

    if (currentZIndexRef.current > 40) {
      currentZIndexRef.current = 1;
    }
    image.style.zIndex = String(currentZIndexRef.current);
    currentZIndexRef.current++;

    image.dataset.status = "active";
    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = "inactive";
      }, 1500);
    }
    last = { x, y };
  };

  const distanceFromLast = (x: number, y: number) => {
    return Math.hypot(x - last.x, y - last.y);
  };
  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive";
  };

  const handleOnMove = (e: MouseEvent) => {
    if (distanceFromLast(e.clientX, e.clientY) > window.innerWidth / distance) {
      // console.log(e.clientX, e.clientY)

      const lead = refs.current[globalIndex % refs.current.length].current;

      const tail =
        refs.current[(globalIndex - maxNumberOfImages) % refs.current.length]
          ?.current;

      if (lead) activate(lead, e.clientX, e.clientY);
      if (tail) deactivate(tail);
      globalIndex++;
    }
  };

  return (
    <section
      onMouseMove={(e) => handleOnMove(e)}
      onTouchMove={(e) => handleOnMove(e.touches[0])}
      ref={containerRef}
      className={cn(
        "grid place-content-center h-[600px] w-full bg-[#e0dfdf] relative overflow-hidden rounded-lg",
        className
      )}
    >
      {items.map((item, index) => (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={index + "image"}
            className={cn(
              "object-cover rounded-2xl scale-0 opacity:0 data-[status='active']:scale-100  data-[status='active']:opacity-100 transition-transform data-[status='active']:duration-500 duration-300 data-[status='active']:ease-out-expo  absolute   -translate-y-[50%] -translate-x-[50%] ",
              imgClass
            )}
            data-index={index}
            data-status="inactive"
            src={item}
            alt={`image-${index}`}
            ref={refs.current[index]}
          />
        </>
      ))}
      {children}
    </section>
  );
}

function Imagetrail() {
  return (
    <section>
      <div className="h-[100vh] w-[100vw]">
        <ImageMouseTrail
          items={images}
          maxNumberOfImages={10}
          distance={10}
          imgClass="sm:w-40 w-28 sm:h-48 h-36"
        >
          <div className="h-full max-w-full overflow-hidden select-none font-boldonse bg-gray-200 ">
            <Marquee
              direction="right"
              className="marquee uppercase font-extrabold overflow-hidden "
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={index}
                    className="mx-8 text-gray-300 text-9xl leading-40 tracking-wide"
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>
            <Marquee
              className="marquee uppercase font-extrabold overflow-hidden "
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={index}
                    className="mx-8 text-gray-300 text-9xl leading-40 tracking-wide"
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>
            <Marquee
              className="marquee uppercase font-extrabold overflow-hidden"
              direction="right"
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={index}
                    className="mx-8 text-gray-300 text-9xl leading-40 tracking-wide"
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>
            <Marquee
              className="marquee uppercase font-extrabold overflow-hidden"
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={index}
                    className="mx-8 text-gray-300 font-extrabold text-9xl leading-40 tracking-wide "
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>
            <div className="h-[50vh] m-10 z-10 relative -top-[75vh]">
              <div className="my-5">
                <div className="text-7xl leading-32 tracking-wider">
                  The Pros Train
                </div>
                <div className="text-7xl  tracking-wider">
                  with <span className="text-sky-500">Plates</span>
                </div>
              </div>
              <div className="font-sans text-xl font-bold">
                <div className="">
                  He was still too young to know that the heart's memory
                  eliminates
                </div>
                <div className="">
                  the bad and magnifies the good, and that thanks to this
                  artifice
                </div>
                <div className="">
                  we manage to endure the burden of the past.
                </div>
              </div>
            </div>
          </div>
        </ImageMouseTrail>
      </div>
    </section>
  );
}

export default Imagetrail;
