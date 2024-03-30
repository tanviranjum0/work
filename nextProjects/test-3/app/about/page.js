import Button from "@/app/components/Button";
import tanvir from "@/public/sc.png";
import Image from "next/image";
const About = () => {
  return (
    <div>
      <div>This is About page</div>
      <Image src={tanvir} alt="mypic" quality={100} placeholder="blur" />
      <Button />
    </div>
  );
};

export default About;
