"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Define page components
const HomePage: React.FC = () => {
  return (
    <motion.div
      style={styles.page}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <h1>Home Page</h1>
      <p>
        Welcome to our website! This is the home page with a fade transition.
      </p>
      <div style={styles.content}>
        <div style={styles.card}>
          <h2>Featured Content</h2>
          <p>Check out our latest offers and updates.</p>
        </div>
        <div style={styles.card}>
          <h2>News & Events</h2>
          <p>Stay updated with what's happening.</p>
        </div>
      </div>
      <Link to="/about" style={styles.link}>
        Go to About →
      </Link>
    </motion.div>
  );
};

const AboutPage: React.FC = () => {
  return (
    <motion.div
      style={styles.page}
      initial="initial"
      animate="in"
      exit="out"
      variants={slideVariants}
      transition={pageTransition}
    >
      <h1>About Us</h1>
      <p>
        Learn more about our company and mission. This page slides in from the
        right.
      </p>
      <div style={styles.content}>
        <div style={styles.card}>
          <h2>Our Story</h2>
          <p>Founded in 2020, we've been serving customers with excellence.</p>
        </div>
        <div style={styles.card}>
          <h2>Our Team</h2>
          <p>Meet the talented people behind our success.</p>
        </div>
      </div>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>
          ← Back to Home
        </Link>
        <Link to="/services" style={styles.link}>
          Go to Services →
        </Link>
      </div>
    </motion.div>
  );
};

const ServicesPage: React.FC = () => {
  return (
    <motion.div
      style={styles.page}
      initial="initial"
      animate="in"
      exit="out"
      variants={slideUpVariants}
      transition={pageTransition}
    >
      <h1>Our Services</h1>
      <p>
        Discover what we can do for you. This page slides up from the bottom.
      </p>
      <div style={styles.content}>
        <div style={styles.card}>
          <h2>Web Development</h2>
          <p>We create beautiful, functional websites and web applications.</p>
        </div>
        <div style={styles.card}>
          <h2>UI/UX Design</h2>
          <p>User-centered designs that enhance experience and engagement.</p>
        </div>
        <div style={styles.card}>
          <h2>Consulting</h2>
          <p>Expert advice to help your business grow and succeed.</p>
        </div>
      </div>
      <div style={styles.navLinks}>
        <Link to="/about" style={styles.link}>
          ← Back to About
        </Link>
        <Link to="/contact" style={styles.link}>
          Go to Contact →
        </Link>
      </div>
    </motion.div>
  );
};

const ContactPage: React.FC = () => {
  return (
    <motion.div
      style={styles.page}
      initial="initial"
      animate="in"
      exit="out"
      variants={scaleVariants}
      transition={pageTransition}
    >
      <h1>Contact Us</h1>
      <p>Get in touch with us. This page uses a scale transition.</p>
      <div style={styles.content}>
        <div style={styles.card}>
          <h2>Get In Touch</h2>
          <p>Email: info@example.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Main St, City, Country</p>
        </div>
        <div style={styles.card}>
          <h2>Send a Message</h2>
          <form style={styles.form}>
            <input type="text" placeholder="Your Name" style={styles.input} />
            <input type="email" placeholder="Your Email" style={styles.input} />
            <textarea
              placeholder="Your Message"
              style={styles.textarea}
              rows={4}
            />
            <button type="submit" style={styles.button}>
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Link to="/services" style={styles.link}>
        ← Back to Services
      </Link>
    </motion.div>
  );
};

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const slideVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -100,
  },
};

const slideUpVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -100,
  },
};

const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.2,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

// Main component with routing
const PageTransitions: React.FC = () => {
  const location = useLocation();
  const [transitionDirection, setTransitionDirection] = useState("forward");

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <Link
          to="/"
          style={styles.navLink}
          onClick={() => setTransitionDirection("back")}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={styles.navLink}
          onClick={() => setTransitionDirection("forward")}
        >
          About
        </Link>
        <Link
          to="/services"
          style={styles.navLink}
          onClick={() => setTransitionDirection("forward")}
        >
          Services
        </Link>
        <Link
          to="/contact"
          style={styles.navLink}
          onClick={() => setTransitionDirection("forward")}
        >
          Contact
        </Link>
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

// Wrapper component to provide router context
const App: React.FC = () => {
  return (
    <Router>
      <PageTransitions />
    </Router>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    padding: "1.5rem",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  navLink: {
    margin: "0 1rem",
    padding: "0.5rem 1rem",
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    borderRadius: "4px",
    transition: "all 0.3s ease",
  },
  page: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    margin: "2rem 0",
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  },
  link: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#667eea",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  navLinks: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  textarea: {
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    resize: "vertical",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "500",
  },
};

// Add hover effects
const hoverStyles = `
  .nav-link:hover {
    background-color: #f0f0f0;
  }
  .page-link:hover {
    background-color: #5a67d8;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  .submit-button:hover {
    background-color: #5a67d8;
  }
`;

// Add styles to document
document.head.insertAdjacentHTML("beforeend", `<style>${hoverStyles}</style>`);

export default App;
