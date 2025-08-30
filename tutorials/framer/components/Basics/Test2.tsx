"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define types for our components
interface CardProps {
  title: string;
  description: string;
  index: number;
}

interface MenuItemProps {
  text: string;
  selected: boolean;
  onClick: () => void;
}

// Animated card component
const AnimatedCard: React.FC<CardProps> = ({ title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      }}
      className="bg-white rounded-xl p-6 shadow-md cursor-pointer"
    >
      <motion.h3
        className="text-xl font-bold mb-3 text-purple-600"
        whileHover={{ color: "#4F46E5" }}
      >
        {title}
      </motion.h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Animated menu item component
const MenuItem: React.FC<MenuItemProps> = ({ text, selected, onClick }) => {
  return (
    <motion.div
      className="relative px-4 py-2 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
    >
      <span
        className={`relative z-10 ${selected ? "text-white" : "text-gray-600"}`}
      >
        {text}
      </span>
      {selected && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );
};

// Main component
const FramerMotionWebsite: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Design");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const cardData = [
    {
      title: "Smooth Animations",
      description:
        "Create fluid transitions between states with physics-based animations.",
    },
    {
      title: "Interactive Elements",
      description:
        "Engage users with components that respond to hover, tap, and drag gestures.",
    },
    {
      title: "Layout Animations",
      description:
        "Animate layout changes automatically when components are added, removed or rearranged.",
    },
  ];

  const menuItems = ["Design", "Develop", "Deploy", "Test"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <motion.header
        className="flex justify-between items-center mb-16"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.1 }}
        >
          MotionFX
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-md"
        >
          Get Started
        </motion.button>
      </motion.header>

      {/* Hero Section */}
      <section className="text-center mb-20">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Create stunning
          <motion.span
            className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
            style={{
              backgroundSize: "200% 100%",
            }}
          >
            animated interfaces
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Build beautiful, responsive websites with smooth animations that
          delight your users.
        </motion.p>

        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 5px 15px rgba(124, 58, 237, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium"
          >
            Explore Features
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-purple-600 border border-purple-200 rounded-lg font-medium"
          >
            View Examples
          </motion.button>
        </motion.div>
      </section>

      {/* Animated Tabs */}
      <section className="mb-16">
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
            {menuItems.map((item) => (
              <MenuItem
                key={item}
                text={item}
                selected={selectedTab === item}
                onClick={() => setSelectedTab(item)}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedTab} Process
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our {selectedTab.toLowerCase()} approach focuses on creating
              beautiful, functional interfaces that prioritize user experience
              and performance across all devices.
            </p>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {cardData.map((card, index) => (
          <AnimatedCard
            key={index}
            title={card.title}
            description={card.description}
            index={index}
          />
        ))}
      </section>

      {/* Animated FAQ Section */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Frequently Asked Questions
        </h2>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-md cursor-pointer mb-4"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
        >
          <motion.div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              How do I get started with Framer Motion?
            </h3>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-gray-600">
                  Getting started with Framer Motion is easy! First, install it
                  via npm or yarn. Then import the motion components and start
                  adding animations to your React components. The library
                  provides a simple yet powerful API for creating smooth
                  animations.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="text-center mt-20 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p>© {new Date().getFullYear()} MotionFX. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default FramerMotionWebsite;
