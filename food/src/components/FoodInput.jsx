/* eslint-disable react/prop-types */
import style from "./FoodInput.module.css";
export default function FoodInput({ handleKeyDown }) {
  return (
    <div>
      <input
        type="text"
        className={style.foodInput}
        placeholder="Enter Your Item Here"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
