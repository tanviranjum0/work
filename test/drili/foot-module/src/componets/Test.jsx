// const Test = () => {
//   const handleClick = async (e) => {
//     // console.log(e.target.getAttribute("fill"));
//     if (e.target.getAttribute("fill") == "#0000ffff") {
//       console.log("none");
//       await e.target.setAttribute("fill", "yellow");
//       console.log(e.target.getAttribute("fill"));
//     } else if (e.target.getAttribute("fill") == "yellow") {
//       console.log("yellow");
//       e.target.setAttribute("fill", "orange");
//     } else if (e.target.getAttribute("fill") == "orange") {
//       console.log("black");
//       e.target.setAttribute("fill", "red");
//     } else if (e.target.getAttribute("fill") == "red") {
//       console.log("red");
//       e.target.setAttribute("fill", "#0000ffff");
//     }
//   };
//   return (
//     <div className="h-52 ">
//       <svg
//         className="bg-slate-600"
//         width="49"
//         height="76"
//         viewBox="0 0 89 140"
//         fill=""
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           className="z-10"
//           onClick={(e) => handleClick(e)}
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d="M35 139.5H1V106.5L15.5 79.5L48.5 40.5L88.5 2V79.5L64.5 126L35 139.5Z"
//           fill="#0000ffff"
//           stroke="violet"
//           // strokeWidth="3"
//         />
//         <path
//           className="z-10"
//           onClick={(e) => handleClick(e)}
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d="M239 650L223.5 660.5L198 631H158.5L136.5 626L107 588L87 544L29.5 455.5L1 344L53.5 1H117.5V112L115.5 170L117.5 216L122.5 313L126 344L144.5 394.5L158.5 443L167 455.5L206 531.5L226.5 600L239 650Z"
//           fill="#0000ffff"
//           // stroke=""
//         />
//       </svg>
//     </div>
//   );
// };

// export default Test;

import React, { useContext } from "react";

import { StoreContext } from "../context/StoreContextMain";
const Test = () => {
  const { zone, increasePain } = useContext(StoreContext);
  return (
    <div>
      <div className="text-4xl text-center">{zone}</div>
      <div
        onClick={() => increasePain("id1")}
        className="py-2 px-3 rounded bg-zinc-500"
      >
        Increase
      </div>
    </div>
  );
};

export default Test;
