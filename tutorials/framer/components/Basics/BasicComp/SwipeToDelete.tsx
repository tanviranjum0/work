"use client";
import React, { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface ListItem {
  id: string;
  title: string;
  description: string;
}

const SwipeToDeleteList: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([
    {
      id: "1",
      title: "Meeting with team",
      description: "Discuss project timeline",
    },
    {
      id: "2",
      title: "Lunch with client",
      description: "12:30 PM at Italian restaurant",
    },
    { id: "3", title: "Finish report", description: "Submit by EOD" },
    {
      id: "4",
      title: "Buy groceries",
      description: "Milk, eggs, bread, fruits",
    },
    { id: "5", title: "Call mom", description: "Wish her happy birthday" },
  ]);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="select-none" style={styles.container}>
      <h1 style={styles.title}>Swipe to Delete</h1>
      <p style={styles.subtitle}>Swipe left on any item to delete it</p>

      <div style={styles.list}>
        {items.map((item) => (
          <SwipeableListItem
            key={item.id}
            item={item}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

interface SwipeableListItemProps {
  item: ListItem;
  onRemove: (id: string) => void;
}

const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  item,
  onRemove,
}) => {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    ["#ff4d4f", "#ff4d4f", "#ffffff", "#ffffff", "#ffffff"]
  );

  const opacity = useTransform(x, [-200, -100, 0], [1, 1, 0]);

  const tickOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -200) {
      // Swiped left beyond threshold - delete item
      onRemove(item.id);
    }
  };

  return (
    <motion.div
      style={styles.listItemContainer}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      {/* Delete indicator */}
      <motion.div
        style={{
          ...styles.deleteIndicator,
          opacity,
        }}
      >
        <motion.span style={{ ...styles.deleteText, opacity: tickOpacity }}>
          Delete
        </motion.span>
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: tickOpacity }}
        >
          <path
            d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
            fill="white"
          />
        </motion.svg>
      </motion.div>

      {/* Swipeable item */}
      <motion.div
        style={{
          ...styles.listItem,
          x,
          backgroundColor: background,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div style={styles.itemContent}>
          <h3 style={styles.itemTitle}>{item.title}</h3>
          <p style={styles.itemDescription}>{item.description}</p>
        </div>
        <motion.div
          style={styles.dragHandle}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
              fill="#ccc"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  subtitle: {
    marginBottom: "2rem",
    color: "#7f8c8d",
  },
  list: {
    width: "100%",
    maxWidth: "500px",
  },
  listItemContainer: {
    position: "relative",
    marginBottom: "1rem",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "12px",
    cursor: "grab",
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    margin: "0 0 0.5rem 0",
    color: "#2c3e50",
  },
  itemDescription: {
    margin: 0,
    color: "#7f8c8d",
    fontSize: "0.9rem",
  },
  dragHandle: {
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "100px",
    backgroundColor: "#ff4d4f",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: "1.5rem",
    color: "white",
    fontWeight: "600",
    flexDirection: "column",
    gap: "0.5rem",
  },
  deleteText: {
    fontSize: "0.8rem",
  },
};

export default SwipeToDeleteList;
