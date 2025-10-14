// "use client";
// const Test3 = () => {
//   return (
//     <div className="flex justify-center items-center bg-emerald-300 h-[100vh]">
//       <a
//         target="_blank"
//         rel="nofollow"
//         href={`mailto:roksanakhanamseo@gmail.com`}
//       >
//         mail
//       </a>
//     </div>
//   );
// };

// export default Test3;

"use client";
import React from "react";

const Test3 = () => {
  return (
    <div className="flex justify-center items-center bg-emerald-300 h-[100vh]">
      <button
        onClick={() =>
          window.open(
            "https://mail.google.com/mail/?view=cm&fs=1&to=roksanakhanamseo@gmail.com&su=Framer%20motion%20business%20discussion&body=Type%20your%20message%20here!",
            "_blank"
          )
        }
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
      >
        Send Email
      </button>
    </div>
  );
};

export default Test3;
