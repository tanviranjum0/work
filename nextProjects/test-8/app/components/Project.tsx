import React, { Fragment, Key } from "react";
import { Chip, Button, Card, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";

type Props = {
  imgSrc: string;
  title: React.ReactNode;
  description?: string;
  chipsText: string[];
  demoLink?: string;
  repoLink?: string;
  children?: React.ReactNode;
};

const ProjectsProject: React.FC<Props> = function ({
  imgSrc,
  title,
  description,
  chipsText,
  demoLink,
  repoLink,
  children,
}) {
  return (
    <Card
      className="w-full h-full bg-card rounded-2xl p-6 flex flex-col items-center justify-between shrink-0"
      style={{ boxShadow: "0px 0px 16px 0px rgba(0, 0, 0, 0.15)" }}
    >
      <div
        className="w-full rounded-xl border-1 mb-8 self-center"
        style={{
          borderColor: "rgba(51, 51, 51, 0.25)",
        }}
      >
        <img src={imgSrc} className="w-full rounded-xl" />
      </div>
      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-col justify-between items-center">
          <div className="flex flex-col max-w-full flex-wrap">
            <div className="flex justify-between max-w-full">
              <h2 className="text-secondary font-[Roboto] text-3xl font-semibold mb-8">
                {title}
              </h2>
              <div className="flex gap-4 mr-4">
                {demoLink && (
                  <Link href={demoLink || ""} passHref>
                    <Tooltip showArrow={true} content="Live demo">
                      <Button
                        isIconOnly
                        variant="faded"
                        aria-label="Live demo icon"
                        className=""
                      >
                        <FaRegCirclePlay size={24} />
                      </Button>
                    </Tooltip>
                  </Link>
                )}
                {repoLink && (
                  <Link href={repoLink || ""} passHref>
                    <Tooltip showArrow={true} content="Github repository">
                      <Button
                        isIconOnly
                        variant="faded"
                        aria-label="Github repo icon"
                        className=""
                      >
                        <FiGithub size={24} />
                      </Button>
                    </Tooltip>
                  </Link>
                )}
              </div>
            </div>
            {description && (
              <p
                className="text-[1rem] text-accent mb-8"
                dangerouslySetInnerHTML={{ __html: description }} //TODO: remove and use other way for line breaks
              >
                {/* {description} */}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {chipsText.map((str, i) => (
                <Chip
                  key={i}
                  color="primary"
                  variant="dot"
                  size="lg"
                  className=""
                >
                  {str}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectsProject;
