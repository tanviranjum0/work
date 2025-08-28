"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimate, usePresence, AnimatePresence } from "motion/react";

// Example 1: Basic presence with useAnimate
function AnimatedListItem({ item, onRemove }) {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (isPresent) {
      // Enter animation
      animate(scope.current, { opacity: 1, x: 0, scale: 1 }, { duration: 0.5 });
    } else {
      // Exit animation
      animate(
        scope.current,
        { opacity: 0, x: -100, scale: 0.8 },
        { duration: 0.5 }
      ).then(safeToRemove);
    }
  }, [isPresent, animate, scope, safeToRemove]);

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0, x: -100, scale: 0.8 }}
      style={{
        padding: "16px",
        margin: "8px 0",
        backgroundColor: "#3B82F6",
        color: "white",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{item}</span>
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ×
      </button>
    </motion.div>
  );
}

function ListWithPresence() {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue]);
      setInputValue("");
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <div style={{ marginBottom: "20px" }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add new item..."
          style={{
            padding: "8px",
            marginRight: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={addItem}
          style={{
            padding: "8px 16px",
            backgroundColor: "#10B981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <AnimatedListItem
            key={item}
            item={item}
            onRemove={() => removeItem(index)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Example 2: Modal with complex animations
function AnimatedModal({ isOpen, onClose, children }) {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const overlayRef = React.useRef(null);
  const contentRef = React.useRef(null);

  useEffect(() => {
    if (isPresent && isOpen) {
      // Enter animation sequence
      animate(overlayRef.current, { opacity: 1 }, { duration: 0.3 });
      animate(
        contentRef.current,
        { opacity: 1, scale: 1, y: 0 },
        { duration: 0.5, type: "spring" }
      );
    } else if (!isOpen) {
      // Exit animation sequence
      animate(
        contentRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { duration: 0.3 }
      );
      animate(overlayRef.current, { opacity: 0 }, { duration: 0.3 }).then(
        safeToRemove
      );
    }
  }, [isOpen, isPresent, animate, safeToRemove]);

  if (!isPresent) return null;

  return (
    <div
      ref={scope}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          cursor: "pointer",
        }}
        onClick={onClose}
      />

      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          position: "relative",
          zIndex: 1001,
        }}
      >
        {children}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </motion.div>
    </div>
  );
}

function ModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "12px 24px",
          backgroundColor: "#8B5CF6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Open Modal
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <AnimatedModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <h2>Welcome to the Modal! 🎉</h2>
            <p>
              This modal uses useAnimate with usePresence for smooth enter/exit
              animations.
            </p>
            <p>Click outside or press the X to close.</p>
          </AnimatedModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Example 3: Notification system
function Notification({ id, message, type, onRemove }) {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (isPresent) {
      // Enter animation
      animate(
        scope.current,
        { x: 0, opacity: 1 },
        { duration: 0.5, type: "spring" }
      );

      // Auto-remove after 3 seconds
      const timer = setTimeout(() => {
        onRemove();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Exit animation
      animate(scope.current, { x: 300, opacity: 0 }, { duration: 0.3 }).then(
        safeToRemove
      );
    }
  }, [isPresent, animate, scope, safeToRemove, onRemove]);

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      default:
        return "#3B82F6";
    }
  };

  return (
    <motion.div
      ref={scope}
      initial={{ x: 300, opacity: 0 }}
      style={{
        padding: "16px",
        margin: "8px 0",
        backgroundColor: getBgColor(),
        color: "white",
        borderRadius: "8px",
        minWidth: "300px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{message}</span>
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ×
      </button>
    </motion.div>
  );
}

function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [counter, setCounter] = useState(0);

  const addNotification = (type) => {
    const messages = {
      info: "This is an information message",
      success: "Operation completed successfully!",
      error: "Something went wrong!",
      warning: "Please check your input",
    };

    const newNotification = {
      id: counter,
      message: messages[type],
      type,
    };

    setNotifications((prev) => [...prev, newNotification]);
    setCounter((prev) => prev + 1);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => addNotification("info")}
          style={buttonStyle("#3B82F6")}
        >
          Add Info
        </button>
        <button
          onClick={() => addNotification("success")}
          style={buttonStyle("#10B981")}
        >
          Add Success
        </button>
        <button
          onClick={() => addNotification("error")}
          style={buttonStyle("#EF4444")}
        >
          Add Error
        </button>
        <button
          onClick={() => addNotification("warning")}
          style={buttonStyle("#F59E0B")}
        >
          Add Warning
        </button>
      </div>

      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <AnimatePresence>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              {...notification}
              onRemove={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Example 4: Image gallery with presence
function GalleryImage({ src, alt, onRemove }) {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isPresent) {
      animate(scope.current, { opacity: 1, scale: 1 }, { duration: 0.5 });
    } else {
      animate(scope.current, { opacity: 0, scale: 0 }, { duration: 0.5 }).then(
        safeToRemove
      );
    }
  }, [isPresent, animate, scope, safeToRemove]);

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0, scale: 0 }}
      style={{
        position: "relative",
        margin: "8px",
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.05 }}
      onClick={() => setIsExpanded(true)}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "200px",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          cursor: "pointer",
        }}
      >
        ×
      </button>

      {isExpanded && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setIsExpanded(false)}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

function ImageGallery() {
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1682687980961-78fa83781450?w=200&h=150&fit=crop",
    "https://images.unsplash.com/photo-1694898100066-61b628ac3ab2?w=200&h=150&fit=crop",
    "https://images.unsplash.com/photo-1695655094195-ff2b5b6c7957?w=200&h=150&fit=crop",
  ]);

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addImage = () => {
    const newImage = `https://images.unsplash.com/photo-${Date.now()}?w=200&h=150&fit=crop`;
    setImages((prev) => [...prev, newImage]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={addImage}
        style={{
          padding: "12px 24px",
          backgroundColor: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Add Random Image
      </button>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <AnimatePresence>
          {images.map((src, index) => (
            <GalleryImage
              key={src}
              src={src}
              alt={`Gallery image ${index + 1}`}
              onRemove={() => removeImage(index)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper function for button styles
const buttonStyle = (color) => ({
  padding: "8px 16px",
  backgroundColor: color,
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "0 4px",
});

// Main component with all examples
function UseAnimateWithPresenceExamples() {
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    { title: "Animated List", component: <ListWithPresence /> },
    { title: "Modal System", component: <ModalExample /> },
    { title: "Notifications", component: <NotificationSystem /> },
    { title: "Image Gallery", component: <ImageGallery /> },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        useAnimate + usePresence Examples
      </h1>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        {examples.map((example, index) => (
          <button
            key={example.title}
            onClick={() => setCurrentExample(index)}
            style={{
              ...buttonStyle(currentExample === index ? "#10B981" : "#6B7280"),
              margin: "0 8px",
            }}
          >
            {example.title}
          </button>
        ))}
      </div>

      <div
        style={{
          border: "2px solid #E5E7EB",
          borderRadius: "12px",
          padding: "20px",
          minHeight: "400px",
        }}
      >
        {examples[currentExample].component}
      </div>
    </div>
  );
}

export default UseAnimateWithPresenceExamples;
