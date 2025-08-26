"use client";
import React from "react";
import "./test2.css";
import { motion, useAnimation } from "framer-motion";
// import { wrap, swipePower } from "./utils";
// import "./style.css";
// import data from "./data";
interface Data {
  name: string;
  vicinity: string;
  address: string;
  distance: string;
  duration: string;
}

function curry(func: Function) {
  return (min: number, max: number, v: number) =>
    v !== undefined ? func(min, max, v) : (cv: number) => func(min, max, cv);
}

function wrapFn(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const wrap = curry(wrapFn);

interface SwipePower {
  offset: number;
  absDistance: number;
}
function swipePower(offset: number, absDistance: number) {
  return (offset / absDistance) * 100;
}

const data: Data[] = [
  {
    name: "Lorem ipsum",
    vicinity: "Geöffnet",
    address: "Straße 1, Stadt",
    distance: "0.5 km",
    duration: "10min.",
  },
  {
    name: "Lorem ipsum amit impur",
    vicinity: "Geöffnet",
    address: "Straße 12, Stadt",
    distance: "0.5 km",
    duration: "10min.",
  },
  {
    name: "Lorem ipsum dolor sit",
    vicinity: "Geöffnet",
    address: "Straße 13, Stadt",
    distance: "0.5 km",
    duration: "10min.",
  },
];
const variants = {
  toLeft: {
    x: "-100%",
    pointerEvents: "none",
  },
  toRight: {
    x: "100%",
    pointerEvents: "none",
  },
  center: {
    x: 0,
    pointerEvents: "initial",
  },
};

function Carousel() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [rect, setRect] = React.useState<DOMRect | undefined>();
  const [yOffset, setYOffset] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) {
      const [itemLower] = ref.current.getElementsByClassName("item-lower");
      setYOffset(itemLower.getBoundingClientRect().height);
      setRect(ref.current.getBoundingClientRect());
    }
  }, []);

  const [page, setPage] = React.useState(0);
  const prev = wrap(0, data.length, page - 1);
  const cur = wrap(0, data.length, page);
  const next = wrap(0, data.length, page + 1);

  const animation = useAnimation();
  const handleDragEnd = async (
    evt: unknown,
    { offset }: { offset: { x: number; y: number } }
  ) => {
    const power = swipePower(offset.x, rect?.width ?? 1);
    if (power > 60) {
      await animation.start("toRight");
      paginate(-1);
    } else if (power < -60) {
      await animation.start("toLeft");
      paginate(1);
    }
  };

  const paginate = (dir: number) => {
    setPage(page + dir);
  };

  return (
    <div
      className="carousel overflow-x-hidden w-full h-full "
      style={{ transform: `translateY(${yOffset}px)` }}
    >
      <motion.div
        key={page}
        className="track"
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        variants={variants}
        animate={animation}
        dragMomentum={false}
        transition={{
          x: { type: "spring", mass: 0.5, stiffness: 500, damping: 50 },
        }}
      >
        <Item key={prev} data={data[prev]} />
        <Item ref={ref} key={cur} data={data[cur]} yOffset={yOffset} />
        <Item key={next} data={data[next]} />
      </motion.div>
    </div>
  );
}

interface ItemProps {
  data: Data;
  yOffset?: number;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(function (
  { data, yOffset = 0 },
  ref
) {
  const variants = {
    top: {
      y: -yOffset,
    },
    bottom: {
      y: 0,
    },
  };
  const currentVariant = React.useRef("bottom");
  const inMotion = React.useRef(false);
  const animation = useAnimation();

  /**
   * handleDragStart handles a drag start event and sets the inMotion ref
   * to true. We enable click events only if `inMotion != true`.
   * @returns {void}
   */
  const handleDragStart = async () => {
    inMotion.current = true;
  };

  /**
   * handleDragEnd handles the drag end event and decides, if we need to
   * transition into a new animation variant.
   * @param {{}} info - Drag informations
   * @returns {void}
   */
  const handleDragEnd = async (
    _: unknown,
    {
      point,
      offset,
      velocity,
    }: { point: { y: number }; offset: { y: number }; velocity: { y: number } }
  ) => {
    const pos = point.y * -1;
    const dir = offset.y < 0 ? "up" : "down";

    if (dir === "up") {
      if (pos > yOffset / 4 || velocity.y < -20) {
        currentVariant.current = "top";
      } else {
        currentVariant.current = "bottom";
      }
    } else if (dir === "down") {
      if (pos < yOffset / 4 || velocity.y > 20) {
        currentVariant.current = "bottom";
      } else {
        currentVariant.current = "top";
      }
    }

    await animation.start(currentVariant.current);
    inMotion.current = false;
  };

  const handleOnClick = async () => {
    if (inMotion.current === false) {
      currentVariant.current =
        currentVariant.current === "top" ? "bottom" : "top";
      await animation.start(currentVariant.current);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="item"
      drag={yOffset ? "y" : false}
      dragDirectionLock
      dragConstraints={{ bottom: 0, top: -yOffset }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragMomentum={false}
      variants={variants}
      animate={animation}
      transition={{
        y: { type: "spring", stiffness: 500, damping: 50 },
      }}
    >
      <div className="item-upper" onClick={handleOnClick}>
        <div className="item-col">
          <p className="item-title">{data.name}</p>
          <p>{data.vicinity}</p>
          <p>{data.address}</p>
        </div>
        <div className="item-col">
          <p>{data.distance}</p>
          <p>{data.duration}</p>
        </div>
      </div>

      <div className="item-lower">
        <button className="button">
          <span />
          Description
        </button>
        <button className="button">
          <span />
          Description
        </button>
        <button className="button">
          <span />
          Description
        </button>
      </div>
    </motion.div>
  );
});

export default Carousel;
