// import { Route, Routes } from "react-router-dom";
// import { Box } from "@mui/material";
// import Home from "./pages/Home";
// // import React from "react";

// import ExerciseDetail from "./pages/ExerciseDetail";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// const App = () => {
//   return (
//     <>
//       <Box width="400px" sx={{ width: { xl: "1488px" } }} m="auto">
//         <Navbar></Navbar>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/exercise/:id" element={<ExerciseDetail />} />
//         </Routes>
//         <Footer></Footer>
//       </Box>
//     </>
//   );
// };

// export default App;

const App = () => {
  function handleFormSubmit(event) {
    event.preventDefault();
    const fullname = document.getElementById("name").value;
    const image = document.getElementById("file").files[0];
    console.log(image, fullname);
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("image", image);
    fetch("http://localhost:3000", {
      body: formData,
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  return (
    <div>
      <form>
        <input type="text" name="name" placeholder="Name" id="name" />
        <input type="file" name="file" placeholder="file" id="file" />
        <div
          style={{
            cursor: "pointer",
            border: "2px solid black",
          }}
          onClick={handleFormSubmit}
        >
          Submit
        </div>
      </form>
    </div>
  );
};

export default App;
