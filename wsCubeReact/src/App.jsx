import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./components/Home";
import ExerciseDetail from "./components/ExerciseDetail";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div>
      <Box width="400px" />
      <Navbar></Navbar>
      <Routes>
        <Home />
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
      </Routes>
    </div>
  );
};

export default App;
