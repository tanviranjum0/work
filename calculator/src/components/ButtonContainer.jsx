/* eslint-disable react/prop-types */
// import React from 'react'
import style from "./ButtonContainer.module.css";
export default function ButtonContainer({ onButtonClick }) {
  let buttonNames = [
    "C",
    "1",
    "2",
    "+",
    "3",
    "4",
    "-",
    "5",
    "6",
    "*",
    "7",
    "8",
    "/",
    "=",
    "9",
    "0",
    ".",
  ];
  return (
    <div className={style.buttonContainer}>
      {buttonNames.map((e) => (
        <button
          key={e}
          onClick={() => onButtonClick(e)}
          className={style.button}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
