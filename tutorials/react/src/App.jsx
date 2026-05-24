
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import StoreContextMain from "./context/StoreContext";
const App = () => {
  return (
    <StoreContextMain>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/:name" element={<About />} />
        </Routes>
      </BrowserRouter>
    </StoreContextMain>
  )
}

export default App
