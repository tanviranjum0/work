import "./Footer.css";
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
            quos doloribus sapiente illo maiores. Molestiae similique
            consectetur consequatur necessitatibus reiciendis. Necessitatibus
            est quos, temporibus hic dolore aperiam vel tempora, rem quod fugit
            magni quis aliquam eligendi odit nonsequatur!
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivary</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>+8801711111111</li>
            <li>contact@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 @ tomato.com - All Right Reserved
      </p>
    </div>
  );
};

export default Footer;
