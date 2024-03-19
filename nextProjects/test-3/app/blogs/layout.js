import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Blogs",
  description: "This is an blogs page",
};
export default function layout({ children }) {
  return <div>{children}</div>;
}
