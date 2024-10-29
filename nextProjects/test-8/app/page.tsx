import Image from "next/image";
import Projects from "./components/Projects";
import Test from "./components/Test";

const page = () => {
  return (
    <div>
      <Projects />
      {/* <div className="h-42 w-42">
        <Image
          src={img}
          quality={100}
          style={{
            backgroundPosition: "center",
            backgroundSize: "cover",
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          height={100}
          width={100}
          alt="image"
        />
        <Image
          src={img1}
          style={{
            backgroundPosition: "center",
            backgroundSize: "cover",
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          height={100}
          quality={100}
          width={100}
          alt="image"
        />
      </div> */}

      {/* <Test /> */}
    </div>
  );
};

export default page;
