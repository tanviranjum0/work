// import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/moleculas/Navbar";
import SignUp from "./pages/SignUp";
import Signout from "./pages/Signout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import NewTicket from "./pages/NewTicket";
import Ticket from "./pages/Ticket";
import Tickets from "./pages/Tickets";
import Login from "./pages/Login";
function App() {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.75,
          type: "tween",
        }}
        variants={{
          initialState: {
            opacity: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          },
          animateState: {
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          },

          exitState: {
            opacity: 0,
            clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
          },
        }}
        className="w-full"
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/new-ticket" element={<NewTicket />} />
          <Route path="/ticket/:ticketId" element={<Ticket />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
