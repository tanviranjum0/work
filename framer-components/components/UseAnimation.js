"use client";
import { useAnimate } from "framer-motion";

const UseAnimation = () => {
  const [scope, animate] = useAnimate();
  const handleAnimate = async () => {
    await animate("#target", { x: 150 });
    await animate("#target", { y: 150, rotate: "360deg" }, { duration: 0.5 });
    await animate("button", { background: "blue" }, { duration: 0.5 });
    await animate(
      "#target",
      { x: 0, y: 0, rotate: "360deg", background: "red" },
      { duration: 0.5 }
    );
    await animate("button", { rotate: "360deg" }, { duration: 0.5 });
  };
  return (
    <div>
      <div className="grid h-screen place-items-center">
        <div ref={scope}>
          <div id="target" className="h-24 w-24 bg-violet-500"></div>
          <button
            onClick={handleAnimate}
            className="mt-4 text-white rounded-md bg-slate-900 px-4 py-2 font-mono"
          >
            Trigger Animation
          </button>
        </div>
      </div>
    </div>
  );
};

export default UseAnimation;
