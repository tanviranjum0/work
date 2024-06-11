import { useState } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
const LoginPopUp = ({ setShowLogin }) => {
  const [currentState, setCurrentSate] = useState("login");
  return (
    <div className="login-popup">
      <form className="login-popup-container" action="" method="post">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            src={assets.cross_icon}
            onClick={() => {
              setShowLogin(false);
            }}
            alt=""
          />
        </div>
        <div className="login-popup-input">
          {currentState === "login" ? (
            <></>
          ) : (
            <input type="text" placeholder="Your Name" required />
          )}

          <input type="email" name="" id="" required />
          <input type="password" name="" id="" required />
          <button>
            {currentState === "signup" ? "Create Account " : "Login"}
          </button>
          <div className="login-popup-condition">
            <input type="checkbox" name="" required id="" />
            <p>By continueing i agree to the terms of use privacy policy</p>
          </div>
          {currentState === "login" ? (
            <p>
              Create new account?{" "}
              <span onClick={() => setCurrentSate("signup")}>Click here</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrentSate("login")}>Login here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopUp;
