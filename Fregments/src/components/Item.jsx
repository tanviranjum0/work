// import React from "react";
import style from "./item.module.css";

export default function Item(props) {
  const e = props;
  return (
    <li className={`${style.meow} list-group-item text-center`}>
      {e.foodItem}
    </li>
  );
}
