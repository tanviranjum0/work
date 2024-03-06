// import React from "react";
import Display from "./components/Display";
import ButtonContainer from "./components/ButtonContainer";
import style from "./App.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
export default function App() {
  const [calVal, setcalVal] = useState("33");
  const onButtonClick = (buttonText) => {
    if (buttonText === "C") {
      setcalVal("");
    } else if (buttonText === "=") {
      const result = eval(calVal);
      setcalVal(result);
    } else {
      const newDisplayValue = calVal + buttonText;
      setcalVal(newDisplayValue);
    }
  };
  return (
    <div className={style.main}>
      <div className={style.calculator}>
        <Display displayValue={calVal} />
        <ButtonContainer onButtonClick={onButtonClick} />
      </div>
    </div>
  );
}
