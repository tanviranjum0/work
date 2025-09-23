"use client";
import { useRef, useEffect } from "react";
import {
  motion,
  PanInfo,
  useAnimation,
  MotionTransform,
  useScroll,
  useSpring,
} from "motion/react";
import "../styles/swipecards.css";

const cards = [
  "https://plus.unsplash.com/premium_photo-1753982324741-839128d837ad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1753982324741-839128d837ad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1753982324741-839128d837ad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1753982324741-839128d837ad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1753982324741-839128d837ad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1753982324741-839128d837ad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const transition = { type: "spring", stiffness: 300, damping: 50 };

const item = {
  enter: {
    x: 0,
    y: -1000,
    scale: 1.5,
    rotateY: 0,
    rotateZ: 0,
  },
  main: (i: number) => {
    const rotate = -10 + Math.random() * 20;
    return {
      x: 0,
      y: i * -4,
      scale: 1,
      rotateY: rotate / 10,
      rotateZ: rotate,
      transition: { ...transition, delay: 1 + i * 0.1 },
    };
  },
};

const constraints = { top: 0, right: 0, bottom: 0, left: 0 };

const swipeForce = 5;

const swipeThreshold = 5000;

const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

// prettier-ignore
const transform = ({ x, y, scale, rotateY, rotateZ }: MotionTransform) => `perspective(1500px) rotateX(30deg) rotateY(${rotateY}) rotateZ(${rotateZ}) scale(${scale}) translateX(${x}) translateY(${y})`

function CardDesk() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["end end", "start start"],
  });
  const keyScroll = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  const controls = useAnimation();
  const gone = useRef(new Set()).current;

  const onDragEnd = async (index: number, { offset, velocity }: PanInfo) => {
    const swipeX = swipePower(offset.x, velocity.x);
    const swipeY = swipePower(offset.y, velocity.y);

    // If the strength of the swipe is not high enough, return
    // since each card has the dragConstraints set, the card
    // will animate back to its original position
    if (Math.abs(swipeX) < swipeThreshold && Math.abs(swipeY) < swipeThreshold)
      return;

    // Keep track of cards that are dismissed
    gone.add(index);

    // Animate the card away from the stack, using the offset
    // of the drag multiplied by a force factor.
    // This will slide the card away from the  stack
    await controls.start((i: number) => {
      if (index !== i) return {}; // We're only interested in animating the current card
      return {
        transition,
        x: offset.x * swipeForce,
        y: offset.y * swipeForce,
      };
    });

    // If all cards are gone, simple rebuild the card stack after some delay has passed
    if (gone.size === cards.length) {
      gone.clear();
      await controls.start(item.main);
    }
  };

  // Run the enter animation only once the component is mounted
  // This is kind of what the variants API does, but we can't use
  // variants here since we want the custom controls, thus, we
  // mock what the variants API does and just animate from the
  // enter animation to the main animation.
  useEffect(() => {
    async function startAnimation() {
      await controls.start(item.enter);
      await controls.start(item.main);
    }
    startAnimation();
  }, []);

  return (
    <div>
      <motion.div
        ref={container}
        className="bg swipecontainer flex justify-between p-10 items-center"
      >
        <div className="flex flex-col items-center mx-5">
          <div className="text-4xl">
            Your well-being
            <span
              style={{
                fontSize: "3rem",
                position: "relative",
                fontWeight: "bold",
                lineHeight: 1.2,
                background: "linear-gradient(90deg, #FF0080, #7928CA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              Journey
            </span>
          </div>
          <div className="text-2xl">is a race not a sprint</div>
        </div>
        {/* Simply map over the number of cards and them. 
          Each card is positioned absolute and centered on the 
          screen so the cards stack. */}
        <div className="w-full">
          {" "}
          {Array(cards.length)
            .fill(null)
            .map((_, i) => (
              <>
                {/* This is the card itself. We use the index as a `key` for the element
                  and also inject it as `custom` property so we know which is which.
                  Additionally, we provide our custom constrols to the `animate` prop 
                  to manipulate the animation. We also provide a custom `transformTemplate`
                  to include a perspective transform which is useful for a kind of 3D-Look.
                  We enable `drag` on the element and set the `dragConstraints` to all zero
                  while the `dragElastic` prop is 1. Thus, we can freely drag the item however
                  we want, but in case or swipe is not strong enough, it will snap back into 
                  its original place. We also set the background to some image and 
                  animate the scale while we tap the element to simulate that we pick the element up. */}
                <motion.div
                  key={i}
                  custom={i}
                  className="card"
                  animate={controls}
                  transformTemplate={transform}
                  drag
                  dragElastic={1}
                  dragConstraints={constraints}
                  onDragEnd={(_, info) => onDragEnd(i, info)}
                  style={{ backgroundImage: `url(${cards[i]})` }}
                  whileTap={{ scale: 1.1 }}
                />
              </>
            ))}
        </div>
        <div className="flex flex-col justify-center items-center mx-5">
          <div className="text-4xl">
            Unlock your
            <span
              style={{
                fontSize: "3rem",
                position: "relative",
                fontWeight: "bold",
                lineHeight: 1.2,
                background: "linear-gradient(90deg, #FF0080, #7928CA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              Potential
            </span>
            <motion.div
              style={{
                rotate: -keyScroll * 90,
              }}
              className="w-40 mt-14 rotate-90"
            >
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 2731.1914 957.4548"
                enableBackground="new 0 0 2731.1914 957.4548"
                xmlSpace="preserve"
              >
                <path
                  d="M455.4235,66.1424c-54.6162,17.0518-99.3918,59.2998-124.8123,109.9444c-19.2071,38.806-20.2057,83.0207-19.2763,125.3689
	c-81.3054-22.5263-175.0156,22.3917-210.1871,98.7897c-9.2783,20.1539-8.3644,20.2433-11.8496,40.3688
	c-4.8375,27.9341-4.2083,37.05-2.2042,55.969c1.4357,22.2823,7.3027,38.5111,7.3027,38.5111
	c18.9492,58.527,69.7227,105.9932,129.7515,120.0033c29.4164,7.2276,60.193,5.4804,89.8412,0.4908
	c-10.0096,49.0664,0.651,101.5653,26.9936,143.9475c40.0951,69.8319,124.2904,109.4827,203.7165,100.3759
	c59.5697-5.0167,114.4316-39.2678,148.4309-88.02c43.8649-59.9792,49.3115-143.4517,19.5382-210.7177
	c-9.8316-22.9943-26.1176-42.2539-42.4297-60.8617c28.0953,8.4742,51.7559,26.8591,78.8311,37.7869
	c15.0134-12.9937,31.1224-24.7645,45.5006-38.5804c3.7272,8.9449,3.8483,18.9711,7.8889,27.7497
	c10.0868,16.8039,29.2522,29.2213,49.3516,27.063c30.2103-0.5527,57.327-29.4418,52.5215-60.0773
	c53.2219,2.8256,106.5587,1.6002,159.8384,2.1477c369.2572,1.4902,738.547,2.401,1107.818,3.5652
	c1.2515,14.8565,2.1516,29.8459-0.686,44.5543c-50.4106-0.8195-100.8386-0.8437-151.2317-0.3648
	c-0.5316,25.5208-1.4232,51.0667,0.4229,76.5304c12.7258,5.466,26.0077,9.5942,39.3083,13.4681
	c2.9021,10.049,2.3779,20.6616,0.739,30.8108c-13.6473,3.5859-26.5519,9.5385-40.3643,12.3054
	c-0.2438,58.6731-3.405,117.4406-0.8727,176.0644c44.5675,0.3605,89.2118-1.8113,133.7675,0.968
	c2.3611-41.747,1.3955-83.5872,0.6863-125.3732c20.0256-2.6947,40.2749,0.4066,60.4207-1.6105
	c2.1978,41.3934-0.7817,83.0754-0.6724,124.5418c35.9739,2.9083,72.0852,2.0889,108.1611,0.7665
	c2.4275-41.3186-1.1101-82.7631,2.1106-124.1005c18.6907-0.6166,37.4458,0.2062,56.2112-0.3792
	c6.5234,41.3085-0.7234,83.3964,3.1113,124.9642c44.2317,1.7554,88.5386-0.068,132.8147,1.2869
	c3.0449-58.3628,1.282-116.8237,1.3247-175.2663c-13.5281-4.0386-26.4944-9.8492-40.3279-12.5671
	c-2.46-10.4407-1.1895-21.2139,0.4966-31.7269c13.1692-3.1915,25.8591-8.0822,38.8096-12.3415
	c3.7913-9.8293,0.4207-20.3871,1.0415-30.6455c-1.0986-15.77,0.114-31.5202,1.5471-47.2133
	c-6.0505-0.842-12.2354-1.0246-18.2112-0.7888c-45.033,1.7659-90.1157-0.2912-135.1638,1.2592
	c-1.3352-13.9846-0.3328-28.0956-0.8804-42.1711c48.9639-3.3753,98.0977-0.1564,147.1155-0.684
	c-0.1201-7.4272-0.6382-14.8632-0.3325-22.3926c2.8564-5.1081,8.5769-1.7526,11.6807,1.3517
	c9.5369,9.9482,19.1436,20.9016,32.7354,25.3331c31.6147,11.8386,69.2354-5.6537,83.7314-35.3964
	c14.8845-30.3829,1.4768-71.0313-28.1584-87.0868c-20.8877-9.1569-46.5176-11.7753-66.7476,0.4272
	c-12.7231,6.481-17.4023,25.3247-33.6899,24.6904c-0.3083-8.5696,2.5593-17.1435,0.8042-25.7563
	c-535.365-2.9481-1070.7096,3.1985-1606.0455-0.3652c4.9905-41.3167-45.7549-72.3251-81.2896-53.3897
	c-17.4521,9.59-25.137,29.3286-29.7484,47.5896c-15.7491-12.0779-30.9636-24.7701-45.6766-38.0392
	c-26.2166,12.7996-50.687,29.4122-78.5338,38.4993c13.2449-15.5779,27.082-30.9441,36.637-49.2245
	c30.2678-52.5713,31.2701-117.9753,12.8795-174.6998c-13.9058-42.0941-43.6952-77.9916-80.674-102.0542
	C586.0027,56.07,516.3781,46.8071,455.4235,66.1424z M590.3859,152.6449c35.858,21.975,61.7482,60.9593,64.8013,103.2316
	c4.816,47.8885-19.7172,97.2808-60.3073,122.9215c-14.9481,9.7766-31.9865,15.9811-49.3969,19.4317
	c-3.9196,1.248-10.6946,0.8896-10.3176,6.8194c-0.7255,9.7962,2.2458,19.8047-1.2086,29.286
	c-10.6701,0.2019-15.4357-10.6922-22.0568-17.125c-12.06-14.5729-34.2052-16.3871-50.3849-8.2208
	c-21.0975,9.5914-32.5003,32.4406-35.6277,54.3883c-4.3816,27.7741,2.1835,59.8391,24.7355,78.3736
	c17.1709,14.8664,45.9146,15.0294,61.9397-1.5718c5.8635-6.509,10.3444-17.8304,20.7899-17.1146
	c4.5142,10.9116,0.8486,22.5371,0.8004,33.7661c28.3914,4.953,57.049,14.7596,77.7832,35.6943
	c48.924,42.6865,57.3423,123.0994,17.7656,174.6948c-22.9255,31.0155-58.7788,53.1497-97.6028,55.963
	c-33.1117,3.4619-66.901-7.4676-93.0364-27.701c-35.6729-28.1241-56.2947-74.9119-51.0098-120.2916
	c3.0522-31.8329,20.527-60.2668,42.0326-83.1698c-23.9846-20.9613-47.7036-42.2656-71.6544-63.2652
	c-19.6789,24.2558-45.584,46.7074-77.8283,50.1813c-55.5916,5.6416-111.0992-41.3868-113.423-97.535
	c-1.8406-38.8557,22.0823-76.7988,57.1049-93.244c29.2238-14.7057,66.0112-14.6336,94.302,2.3456
	c15.801,8.6812,28.0173,22.3768,38.3102,36.9644c26.0116-18.8495,48.4291-42.141,73.6849-61.9848
	c-22.0155-24.3114-38.4592-54.6412-42.0161-87.5662c-8.1386-65.5243,43.349-130.0781,107.2407-141.9646
	C527.9047,129.3482,562.4468,135.5323,590.3859,152.6449z"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <div className="h-[100vh] bg-orange-400 mt-[100vh]"></div>
    </div>
  );
}

export default CardDesk;
