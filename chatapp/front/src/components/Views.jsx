import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Signup from "./login/Signup";

const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<Signup />}></Route>
      <Route path="*" element={<Login />}></Route>
    </Routes>
  );
};

export default Views;
