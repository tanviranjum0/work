/* eslint-disable react/prop-types */
// import React from "react";
import style from "./Container.module.css";
export default function Container(props) {
  return <div className={style.container}>{props.children}</div>;
}
