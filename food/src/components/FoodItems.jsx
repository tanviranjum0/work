/* eslint-disable react/prop-types */
// import React from 'react'
import Item from "./Item";
import { useState } from "react";
const FoodItems = ({ items }) => {
  // let fooditems = items;
  let [activeItems, setActiveItems] = useState([]);
  let onBuyButton = (item, event) => {
    let newItems = [...activeItems, item];
    setActiveItems(newItems);
  };
  return (
    <ul className="list-group">
      {items.map((item) => (
        <Item
          key={item}
          bought={activeItems.includes(item)}
          foodItem={item}
          handleBuyButton={(event) => onBuyButton(item, event)}
        />
      ))}
    </ul>
  );
};
export default FoodItems;
