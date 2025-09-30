import React from "react";

const Test3 = () => {
  return (
    <>
      <body>
        <div
          style={{
            color: "#fff",
            height: "500px",
            background: "#212121",
            width: "100%",
            marginBottom: "26px",
            textAlign: "center",
            boxShadow: " 0 2px 5px rgba(0,0,0,0.26)",
          }}
        >
          <h1 style={{ paddingTop: "240px" }}>
            Scroll <span id="bounce">&darr,</span>
          </h1>
          <p>to view my story</p>
        </div>
        <div className="full" id="timeline">
          <p
            style={{
              textAlign: "center",
              fontSize: "26px",
              color: "#fff",
              textShadow: " -3px 3px 1px rgba(0, 0, 0, 0.5)",
              paddingTop: "30px",
            }}
          >
            <u>My story</u>
          </p>
          <br />
          <br />
          <br />
          <div className="timeline">
            <div
              className="fakePuce puceImg"
              id="puceProfile"
              data-anchor-target="#puceTwo"
              data--130-bottom="width: 65px, height: 65px, top: 0px, left: 0px,"
              data--140-bottom="top: 0px, left: 0px, width: 95px, height: 95px,"
            ></div>
            <div className="rotateOne full" style={{ top: "165px" }}>
              <div
                id="bar"
                data-anchor-target="#puceTwo"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              className="puce puceLeft puceOne"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceOne"
            />
            <img
              className="puce puceLeft puceOne"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              style={{ opacity: 1 }}
              className="descOne"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              Hi ! It's me, <b>Jérémie Gaffarel</b>
            </p>
            <div
              className="fakePuce puceImg"
              id="pucePt2"
              data-anchor-target="#puceTwo"
              data--180-bottom="width: 65px, height: 65px,top: 250px, right: 0px,"
              data--200-bottom="width: 95px, height: 95px, top: 250px, right: 0px,"
            ></div>
            <div className="rotateTwo full" style={{ top: "408px" }}>
              <div
                id="bar"
                data-anchor-target="#puceThree"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              className="puce puceRight puceTwo"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceTwo"
            />
            <img
              style={{ opacity: 1 }}
              className="puce puceRight puceTwo"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              style={{ opacity: 1 }}
              className="descTwo"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              My first site is the <b>CP of Pitouille2</b>, <br />
              all begin with that ! <br />
              Link :{" "}
              <a href="https://pitouille2.renseign.com">
                https://pitouille2.renseign.com
              </a>
            </p>
            <div
              className="fakePuce puceImg"
              id="puceHtml"
              data-anchor-target="#puceThree"
              data--180-bottom="width: 65px, height: 65px, top: 500px, left: 0px,"
              data--200-bottom="
      width: 95px, height: 95px, top: 500px, left: 0px,"
            ></div>
            <div className="rotateOne full" style={{ top: "665px" }}>
              <div
                id="bar"
                data-anchor-target="#puceFour"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              className="puce puceLeft puceThree"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceThree"
            />
            <img
              style={{ opacity: 1 }}
              className="puce puceLeft puceThree"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              style={{ opacity: 1 }}
              className="descThree"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              To create my first site, I first learn to write sites in{" "}
              <b>HTML</b>.{" "}
            </p>
            <div
              className="fakePuce puceImg"
              id="puceCss"
              data-anchor-target="#puceFour"
              data--180-bottom="width: 65px, height: 65px, top: 750px, right: 0px,"
              data--200-bottom="width: 95px, height: 95px, top: 750px, right: 0px,"
            ></div>
            <div className="rotateTwo full" style={{ top: "905px" }}>
              <div
                id="bar"
                data-anchor-target="#puceFive"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              className="puce puceRight puceFour"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceFour"
            />
            <img
              style={{ opacity: 1 }}
              className="puce puceRight puceFour"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              style={{ opacity: 1 }}
              className="descFour"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              To add a design to my site, <br />I learned how to create{" "}
              <b>CSS</b> style sheets.{" "}
            </p>
            <div
              className="fakePuce puceImg"
              id="puce4t5"
              data-anchor-target="#puceFive"
              data--180-bottom="width: 65px, height: 65px, top: 1000px, left: 0px,"
              data--200-bottom="width: 95px, height: 95px, top: 1000px, left: 0px,"
            ></div>
            <div className="rotateOne full" style={{ top: "1150px" }}>
              <div
                id="bar"
                data-anchor-target="#puceSix"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              className="puce puceLeft puceFive"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceFive"
            />
            <img
              style={{ opacity: 1 }}
              className="puce puceLeft puceFour"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              style={{ opacity: 1 }}
              className="descFive"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              The second site I've making is <br />a private social network,
              called " <b>4t5</b>". <br />
              Link :{" "}
              <a href="https://4t5.renseign.com">https://4t5.renseign.com</a>
            </p>
            <div
              className="fakePuce puceImg"
              id="pucePhp"
              data-anchor-target="#puceSix"
              data--180-bottom="width: 65px, height: 65px, top: 1250px, right: 0px,"
              data--200-bottom="width: 95px, height: 95px, top: 1250px, right: 0px,"
            ></div>
            <div className="rotateTwo  full" style={{ top: "1400px" }}>
              <div
                id="bar"
                style={{ width: "0%" }}
                data-anchor-target="#puceSeven"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              className="puce puceRight puceSix"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceSix"
            />
            <img
              style={{ opacity: 1 }}
              className="puce puceRight puceSix"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              style={{ opacity: 1 }}
              className="descSix"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              To do this network site, <br />I had to learn my first programming
              language, the <b>PHP</b>.{" "}
            </p>
            <div
              className="fakePuce puceImg"
              id="puceJs"
              data-anchor-target="#puceSeven"
              data--180-bottom="width: 65px, height: 65px, left: 0, top: 1500px,"
              data--200-bottom="width: 95px, height: 95px, left: 0px, top: 1500px,"
            ></div>
            <div className="rotateOne full" style={{ top: "1650px" }}>
              <div
                id="bar"
                style={{ width: "0%" }}
                data-anchor-target="#puceHeight"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              style={{ opacity: 1 }}
              className="puce puceSeven puceLeft"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceSeven"
            />
            <img
              className="puce puceSeven puceLeft"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              className="descSeven"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              Then, to anime some elements of my site, <br />I was learning the{" "}
              <b>javascript</b>.{" "}
            </p>
            <div
              className="fakePuce puceImg"
              id="puceEnvr"
              data-anchor-target="#puceHeight"
              data--180-bottom="width: 65px, height: 65px, top: 1750px, right: 0px,"
              data--200-bottom="width: 95px, height: 95px, top: 1750px, right: 0px,"
            ></div>
            <div className="rotateTwo full" style={{ top: "1900px" }}>
              <div
                id="bar"
                style={{ width: "0%" }}
                data-anchor-target="#puceNine"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              style={{ opacity: 1 }}
              className="puce puceHeight puceRight"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceHeight"
            />
            <img
              className="puce puceHeight puceRight"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              className="descHeight"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              Next, I make my third website, " <b>Environment</b>", a site which
              speak of... environment ! <br />
              Link :{" "}
              <a href="https://environnement.renseign.com">
                https://environnement.renseign.com
              </a>
            </p>
            <div
              className="fakePuce puceImg"
              id="puceCs"
              data-anchor-target="#puceNine"
              data--180-bottom="width: 65px, height: 65px, left: 0px, top: 2000px,"
              data--200-bottom="width: 95px, height: 95px, left: 0px, top: 2000px,"
            ></div>
            <div
              className="rotateThree full"
              style={{ top: "2165px", width: "60%", left: 0 }}
            >
              <div
                id="bar"
                style={{ width: "0%" }}
                data-anchor-target="#puceTen"
                data--140-bottom="width: 0%,"
                data--200-bottom="width: 100%,"
              ></div>
            </div>
            <img
              style={{ opacity: 1 }}
              className="puce puceLeft puceNine"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceNine"
            />
            <img
              className="puce puceLeft puceNine"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
            <p
              className="descNine"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            >
              {" "}
              Finally, I learn a second programming language called " <b>C#</b>"
              for creating a Web Search Engine open source.{" "}
            </p>
            <div
              className="fakePuce puceImg"
              id="puceNext"
              data-anchor-target="#puceTen"
              data--180-bottom="width: 65px, height: 65px, bottom: 0px, left: 250px,"
              data--200-bottom="width: 95px, height: 95px, bottom: 0px, left: 250px,"
            ></div>
            <img
              style={{ opacity: 1 }}
              className="puce puceCenter puceTen"
              data--180-bottom={{ opacity: 1 }}
              data--200-bottom="opacity: 0,"
              id="puceTen"
            />
            <img
              className="puce puceCenter puceTen"
              data--180-bottom="opacity: 0,"
              data--200-bottom={{ opacity: 1 }}
            />
          </div>
          <br />
          <br />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "#fff",
                textShadow: "-3px 3px 1px rgba(0, 0, 0, 0.5)",
              }}
              data--140-bottom="opacity: 0,"
              data--160-bottom={{ opacity: 1 }}
            >
              {" "}
              And now, if you would like <br />I make your website, just <br />
              <a href="LINK" id="order">
                Order here
              </a>
            </div>
          </div>
          <br />
        </div>
      </body>
    </>
  );
};

export default Test3;
