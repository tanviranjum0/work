"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const StickyNavbarReveal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const lastScrollY = useRef(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, {
    damping: 30,
    stiffness: 100,
  });

  // Transform scroll position to background opacity
  const bgOpacity = useTransform(scrollYSpring, [0, 100], [0, 0.9]);

  // Transform scroll position to blur effect
  const blurAmount = useTransform(scrollYSpring, [0, 100], [0, 10]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if at top of page
      setIsAtTop(currentScrollY < 10);

      // Determine scroll direction and toggle navbar visibility
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Update active section based on scroll position
      const sections = ["home", "about", "services", "portfolio", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - (navbarRef.current?.offsetHeight || 0),
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div style={styles.container}>
      {/* Sticky Navbar */}
      <motion.nav
        ref={navbarRef}
        style={{
          ...styles.navbar,
          y: isVisible ? 0 : -100,
          backgroundColor: `rgba(255, 255, 255, ${
            isAtTop ? 0 : bgOpacity.get()
          })`,
          backdropFilter: `blur(${blurAmount.get()}px)`,
        }}
        initial={{ y: -100 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <div style={styles.navContent}>
          <motion.div
            style={styles.logo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span style={styles.logoText}>Logo</span>
          </motion.div>

          <div style={styles.navItems}>
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                style={{
                  ...styles.navItem,
                  color: activeSection === item.id ? "#667eea" : "#4a5568",
                }}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  fontWeight: activeSection === item.id ? "600" : "400",
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    style={styles.activeIndicator}
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            style={styles.ctaButton}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Page Content */}
      <main style={styles.content}>
        {navItems.map((item) => (
          <section key={item.id} id={item.id} style={styles.section}>
            <h2 style={styles.sectionTitle}>{item.label}</h2>
            <p style={styles.sectionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
              dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed
              auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut enim
              nulla, suscipit sit amet blandit vel, tempor et est.
            </p>
            {item.id === "home" && (
              <motion.button
                style={styles.sectionButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("contact")}
              >
                Learn More
              </motion.button>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "200vh",
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    padding: "1rem 2rem",
    zIndex: 1000,
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  navContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#667eea",
    cursor: "pointer",
  },
  logoText: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "700",
  },
  navItems: {
    display: "flex",
    gap: "1.5rem",
  },
  navItem: {
    position: "relative",
    background: "none",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    padding: "0.5rem 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    height: "2px",
    width: "100%",
    backgroundColor: "#667eea",
    borderRadius: "2px",
  },
  ctaButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  },
  content: {
    paddingTop: "80px", // Account for navbar height
  },
  section: {
    minHeight: "100vh",
    padding: "4rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "1.5rem",
  },
  sectionText: {
    fontSize: "1.1rem",
    color: "#4a5568",
    maxWidth: "600px",
    textAlign: "center",
    lineHeight: "1.6",
  },
  sectionButton: {
    marginTop: "2rem",
    padding: "1rem 2rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  },
};

export default StickyNavbarReveal;
