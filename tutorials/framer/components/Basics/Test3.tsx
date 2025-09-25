// "use client";
// import React from "react";
// import { motion, useScroll, useTransform } from "motion/react";

// export default function StickyImageScroll() {
//   const containerRef = React.useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   const images = [
//     "https://business.adobe.com/blog/basics/media_1344a5a68032785bf8eb18e748f92b1078812f729.png?width=2000&format=webply&optimize=medium",
//     "https://business.adobe.com/blog/basics/media_14e35529cffcb7d5fe9d68dc1fbcf3662196be3f3.png?width=2000&format=webply&optimize=medium",
//     "https://business.adobe.com/blog/basics/media_191d4264f4b2a54c2cc964c335309b8cbdb066087.png?width=2000&format=webply&optimize=medium",
//     "https://business.adobe.com/blog/basics/media_1bc0275f4fc0ef95aedef70cfaa71e62c9e01473d.png?width=2000&format=webply&optimize=medium",
//     "https://business.adobe.com/blog/basics/media_10739d296019a74991795ffe17ee73afc8447df67.png?width=2000&format=webply&optimize=medium",
//   ];

//   return (
//     <div className="w-full min-h-screen flex items-center justify-center">
//       <section
//         ref={containerRef}
//         className="relative w-full inset-0 -my-0 min-h-[500vh] bg-gradient-to-br from-gray-50 to-gray-200"
//       >
//         {/* Right sticky image showcase */}
//         <div className="sticky right-0 top-0 w-full h-screen flex items-center justify-center">
//           <div className="relative w-full h-full">
//             {images.map((src, i) => {
//               const start = i / images.length;
//               const end = (i + 1) / images.length;
//               const opacity = useTransform(
//                 scrollYProgress,
//                 [start, end],
//                 [0, 1]
//               );
//               const scale = useTransform(
//                 scrollYProgress,
//                 [start, end],
//                 [0.95, 1]
//               );

//               return (
//                 <motion.img
//                   key={i}
//                   src={src}
//                   alt={`Scenery ${i + 1}`}
//                   className={`absolute top-0 left-0 w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white`}
//                   style={{
//                     opacity,
//                     scale,
//                     zIndex: i + 1,
//                   }}
//                 />
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// Types
interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: "toggle" | "chevron" | "badge" | "slider";
  value?: boolean;
  badge?: string;
  section: string;
}

interface Section {
  id: string;
  title: string;
  items: string[];
}

// Mock data for settings
const settingsData: SettingItem[] = [
  // Airplane Mode Section
  {
    id: "airplane",
    title: "Airplane Mode",
    icon: "✈️",
    type: "toggle",
    value: false,
    section: "general",
  },

  // Wi-Fi Section
  {
    id: "wifi",
    title: "Wi-Fi",
    subtitle: "Not Connected",
    icon: "📶",
    type: "chevron",
    section: "network",
  },
  {
    id: "bluetooth",
    title: "Bluetooth",
    subtitle: "On",
    icon: "🔵",
    type: "chevron",
    section: "network",
  },
  {
    id: "cellular",
    title: "Cellular",
    icon: "📱",
    type: "chevron",
    section: "network",
  },

  // Notifications Section
  {
    id: "notifications",
    title: "Notifications",
    icon: "🔔",
    type: "chevron",
    section: "notifications",
  },
  {
    id: "sounds",
    title: "Sounds & Haptics",
    icon: "🔊",
    type: "chevron",
    section: "notifications",
  },
  {
    id: "focus",
    title: "Focus",
    icon: "🌙",
    type: "chevron",
    section: "notifications",
  },
  {
    id: "screen-time",
    title: "Screen Time",
    icon: "⏰",
    type: "chevron",
    section: "notifications",
  },

  // General Section
  {
    id: "general",
    title: "General",
    icon: "⚙️",
    type: "chevron",
    section: "general",
  },
  {
    id: "display",
    title: "Display & Brightness",
    icon: "🌅",
    type: "chevron",
    section: "general",
  },
  {
    id: "wallpaper",
    title: "Wallpaper",
    icon: "🖼️",
    type: "chevron",
    section: "general",
  },

  // Privacy Section
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: "🔒",
    type: "chevron",
    badge: "New",
    section: "privacy",
  },

  // App Store Section
  {
    id: "app-store",
    title: "App Store",
    icon: "📱",
    type: "chevron",
    section: "apps",
  },

  // Battery Section
  {
    id: "battery",
    title: "Battery",
    icon: "🔋",
    type: "chevron",
    section: "battery",
  },

  // More Settings
  {
    id: "music",
    title: "Music",
    icon: "🎵",
    type: "chevron",
    section: "entertainment",
  },
  {
    id: "photos",
    title: "Photos",
    icon: "🖼️",
    type: "chevron",
    section: "entertainment",
  },
  {
    id: "camera",
    title: "Camera",
    icon: "📷",
    type: "chevron",
    section: "entertainment",
  },
];

const sections: Section[] = [
  {
    id: "general",
    title: "",
    items: ["airplane", "wifi", "bluetooth", "cellular"],
  },
  {
    id: "notifications",
    title: "",
    items: ["notifications", "sounds", "focus", "screen-time"],
  },
  { id: "general2", title: "", items: ["general", "display", "wallpaper"] },
  { id: "privacy", title: "", items: ["privacy"] },
  { id: "apps", title: "", items: ["app-store"] },
  { id: "battery", title: "", items: ["battery"] },
  { id: "entertainment", title: "", items: ["music", "photos", "camera"] },
];

const iPhoneSettingsApp: React.FC = () => {
  const [settings, setSettings] = useState<SettingItem[]>(settingsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeSetting, setActiveSetting] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter settings based on search
  const filteredSettings = searchQuery
    ? settings.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : settings;

  // Group settings by section for non-search view
  const groupedSettings = sections
    .map((section) => ({
      ...section,
      items: section.items
        .map((itemId) => settings.find((setting) => setting.id === itemId))
        .filter(Boolean) as SettingItem[],
    }))
    .filter((section) => section.items.length > 0);

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearching(false);
    }
  };

  // Toggle setting value
  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, value: !item.value } : item
      )
    );
  };

  // iOS-style haptic feedback simulation
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div style={styles.container}>
      {/* Status Bar */}
      <motion.div
        style={styles.statusBar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div style={styles.statusTime}>9:41</div>
        <div style={styles.statusIcons}>
          <span style={styles.statusIcon}>📶</span>
          <span style={styles.statusIcon}>📱</span>
          <span style={styles.statusIcon}>🔋</span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h1 style={styles.title}>Settings</h1>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        style={styles.searchContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            style={styles.searchInput}
          />
          {searchQuery && (
            <motion.button
              style={styles.clearButton}
              onClick={() => setSearchQuery("")}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Settings List */}
      <motion.div
        style={styles.settingsList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <AnimatePresence mode="popLayout">
          {isSearching || searchQuery ? (
            // Search Results View
            <motion.div
              key="search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredSettings.map((item, index) => (
                <SettingRow
                  key={item.id}
                  item={item}
                  index={index}
                  onToggle={toggleSetting}
                  onSelect={setActiveSetting}
                  isActive={activeSetting === item.id}
                  triggerHaptic={triggerHaptic}
                />
              ))}
            </motion.div>
          ) : (
            // Grouped Settings View
            <motion.div
              key="grouped-settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {groupedSettings.map((section, sectionIndex) => (
                <motion.div key={section.id} style={styles.section}>
                  {section.items.map((item, index) => (
                    <SettingRow
                      key={item.id}
                      item={item}
                      index={sectionIndex * 10 + index}
                      onToggle={toggleSetting}
                      onSelect={setActiveSetting}
                      isActive={activeSetting === item.id}
                      triggerHaptic={triggerHaptic}
                    />
                  ))}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Bar */}
      <motion.div
        style={styles.navBar}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div style={styles.navItem}>
          <span style={styles.navIcon}>🏠</span>
          <span style={styles.navLabel}>Home</span>
        </div>
        <div style={styles.navItem}>
          <span style={styles.navIcon}>🔍</span>
          <span style={styles.navLabel}>Search</span>
        </div>
        <div style={{ ...styles.navItem, ...styles.navActive }}>
          <span style={styles.navIcon}>⚙️</span>
          <span style={styles.navLabel}>Settings</span>
        </div>
        <div style={styles.navItem}>
          <span style={styles.navIcon}>👤</span>
          <span style={styles.navLabel}>Profile</span>
        </div>
      </motion.div>
    </div>
  );
};

// Setting Row Component
interface SettingRowProps {
  item: SettingItem;
  index: number;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  isActive: boolean;
  triggerHaptic: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  item,
  index,
  onToggle,
  onSelect,
  isActive,
  triggerHaptic,
}) => {
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 });
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  const handleTapStart = () => {
    scale.set(0.95);
    triggerHaptic();
  };

  const handleTapEnd = () => {
    scale.set(1);
    onSelect(item.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(item.id);
    triggerHaptic();
  };

  return (
    <motion.div
      style={{
        ...styles.settingRow,
        scale: springScale,
        x: springX,
        backgroundColor: isActive ? "rgba(0, 122, 255, 0.1)" : "transparent",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      whileTap={{ scale: 0.98 }}
      onTapStart={handleTapStart}
      onTap={handleTapEnd}
      onTapCancel={() => scale.set(1)}
    >
      <div style={styles.settingLeft}>
        <span style={styles.settingIcon}>{item.icon}</span>
        <div style={styles.settingText}>
          <span style={styles.settingTitle}>{item.title}</span>
          {item.subtitle && (
            <span style={styles.settingSubtitle}>{item.subtitle}</span>
          )}
        </div>
      </div>

      <div style={styles.settingRight}>
        {item.badge && (
          <motion.span
            style={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {item.badge}
          </motion.span>
        )}

        {item.type === "toggle" ? (
          <motion.div
            style={{
              ...styles.toggle,
              backgroundColor: item.value ? "#007AFF" : "#ccc",
              justifyContent: item.value ? "flex-end" : "flex-start",
            }}
            onClick={handleToggle}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              style={styles.toggleKnob}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.div>
        ) : item.type === "chevron" ? (
          <motion.span
            style={styles.chevron}
            animate={{ x: isActive ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ›
          </motion.span>
        ) : null}
      </div>
    </motion.div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "390px",
    height: "844px",
    backgroundColor: "#f2f2f7",
    borderRadius: "40px",
    overflow: "hidden",
    position: "relative",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    margin: "20px auto",
  },
  statusBar: {
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  statusTime: {
    fontWeight: "600",
    fontSize: "17px",
  },
  statusIcons: {
    display: "flex",
    gap: "5px",
  },
  statusIcon: {
    fontSize: "14px",
  },
  header: {
    padding: "10px 20px",
  },
  title: {
    fontSize: "34px",
    fontWeight: "700",
    margin: "10px 0",
    color: "#000",
  },
  searchContainer: {
    padding: "10px 20px",
  },
  searchBar: {
    backgroundColor: "rgba(118, 118, 128, 0.12)",
    borderRadius: "10px",
    padding: "10px 15px",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  searchIcon: {
    marginRight: "10px",
    fontSize: "16px",
    opacity: 0.5,
  },
  searchInput: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "17px",
    flex: 1,
    color: "#000",
  },
  clearButton: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 0",
  },
  section: {
    marginBottom: "20px",
  },
  settingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    cursor: "pointer",
    borderRadius: "10px",
    margin: "0 10px 2px 10px",
  },
  settingLeft: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    fontSize: "24px",
    marginRight: "15px",
    width: "30px",
    textAlign: "center",
  },
  settingText: {
    display: "flex",
    flexDirection: "column",
  },
  settingTitle: {
    fontSize: "17px",
    fontWeight: "400",
    color: "#000",
  },
  settingSubtitle: {
    fontSize: "14px",
    color: "#8e8e93",
    marginTop: "2px",
  },
  settingRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  badge: {
    backgroundColor: "#007AFF",
    color: "white",
    fontSize: "12px",
    padding: "2px 8px",
    borderRadius: "10px",
    fontWeight: "600",
  },
  toggle: {
    width: "51px",
    height: "31px",
    borderRadius: "15.5px",
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  toggleKnob: {
    width: "27px",
    height: "27px",
    backgroundColor: "white",
    borderRadius: "50%",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  chevron: {
    fontSize: "20px",
    color: "#c7c7cc",
    fontWeight: "300",
  },
  navBar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px 0",
    backgroundColor: "rgba(249, 249, 249, 0.8)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5px 15px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  navActive: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  navIcon: {
    fontSize: "22px",
    marginBottom: "2px",
  },
  navLabel: {
    fontSize: "10px",
    fontWeight: "500",
  },
};

export default iPhoneSettingsApp;
