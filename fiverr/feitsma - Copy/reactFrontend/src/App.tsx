import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UpdateShipment from "./pages/UpdateShipment";
import Shipments from "./pages/Shipments";
import Routespage from "./pages/Routespage";
import OptimizedRoutesPage from "./pages/OptimizedRoute";
import NewShipment from "./pages/NewShipment";
import SignUpPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import GetRoutePage from "./pages/GetRoute";
import ForgotPassword from "./pages/ForgotPassword";
import BestRouteMap from "./pages/BestRoute";
import NotFound from "./pages/NotFound";
import "./App.css";
import Base from "./pages/Base";
import RootLayout from "./components/layout";

const App = () => {
  return (
    <BrowserRouter>
      {/* <script
        src={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API}&loading=async`}
      /> */}
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Base />} />
          <Route path="/update-shipment" element={<UpdateShipment />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/routes" element={<Routespage />} />
          <Route path="/new-shipment" element={<NewShipment />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/get-route" element={<GetRoutePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/best-route/:id" element={<BestRouteMap />} />
          <Route path="/*" element={<NotFound />} />
          <Route
            path="/optimized-route/:id"
            element={<OptimizedRoutesPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
