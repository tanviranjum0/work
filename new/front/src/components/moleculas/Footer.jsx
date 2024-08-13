import img1 from "../../assets/music-icon.svg";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
const Footer = () => {
  return (
    <div>
      <div className="grid w-[80%] cursor-pointer py-10 mx-auto md:grid-cols-4 justify-center gap-4">
        <div className="flex flex-col justify-center gap-4">
          <img src={img1} alt="main" className="h-20 w-20 mx-auto" />
          <div className="text-sm">
            ©2024 RockGaan. Trademarks and brands are the property of their
            respective owners.
          </div>
        </div>
        <div className="flex flex-col mx-auto justify-center gap-3">
          <div className="font-bold mx-auto">Company</div>
          <div>About Us</div>
          <div>Contact Us</div>
        </div>
        <div className="flex flex-col mx-auto justify-center gap-3">
          <div className="font-bold mx-auto">Legal</div>
          <div>Privacy and Policy</div>
          <div>Refund and Return Policy</div>
          <div>Terms and Conditions</div>
        </div>
        <div className="flex flex-col mx-auto justify-center gap-3">
          <div className="font-bold mx-auto">Follow Us</div>
          <div className="flex gap-2 ">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <IoLogoYoutube />
          </div>
        </div>
      </div>

      <div className="text-sm text-center ">Trade License: 3884</div>
      <div className="border-b-4 pt-10"></div>
      <div className="text-center py-5 font-semibold">
        Design & Developed by Tanvir/Roksana
      </div>
    </div>
  );
};

export default Footer;
