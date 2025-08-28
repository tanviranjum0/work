"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

const AnimatedSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems: MenuItem[] = [
    { id: "1", icon: "🏠", label: "Dashboard" },
    { id: "2", icon: "📊", label: "Analytics" },
    { id: "3", icon: "📁", label: "Projects" },
    { id: "4", icon: "📋", label: "Tasks" },
    { id: "5", icon: "👥", label: "Team" },
    { id: "6", icon: "⚙️", label: "Settings" },
    { id: "7", icon: "🙋", label: "Profile" },
    { id: "8", icon: "🔔", label: "Notifications" },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Animation variants for the sidebar
  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: {
        damping: 20,
        stiffness: 200,
      },
    },
    collapsed: {
      width: 80,
      transition: {
        damping: 20,
        stiffness: 200,
      },
    },
  };

  // Animation variants for menu items
  const menuItemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
  };

  // Stagger animation for menu items
  const containerVariants = {
    expanded: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
    collapsed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.sidebar}
        variants={sidebarVariants}
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
      >
        {/* Sidebar header */}
        <div style={styles.sidebarHeader}>
          <AnimatePresence>
            {isExpanded && (
              <motion.h2
                style={styles.logo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Navigation
              </motion.h2>
            )}
          </AnimatePresence>

          <motion.button
            style={styles.toggleButton}
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? "◀" : "▶"}
          </motion.button>
        </div>

        {/* Menu items */}
        <motion.ul
          style={styles.menuList}
          variants={containerVariants}
          initial="expanded"
          animate={isExpanded ? "expanded" : "collapsed"}
        >
          {menuItems.map((item, index) => (
            <motion.li
              key={item.id}
              style={styles.menuItem}
              variants={menuItemVariants}
              whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={styles.menuIcon}>{item.icon}</span>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    style={styles.menuLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </motion.ul>

        {/* Sidebar footer */}
        <div style={styles.sidebarFooter}>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={styles.userInfo}
              >
                <div style={styles.avatar}>👤</div>
                <div>
                  <div style={styles.userName}>John Doe</div>
                  <div style={styles.userRole}>Administrator</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main content */}
      <div style={styles.mainContent}>
        <h1>Animated Sidebar</h1>
        <p>Click the toggle button to collapse/expand the sidebar.</p>
        <p>Notice the staggered animation of menu items.</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    backgroundColor: "#2c3e50",
    color: "white",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
  },
  sidebarHeader: {
    padding: "1.5rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  logo: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  toggleButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    color: "white",
    borderRadius: "8px",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
  menuList: {
    listStyle: "none",
    padding: "1rem 0",
    margin: 0,
    flex: 1,
  },
  menuItem: {
    padding: "0.8rem 1rem",
    margin: "0.25rem 0.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  menuIcon: {
    fontSize: "1.5rem",
    minWidth: "40px",
  },
  menuLabel: {
    marginLeft: "0.75rem",
    whiteSpace: "nowrap",
  },
  sidebarFooter: {
    padding: "1rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    marginRight: "0.75rem",
  },
  userName: {
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  userRole: {
    fontSize: "0.8rem",
    opacity: 0.7,
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
    backgroundColor: "white",
  },
};

export default AnimatedSidebar;
