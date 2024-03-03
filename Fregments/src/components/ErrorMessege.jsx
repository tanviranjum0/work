// import React from "react";

export default function ErrorMessege(e) {
  return <div>{e.items.length === 0 && <h3>I am still Hungry</h3>}</div>;
}
