// "use client";

// import { useState } from "react";

// const page = () => {
//   const [file, setFile] = useState();
//   const submit = async (e) => {
//     e.preventDefault();

//     console.log(file);
//     const data = new FormData();
//     data.set("file", file);
//     const result = await fetch("api/upload", {
//       method: "POST",
//       body: data,
//     });
//     console.log(result);
//   };
//   return (
//     <div className="flex justify-center items-center">
//       <form action="" onSubmit={submit}>
//         <input
//           type="file"
//           name="file"
//           id=""
//           onChange={(e) => setFile(e.target.files?.[0])}
//         />
//         <button className="text-2xl border">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default page;

const page = () => {
  return <div></div>;
};

export default page;
