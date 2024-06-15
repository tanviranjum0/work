"use client";
import { motion } from "framer-motion";
const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div id="about" className="dark:text-[#C4D7F6] text-center pb-10 py-5">
        <div className="text-2xl md:text:4xl text-center">ABOUT ME</div>
        <p
          // style={{ borderBottom: "1px solid black" }}
          className="text-center mx-auto w-4/6"
        >
          I have been a Fullstack web developer since 2021 and continuously
          learning new technologies. I have expertise in various projects like
          e-commerce, Portfolio and SaaS-based websites. I am very passionate
          about my work. I have expertise in HTML, Css, React js, Next.js, Node
          js, Express js etc.I am also experienced as a team player. I am
          looking forward to new opportunities to expand my knowledge.
        </p>
        <hr className="w-full border-spacing-2 border-black my-9" />
        <div
          id="work"
          className="grid md:grid-cols-2 md:justify-between mx-10 gap-5"
        >
          {/* <div className="text-2xl ">Skills</div>
      <div className="text-2xl">Tools i use</div> */}
          <div className=" ">
            <div
              style={{ borderBottom: "3px solid #C4D7F6" }}
              className="text-2xl "
            >
              Skills
            </div>

            <ul className="list-none">
              <li>Node JS</li>
              <li>Express JS</li>
              <li>MongoDD</li>
              <li>NoSql</li>
              <li>Javascript</li>
              <li>React JS & Next JS</li>
              <li>Bootstarp & Tailwind</li>
            </ul>
          </div>
          <div className="">
            <div
              style={{ borderBottom: "3px solid #C4D7F6" }}
              className="text-2xl "
            >
              Tools
            </div>
            <ul className="list-none">
              <li>Vs Code</li>
              <li>Git & Github</li>
              <li>Docker</li>
              <li>AWS</li>
              <li>Postman</li>
              <li>Jest</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
