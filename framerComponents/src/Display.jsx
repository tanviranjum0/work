import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import AnimationControls from "./components/AnimationControls";
import AppleAnim from "./components/AppleAnim";
import BasicsOfMotion from "./components/BasicsOfMotion";
import BubbleText from "./components/BubbleText";
import DropdownMenu1 from "./components/DropdownMenu1";
import DropdownMenu2 from "./components/DropdownMenu2";
import Gestures from "./components/Gestures";
import HideNav from "./components/HideNav";
import HorizontalScroll from "./components/HorizontalScroll";
import OnScrollReveal from "./components/OnScrollReveal";
import SlideTabs from "./components/SlideTabs";
import ScrollAnim from "./components/ScrollAnim";
import SwipeCarousel from "./components/SwipeCarousel";
import TiltCard from "./components/TiltCard";
import ViewBaseAnimaions from "./components/ViewBaseAnimaions";
import Zoop from "./components/Zoop";
const Display = () => {
  return (
    <BrowserRouter>
      <nav className="h-screen fixed w-[20%] top-0 left-0 bg-neutral-600">
        <ul className="list-none flex flex-col p-5">
          <Link
            to={"/animation-controls"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Animation Controls
          </Link>
          <Link
            to={"/apple-anim"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Apple Anim
          </Link>
          <Link
            to={"/basics-of-motion"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Basic of Motion
          </Link>
          <Link
            to={"/bubble-text"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Bubble Text
          </Link>
          <Link
            to={"/dropdown-menu1"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Dropdown 01
          </Link>
          <Link
            to={"/dropdown-menu2"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Dropdown 02
          </Link>
          <Link
            to={"/gestures"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Gesture
          </Link>
          <Link
            to={"/hide-nav"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Hide nav
          </Link>
          <Link
            to={"/horizontal-scroll"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Horizontal Scroll
          </Link>
          {/* <Link
            to={"/on-scroll-reveal"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            On Scroll Reveal
          </Link> */}
          {/* <Link
            to={"/scroll-anim"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Scroll Anim
          </Link> */}
          <Link
            to={"/slide-tabs"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Slide Tabs
          </Link>
          {/* <Link
            to={"/swiper-carousel"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Swipe Carousel
          </Link> */}
          <Link
            to={"/tilt-card"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Tilt Card
          </Link>
          <Link
            to={"/view-base-animation"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            View Base animation
          </Link>
          <Link
            to={"/zoop"}
            className=" text-white w-full  px-3 py-2 hover:bg-green-400 active:scale-95 "
          >
            Zoop
          </Link>
        </ul>
      </nav>

      <div className="absolute left-[20%] m-5 z-10 top-0 w-[78%]">
        <Routes>
          <Route path="/animation-controls" element={<AnimationControls />} />
          <Route path="apple-anim" element={<AppleAnim />} />
          <Route path="basics-of-motion" element={<BasicsOfMotion />} />
          <Route path="bubble-text" element={<BubbleText />} />
          <Route path="dropdown-menu1" element={<DropdownMenu1 />} />
          <Route path="dropdown-menu2" element={<DropdownMenu2 />} />
          <Route path="gestures" element={<Gestures />} />
          <Route path="hide-nav" element={<HideNav />} />
          <Route path="horizontal-scroll" element={<HorizontalScroll />} />
          <Route path="on-scroll-reveal" element={<OnScrollReveal />} />
          <Route path="scroll-anim" element={<ScrollAnim />} />
          <Route path="slide-tabs" element={<SlideTabs />} />
          <Route path="swiper-carousel" element={<SwipeCarousel />} />
          <Route path="tilt-card" element={<TiltCard />} />
          <Route path="view-base-animation" element={<ViewBaseAnimaions />} />
          <Route path="zoop" element={<Zoop />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Display;
