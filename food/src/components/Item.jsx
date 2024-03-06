/* eslint-disable react/prop-types */
import style from "./item.module.css";
export default function Item({ foodItem, bought }) {
  const handleBuyButtonClick = (event) => {
    console.log(event.target.innerText);
    console.log(`${foodItem} being bought`);
  };
  return (
    <li className={`list-group-item ${bought ? "active" : null}`}>
      <span className={style.kgspan}>{foodItem}</span>
      <button
        onClick={(event) => handleBuyButtonClick(event)}
        className={`${style.button} btn btn-primary`}
      >
        Buy
      </button>
    </li>
  );
}
