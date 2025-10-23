"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  color: string;
}

const InteractiveTimeline: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const timelineItems: TimelineItem[] = [
    {
      id: "1",
      title: "Project Kickoff",
      date: "January 2023",
      description:
        "Initial meeting with stakeholders to define project goals, scope, and deliverables. Established communication channels and set up project management tools.",
      icon: "🚀",
      color: "#FF6B6B",
    },
    {
      id: "2",
      title: "Research Phase",
      date: "February 2023",
      description:
        "Conducted market research, user interviews, and competitive analysis. Created user personas and journey maps to inform design decisions.",
      icon: "🔍",
      color: "#4ECDC4",
    },
    {
      id: "3",
      title: "Design & Prototyping",
      date: "March 2023",
      description:
        "Developed wireframes, mockups, and interactive prototypes. Conducted usability testing and iterated based on feedback from stakeholders and users.",
      icon: "🎨",
      color: "#FFE66D",
    },
    {
      id: "4",
      title: "Development",
      date: "April 2023",
      description:
        "Began implementation of the frontend and backend systems. Established CI/CD pipeline and conducted regular code reviews to maintain quality standards.",
      icon: "💻",
      color: "#9b59b6",
    },
    {
      id: "5",
      title: "Testing & QA",
      date: "May 2023",
      description:
        "Performed comprehensive testing including unit tests, integration tests, and user acceptance testing. Identified and resolved bugs and performance issues.",
      icon: "🧪",
      color: "#3498db",
    },
    {
      id: "6",
      title: "Launch",
      date: "June 2023",
      description:
        "Deployed the application to production environment. Monitored performance and user feedback. Conducted post-launch review and planning for next phases.",
      icon: "🎉",
      color: "#2ecc71",
    },
  ];

  const toggleItem = (id: string) => {
    setActiveItem(activeItem === id ? null : id);
  };

  return (
    <div style={styles.container}>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Project Timeline
      </motion.h1>
      <motion.p
        style={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Click on any milestone to see details
      </motion.p>

      <div style={styles.timelineContainer}>
        {/* Timeline line */}
        <div style={styles.timelineLine} />

        {timelineItems.map((item, index) => (
          <TimelineItemComponent
            key={item.id}
            item={item}
            index={index}
            isActive={activeItem === item.id}
            onClick={() => toggleItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface TimelineItemProps {
  item: TimelineItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const TimelineItemComponent: React.FC<TimelineItemProps> = ({
  item,
  index,
  isActive,
  onClick,
}) => {
  return (
    <div
      style={{
        ...styles.itemContainer,
        flexDirection: index % 2 === 0 ? "row" : "row-reverse",
      }}
    >
      {/* Content */}
      <motion.div
        style={{
          ...styles.content,
          textAlign: index % 2 === 0 ? "right" : "left",
        }}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <motion.h3
          style={styles.itemTitle}
          onClick={onClick}
          whileHover={{ color: item.color }}
          transition={{ duration: 0.2 }}
        >
          {item.title}
        </motion.h3>
        <motion.p
          style={styles.itemDate}
          onClick={onClick}
          whileHover={{ color: item.color }}
          transition={{ duration: 0.2 }}
        >
          {item.date}
        </motion.p>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <motion.p
                style={styles.itemDescription}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {item.description}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Icon connector */}
      <div style={styles.connector}>
        <div style={styles.line} />
        <motion.div
          style={{
            ...styles.icon,
            backgroundColor: item.color,
            borderColor: item.color,
          }}
          onClick={onClick}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: isActive
              ? `0 0 0 5px ${item.color}40`
              : "0 0 0 0px rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.3 }}
        >
          {item.icon}
        </motion.div>
      </div>

      {/* Empty space for alternating layout */}
      <div style={styles.empty} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#7f8c8d",
    marginBottom: "3rem",
  },
  timelineContainer: {
    position: "relative",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  timelineLine: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    width: "4px",
    height: "100%",
    backgroundColor: "#3498db",
    borderRadius: "2px",
  },
  itemContainer: {
    display: "flex",
    marginBottom: "3rem",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    padding: (index) => (index % 2 === 0 ? "0 2rem 0 0" : "0 0 0 2rem"),
  },
  itemTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0 0 0.5rem 0",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  itemDate: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#7f8c8d",
    margin: "0 0 1rem 0",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  itemDescription: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#34495e",
    margin: "1rem 0 0 0",
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  connector: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
  },
  line: {
    width: "40px",
    height: "2px",
    backgroundColor: "#3498db",
  },
  icon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.5rem",
    color: "white",
    cursor: "pointer",
    border: "3px solid",
    boxSizing: "border-box",
  },
  empty: {
    flex: 1,
  },
};

export default InteractiveTimeline;
