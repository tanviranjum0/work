import Navbar from "./components/navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Cart from "./pages/Cart/Cart";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/cart" element={<Cart></Cart>} />
          <Route path="/order" element={<PlaceOrder></PlaceOrder>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
