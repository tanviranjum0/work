// import React from 'react'

export default function ErrorMessage({ items }) {
  // let fooditems = ["Apple", "Lichi", "Mango", "Guava"];

  return <div>{items.length === 0 && <h1>I am still hungry </h1>}</div>;
}
