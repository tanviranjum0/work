"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface Section {
  id: string;
  title: string;
  color: string;
}

const FloatingNavDots: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("section1");
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const sections: Section[] = [
    { id: "section1", title: "Introduction", color: "#FF6B6B" },
    { id: "section2", title: "Features", color: "#4ECDC4" },
    { id: "section3", title: "Gallery", color: "#FFE66D" },
    { id: "section4", title: "Testimonials", color: "#9b59b6" },
    { id: "section5", title: "Contact", color: "#3498db" },
  ];

  // Handle scroll events to determine active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Clear previous timeout if it exists
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Find which section is currently in view
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }

      // Set a timeout to mark scrolling as complete
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation Dots */}
      <motion.div
        style={styles.navContainer}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            style={styles.navItem}
            onClick={() => scrollToSection(section.id)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              style={{
                ...styles.dot,
                backgroundColor:
                  section.id === activeSection ? section.color : "#ddd",
              }}
              animate={{
                scale: section.id === activeSection ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            />
            <motion.span
              style={{
                ...styles.label,
                color: section.id === activeSection ? section.color : "#999",
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: section.id === activeSection ? 1 : 0.7,
                x: section.id === activeSection ? 0 : -10,
              }}
              transition={{ duration: 0.3 }}
            >
              {section.title}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Sections */}
      <div style={styles.content}>
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            style={{
              ...styles.section,
              backgroundColor: section.color,
            }}
          >
            <h2>{section.title}</h2>
            <p>Scroll down to see the navigation dots change</p>
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={styles.scrollIndicator}
        animate={{
          opacity: isScrolling ? 1 : 0,
          y: isScrolling ? 0 : 10,
        }}
        transition={{ duration: 0.3 }}
      >
        Scrolling...
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  navContainer: {
    position: "fixed",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    zIndex: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "0.75rem",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    transition: "background-color 0.3s ease",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    transition: "color 0.3s ease",
  },
  content: {
    marginLeft: "120px", // Space for the nav dots
  },
  section: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    padding: "2rem",
    textAlign: "center",
  },
  scrollIndicator: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    zIndex: 1000,
  },
};

export default FloatingNavDots;
