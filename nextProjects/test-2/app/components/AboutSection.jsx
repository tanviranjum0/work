"use client";
import { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./TabButton";
const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-2">
        <li>Node.js</li>
        <li>Express</li>
        <li>PostgreSQL</li>
        <li>Sequelize</li>
        <li>JavaScript</li>
        <li>React</li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2">
        <li>Fullstack Academy of Code</li>
        <li>University of California, Santa Cruz</li>
      </ul>
    ),
  },
  {
    title: "Experience",
    id: "experience",
    content: (
      <ul className="list-disc pl-2">
        <li>AWS Cloud Practitioner</li>
        <li>Google Professional Cloud Developer</li>
      </ul>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();
  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };
  return (
    <div>
      <div className="grid text-white md:grid-cols-2 md:gap-8 items-center xl:gap-16 py-8 px-4 sm:py-16 xl:px-16">
        <Image
          src="/images/about-image.png"
          width={500}
          height={500}
          quality={100}
          className="rounded"
        ></Image>
        <div className="mt-4 md:mt-4 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold my-4">About ME</h2>
          <p className="text-base lg:text-2xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Consectetur beatae quasi eius, vitae incidunt doloremque dolores
            exercitationem neque rem nisi id! Enim, earum. Consequatur ratione
            eveniet velit mollitia veniam nemo. Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. In, dolorem a, voluptatum, ipsam amet
            dignissimos recusandae unde rerum ex sed dicta totam ut ipsum dolore
            accusamus. Fuga sint saepe dolorem.
          </p>
          <div className="flex flex-row mt-8">
            <TabButton
              selectTab={() => handleTabChange("skills")}
              active={tab === "skills"}
            >
              Skills
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
            >
              Education
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("experience")}
              active={tab === "experience"}
            >
              Experience
            </TabButton>
          </div>
          <div className="mt-8">
            {TAB_DATA.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
