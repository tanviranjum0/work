import img1 from "../assets/foot/Intersect1.png";
import img2 from "../assets/foot/Intersect2.png";
import img3 from "../assets/foot/Intersect3.png";
import img8 from "../assets/foot/Intersect8.png";
import img5 from "../assets/foot/Intersect5.png";
import img6 from "../assets/foot/Intersect6.png";
import img7 from "../assets/foot/Intersect7.png";

const Foot = () => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="relative h-[800px] w-full p-14 bg-gray-300">
          <div className="absolute top-[71%] left-[26%]">
            <img className="max-w-[35%] max-h-[35%]" src={img1} alt="" />
          </div>
          <div className="absolute top-[calc(67%-5px)] left-[25%]">
            <img className="max-w-[35%] max-h-[35%]" src={img2} alt="" />
          </div>
          <div className="absolute  top-[calc(57%+6px)] left-[35%] ">
            <img className="max-w-[35%] max-h-[35%]" src={img3} alt="" />
          </div>
          <div className="absolute  left-[40%] top-[40%] ">
            <img className="max-w-[35%] max-h-[35%]" src={img8} alt="" />
          </div>
          <div className="absolute top-[56%] left-[56%]">
            <img className="max-w-[35%] max-h-[35%]" src={img5} alt="" />
          </div>
          <div className="absolute left-[38%] top-[51%] ">
            <img className="max-w-[32%] max-h-[32%]" src={img6} alt="" />
          </div>
          <div className="absolute top-[40%] left-[50%]">
            <img className="max-w-[31%] max-h-[31%]" src={img7} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Foot;
