"use client"; // App.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useDragControls,
  PanInfo,
} from "framer-motion";
import "./test3.css";

// Types
interface App {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
}

interface Notification {
  id: string;
  app: string;
  title: string;
  message: string;
  time: string;
  icon: string;
}

// Mock data
const APPS: App[] = [
  {
    id: "1",
    name: "Phone",
    icon: "📱",
    color: "#4CAF50",
    category: "Utilities",
  },
  {
    id: "2",
    name: "Messages",
    icon: "💬",
    color: "#2196F3",
    category: "Communication",
  },
  {
    id: "3",
    name: "Mail",
    icon: "✉️",
    color: "#FF9800",
    category: "Productivity",
  },
  {
    id: "4",
    name: "Safari",
    icon: "🧭",
    color: "#2196F3",
    category: "Utilities",
  },
  {
    id: "5",
    name: "Music",
    icon: "🎵",
    color: "#E91E63",
    category: "Entertainment",
  },
  {
    id: "6",
    name: "Photos",
    icon: "🖼️",
    color: "#9C27B0",
    category: "Utilities",
  },
  {
    id: "7",
    name: "Camera",
    icon: "📷",
    color: "#607D8B",
    category: "Utilities",
  },
  {
    id: "8",
    name: "Maps",
    icon: "🗺️",
    color: "#4CAF50",
    category: "Navigation",
  },
  {
    id: "9",
    name: "Weather",
    icon: "☀️",
    color: "#FFC107",
    category: "Information",
  },
  {
    id: "10",
    name: "Notes",
    icon: "📝",
    color: "#FF9800",
    category: "Productivity",
  },
  {
    id: "11",
    name: "Calendar",
    icon: "📅",
    color: "#F44336",
    category: "Productivity",
  },
  {
    id: "12",
    name: "Clock",
    icon: "⏰",
    color: "#000000",
    category: "Utilities",
  },
  {
    id: "13",
    name: "Settings",
    icon: "⚙️",
    color: "#8E8E93",
    category: "System",
  },
  {
    id: "14",
    name: "App Store",
    icon: "🛒",
    color: "#007AFF",
    category: "Utilities",
  },
  {
    id: "15",
    name: "Wallet",
    icon: "💳",
    color: "#5856D6",
    category: "Finance",
  },
  {
    id: "16",
    name: "Health",
    icon: "❤️",
    color: "#FF2D55",
    category: "Health",
  },
];

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    app: "Messages",
    title: "iMessage",
    message: "John: Hey, are we still meeting today?",
    time: "10:30 AM",
    icon: "💬",
  },
  {
    id: "2",
    app: "Mail",
    title: "New Email",
    message: "Amazon: Your order has been shipped",
    time: "9:45 AM",
    icon: "✉️",
  },
  {
    id: "3",
    app: "Calendar",
    title: "Event Reminder",
    message: "Meeting with team in 30 minutes",
    time: "9:15 AM",
    icon: "📅",
  },
];

const AppDrawer: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(NOTIFICATIONS);

  const appsPerPage = 16;
  const totalPages = Math.ceil(APPS.length / appsPerPage);

  const openApp = (app: App) => {
    if (!isEditing) {
      setSelectedApp(app);
    }
  };

  const closeApp = () => {
    setSelectedApp(null);
  };

  const filteredApps = APPS.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedApps = filteredApps.slice(
    currentPage * appsPerPage,
    (currentPage + 1) * appsPerPage
  );

  // Drag handlers for page switching
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    if (info.offset.x < -threshold && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (info.offset.x > threshold && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="iphone-container">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span>9:41</span>
        </div>
        <div className="status-right">
          <span className="cellular">📶</span>
          <span className="wifi">📡</span>
          <span className="battery">🔋 100%</span>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationPanel
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />

      {/* Control Center */}
      <ControlCenter
        isVisible={showControlCenter}
        onClose={() => setShowControlCenter(false)}
      />

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="search-container"
          >
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Grid with Page Swiping */}
      <motion.div
        className="app-grid-container"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ cursor: "grab" }}
        whileTap={{ cursor: "grabbing" }}
      >
        <div className="page-indicator">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`page-dot ${index === currentPage ? "active" : ""}`}
            />
          ))}
        </div>

        <motion.div
          className="app-grid"
          animate={{ x: -currentPage * 100 + "%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div key={pageIndex} className="app-page">
              {APPS.slice(
                pageIndex * appsPerPage,
                (pageIndex + 1) * appsPerPage
              ).map((app, index) => (
                <AppIcon
                  key={app.id}
                  app={app}
                  index={index}
                  onTap={() => openApp(app)}
                  isEditing={isEditing}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Dock */}
      <div className="dock">
        <div className="dock-background"></div>
        {APPS.slice(0, 4).map((app) => (
          <AppIcon
            key={app.id}
            app={app}
            onTap={() => openApp(app)}
            isEditing={false}
            isDock
          />
        ))}
      </div>

      {/* Home Indicator */}
      <div className="home-indicator">
        <div className="home-bar"></div>
      </div>

      {/* App Window */}
      <AnimatePresence mode="wait">
        {selectedApp && <AppWindow app={selectedApp} onClose={closeApp} />}
      </AnimatePresence>

      {/* Pull Down Handles */}
      <TopDragHandle
        onNotificationsPull={() => setShowNotifications(true)}
        onControlCenterPull={() => setShowControlCenter(true)}
      />
    </div>
  );
};

// Top Drag Handle for Notifications and Control Center
interface TopDragHandleProps {
  onNotificationsPull: () => void;
  onControlCenterPull: () => void;
}

const TopDragHandle: React.FC<TopDragHandleProps> = ({
  onNotificationsPull,
  onControlCenterPull,
}) => {
  const leftDragControls = useDragControls();
  const rightDragControls = useDragControls();

  return (
    <>
      <motion.div
        className="drag-handle left"
        drag="y"
        dragControls={leftDragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.5}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80) onNotificationsPull();
        }}
      />
      <motion.div
        className="drag-handle right"
        drag="y"
        dragControls={rightDragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.5}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80) onControlCenterPull();
        }}
      />
    </>
  );
};

// Notification Panel Component
interface NotificationPanelProps {
  isVisible: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isVisible,
  onClose,
  notifications,
}) => {
  const y = useMotionValue(-400);
  const opacity = useTransform(y, [-400, 0], [0, 1]);
  const scale = useTransform(y, [-400, 0], [0.9, 1]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="notification-panel"
          style={{ y, opacity }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.y < -50 || info.velocity.y < -500) {
              onClose();
            }
          }}
          initial={{ y: -400 }}
          animate={{ y: 0 }}
          exit={{ y: -400 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <div className="notification-header">
            <div className="notification-time">Wednesday, November 15</div>
            <motion.button
              className="close-notifications"
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                className="notification-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="notification-icon">{notification.icon}</div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                </div>
                <div className="notification-time">{notification.time}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Control Center Component
interface ControlCenterProps {
  isVisible: boolean;
  onClose: () => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({
  isVisible,
  onClose,
}) => {
  const y = useMotionValue(800);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="control-center"
          style={{ y }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.y > 50 || info.velocity.y > 500) {
              onClose();
            }
          }}
          initial={{ y: 800 }}
          animate={{ y: 0 }}
          exit={{ y: 800 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <div className="control-center-header">
            <div className="control-center-handle"></div>
          </div>

          <div className="control-grid">
            <ControlTile icon="✈️" label="Airplane" />
            <ControlTile icon="📶" label="Wi-Fi" />
            <ControlTile icon="📱" label="Cellular" />
            <ControlTile icon="🔈" label="Sound" />

            <ControlTile icon="🔒" label="Focus" large />
            <ControlTile icon="🔦" label="Flashlight" large />

            <div className="brightness-slider">
              <span>☀️</span>
              <input type="range" className="slider" />
            </div>

            <div className="volume-slider">
              <span>🔊</span>
              <input type="range" className="slider" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Control Tile Component
const ControlTile: React.FC<{
  icon: string;
  label: string;
  large?: boolean;
}> = ({ icon, label, large }) => (
  <motion.div
    className={`control-tile ${large ? "large" : ""}`}
    whileTap={{ scale: 0.95, opacity: 0.8 }}
  >
    <div className="control-icon">{icon}</div>
    <div className="control-label">{label}</div>
  </motion.div>
);

// App Icon Component (Updated)
const AppIcon: React.FC<{
  app: App;
  index?: number;
  onTap: () => void;
  isEditing: boolean;
  isDock?: boolean;
}> = ({ app, index = 0, onTap, isEditing, isDock = false }) => {
  return (
    <motion.div
      className={`app-icon ${isDock ? "dock-icon" : ""}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.02, type: "spring" }}
      whileHover={{ scale: isEditing ? 1 : 1.05 }}
      whileTap={{ scale: isEditing ? 1.1 : 0.9 }}
      onTap={onTap}
      layout
    >
      <motion.div
        className="app-icon-inner"
        animate={{
          y: isEditing ? [0, -5, 0] : 0,
          transition: isEditing ? { repeat: Infinity, duration: 1.5 } : {},
        }}
      >
        <div className="app-icon-image" style={{ backgroundColor: app.color }}>
          {app.icon}
        </div>
        <span className="app-name">{app.name}</span>
        {isEditing && !isDock && (
          <motion.div
            className="delete-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
          >
            ×
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// App Window Component (Enhanced)
const AppWindow: React.FC<{ app: App; onClose: () => void }> = ({
  app,
  onClose,
}) => {
  return (
    <motion.div
      className="app-window-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onTap={onClose}
    >
      <motion.div
        className="app-window"
        layoutId={`app-${app.id}`}
        initial={{ scale: 0.8, opacity: 0, borderRadius: 25 }}
        animate={{
          scale: 1,
          opacity: 1,
          borderRadius: 0,
          transition: {
            type: "spring",
            damping: 40,
            stiffness: 400,
          },
        }}
        exit={{
          scale: 0.8,
          opacity: 0,
          borderRadius: 25,
          transition: { duration: 0.2 },
        }}
        onTap={(e) => e.stopPropagation()}
      >
        <div className="app-header">
          <motion.button
            className="close-button"
            onTap={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ←
          </motion.button>
          <h2 className="app-title">{app.name}</h2>
          <div></div>
        </div>

        <div className="app-content">
          <motion.div
            className="app-hero"
            style={{ backgroundColor: app.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {app.icon}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to {app.name}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppDrawer;
