import "./ticket.css";

// const Ticket = () => {
//   return (
//     <div>
//       <div className="bg-[#0f1220] min-h-screen flex items-center justify-center p-6">
//         <article className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl notch">
//           <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-gray-50 to-white rounded-t-2xl cut-indicator"></div>

//           <div className="relative z-10 grid md:grid-cols-2 gap-6 p-6 pt-20">
//             <section className="pr-4 border-r border-dashed border-gray-300 md:border-b-0 md:pb-0 pb-4">
//               <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
//                 Frontend Conference 2025
//               </h1>
//               <p className="text-gray-500 font-medium">
//                 Dhaka • September 20, 2025 • 10:00 AM
//               </p>

//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <div className="text-xs uppercase tracking-wide text-gray-400">
//                     Attendee
//                   </div>
//                   <div className="font-semibold text-gray-800">
//                     Tanvir Anjum
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xs uppercase tracking-wide text-gray-400">
//                     Seat
//                   </div>
//                   <div className="font-semibold text-gray-800">B12</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <div className="text-xs uppercase tracking-wide text-gray-400">
//                     Hall
//                   </div>
//                   <div className="font-semibold text-gray-800">Main Stage</div>
//                 </div>
//                 <div>
//                   <div className="text-xs uppercase tracking-wide text-gray-400">
//                     Ticket ID
//                   </div>
//                   <div className="font-semibold text-gray-800">
//                     #FD-2025-0912
//                   </div>
//                 </div>
//               </div>
//             </section>

//             <aside className="flex flex-col items-end space-y-4">
//               <div className="w-28 h-28 rounded-lg border-8 border-gray-100 bg-[conic-gradient(from_90deg,#111_0_25%,#fff_0_50%,#111_0_75%,#fff_0_100%)] [background-size:24px_24px] contrast-125 saturate-90"></div>
//               <div className="w-full h-14 rounded bg-[repeating-linear-gradient(to_right,#111_0_2px,#fff_2px_6px,#111_6px_8px,#fff_8px_14px)] shadow-inner"></div>
//               <button className="ml-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 shadow hover:-translate-y-0.5 hover:shadow-lg transition">
//                 Add to Wallet
//               </button>
//             </aside>
//           </div>

//           <footer className="flex justify-between items-center text-xs text-gray-500 px-6 pb-6">
//             <span>Show QR at entry. Valid for one person only.</span>
//             <span>✂ Tear along the dotted line</span>
//           </footer>
//         </article>
//       </div>
//     </div>
//   );
// };

// export default Ticket;

import React from "react";

const Ticket = () => {
  return (
    <div className="bg-[#0f1220] min-h-screen flex items-center justify-center p-6">
      <article className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl">
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-gray-50 to-white rounded-t-2xl cut-indicator">
          <div className="cutting-line top-[26px] relative"></div>
          {/* https://kovart.github.io/dashed-border-generator/ */}
          <div className="absolute left-5 top-[23px] rounded-xl">
            <svg
              width="8px"
              height="8px"
              viewBox="-19.04 0 75.804 75.804"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="Group_65"
                data-name="Group 65"
                transform="translate(-831.568 -384.448)"
              >
                <path
                  id="Path_57"
                  data-name="Path 57"
                  d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z"
                  fill="#0c2c67"
                />
              </g>
            </svg>
          </div>
          <div className="absolute right-5 top-[23px] rounded-xl">
            <svg
              width="8px"
              height="8px"
              viewBox="-19.04 0 75.804 75.804"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="Group_65"
                data-name="Group 65"
                transform="translate(-831.568 -384.448)"
              >
                <path
                  id="Path_57"
                  data-name="Path 57"
                  d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z"
                  fill="#0c2c67"
                />
              </g>
            </svg>
          </div>
          {/* <div className="absolute -right-3 top-[23px] w-6 h-6 bg-[#0f1220] rounded-full"></div> */}
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-6 p-6 pt-20">
          <section className="pr-4 border-r border-dashed border-gray-300 md:border-b-0 md:pb-0 pb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Frontend Conference 2025
            </h1>
            <p className="text-gray-500 font-medium">
              Dhaka • September 20, 2025 • 10:00 AM
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Attendee
                </div>
                <div className="font-semibold text-gray-800">Tanvir Anjum</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Seat
                </div>
                <div className="font-semibold text-gray-800">B12</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Hall
                </div>
                <div className="font-semibold text-gray-800">Main Stage</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Ticket ID
                </div>
                <div className="font-semibold text-gray-800">#FD-2025-0912</div>
              </div>
            </div>
          </section>
          <aside className="flex flex-col items-end space-y-4">
            <div className="w-28 h-28 rounded-lg border-8 border-gray-100 bg-[conic-gradient(from_90deg,#111_0_25%,#fff_0_50%,#111_0_75%,#fff_0_100%)] [background-size:24px_24px] contrast-125 saturate-90"></div>
            <div className="w-full h-14 rounded bg-[repeating-linear-gradient(to_right,#111_0_2px,#fff_2px_6px,#111_6px_8px,#fff_8px_14px)] shadow-inner"></div>
            <button className="ml-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 shadow hover:-translate-y-0.5 hover:shadow-lg transition">
              Add to Wallet
            </button>
          </aside>
        </div>
        <footer className="flex justify-between items-center text-xs text-gray-500 px-6 pb-6">
          <span>Show QR at entry. Valid for one person only.</span>
          <span>✂ Tear along the dotted line</span>
        </footer>
      </article>
    </div>
  );
};

export default Ticket;
