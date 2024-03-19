import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Posts",
  description: "This is an posts page",
};
export default function layout({ children }) {
  return <div>{children}</div>;
}
