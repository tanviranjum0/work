// import React from "react";
import Link from "next/link";
export const metadata = {
  title: "About",
  description: "This is an About page",
};
export default function layout({ children }) {
  return (
    <div>
      <hr />
      <nav>
        <ul className="flex gap-6 mt-6">
          <li>
            {" "}
            <Link href="/about/vision"> Vision |</Link>
          </li>
          <li>
            {" "}
            <Link href="/about/more"> More</Link>
          </li>
        </ul>
      </nav>
      <br />
      {children}
    </div>
  );
}
