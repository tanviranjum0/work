// import React from "react";
import Item from "./Item";

export default function FoodItems(e) {
  return (
    <ul className="meow list-group">
      {e.items.map((item) => (
        <Item key={item} foodItem={item} />
      ))}
    </ul>
  );
}
